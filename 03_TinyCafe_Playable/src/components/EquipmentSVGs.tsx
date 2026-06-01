import { motion } from 'framer-motion';
import waterpumpBaseworkerImg from '../../TinyCafe_reference_img/waterpump_baseworker.png';

interface SVGProps {
  level: number;
  progress: number;
  scale?: number;
  hideLv?: boolean;
  hideBar?: boolean;
}

const LvBadge = ({ level }: { level: number }) => (
  <div
    className="absolute top-0 left-0 flex items-center justify-center font-black text-white rounded-lg px-1"
    style={{ fontSize: 9, background: '#2D7016', border: '1.5px solid #4A9028', minWidth: 30, height: 18, letterSpacing: 0 }}
  >
    Lv.{level}
  </div>
);

// Shared progress bar rendered below each equipment
function ProgressBar({ pct, width, mt = 4, color = 'linear-gradient(90deg,#A85E00,#D4900A)' }: { pct: number; width: number; mt?: number; color?: string }) {
  return (
    <div style={{ width, height: 4, background: 'rgba(0,0,0,0.22)', borderRadius: 2, overflow: 'hidden', marginTop: mt, flexShrink: 0, opacity: 1 }}>
      <motion.div
        style={{ height: '100%', background: color, borderRadius: 2 }}
        animate={{ width: `${Math.min(100, pct * 100)}%` }}
        transition={{ duration: 0.08, ease: 'linear' }}
      />
    </div>
  );
}

// ── Hand Drip ─────────────────────────────────────────────────────────────────
export function HandDripSVG({ level, progress: _progress, scale = 1, showCup = false, brewPct = 0, hideLv = false }: SVGProps & { showCup?: boolean; brewPct?: number }) {
  const w = 90 * scale;
  const h = 100 * scale;

  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 90 100" style={{ overflow: 'visible' }}>

        {/* === Tripod stand + round wooden base (longer legs, wider base) === */}
        {/* Round wooden base disc (bottom) */}
        <ellipse cx={46} cy={100} rx={32} ry={5.5} fill="#9A6418" />
        <ellipse cx={46} cy={98}  rx={30} ry={5}   fill="#B87830" />
        <ellipse cx={46} cy={96}  rx={27} ry={3.8} fill="#D29038" />
        {/* 3 thin dark metal legs — longer, splay wider */}
        <line x1={28} y1={60} x2={17} y2={96} stroke="#383838" strokeWidth={3.5} strokeLinecap="round" />
        <line x1={64} y1={60} x2={75} y2={96} stroke="#383838" strokeWidth={3.5} strokeLinecap="round" />
        <line x1={46} y1={62} x2={46} y2={96} stroke="#303030" strokeWidth={3}   strokeLinecap="round" />
        {/* Metal collar ring (where legs meet platform) */}
        <ellipse cx={46} cy={60} rx={22} ry={4.5} fill="#1E1E1E" />
        {/* Wooden platform disc (where dripper sits) */}
        <ellipse cx={46} cy={58} rx={21} ry={4}   fill="#A86C20" />
        <ellipse cx={46} cy={56} rx={19} ry={3.5} fill="#C07828" />
        <ellipse cx={46} cy={54} rx={17} ry={2.5} fill="#D28A30" />

        {/* === Serving mug — rests on base top (y≈92) === */}
        {showCup && (
          <>
            {/* Mug depth/shadow layer */}
            <path d="M34 92 L34 73 Q46 68 58 73 L58 92 Q46 97 34 92 Z" fill="#D6D2CA" />
            {/* Mug main body */}
            <path d="M35 92 L35 74 Q46 70 57 74 L57 92 Q46 96 35 92 Z" fill="#F2EFE9" />
            {/* Flat front face */}
            <rect x={35} y={74} width={22} height={18} fill="#F8F5F0" />
            {/* Rim top ellipse */}
            <ellipse cx={46} cy={74} rx={11} ry={2.5} fill="#E6E2DA" />
            <ellipse cx={46} cy={73} rx={9}  ry={1.8} fill="#DEDAD2" />
            {/* Coffee visible at top 70%+ */}
            {brewPct >= 0.7 && (
              <ellipse cx={46} cy={74} rx={9} ry={1.8} fill="#2A0E02" opacity={0.90} />
            )}
            {/* Logo circle on mug front */}
            <circle cx={46} cy={83} r={5.5} fill="rgba(160,140,110,0.18)" stroke="#C4BAA8" strokeWidth={0.9} />
            <circle cx={46} cy={83} r={3.5} fill="#B0A890" opacity={0.35} />
            <circle cx={46} cy={82} r={2}   fill="#706050" opacity={0.55} />
            <path d="M44 84 Q46 86 48 84" fill="none" stroke="#706050" strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />
            {/* Mug base ellipse */}
            <ellipse cx={46} cy={92} rx={11} ry={2.5} fill="#D8D4CC" />
            {/* Saucer — sits on wooden base */}
            <ellipse cx={46} cy={94} rx={16} ry={3}   fill="#CECAC2" />
            <ellipse cx={46} cy={93} rx={14} ry={2.2} fill="#E0DCD4" />
            {/* Handle D-shape */}
            <path d="M57 77 Q67 77 67 83 Q67 89 57 88"
                  fill="none" stroke="#C8C4BC" strokeWidth={4}   strokeLinecap="round" />
            <path d="M57 77 Q67 77 67 83 Q67 89 57 88"
                  fill="none" stroke="#F0EDE8" strokeWidth={2.5} strokeLinecap="round" />
          </>
        )}

        {/* === Dripper unit — ALWAYS VISIBLE === */}
        {/* Dripper body (white ceramic, wide at top → narrow at bottom) */}
        <path d="M32 56 Q28 40 22 26 Q22 15 46 13 Q70 15 70 26 Q64 40 60 56 Q46 62 32 56 Z"
              fill="#E0DDD5" />
        <path d="M32 56 Q28 40 22 26 Q22 15 46 13 Q70 15 70 26 Q64 40 60 56 Q46 62 32 56 Z"
              fill="#F4F1EB" stroke="#D8D4C8" strokeWidth={1.2} />
        {/* Single red band at the MOUTH (rim of the opening) */}
        <path d="M23 20 Q23 15 46 13 Q69 15 69 20 Q69 26 46 28 Q23 26 23 20 Z"
              fill="#C83010" />
        {/* Coffee grounds at very top interior — covers the top, making it brown */}
        <ellipse cx={46} cy={17} rx={18} ry={4} fill="#2E1204" opacity={0.78} />
        <ellipse cx={44} cy={16} rx={7}  ry={2} fill="rgba(255,170,70,0.16)" />
        {/* Filter paper sticking above grounds */}
        <path d="M26 18 Q26 11 46 9 Q66 11 66 18"
              fill="none" stroke="#C4A060" strokeWidth={5} strokeLinecap="round" />
        <path d="M36 13 Q40 7 46 7 Q52 7 56 13"
              fill="none" stroke="#D4B07A" strokeWidth={3.5} strokeLinecap="round" />
        {/* Logo */}
        <rect x={38} y={39} width={16} height={13} rx={2}   fill="#D4C8A0" />
        <rect x={40} y={41} width={12} height={9}  rx={1.5} fill="#C0A878" />
        <circle cx={46} cy={46} r={4}   fill="#A08858" />
        <circle cx={46} cy={46} r={2.2} fill="#7A6038" />
        {/* Dripper handle */}
        <path d="M60 30 Q76 30 76 40 Q76 50 60 50"
              fill="none" stroke="#DEDAD0" strokeWidth={7}   strokeLinecap="round" />
        <path d="M60 30 Q76 30 76 40 Q76 50 60 50"
              fill="none" stroke="#F2EEE8" strokeWidth={4.5} strokeLinecap="round" />

        {/* === Drip animation (from dripper exit through collar → mug) === */}
        {showCup && brewPct > 0 && brewPct < 1 && (
          <motion.line
            x1={46} y1={62} x2={46} y2={68}
            stroke="#FF9800" strokeWidth={2.5} strokeLinecap="round"
            animate={{ y2: [68, 75, 68], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.38 }}
          />
        )}
      </svg>
      {/* 손님 추출 중에만 바 표시 */}
      {showCup
        ? <ProgressBar pct={brewPct} width={56} mt={6} />
        : <div style={{ height: 4, marginTop: 6 }} />
      }
      {!hideLv && (
        <div
          className="absolute flex items-center justify-center font-black text-white rounded-lg px-1"
          style={{ fontSize: 9, background: '#2D7016', border: '1.5px solid #4A9028', minWidth: 30, height: 18, letterSpacing: 0, top: -6, right: 0 }}
        >
          Lv.{level}
        </div>
      )}
    </div>
  );
}

// ── Espresso Machine (cream/white compact style) ───────────────────
export function EspressoSVG({ level, progress, scale = 1, hideLv = false, hideBar = false }: SVGProps) {
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

      </svg>
      {!hideBar && <ProgressBar pct={progress} width={56} color="#8A8278" />}
      {!hideLv && <LvBadge level={level} />}
    </div>
  );
}

// ── Water Pump (tall glass carafe with teal arc frame) ───────────────
export function WaterPumpSVG({ level, progress, scale = 1, hideLv = false, hideBar = false, showBaseWorker = false }: SVGProps & { showBaseWorker?: boolean }) {
  const w = 90 * scale;
  const h = 105 * scale;
  // Water level drops from top as progress increases (dispenser being consumed)
  const glassTop = 18;
  const glassBot = 84;
  const fillH = Math.max(3, (glassBot - glassTop) * (1 - Math.min(1, progress)));
  const fillY = glassBot - fillH;

  return (
    <div className="flex flex-col items-center" style={{ width: w, position: 'relative' }}>
      <svg width={w} height={h} viewBox="0 0 90 105" style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id="wpGlassClip">
            <rect x={27} y={glassTop} width={36} height={glassBot - glassTop} rx={6} />
          </clipPath>
          <linearGradient id="wpWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(140,230,248,0.72)" />
            <stop offset="100%" stopColor="rgba(72,190,220,0.55)" />
          </linearGradient>
          <linearGradient id="wpGlassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="28%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>

        {/* Left arc arm */}
        <path d="M28 26 Q8 52 28 78" stroke="#4AA8E0" strokeWidth={3.2} fill="none" strokeLinecap="round" />
        {/* Right arc arm */}
        <path d="M62 26 Q82 52 62 78" stroke="#4AA8E0" strokeWidth={3.2} fill="none" strokeLinecap="round" />

        {/* Glass cylinder — back wall tint */}
        <rect x={27} y={glassTop} width={36} height={glassBot - glassTop} rx={6}
              fill="rgba(195,248,255,0.07)" stroke="#80D4F5" strokeWidth={1.4} />

        {/* Water fill */}
        <rect x={27} y={fillY} width={36} height={fillH}
              fill="url(#wpWaterGrad)" clipPath="url(#wpGlassClip)" />
        {/* Water surface shimmer */}
        <ellipse cx={45} cy={fillY} rx={14} ry={2.2} fill="rgba(200,248,255,0.65)"
                 clipPath="url(#wpGlassClip)" />
        {/* Bubble */}
        <circle cx={39} cy={fillY + 9} r={2.2} fill="rgba(255,255,255,0.18)"
                clipPath="url(#wpGlassClip)" />

        {/* Glass highlight strip */}
        <rect x={31} y={glassTop + 2} width={3} height={glassBot - glassTop - 6} rx={1.5}
              fill="rgba(255,255,255,0.20)" clipPath="url(#wpGlassClip)" />

        {/* Glass front overlay (subtle depth) */}
        <rect x={27} y={glassTop} width={36} height={glassBot - glassTop} rx={6}
              fill="url(#wpGlassGrad)" stroke="#80D4F5" strokeWidth={1.4} />

        {/* Bottom base */}
        <ellipse cx={45} cy={86} rx={22} ry={4.5} fill="#3590C8" />
        <ellipse cx={45} cy={84} rx={20} ry={3.5} fill="#5CC8F0" />

        {/* Top cap */}
        <ellipse cx={45} cy={20} rx={20} ry={4.5} fill="#3590C8" />
        <ellipse cx={45} cy={18} rx={18} ry={4} fill="#6AD8F5" />

        {/* Top knob */}
        <rect x={38} y={8} width={14} height={11} rx={5} fill="#4AA8E0" />
        <ellipse cx={45} cy={8} rx={7} ry={3} fill="#90E4FC" />
        <ellipse cx={45} cy={6} rx={4.5} ry={2} fill="#C8F4FF" opacity={0.7} />

        {/* Spout arm — 가로를 더 길게 뻗다가 자연스럽게 꺾이는 형태 */}
        <path d="M27 70 L-6 70 Q-14 70 -14 78 L-14 93"
          stroke="#4AA8E0" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={-14} cy={93} r={3} fill="#5CC8F0" />

        {/* Water drip animation */}
        {progress > 0 && progress < 1 && (
          <motion.ellipse cx={-14} cy={97} rx={2} ry={2.8} fill="#A8EEFA"
            animate={{ cy: [95, 104, 95] }}
            transition={{ repeat: Infinity, duration: 0.55, ease: 'easeIn' }} />
        )}

        {/* Base worker — sits on horizontal pipe using PNG */}
        {showBaseWorker && (
          <image
            href={waterpumpBaseworkerImg}
            x={-17} y={44}
            width={38} height={40}
            preserveAspectRatio="xMidYMid meet"
          />
        )}

      </svg>
      {!hideBar && <ProgressBar pct={progress} width={56} mt={0} color="#48B4F0" />}
      {!hideLv && <LvBadge level={level} />}
    </div>
  );
}

export function EquipmentSVG({ id, level, progress, scale, hideLv, hideBar }: { id: string; level: number; progress: number; scale?: number; hideLv?: boolean; hideBar?: boolean }) {
  if (id === 'drip_coffee') return <HandDripSVG level={level} progress={progress} scale={scale} hideLv={hideLv} />;
  if (id === 'espresso_machine') return <EspressoSVG level={level} progress={progress} scale={scale} hideLv={hideLv} hideBar={hideBar} />;
  if (id === 'water_pump') return <WaterPumpSVG level={level} progress={progress} scale={scale} hideLv={hideLv} hideBar={hideBar} />;
  return <div style={{ width: 80, height: 80, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛁</div>;
}
