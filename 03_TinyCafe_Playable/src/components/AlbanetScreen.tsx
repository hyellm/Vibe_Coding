import { motion } from 'framer-motion';
import { useGameStore, getAlbanetHireCost } from '../store/gameStore';

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'b';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'm';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return Math.floor(n).toString();
}

const TEAM_NAMES: Record<string, string> = {
  drip_coffee: '드립 팀',
  espresso_machine: '에스프레소 팀',
  water_pump: '물 팀',
};

const TEAM_ICONS: Record<string, string> = {
  drip_coffee: '☕',
  espresso_machine: '🫖',
  water_pump: '💧',
};

export default function AlbanetScreen({ onClose }: { onClose: () => void }) {
  const equipment = useGameStore(s => s.equipment);
  const albanetWorkers = useGameStore(s => s.albanetWorkers);
  const cheese = useGameStore(s => s.resources.cheese);
  const hireAlbanet = useGameStore(s => s.hireAlbanet);

  // Only production equipment (not bathhouse)
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

      {/* Subtitle */}
      <div className="px-5 py-4 text-center" style={{ borderBottom: '1px solid #E0D8CC' }}>
        <div className="font-bold" style={{ fontSize: 13, color: '#5A5A5A' }}>
          알바생 추가시 해당 시설의 판매가 상승 <span style={{ color: '#52B788', fontWeight: 900 }}>+100%</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span style={{ fontSize: 16 }}>🐾</span>
          <span className="font-black" style={{ fontSize: 18, color: '#1A1A1A' }}>{totalWorkers}</span>
          <span style={{ fontSize: 12, color: '#888' }}>명 고용 중</span>
        </div>
      </div>

      {/* Team list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {productionEqs.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#AAA', fontSize: 13 }}>
            시설을 먼저 설치해주세요
          </div>
        ) : (
          productionEqs.map(eq => {
            const current = albanetWorkers[eq.id] ?? 0;
            const maxWorkers = 5;
            const isFull = current >= maxWorkers;
            const cost = getAlbanetHireCost(current);
            const canAfford = cost === 0 || cheese >= cost;

            return (
              <div
                key={eq.id}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {/* Team icon */}
                <div className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 52, height: 52, background: '#E8F4E0', fontSize: 26 }}>
                  {TEAM_ICONS[eq.id] ?? eq.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-black" style={{ fontSize: 14, color: '#1A1A1A' }}>
                    {TEAM_NAMES[eq.id] ?? eq.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {current} / {maxWorkers}마리
                  </div>
                  {/* Worker dots */}
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: maxWorkers }).map((_, i) => (
                      <div key={i} style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: i < current ? '#52B788' : '#D8D0C4',
                      }} />
                    ))}
                  </div>
                </div>

                {/* Hire button */}
                <motion.button
                  whileTap={!isFull && canAfford ? { scale: 0.92 } : {}}
                  onClick={!isFull && canAfford ? () => hireAlbanet(eq.id) : undefined}
                  className="flex flex-col items-center justify-center rounded-2xl flex-shrink-0"
                  style={{
                    width: 64, height: 52,
                    background: isFull ? '#E0E0E0' : canAfford ? '#52B788' : '#AAA',
                    border: 'none',
                    cursor: isFull || !canAfford ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isFull ? (
                    <span className="font-black text-white" style={{ fontSize: 10 }}>만원</span>
                  ) : cost === 0 ? (
                    <span className="font-black text-white" style={{ fontSize: 12 }}>FREE</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 13 }}>🧀</span>
                      <span className="font-black text-white" style={{ fontSize: 10 }}>{fmt(cost)}</span>
                    </>
                  )}
                </motion.button>
              </div>
            );
          })
        )}
      </div>

      {/* Current cheese */}
      <div className="flex items-center justify-center gap-2 py-3" style={{ borderTop: '1px solid #E0D8CC', background: '#FDFAF5' }}>
        <span style={{ fontSize: 16 }}>🧀</span>
        <span className="font-black" style={{ fontSize: 14, color: '#5A3A20' }}>보유 치즈: {fmt(cheese)}</span>
      </div>
    </motion.div>
  );
}
