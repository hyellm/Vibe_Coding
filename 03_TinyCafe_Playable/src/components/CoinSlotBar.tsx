import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function CoinSlotBar() {
  const coinSlots = useGameStore(s => s.coinSlots);
  const collectSlot = useGameStore(s => s.collectSlot);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      {/* World map button */}
      <button
        className="flex flex-col items-center justify-center flex-shrink-0"
        style={{
          width: 52, height: '100%',
          background: 'rgba(255,255,255,0.06)',
          border: 'none',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          gap: 3,
        }}
      >
        <span style={{ fontSize: 22 }}>🗺️</span>
        <span style={{ fontSize: 8, color: '#A07050', fontWeight: 700 }}>월드맵</span>
      </button>

      {/* Scrollable coin slots */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto flex-1"
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
                className="flex flex-col items-center justify-center flex-shrink-0 rounded-2xl"
                style={{
                  width: 60,
                  height: 68,
                  background: 'linear-gradient(160deg,#7A4828,#5C3A1E)',
                  border: '2px solid #9A6040',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  gap: 4,
                }}
              >
                {/* Drink icon */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 34, height: 34,
                    background: 'rgba(0,0,0,0.25)',
                    fontSize: 20,
                  }}
                >
                  {slot.drinkEmoji}
                </div>
                {/* Coin amount */}
                <div
                  className="flex items-center gap-0.5 font-black text-white"
                  style={{ fontSize: 10 }}
                >
                  <span style={{ fontSize: 9 }}>🪙</span>
                  <span>{slot.amount}</span>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Coin slot count badge */}
      {coinSlots.length > 0 && (
        <div
          className="absolute top-2 right-3 flex items-center justify-center rounded-full font-black text-white"
          style={{
            fontSize: 9,
            background: '#E84060',
            minWidth: 18, height: 18,
            padding: '0 4px',
            boxShadow: '0 2px 6px rgba(232,64,96,0.5)',
          }}
        >
          {coinSlots.length}
        </div>
      )}
    </div>
  );
}
