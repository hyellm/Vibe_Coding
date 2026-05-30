import { motion } from 'framer-motion';

interface SVGProps {
  level: number;
  progress: number;
  scale?: number;
}

const LvBadge = ({ level }: { level: number }) => (
  <div
    className="absolute top-0 left-0 flex items-center justify-center font-black text-white rounded-lg px-1"
    style={{ fontSize: 9, background: '#2D7016', border: '1.5px solid #4A9028', minWidth: 30, height: 18, letterSpacing: 0 }}
  >
    Lv.{level}
  </div>
);

// ── Hand Drip ──────────────────────────────────────────────────────
export function HandDripSVG({ level, progress, scale = 1 }: SVGProps) {
  const circ = 2 * Math.PI * 16;
  const offset = circ * (1 - Math.min(1, progress));
  const w = 90 * scale;
  const h = 100 * scale;
  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 90 100" style={{ overflow: 'visible' }}>

        {/* ── 삼각대 다리 ── */}
        <line x1={44} y1={24} x2={16} y2={96} stroke="#8A5C24" strokeWidth={5} strokeLinecap="round" />
        <line x1={44} y1={24} x2={72} y2={96} stroke="#8A5C24" strokeWidth={5} strokeLinecap="round" />
        <line x1={44} y1={24} x2={44} y2={96} stroke="#7A4C18" strokeWidth={4} strokeLinecap="round" />
        {/* 크로스 브레이스 */}
        <line x1={27} y1={68} x2={61} y2={68} stroke="#8A5C24" strokeWidth={3} strokeLinecap="round" />
        {/* 다리 발받침 */}
        <ellipse cx={16} cy={96} rx={4} ry={2} fill="#6A4010" />
        <ellipse cx={72} cy={96} rx={4} ry={2} fill="#6A4010" />
        <ellipse cx={44} cy={96} rx={3} ry={1.5} fill="#6A4010" />

        {/* ── 상단 플랫폼 ── */}
        <ellipse cx={44} cy={22} rx={20} ry={5} fill="#D8A030" />
        <ellipse cx={44} cy={24} rx={20} ry={5} fill="#C08020" />

        {/* ── 상단 필터 컵 ── */}
        <path d="M25 21 L27 4 Q44 -3 61 4 L63 21 Q44 28 25 21 Z" fill="#F8F4EE" stroke="#D8D2C8" strokeWidth={1.2} />
        {/* 빨간 밴드 */}
        <path d="M26 17 Q44 24 62 17" fill="none" stroke="#E84A30" strokeWidth={4} />
        {/* 커피 원두 */}
        <ellipse cx={44} cy={10} rx={14} ry={5} fill="#7A3A08" opacity={0.88} />
        {/* 컵 손잡이 */}
        <path d="M63 11 Q75 11 75 17 Q75 23 63 20" fill="none" stroke="#D8D2C8" strokeWidth={3} strokeLinecap="round" />

        {/* ── 중앙 수직 기둥 (두 컵 사이) ── */}
        <rect x={42} y={28} width={4} height={24} rx={2} fill="#A07820" />

        {/* ── 하단 플랫폼 ── */}
        <ellipse cx={44} cy={53} rx={18} ry={4.5} fill="#D8A030" />
        <ellipse cx={44} cy={55} rx={18} ry={4.5} fill="#C08020" />

        {/* ── 하단 수령 컵 ── */}
        <path d="M28 53 L30 38 Q44 32 58 38 L60 53 Q44 59 28 53 Z" fill="#F8F4EE" stroke="#D8D2C8" strokeWidth={1.2} />
        {/* 컵 손잡이 */}
        <path d="M60 43 Q72 43 72 48 Q72 53 60 50" fill="none" stroke="#D8D2C8" strokeWidth={3} strokeLinecap="round" />
        {/* 라벨/로고 */}
        <rect x={36} y={39} width={16} height={12} rx={2} fill="#EEEADA" />
        <circle cx={44} cy={45} r={5} fill="#C8A878" />
        <circle cx={44} cy={45} r={3} fill="#A88858" />

        {/* 드립 애니메이션 (위 컵 → 아래 컵) */}
        {progress > 0 && progress < 1 && (
          <motion.line x1={44} y1={28} x2={44} y2={34}
            stroke="#7A3A08" strokeWidth={2} strokeLinecap="round"
            animate={{ y2: [32, 36, 32] }}
            transition={{ repeat: Infinity, duration: 0.4 }} />
        )}

        {/* 프로그레스 링 */}
        {level > 0 && (
          <circle cx={44} cy={46} r={16} fill="none" stroke="#FFD700" strokeWidth={3}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 44 46)" opacity={0.7}
            style={{ transition: 'stroke-dashoffset 0.4s linear' }} />
        )}
      </svg>
      <div
        className="absolute flex items-center justify-center font-black text-white rounded-lg px-1"
        style={{ fontSize: 9, background: '#2D7016', border: '1.5px solid #4A9028', minWidth: 30, height: 18, letterSpacing: 0, top: -6, right: 0 }}
      >
        Lv.{level}
      </div>
    </div>
  );
}

// ── Espresso Machine (cream/white compact style) ───────────────────
export function EspressoSVG({ level, progress, scale = 1 }: SVGProps) {
  const circ = 2 * Math.PI * 22;
  const offset = circ * (1 - Math.min(1, progress));
  const w = 100 * scale;
  const h = 100 * scale;
  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        {/* Drip tray */}
        <rect x={14} y={84} width={70} height={5} rx={2} fill="#D8D4CE" />
        {[22, 32, 42, 52, 62, 72].map(x => (
          <line key={x} x1={x} y1={84} x2={x} y2={89} stroke="#BEB8B2" strokeWidth={0.8} />
        ))}
        <rect x={10} y={87} width={78} height={7} rx={3} fill="#C8C4BC" stroke="#B0ACA6" strokeWidth={1} />

        {/* Main body */}
        <rect x={14} y={10} width={70} height={75} rx={9} fill="#F2EDE6" stroke="#D8D2CA" strokeWidth={1.5} />

        {/* Top panel */}
        <rect x={14} y={10} width={70} height={20} rx={9} fill="#E6E0D8" />
        <rect x={14} y={22} width={70} height={8} fill="#E6E0D8" />

        {/* Display panel */}
        <rect x={18} y={36} width={32} height={24} rx={4} fill="#D5D0C8" stroke="#C5BFB8" strokeWidth={1} />
        <rect x={20} y={38} width={28} height={20} rx={3} fill="#C8C2B8" />
        <rect x={22} y={41} width={24} height={2.5} rx={1.2} fill="#A5A09A" opacity={0.7} />
        <rect x={22} y={46} width={18} height={2.5} rx={1.2} fill="#A5A09A" opacity={0.5} />
        <rect x={22} y={51} width={21} height={2.5} rx={1.2} fill="#A5A09A" opacity={0.6} />

        {/* Main dial knob */}
        <circle cx={67} cy={47} r={12} fill="#D8D2C8" stroke="#C0BAB2" strokeWidth={1.5} />
        <circle cx={67} cy={47} r={8.5} fill="#C8C2B8" />
        <circle cx={67} cy={47} r={4} fill="#B8B2A8" />
        <circle cx={67} cy={36.5} r={2} fill="#8A8480" />
        <circle cx={74.5} cy={39.5} r={1.5} fill="#9A9490" opacity={0.7} />

        {/* Steam wand arm */}
        <rect x={4} y={43} width={11} height={4} rx={2} fill="#CCCAB8" />
        {/* Wand */}
        <rect x={4} y={47} width={4.5} height={22} rx={2.2} fill="#D0CAC0" />
        <circle cx={6.2} cy={47} r={3.5} fill="#C0BAB0" />
        <ellipse cx={6.2} cy={69} rx={4} ry={3} fill="#B0AAA0" />

        {/* Group head */}
        <rect x={30} y={73} width={38} height={12} rx={4} fill="#C8C2B8" stroke="#B5B0A8" strokeWidth={1} />
        <rect x={36} y={81} width={26} height={9} rx={3} fill="#B5B0A8" />
        <rect x={33} y={84} width={32} height={5} rx={2.5} fill="#A8A29A" />
        {/* Spout holes */}
        <rect x={47} y={90} width={3.5} height={8} rx={1.7} fill="#989490" />
        <rect x={53.5} y={90} width={3.5} height={8} rx={1.7} fill="#989490" />

        {/* Espresso drips */}
        {progress > 0.1 && progress < 1 && (
          <>
            <motion.ellipse cx={48.7} cy={99} rx={1.5} ry={2} fill="#4A2808"
              animate={{ cy: [97, 103, 97] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeIn' }} />
            <motion.ellipse cx={55.2} cy={99} rx={1.5} ry={2} fill="#4A2808"
              animate={{ cy: [98, 104, 98] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeIn', delay: 0.2 }} />
          </>
        )}

        {/* Progress ring */}
        {level > 0 && (
          <circle cx={49} cy={50} r={22} fill="none" stroke="rgba(255,215,0,0.25)" strokeWidth={2}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 49 50)" style={{ transition: 'stroke-dashoffset 0.4s linear' }} />
        )}
      </svg>
      <LvBadge level={level} />
    </div>
  );
}

// ── Water Pump (dark blue industrial dispenser) ────────────────────
export function WaterPumpSVG({ level, progress, scale = 1 }: SVGProps) {
  const circ = 2 * Math.PI * 20;
  const offset = circ * (1 - Math.min(1, progress));
  const w = 90 * scale;
  const h = 100 * scale;
  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 90 100" style={{ overflow: 'visible' }}>
        {/* Main body — sky blue */}
        <rect x={20} y={14} width={54} height={70} rx={7} fill="#5AC8E8" stroke="#3AAAC8" strokeWidth={2} />

        {/* Top cap */}
        <rect x={28} y={9} width={38} height={9} rx={4} fill="#3AAAC8" stroke="#2890B0" strokeWidth={1.5} />
        {/* Pump handle */}
        <rect x={52} y={2} width={8} height={13} rx={3} fill="#6AD8F8" />
        <rect x={44} y={0} width={22} height={5} rx={2.5} fill="#7AE4FF" stroke="#5AC8E8" strokeWidth={1} />

        {/* Water level window (left side of body) */}
        <rect x={24} y={20} width={16} height={44} rx={3} fill="#2890B0" stroke="#5AC8E8" strokeWidth={1} />
        <clipPath id="wpWaterClip">
          <rect x={24} y={20} width={16} height={44} rx={3} />
        </clipPath>
        <rect x={25} y={33} width={14} height={30} fill="#7AE4FF" opacity={0.85} clipPath="url(#wpWaterClip)" />
        <ellipse cx={32} cy={34} rx={6} ry={2} fill="rgba(180,240,255,0.6)" clipPath="url(#wpWaterClip)" />

        {/* Control panel (right side of body) */}
        <rect x={44} y={22} width={24} height={40} rx={4} fill="#3AAAC8" />
        {/* Power button */}
        <circle cx={56} cy={32} r={7} fill="#2890B0" stroke="#5AC8E8" strokeWidth={1} />
        <circle cx={56} cy={32} r={4} fill="#E84060" />
        {/* Mode button */}
        <circle cx={56} cy={47} r={6} fill="#2890B0" stroke="#5AC8E8" strokeWidth={1} />
        <circle cx={56} cy={47} r={3.5} fill="#52B788" />
        {/* Slider */}
        <rect x={46} y={57} width={22} height={3} rx={1.5} fill="#2890B0" />
        <rect x={46} y={57} width={12} height={3} rx={1.5} fill="#7AE4FF" />

        {/* Spout arm */}
        <path d="M20 66 Q8 66 8 76 L8 84" stroke="#3AAAC8" strokeWidth={5} fill="none" strokeLinecap="round" />

        {/* Falling water droplet from spout */}
        {progress > 0 && progress < 1 && (
          <motion.ellipse cx={8} cy={84} rx={2} ry={3} fill="#7AE4FF"
            animate={{ cy: [82, 90, 82] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeIn' }} />
        )}

        {/* Base */}
        <rect x={16} y={82} width={58} height={6} rx={3} fill="#3AAAC8" stroke="#2890B0" strokeWidth={1} />

        {/* Progress ring */}
        {level > 0 && (
          <circle cx={45} cy={50} r={20} fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth={2.5}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 45 50)" opacity={0.7}
            style={{ transition: 'stroke-dashoffset 0.4s linear' }} />
        )}
      </svg>
      <LvBadge level={level} />
    </div>
  );
}

export function EquipmentSVG({ id, level, progress, scale }: { id: string; level: number; progress: number; scale?: number }) {
  if (id === 'drip_coffee') return <HandDripSVG level={level} progress={progress} scale={scale} />;
  if (id === 'espresso_machine') return <EspressoSVG level={level} progress={progress} scale={scale} />;
  if (id === 'water_pump') return <WaterPumpSVG level={level} progress={progress} scale={scale} />;
  return <div style={{ width: 80, height: 80, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛁</div>;
}
