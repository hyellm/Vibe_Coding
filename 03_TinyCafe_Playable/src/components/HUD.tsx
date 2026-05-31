import { useGameStore, getIncomePerSec } from '../store/gameStore';
import { fmt } from '../utils/fmt';

function ResourcePill({
  icon, value, rate, bg,
}: {
  icon: string; value: number; rate?: number; bg: string;
}) {
  const hasRate = rate !== undefined && rate > 0;
  return (
    <div className="flex flex-col items-center" style={{ gap: 1 }}>
      <div
        className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-white font-bold"
        style={{
          fontSize: 11,
          background: bg,
          whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.08)',
          minWidth: 46,
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 12 }}>{icon}</span>
        <span>{fmt(value)}</span>
      </div>
      {/* Always rendered to keep uniform height across all pills */}
      <div style={{ fontSize: 7, color: '#90E080', fontWeight: 700, visibility: hasRate ? 'visible' : 'hidden' }}>
        ↑{hasRate ? fmt(rate!) : '0'}/s
      </div>
    </div>
  );
}

function HeartRing({ current, target }: { current: number; target: number }) {
  const R = 18;
  const circ = 2 * Math.PI * R;
  const dashoffset = circ * (1 - Math.min(1, current / target));

  return (
    <div className="flex flex-col items-center" style={{ gap: 1, flexShrink: 0 }}>
      <div className="relative flex items-center justify-center" style={{ width: 44, height: 44 }}>
        <svg width={44} height={44} style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx={22} cy={22} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={4} />
          <circle
            cx={22} cy={22} r={R}
            fill="none"
            stroke="#FF4D6D"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 22 22)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{ fontSize: 17, zIndex: 1, lineHeight: 1 }}>❤️</div>
      </div>
      <div style={{ fontSize: 7, color: '#FFB0C0', fontWeight: 700, whiteSpace: 'nowrap' }}>
        {fmt(current)}/{fmt(target)}
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
      className="flex items-center justify-between px-3"
      style={{
        height: 58,
        background: 'linear-gradient(180deg,#221006 0%,#361808 100%)',
        borderBottom: '2px solid #623A1A',
        flexShrink: 0,
      }}
    >
      {/* Left resources */}
      <div className="flex items-center gap-1">
        <ResourcePill icon="💎" value={resources.gems}   bg="rgba(120,80,220,0.50)" />
        <ResourcePill icon="🧀" value={resources.cheese} bg="rgba(200,148,18,0.50)" />
      </div>

      {/* Center heart ring */}
      <HeartRing current={resources.hearts} target={heartTarget} />

      {/* Right resources */}
      <div className="flex items-center gap-1">
        <ResourcePill icon="🪙" value={resources.coins} rate={coinsRate} bg="rgba(200,158,8,0.42)" />
        <ResourcePill icon="💵" value={0}               bg="rgba(38,178,96,0.42)" />
      </div>
    </div>
  );
}
