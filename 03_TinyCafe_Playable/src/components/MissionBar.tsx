import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function MissionBar() {
  const missions = useGameStore(s => s.missions);
  const pendingReward = useGameStore(s => s.pendingMissionReward);
  const dismissMissionReward = useGameStore(s => s.dismissMissionReward);

  const active = missions.find(m => !m.isCompleted);

  return (
    <div
      className="relative flex items-center px-3 gap-2"
      style={{
        height: 44,
        background: 'linear-gradient(180deg, #4A2810 0%, #3A1E08 100%)',
        borderBottom: '2px solid #6A3C1C',
        flexShrink: 0,
      }}
    >
      {/* Mission complete popup */}
      <AnimatePresence>
        {pendingReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#2D6A4F,#1B4332)' }}
            onClick={dismissMissionReward}
          >
            <span className="text-white font-black text-sm">🎉 미션 완료! 탭해서 계속</span>
          </motion.div>
        )}
      </AnimatePresence>

      {active ? (
        <>
          <span className="text-yellow-300 font-bold text-xs whitespace-nowrap" style={{ fontSize: 11 }}>
            ◆ {active.description}
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#52B788,#40916C)' }}
              animate={{ width: `${Math.min(100, (active.current / active.target) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 60 }}
            />
          </div>
          <span className="text-white font-bold whitespace-nowrap" style={{ fontSize: 10 }}>
            {active.current}/{active.target}
          </span>
          <span className="text-pink-300 font-black whitespace-nowrap" style={{ fontSize: 10 }}>
            ❤️+{active.reward.hearts}{active.reward.gems ? ` 💎+${active.reward.gems}` : ''}
          </span>
        </>
      ) : (
        <span className="text-green-300 font-bold text-xs mx-auto">✅ 모든 미션 완료!</span>
      )}
    </div>
  );
}
