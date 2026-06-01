import { motion } from 'framer-motion';
import { useGameStore, getAlbanetHireCost } from '../store/gameStore';
import { fmt } from '../utils/fmt';

const TEAM_NAMES: Record<string, string> = {
  drip_coffee: '드립 팀',
  espresso_machine: '에스프레소 팀',
  water_pump: '물 팀',
};

const TEAM_ICONS: Record<string, string> = {
  drip_coffee: '☕',
  espresso_machine: '🫘',
  water_pump: '💧',
};

const MAX_WORKERS = 5;

export default function AlbanetScreen({ onClose }: { onClose: () => void }) {
  const equipment = useGameStore(s => s.equipment);
  const albanetWorkers = useGameStore(s => s.albanetWorkers);
  const cheese = useGameStore(s => s.resources.cheese);
  const hireAlbanet = useGameStore(s => s.hireAlbanet);

  const productionEqs = equipment.filter(e => e.id !== 'bathhouse' && e.level > 0);
  const totalWorkers = Object.values(albanetWorkers).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F5F0E8', zIndex: 70 }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
    >
      {/* Header */}
      <div className="flex items-center px-4 pt-4 pb-2 gap-3" style={{ borderBottom: '1px solid #E0D8CC' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#5A3A20' }}>←</button>
        <div className="font-black" style={{ fontSize: 18, color: '#1A1A1A' }}>알바넷</div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#EDE8DF', borderBottom: '1px solid #D8D0C4' }}>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 14 }}>🧀</span>
          <span className="font-black" style={{ fontSize: 13, color: '#5A3A20' }}>{fmt(cheese)}</span>
          <span style={{ fontSize: 11, color: '#8A7060' }}>보유</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 12, color: '#8A7060' }}>총</span>
          <span className="font-black" style={{ fontSize: 13, color: '#1A1A1A' }}>{totalWorkers}</span>
          <span style={{ fontSize: 12, color: '#8A7060' }}>명 고용 중</span>
        </div>
        <div className="font-bold" style={{ fontSize: 11, color: '#52B788' }}>1명당 +100%</div>
      </div>

      {/* Team list */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '8px 0' }}>
        {productionEqs.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#AAA', fontSize: 13 }}>
            시설을 먼저 설치해주세요
          </div>
        ) : (
          productionEqs.map(eq => {
            const current = albanetWorkers[eq.id] ?? 0;
            const isFull = current >= MAX_WORKERS;
            const cost = getAlbanetHireCost(current);
            const canAfford = cost === 0 || cheese >= cost;
            const multiplierNow = current * 100;

            return (
              <div
                key={eq.id}
                className="flex items-center gap-2 pl-4 pr-2 py-3"
                style={{ borderBottom: '1px solid #E8E0D4' }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 52, height: 52, background: '#EAE0CC', fontSize: 28 }}
                >
                  {TEAM_ICONS[eq.id] ?? eq.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-black" style={{ fontSize: 13, color: '#1A1A1A' }}>
                    {TEAM_NAMES[eq.id] ?? eq.name}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: MAX_WORKERS }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: i < current ? '#52B788' : '#D8D0C4',
                          flexShrink: 0,
                        }}
                      />
                    ))}
                    <span style={{ fontSize: 10, color: '#8A7060', marginLeft: 4 }}>
                      {current}/{MAX_WORKERS}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#4A90D9', fontWeight: 700 }}>
                    {multiplierNow > 0 ? `수익 +${multiplierNow}%` : '직원 없음'}
                  </div>
                </div>

                {/* Hire button */}
                {isFull ? (
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0 py-1.5 px-3"
                    style={{ background: '#E8E0D4', minWidth: 68 }}
                  >
                    <span className="font-black" style={{ fontSize: 11, color: '#AAA' }}>만원</span>
                  </div>
                ) : (
                  <motion.button
                    whileTap={canAfford ? { scale: 0.95 } : {}}
                    onClick={canAfford ? () => hireAlbanet(eq.id) : undefined}
                    className="flex flex-col items-center justify-center rounded-xl flex-shrink-0 py-1.5 px-2"
                    style={{
                      background: canAfford ? '#52B788' : '#CCC',
                      border: 'none',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      minWidth: 68,
                    }}
                  >
                    <span className="font-black text-white" style={{ fontSize: 10 }}>고용</span>
                    {cost === 0 ? (
                      <span className="font-black text-white" style={{ fontSize: 11 }}>FREE</span>
                    ) : (
                      <span className="font-black text-white" style={{ fontSize: 11 }}>🧀 {fmt(cost)}</span>
                    )}
                  </motion.button>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
