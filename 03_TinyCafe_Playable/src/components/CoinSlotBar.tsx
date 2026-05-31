import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { fmt } from '../utils/fmt';
import { MENU_IMAGES } from '../utils/menuImages';
import cathand1 from '../../TinyCafe_reference_img/cathand1.png';
import cathand2 from '../../TinyCafe_reference_img/cathand2.png';

export default function CoinSlotBar() {
  const coinSlots = useGameStore(s => s.coinSlots);
  const collectSlot = useGameStore(s => s.collectSlot);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [pawSlotId, setPawSlotId] = useState<string | null>(null);
  const [pawFrame, setPawFrame] = useState(0);
  const isPawingRef = useRef(false);
  const lastPawTimeRef = useRef(0);
  const slotsRef = useRef(coinSlots);
  slotsRef.current = coinSlots;

  // Check every 500ms — oldest slot ≥10s AND ≥10s since last paw
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPawingRef.current) return;
      const now = Date.now();
      if (now - lastPawTimeRef.current < 10000) return;
      const old = slotsRef.current.find(s => now - s.createdAt >= 10000);
      if (old) {
        isPawingRef.current = true;
        setPawSlotId(old.id);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // If the target slot was manually collected, cancel paw
  useEffect(() => {
    if (pawSlotId && !coinSlots.some(s => s.id === pawSlotId)) {
      setPawSlotId(null);
      isPawingRef.current = false;
    }
  }, [coinSlots, pawSlotId]);

  // Scroll to leftmost when paw activates
  useEffect(() => {
    if (!pawSlotId) return;
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [pawSlotId]);

  const handlePawDone = (slotId: string) => {
    collectSlot(slotId);
    setPawSlotId(null);
    setPawFrame(f => f === 0 ? 1 : 0);
    isPawingRef.current = false;
    lastPawTimeRef.current = Date.now();
  };

  return (
    <div
      className="flex items-center"
      style={{
        height: 90,
        background: 'linear-gradient(180deg,#3A200E,#2A1408)',
        borderTop: '3px solid #7A4828',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Scrollable coin slots */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto flex-1"
        style={{
          height: '100%',
          padding: '10px 8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {coinSlots.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center w-full"
              style={{ color: '#7A5040', fontSize: 11, fontWeight: 700 }}
            >
              장비를 탭해서 생산하세요 ☕
            </motion.div>
          ) : (
            coinSlots.map(slot => (
              <motion.button
                key={slot.id}
                layout
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => collectSlot(slot.id)}
                className="flex flex-col items-center flex-shrink-0 rounded-2xl"
                style={{
                  width: 59,
                  height: 80,
                  background: 'linear-gradient(160deg,#4A2A14,#321608)',
                  border: '1.5px solid #5A3418',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                  cursor: 'pointer',
                  paddingTop: 6,
                  paddingBottom: 5,
                  gap: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Drink image — large, no circle */}
                {MENU_IMAGES[slot.drinkEmoji]
                  ? <img src={MENU_IMAGES[slot.drinkEmoji]} alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
                  : <span style={{ fontSize: 30 }}>{slot.drinkEmoji}</span>
                }
                {/* Coin amount */}
                <div className="flex items-center gap-0.5 font-black rounded-full px-2"
                  style={{ fontSize: 10, color: '#FFD700', background: 'rgba(0,0,0,0.30)' }}>
                  <span style={{ fontSize: 9 }}>🪙</span>
                  <span>{fmt(slot.amount)}</span>
                </div>

                {/* Cat paw auto-collect animation */}
                {pawSlotId === slot.id && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0, right: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      pointerEvents: 'none',
                      zIndex: 5,
                    }}
                    initial={{ y: 80 }}
                    animate={{ y: [80, 15, 15, 80] }}
                    transition={{ duration: 1.3, times: [0, 0.38, 0.65, 1], ease: 'easeInOut' }}
                    onAnimationComplete={() => handlePawDone(slot.id)}
                  >
                    <img
                      src={pawFrame === 0 ? cathand1 : cathand2}
                      alt="cat hand"
                      style={{ width: 70, height: 70, objectFit: 'contain', imageRendering: 'crisp-edges' }}
                    />
                  </motion.div>
                )}
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
