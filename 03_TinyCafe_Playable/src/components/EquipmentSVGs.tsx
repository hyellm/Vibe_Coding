import { motion } from 'framer-motion';

interface SVGProps {
  level: number;
  progress: number;
  scale?: number;
}

export function HandDripSVG({ level, progress, scale = 1 }: SVGProps) {
  const circ = 2 * Math.PI * 18;
  const offset = circ * (1 - Math.min(1, progress));
  const w = 90 * scale;
  const h = 100 * scale;
  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 90 100" style={{ overflow: 'visible' }}>
        <rect x={52} y={58} width={32} height={38} rx={4} fill="#C8A870" />
        <rect x={56} y={62} width={24} height={16} rx={3} fill="#B89060" />
        <text x={68} y={73} textAnchor="middle" fontSize={6} fill="#8A6030" fontWeight="bold">COFFEE</text>
        <ellipse cx={68} cy={58} rx={16} ry={5} fill="#D4B880" />
        <line x1={45} y1={90} x2={15} y2={95} stroke="#8B5E2A" strokeWidth={4} strokeLinecap="round" />
        <line x1={45} y1={90} x2={45} y2={96} stroke="#8B5E2A" strokeWidth={4} strokeLinecap="round" />
        <line x1={45} y1={90} x2={52} y2={95} stroke="#8B5E2A" strokeWidth={4} strokeLinecap="round" />
        <line x1={20} y1={52} x2={52} y2={52} stroke="#8B5E2A" strokeWidth={3} strokeLinecap="round" />
        <line x1={20} y1={52} x2={45} y2={90} stroke="#8B5E2A" strokeWidth={3} strokeLinecap="round" />
        <line x1={52} y1={52} x2={45} y2={90} stroke="#8B5E2A" strokeWidth={3} strokeLinecap="round" />
        <path d="M24 52 L36 78 L36 82 L34 88 L46 88 L44 82 L44 78 L56 52 Z" fill="#F5F0E8" stroke="#D4C8B0" strokeWidth={1.5} />
        <path d="M26 56 L54 56" stroke="#D4C8B0" strokeWidth={1} opacity="0.5" />
        <path d="M29 58 L36 78 L44 78 L51 58 Z" fill="#FDECD0" opacity="0.6" />
        {progress > 0 && progress < 1 && (
          <motion.line x1={40} y1={88} x2={40} y2={95} stroke="#5A3010" strokeWidth={2} strokeLinecap="round"
            animate={{ y2: [92, 97, 92] }} transition={{ repeat: Infinity, duration: 0.6 }} />
        )}
        <ellipse cx={40} cy={97} rx={10} ry={4} fill="#F5F0E8" />
        <path d="M30 97 L32 108 Q40 112 48 108 L50 97" fill="#F5F0E8" stroke="#D4C8B0" strokeWidth={1} />
        {level > 0 && (
          <circle cx={40} cy={65} r={18} fill="none" stroke="#FFD700" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 40 65)" opacity={0.7}
            style={{ transition: 'stroke-dashoffset 0.4s linear' }} />
        )}
      </svg>
      <div className="absolute top-0 right-0 flex items-center justify-center font-black text-white rounded-md px-1"
        style={{ fontSize: 8, background: '#2D5016', border: '1px solid #4A8028', minWidth: 26, height: 16 }}>
        Lv.{level}
      </div>
    </div>
  );
}

export function EspressoSVG({ level, progress, scale = 1 }: SVGProps) {
  const circ = 2 * Math.PI * 20;
  const offset = circ * (1 - Math.min(1, progress));
  const dialCirc = 2 * Math.PI * 14;
  const dialOffset = dialCirc * (1 - Math.min(1, progress));
  const w = 100 * scale;
  const h = 100 * scale;
  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <rect x={18} y={20} width={64} height={72} rx={10} fill="#F0ECE4" stroke="#D8D0C0" strokeWidth={2} />
        <rect x={18} y={20} width={64} height={18} rx={10} fill="#E0D8CC" />
        <rect x={18} y={30} width={64} height={8} fill="#E0D8CC" />
        <circle cx={52} cy={52} r={20} fill="#2A2A2A" />
        <circle cx={52} cy={52} r={16} fill="#1A1A1A" />
        <ellipse cx={52} cy={52} rx={7} ry={9} fill="#8B5E2A" />
        <path d="M52 43 Q56 52 52 61" stroke="#5A3A10" strokeWidth={1.5} fill="none" />
        <circle cx={52} cy={52} r={14} fill="none" stroke="#FFD700" strokeWidth={3.5} strokeLinecap="round"
          strokeDasharray={dialCirc} strokeDashoffset={dialOffset} transform="rotate(-90 52 52)"
          style={{ transition: 'stroke-dashoffset 0.4s linear' }} />
        {level > 0 && (
          <circle cx={52} cy={52} r={20} fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth={2}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 52 52)"
            style={{ transition: 'stroke-dashoffset 0.4s linear' }} />
        )}
        <circle cx={34} cy={25} r={5} fill="#C8C0B0" />
        <circle cx={50} cy={25} r={5} fill="#C8C0B0" />
        <circle cx={66} cy={25} r={5} fill="#C8C0B0" />
        <rect x={6} y={64} width={18} height={10} rx={5} fill="#8B5E2A" />
        <ellipse cx={7} cy={69} rx={6} ry={5} fill="#6A4020" />
        <rect x={76} y={50} width={6} height={24} rx={3} fill="#C8C0B0" />
        <ellipse cx={79} cy={74} rx={5} ry={3} fill="#B0A890" />
        <rect x={40} y={86} width={24} height={3} rx={1.5} fill="#C8C0B0" />
        <rect x={22} y={78} width={56} height={10} rx={3} fill="#2A2A2A" />
        <text x={50} y={86} textAnchor="middle" fontSize={6} fill="#FFD700" fontWeight="bold" letterSpacing={1}>ESPRESSO</text>
        {progress > 0.1 && progress < 1 && (
          <motion.line x1={50} y1={90} x2={50} y2={96} stroke="#3A2010" strokeWidth={2} strokeLinecap="round"
            animate={{ y2: [93, 97, 93] }} transition={{ repeat: Infinity, duration: 0.5 }} />
        )}
        <ellipse cx={50} cy={97} rx={10} ry={4} fill="#F5F0E8" />
        <path d="M40 97 L42 106 Q50 110 58 106 L60 97" fill="#F5F0E8" stroke="#D4C8B0" strokeWidth={1} />
      </svg>
      <div className="absolute top-0 right-0 flex items-center justify-center font-black text-white rounded-md px-1"
        style={{ fontSize: 8, background: '#2D5016', border: '1px solid #4A8028', minWidth: 26, height: 16 }}>
        Lv.{level}
      </div>
    </div>
  );
}

export function WaterPumpSVG({ level, progress, scale = 1 }: SVGProps) {
  const circ = 2 * Math.PI * 18;
  const offset = circ * (1 - Math.min(1, progress));
  const w = 90 * scale;
  const h = 100 * scale;
  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 90 100" style={{ overflow: 'visible' }}>
        {/* Tank body */}
        <rect x={20} y={30} width={50} height={60} rx={8} fill="#B8D8E8" stroke="#88B8D0" strokeWidth={2} />
        {/* Water fill */}
        <clipPath id="tankClip">
          <rect x={20} y={30} width={50} height={60} rx={8} />
        </clipPath>
        <rect x={20} y={55} width={50} height={35} fill="#5ABFE8" opacity={0.7} clipPath="url(#tankClip)" />
        {/* Water shimmer */}
        <ellipse cx={45} cy={56} rx={18} ry={4} fill="rgba(120,210,240,0.5)" clipPath="url(#tankClip)" />
        {/* Tank cap */}
        <rect x={30} y={24} width={30} height={10} rx={4} fill="#88B8D0" stroke="#6898B0" strokeWidth={1.5} />
        {/* Pump handle */}
        <rect x={52} y={10} width={8} height={20} rx={3} fill="#6898B0" />
        <rect x={44} y={8} width={24} height={6} rx={3} fill="#88B8D0" stroke="#6898B0" strokeWidth={1} />
        {/* Spout */}
        <path d="M20 70 Q8 70 8 82 L8 88" stroke="#6898B0" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* Water cup under spout */}
        <path d="M3 89 L5 102 Q8 105 11 102 L13 89 Z" fill="#E8F8FF" stroke="#88C8E8" strokeWidth={1.5} />
        <line x1={3} y1={89} x2={13} y2={89} stroke="#88C8E8" strokeWidth={1.5} />
        <path d="M4 95 L5 102 Q8 105 11 102 L12 95 Z" fill="#5ABFE8" opacity={0.7} />
        {/* Falling water droplet */}
        {progress > 0 && progress < 1 && (
          <motion.ellipse cx={8} cy={82} rx={2} ry={3} fill="#5ABFE8"
            animate={{ cy: [80, 88, 80] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeIn' }} />
        )}
        {/* Base */}
        <rect x={18} y={88} width={54} height={6} rx={3} fill="#88B8D0" />
        {/* Progress ring */}
        {level > 0 && (
          <circle cx={45} cy={58} r={18} fill="none" stroke="#FFD700" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 45 58)" opacity={0.7}
            style={{ transition: 'stroke-dashoffset 0.4s linear' }} />
        )}
      </svg>
      <div className="absolute top-0 right-0 flex items-center justify-center font-black text-white rounded-md px-1"
        style={{ fontSize: 8, background: '#2D5016', border: '1px solid #4A8028', minWidth: 26, height: 16 }}>
        Lv.{level}
      </div>
    </div>
  );
}

export function EquipmentSVG({ id, level, progress, scale }: { id: string; level: number; progress: number; scale?: number }) {
  if (id === 'drip_coffee') return <HandDripSVG level={level} progress={progress} scale={scale} />;
  if (id === 'espresso_machine') return <EspressoSVG level={level} progress={progress} scale={scale} />;
  if (id === 'water_pump') return <WaterPumpSVG level={level} progress={progress} scale={scale} />;
  return <div style={{ width: 80, height: 80, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛁</div>;
}
