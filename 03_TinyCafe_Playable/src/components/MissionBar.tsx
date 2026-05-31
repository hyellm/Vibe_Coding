import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function MissionBar() {
  const missions = useGameStore(s => s.missions);
  const pendingReward = useGameStore(s => s.pendingMissionReward);
  const dismissMissionReward = useGameStore(s => s.dismissMissionReward);

  const active = missions.find(m => !m.isCompleted);

  return (
    <div
      className="relative flex items-center px-2 gap-2"
      style={{
        height: 44,
        background: 'linear-gradient(180deg,#FAFAF5 0%,#F0EDE5 100%)',
        borderBottom: '2px solid #D4C4A0',
        flexShrink: 0,
      }}
    >
      {/* Mission complete overlay */}
      <AnimatePresence>
        {pendingReward && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer gap-2"
            style={{ background: 'linear-gradient(135deg,#2D6A4F,#1B4332)' }}
            onClick={dismissMissionReward}
          >
            <span style={{ fontSize: 18 }}>🎉</span>
            <span className="text-white font-black" style={{ fontSize: 13 }}>
              미션 완료! 탭해서 보상 수령
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {active ? (
        <>
          {/* Left: heart reward badge */}
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0 font-black text-white"
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg,#E84060,#C02040)',
              fontSize: 11,
              boxShadow: '0 2px 6px rgba(232,64,96,0.4)',
            }}
          >
            <div className="flex flex-col items-center leading-tight">
              <span style={{ fontSize: 9 }}>❤️</span>
              <span style={{ fontSize: 9 }}>{active.reward.hearts}</span>
            </div>
          </div>

          {/* Center: mission text + progress bar */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div
              className="font-bold truncate"
              style={{ fontSize: 10, color: '#4A3820' }}
            >
              {active.description}
            </div>
            <div className="flex items-center gap-1">
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 6, background: 'rgba(0,0,0,0.1)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#52B788,#40916C)' }}
                  animate={{ width: `${Math.min(100, (active.current / active.target) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 60 }}
                />
              </div>
              <span style={{ fontSize: 9, color: '#7A6050', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {active.current}/{active.target}
              </span>
            </div>
          </div>

        </>
      ) : (
        <div className="flex items-center justify-center flex-1 gap-2">
          <span style={{ fontSize: 16 }}>✅</span>
          <span className="font-bold" style={{ fontSize: 12, color: '#2D6A4F' }}>
            모든 미션 완료!
          </span>
        </div>
      )}
    </div>
  );
}
