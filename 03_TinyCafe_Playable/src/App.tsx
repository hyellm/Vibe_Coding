import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import HUD from './components/HUD';
import MissionBar from './components/MissionBar';
import CafeView from './components/CafeView';
import CoinSlotBar from './components/CoinSlotBar';
import UpgradeModal from './components/UpgradeModal';
import FacilityScreen from './components/FacilityScreen';
import SmartphoneScreen from './components/SmartphoneScreen';

function OfflinePopup() {
  const popup = useGameStore(s => s.offlinePopup);
  const dismiss = useGameStore(s => s.dismissOfflinePopup);

  return (
    <AnimatePresence>
      {popup?.show && (
        <motion.div
          className="absolute inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="rounded-3xl p-6 flex flex-col items-center gap-3 mx-6"
            style={{
              background: 'linear-gradient(160deg,#3D2010,#251005)',
              border: '2px solid #C4832A',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 30 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <span style={{ fontSize: 48 }}>🐭</span>
            <div className="text-white font-black text-center" style={{ fontSize: 18 }}>
              열심히 일했어요!
            </div>
            <div className="text-yellow-300 font-bold text-center" style={{ fontSize: 14 }}>
              자리를 비운 동안<br />
              <span className="font-black" style={{ fontSize: 22 }}>
                +{popup.coins.toLocaleString()}🪙
              </span>
              <br />코인을 벌었습니다
            </div>
            <motion.button
              className="w-full py-3 rounded-2xl font-black text-white"
              style={{
                fontSize: 16,
                background: 'linear-gradient(135deg,#E8A020,#C07010)',
                border: 'none',
                cursor: 'pointer',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={dismiss}
            >
              감사해요! 🎉
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type OverlayType = 'facility' | 'smartphone' | null;

export default function App() {
  const tick = useGameStore(s => s.tick);
  const lastTimeRef = useRef(Date.now());
  const [overlay, setOverlay] = useState<OverlayType>(null);

  useEffect(() => {
    lastTimeRef.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const delta = Math.min(now - lastTimeRef.current, 500);
      lastTimeRef.current = now;
      tick(delta);
    }, 100);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div
      className="flex flex-col"
      style={{
        width: 390,
        height: '100%',
        fontFamily: "'Nunito', sans-serif",
        overflow: 'hidden',
        position: 'relative',
        background: '#2A1408',
      }}
    >
      <HUD />
      <MissionBar />
      <CafeView
        onOpenFacility={() => setOverlay('facility')}
        onOpenSmartphone={() => setOverlay('smartphone')}
      />
      <CoinSlotBar />

      {/* Game overlays */}
      <UpgradeModal />
      <OfflinePopup />

      {/* Screen overlays */}
      <AnimatePresence>
        {overlay === 'facility' && (
          <FacilityScreen key="facility" onClose={() => setOverlay(null)} />
        )}
        {overlay === 'smartphone' && (
          <SmartphoneScreen key="smartphone" onClose={() => setOverlay(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
