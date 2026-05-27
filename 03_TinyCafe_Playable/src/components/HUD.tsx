import { useGameStore, getIncomePerSec } from '../store/gameStore';

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'b';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'm';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return Math.floor(n).toString();
}

function RateChip({ icon, value, rate }: { icon: string; value: number; rate: number }) {
  return (
    <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
      <div
        className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-white font-bold"
        style={{ fontSize: 12, background: 'rgba(255,255,255,0.15)', whiteSpace: 'nowrap' }}
      >
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span>{fmt(value)}</span>
      </div>
      {rate > 0 && (
        <div style={{ fontSize: 8, color: '#B8E0A0', fontWeight: 700, marginTop: 1 }}>
          ↑+{fmt(rate)}/초
        </div>
      )}
    </div>
  );
}

// SVG ring progress gauge for hearts
function HeartRing({
  current, target, branchName,
}: {
  current: number; target: number; branchName: string;
}) {
  const R = 24;
  const circ = 2 * Math.PI * R;
  const pct = Math.min(1, current / target);
  const dashoffset = circ * (1 - pct);

  return (
    <div className="flex flex-col items-center" style={{ gap: 2 }}>
      <div style={{ fontSize: 8, color: '#FFD080', fontWeight: 900 }}>{branchName}</div>
      <div className="relative flex items-center justify-center" style={{ width: 58, height: 58 }}>
        <svg width={58} height={58} style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Background ring */}
          <circle
            cx={29} cy={29} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={5}
          />
          {/* Progress ring */}
          <circle
            cx={29} cy={29} r={R}
            fill="none"
            stroke="#FF4D6D"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 29 29)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        {/* Center heart */}
        <div style={{ fontSize: 22, zIndex: 1, lineHeight: 1 }}>❤️</div>
      </div>
      <div style={{ fontSize: 8, color: '#FFB0C0', fontWeight: 700 }}>
        {fmt(current)} / {fmt(target)}
      </div>
    </div>
  );
}

export default function HUD() {
  const resources = useGameStore(s => s.resources);
  const equipment = useGameStore(s => s.equipment);
  const heartTarget = useGameStore(s => s.heartTarget);

  const albanetWorkers = useGameStore(s => s.albanetWorkers);
  const coinsRate = getIncomePerSec(equipment, albanetWorkers);

  return (
    <div
      className="flex items-center justify-between px-2"
      style={{
        height: 60,
        background: 'linear-gradient(180deg,#3D1F0F 0%,#5A2E14 100%)',
        borderBottom: '2px solid #8B5E3C',
        flexShrink: 0,
      }}
    >
      {/* Left resources */}
      <div className="flex flex-col gap-1">
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white font-bold"
          style={{ fontSize: 11, background: 'rgba(136,96,232,0.4)' }}
        >
          <span style={{ fontSize: 12 }}>💎</span>
          <span>{fmt(resources.gems)}</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white font-bold"
          style={{ fontSize: 11, background: 'rgba(212,168,32,0.4)' }}
        >
          <span style={{ fontSize: 12 }}>🧀</span>
          <span>{fmt(resources.cheese)}</span>
        </div>
      </div>

      {/* Center: heart ring */}
      <HeartRing
        current={resources.hearts}
        target={heartTarget}
        branchName="1호점"
      />

      {/* Right resources */}
      <div className="flex flex-col items-end gap-0.5">
        <RateChip icon="🪙" value={resources.coins} rate={coinsRate} />
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white font-bold"
          style={{ fontSize: 11, background: 'rgba(46,204,113,0.35)' }}
        >
          <span style={{ fontSize: 12 }}>💵</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
}
