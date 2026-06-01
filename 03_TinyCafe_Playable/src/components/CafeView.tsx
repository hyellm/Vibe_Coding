import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getProductionTimeMs } from '../store/gameStore';
import { fmt } from '../utils/fmt';
import CatCustomer from './CatCustomer';
import { HandDripSVG, EspressoSVG, WaterPumpSVG } from './EquipmentSVGs';
import dolceImg from '../../TinyCafe_reference_img/Dolce.png';
import espressoWorkerImg from '../../TinyCafe_reference_img/espresso_worker.png';
import waterpumpWorkerImg from '../../TinyCafe_reference_img/waterpump_worker.png';
import espressoBaseworkerImg from '../../TinyCafe_reference_img/espresso_baseworker.png';

// ── Brew button ────────────────────────────────────────────────────
function BrewButton() {
  const customers = useGameStore(s => s.customers);
  const brewingId = useGameStore(s => s.brewingCustomerId);
  const brewTimer = useGameStore(s => s.brewTimer);
  const brewDuration = useGameStore(s => s.brewDuration);
  const tapBrew = useGameStore(s => s.tapBrew);
  const equipment = useGameStore(s => s.equipment);

  const waitingCustomer = customers.find(c => c.state === 'at_window');
  const isBrewing = !!brewingId;
  const isPulsing = !!waitingCustomer && !isBrewing;

  // Hidden when idle or brewing
  if (!waitingCustomer || isBrewing) return null;

  // Check if the desired equipment is unlocked
  const canBrew = waitingCustomer
    ? equipment.some(e => e.id === waitingCustomer.desiredMenuId && e.level > 0)
    : false;

  const brewPct = isBrewing ? Math.min(1, brewTimer / brewDuration) : 0;
  const R = 21;
  const circ = 2 * Math.PI * R;
  const dashoffset = circ * (1 - brewPct);

  return (
    <button
      className={`relative flex items-center justify-center rounded-full${isPulsing && canBrew ? ' brew-blink' : ''}`}
      style={{
        width: 49,
        height: 49,
        background: 'linear-gradient(135deg,#27AE60,#1E8449)',
        border: 'none',
        boxShadow: '0 0 12px rgba(46,204,113,0.3)',
        cursor: isPulsing && canBrew ? 'pointer' : 'default',
        outline: 'none',
      }}
      onClick={isPulsing && canBrew ? tapBrew : undefined}
    >
      {/* White ring + optional progress arc — all in one SVG so centers are identical */}
      <svg
        width={49} height={49}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Static white border ring */}
        <circle cx={24.5} cy={24.5} r={23} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={3} />
        {/* Progress arc */}
        {isBrewing && (
          <circle
            cx={24.5} cy={24.5} r={R}
            fill="none"
            stroke="white"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 24.5 24.5)"
            style={{ transition: 'stroke-dashoffset 0.15s linear' }}
          />
        )}
      </svg>

      {/* Kettle icon — always visible */}
      <svg width={28} height={28} viewBox="0 0 30 30" style={{ zIndex: 1 }}>
        <ellipse cx={14} cy={18} rx={11} ry={8} fill="white" />
        <rect x={4} y={12} width={20} height={3} rx={1.5} fill="white" />
        <path d="M24 15 Q30 12 29 18 Q30 22 24 20" fill="white" />
        <rect x={10} y={8} width={4} height={5} rx={2} fill="white" />
        <path d="M10 8 Q14 4 18 8" stroke="white" strokeWidth={2} fill="none" strokeLinecap="round" />
      </svg>

      {/* Lock indicator */}
      {waitingCustomer && !canBrew && (
        <div className="absolute -top-1 -right-1" style={{ fontSize: 14 }}>🔒</div>
      )}
    </button>
  );
}

// ── Window zone ────────────────────────────────────────────────────
// 화면 50% 높이 차지 (루트 844px 기준: HUD 60 + MissionBar 44 = 104px 제외 → ~320px)
function WindowZone() {
  const customers = useGameStore(s => s.customers);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 285, flexShrink: 0 }}
    >
      {/* Brick wall background */}
      <div className="absolute inset-0 brick-wall" />

      {/* Large arched window — city background (border-only frame added after overlays) */}
      <div
        className="absolute"
        style={{
          left: 60, right: 60,
          top: 8, bottom: 0,
          borderRadius: '80px 80px 0 0',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        {/* === Warm Sunny Café Street === */}

        {/* Sky — clear blue to warm golden horizon */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #5AB8EC 0%, #80CCF4 22%, #B8E2F8 55%, #EEE8C4 80%, #F8DCA0 100%)' }} />


        {/* Clouds */}
        <div className="absolute" style={{ top: 20, left: 6 }}>
          <div style={{ position: 'relative', width: 68, height: 30 }}>
            <div style={{ position: 'absolute', bottom: 0, left: 8, width: 52, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.93)' }} />
            <div style={{ position: 'absolute', bottom: 6, left: 16, width: 36, height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.90)' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 32, width: 26, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.88)' }} />
          </div>
        </div>
        <div className="absolute" style={{ top: 12, left: 88 }}>
          <div style={{ position: 'relative', width: 50, height: 24 }}>
            <div style={{ position: 'absolute', bottom: 0, left: 5, width: 40, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.86)' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 12, width: 26, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.90)' }} />
            <div style={{ position: 'absolute', bottom: 3, left: 24, width: 18, height: 15, borderRadius: 7, background: 'rgba(255,255,255,0.82)' }} />
          </div>
        </div>

        {/* Background skyline — soft distant buildings */}
        <div className="absolute" style={{ bottom: 95, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          {[{w:30,h:72},{w:20,h:88},{w:34,h:65},{w:24,h:95},{w:38,h:78},{w:16,h:100},{w:28,h:68},{w:22,h:84},{w:36,h:70},{w:26,h:90}].map((b,i) => (
            <div key={i} style={{ width: b.w, height: b.h, flexShrink: 0, background: `rgba(195,180,155,${0.16+i*0.007})`, borderRadius: '2px 2px 0 0' }} />
          ))}
        </div>

        {/* Building LEFT — 4F cream residential */}
        <div className="absolute" style={{ left: 4, bottom: 95, width: 76, height: 122 }}>
          <div style={{ position: 'absolute', inset: 0, background: '#ECD8B2' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 12, background: '#C87840', borderRadius: '4px 4px 0 0' }} />
          <div style={{ position: 'absolute', top: 11, left: 0, right: 0, height: 3, background: '#B86030' }} />
          {[38,62,86].map(y => (
            <div key={y} style={{ position: 'absolute', top: y, left: 0, right: 0, height: 2, background: 'rgba(150,100,40,0.13)' }} />
          ))}
          {Array.from({length:4},(_,r)=>Array.from({length:2},(_,c)=>({r,c}))).flat().map(({r,c},i) => (
            <div key={i} style={{ position: 'absolute', left: 9+c*40, top: 16+r*24, width: 20, height: 21,
              background: 'rgba(188,220,252,0.68)',
              border: '1.5px solid rgba(160,125,70,0.36)', borderRadius: 2 }}>
              <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:1, background:'rgba(150,120,60,0.20)' }} />
              <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:'rgba(150,120,60,0.16)' }} />
            </div>
          ))}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:18, background:'#D8C498' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(100,70,20,0.18)' }} />
          </div>
        </div>

        {/* Building CENTER — 4F warm stone (tallest, with gap on both sides) */}
        <div className="absolute" style={{ left: 100, bottom: 95, width: 98, height: 138 }}>
          <div style={{ position: 'absolute', inset: 0, background: '#D8C29C' }} />
          <div style={{ position:'absolute', top:0, left:0, right:0, height:5, background:'#A86030' }} />
          <div style={{ position:'absolute', top:4, left:5, right:5, height:9, background:'#B87040', borderRadius:'3px 3px 0 0' }} />
          <div style={{ position:'absolute', top:12, left:0, right:0, height:3, background:'#C88050' }} />
          {[14,46].map(x => (
            <div key={x} style={{ position:'absolute', top:14, bottom:0, left:x, width:2.5, background:'rgba(140,95,35,0.13)' }} />
          ))}
          {[42,68,94].map(y => (
            <div key={y} style={{ position:'absolute', top:y, left:0, right:0, height:2, background:'rgba(140,95,30,0.13)' }} />
          ))}
          {Array.from({length:4},(_,r)=>Array.from({length:3},(_,c)=>({r,c}))).flat().map(({r,c},i) => (
            <div key={i} style={{ position:'absolute', left:8+c*30, top:16+r*26, width:20, height:22,
              background: 'rgba(185,218,252,0.68)',
              border:'1.5px solid rgba(155,120,65,0.36)', borderRadius:2 }}>
              <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:1, background:'rgba(140,110,55,0.20)' }} />
              <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:'rgba(140,110,55,0.16)' }} />
            </div>
          ))}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:20, background:'#C8B485' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(100,65,15,0.18)' }} />
            <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:28, height:16, background:'rgba(160,120,60,0.28)', borderRadius:'3px 3px 0 0' }} />
          </div>
        </div>

        {/* Building RIGHT — 4F sandy residential */}
        <div className="absolute" style={{ right: 4, bottom: 95, width: 68, height: 112 }}>
          <div style={{ position:'absolute', inset:0, background:'#D4BC92' }} />
          <div style={{ position:'absolute', top:0, left:0, right:0, height:11, background:'#A05030', borderRadius:'4px 4px 0 0' }} />
          <div style={{ position:'absolute', top:10, left:0, right:0, height:3, background:'#B86040' }} />
          {[36,60,84].map(y => (
            <div key={y} style={{ position:'absolute', top:y, left:0, right:0, height:2, background:'rgba(140,95,30,0.13)' }} />
          ))}
          {Array.from({length:4},(_,r)=>Array.from({length:2},(_,c)=>({r,c}))).flat().map(({r,c},i) => (
            <div key={i} style={{ position:'absolute', left:8+c*36, top:14+r*24, width:20, height:20,
              background: 'rgba(185,218,250,0.65)',
              border:'1.5px solid rgba(155,118,60,0.34)', borderRadius:2 }}>
              <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:1, background:'rgba(140,108,52,0.18)' }} />
              <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:'rgba(140,108,52,0.15)' }} />
            </div>
          ))}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:17, background:'#C4AE84' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(100,65,15,0.16)' }} />
          </div>
        </div>

        {/* Lamp post — left gap (between left & center building) */}
        <svg className="absolute" style={{ bottom: 87, left: 70, width: 8, height: 68, overflow: 'visible' }}>
          <rect x={3} y={6} width={2.5} height={62} rx={1.2} fill="#6A5030" />
          <path d="M4 6 Q4 1 11 0" stroke="#6A5030" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx={11} cy={0} rx={4} ry={3} fill="rgba(255,230,100,0.25)" />
          <circle cx={11} cy={0} r={3} fill="#FFE890" opacity={0.92} />
          <circle cx={11} cy={0} r={1.6} fill="#FFFAD0" />
        </svg>

        {/* Far sidewalk — warm stone */}
        <div className="absolute" style={{ bottom: 87, left: 0, right: 0, height: 8, background: '#C8B898' }} />

        {/* Tree 1 — left side, slender, in front of left building */}
        <svg className="absolute" style={{ bottom: 83, left: 18, width: 24, height: 48, overflow: 'visible' }}>
          <ellipse cx={12} cy={46} rx={8} ry={2} fill="rgba(0,0,0,0.08)" />
          <rect x={10} y={28} width={4} height={18} rx={2} fill="#7A5020" />
          <ellipse cx={12} cy={20} rx={11} ry={13} fill="#3E8824" />
          <ellipse cx={12} cy={15} rx={9} ry={10} fill="#50A030" />
          <ellipse cx={9} cy={11} rx={6} ry={8} fill="#64B83C" opacity={0.68} />
          <ellipse cx={15} cy={13} rx={5} ry={7} fill="#72CA46" opacity={0.55} />
        </svg>

        {/* Tree 2 — right of center, larger */}
        <svg className="absolute" style={{ bottom: 83, left: 186, width: 34, height: 60, overflow: 'visible' }}>
          <ellipse cx={17} cy={58} rx={12} ry={2.8} fill="rgba(0,0,0,0.09)" />
          <rect x={14} y={34} width={6} height={24} rx={3} fill="#7A5020" />
          <ellipse cx={17} cy={25} rx={16} ry={18} fill="#3A8422" />
          <ellipse cx={17} cy={19} rx={14} ry={15} fill="#4EA02E" />
          <ellipse cx={12} cy={14} rx={10} ry={12} fill="#62BC3C" opacity={0.68} />
          <ellipse cx={21} cy={16} rx={8} ry={10} fill="#74CC48" opacity={0.58} />
          <ellipse cx={16} cy={9} rx={7} ry={7} fill="rgba(185,255,95,0.26)" />
        </svg>

        {/* Bench — right side, under tree 2 */}
        <svg className="absolute" style={{ bottom: 89, left: 178, width: 38, height: 24, overflow: 'visible' }}>
          <rect x={5} y={14} width={3} height={10} rx={1.5} fill="#7A5020" />
          <rect x={30} y={14} width={3} height={10} rx={1.5} fill="#7A5020" />
          <rect x={3} y={11} width={32} height={5} rx={2.5} fill="#A86830" />
          <rect x={5} y={4} width={28} height={4} rx={2} fill="#BA7840" />
          <rect x={9} y={4} width={2.5} height={10} rx={1} fill="#7A5020" />
          <rect x={26.5} y={4} width={2.5} height={10} rx={1} fill="#7A5020" />
        </svg>

        {/* Lamp post — far right, leaning left */}
        <svg className="absolute" style={{ bottom: 87, right: 20, width: 8, height: 62, overflow: 'visible' }}>
          <rect x={3} y={6} width={2.5} height={56} rx={1.2} fill="#6A5030" />
          <path d="M4 6 Q4 1 -3 0" stroke="#6A5030" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx={-3} cy={0} rx={4} ry={3} fill="rgba(255,230,100,0.25)" />
          <circle cx={-3} cy={0} r={3} fill="#FFE890" opacity={0.90} />
          <circle cx={-3} cy={0} r={1.6} fill="#FFFAD0" />
        </svg>

        {/* Road — warm paving */}
        <div className="absolute" style={{ bottom: 42, left: 0, right: 0, height: 45, background: '#C0B090' }}>
          {[9,20,31,40].map(y => (
            <div key={y} style={{ position: 'absolute', top: y, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.06)' }} />
          ))}
          {[22,50,80,108,136,162,192,222,248].map(x => (
            <div key={x} style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.05)' }} />
          ))}
        </div>

        {/* Curb */}
        <div className="absolute" style={{ bottom: 38, left: 0, right: 0, height: 4, background: '#D4C4A0' }} />

        {/* Near sidewalk — warm beige stone */}
        <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: 38, background: 'linear-gradient(180deg,#D6C9B0 0%,#E2D4BC 100%)' }}>
          <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          <div style={{ position: 'absolute', top: 22, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.06)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 5%,rgba(255,220,140,0.10) 50%,transparent 95%)', pointerEvents: 'none' }} />
        </div>

        {/* Warm sunlight overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(155deg, rgba(255,215,90,0.09) 0%, transparent 55%)', pointerEvents: 'none' }} />

        {/* Glass effects */}
        <div className="absolute inset-0" style={{ background: 'rgba(200,232,255,0.04)', pointerEvents: 'none' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(140deg, rgba(255,255,255,0.22) 0%, transparent 45%)', pointerEvents: 'none' }} />
        <div className="absolute" style={{ top: 18, left: 22, width: 5, height: 150, background: 'rgba(255,255,255,0.14)', borderRadius: 3, transform: 'rotate(-8deg)', pointerEvents: 'none' }} />
        <div className="absolute" style={{ top: 35, left: 42, width: 2.5, height: 100, background: 'rgba(255,255,255,0.09)', borderRadius: 2, transform: 'rotate(-8deg)', pointerEvents: 'none' }} />
      </div>

      {/* Tunnel arch shadow (depth effect) */}
      <div
        className="absolute"
        style={{
          bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 62, height: 36, borderRadius: '31px 31px 0 0',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, transparent 100%)',
          zIndex: 26, pointerEvents: 'none',
        }}
      />
      {/* Tunnel arch frame (wood) */}
      <div
        className="absolute"
        style={{
          bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 74, height: 44, borderRadius: '37px 37px 0 0',
          border: '5px solid #5A3818', borderBottom: 'none',
          zIndex: 27, pointerEvents: 'none',
          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.18)',
        }}
      />

      {/* Pendant lamp — modern */}
      <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 14 }}>
        <svg width={42} height={52} viewBox="0 0 42 52" style={{ overflow: 'visible' }}>
          {/* Light bloom on ceiling */}
          <ellipse cx={21} cy={2} rx={12} ry={3} fill="rgba(255,225,140,0.18)" />
          {/* Cord */}
          <line x1={21} y1={0} x2={21} y2={11} stroke="#8A7050" strokeWidth={1.4} strokeLinecap="round" />
          {/* Shade — clean dome, warm cream */}
          <path d="M15 11 Q5 15 4 28 Q4 33 21 34 Q38 33 38 28 Q37 15 27 11 Z" fill="#EDE0C8" />
          {/* Shade inner (slightly lighter for depth) */}
          <path d="M15 11 Q6 15 5 27 Q5 32 21 33 Q37 32 37 27 Q36 15 27 11 Z" fill="#F4EAD4" />
          {/* Top ring */}
          <ellipse cx={21} cy={11} rx={6} ry={1.8} fill="#C8B090" />
          <ellipse cx={21} cy={10.5} rx={5} ry={1.2} fill="#D8C4A0" />
          {/* Subtle sheen highlight */}
          <path d="M15 12 Q8 17 7 26" stroke="rgba(255,255,255,0.30)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {/* Bottom rim */}
          <ellipse cx={21} cy={34} rx={17} ry={2.8} fill="#C0A880" />
          <ellipse cx={21} cy={33.5} rx={15} ry={2} fill="#D4BC98" />
          {/* Inner warm glow */}
          <ellipse cx={21} cy={31} rx={9} ry={4.5} fill="rgba(255,220,150,0.45)" />
          <ellipse cx={21} cy={30} rx={5.5} ry={3} fill="rgba(255,240,195,0.65)" />
          {/* Light cone below shade */}
          <path d="M8 36 L1 52 L41 52 L34 36 Z" fill="rgba(255,215,130,0.09)" />
          <ellipse cx={21} cy={52} rx={20} ry={4.5} fill="rgba(255,210,110,0.11)" />
        </svg>
      </div>

      {/* 고양이 손님 컨테이너 — arch window 밖에 배치해 overflow 클리핑 방지 */}
      <div
        className="absolute"
        style={{ left: 0, right: 0, bottom: -15, height: 260, overflow: 'visible', zIndex: 15, pointerEvents: 'none' }}
      >
        <AnimatePresence>
          {customers.map(c => (
            <CatCustomer key={c.id} customer={c} />
          ))}
        </AnimatePresence>
      </div>

      {/* 벽돌 오버레이 — 창문 바깥 영역(좌우 벽)에서 고양이를 가림 */}
      <div className="absolute brick-wall" style={{ top: 0, left: 0, width: 66, bottom: 0, zIndex: 20, pointerEvents: 'none' }} />
      <div className="absolute brick-wall" style={{ top: 0, right: 0, width: 66, bottom: 0, zIndex: 20, pointerEvents: 'none' }} />

      {/* Window frame outer shadow — z:21 so it renders above brick overlays */}
      <div
        className="absolute"
        style={{
          left: 54, right: 54,
          top: 2, bottom: 0,
          borderRadius: '84px 84px 0 0',
          border: '10px solid #3A2808',
          borderBottom: 'none',
          pointerEvents: 'none',
          zIndex: 21,
        }}
      />

      {/* Window frame inner border — z:22, border only (no overflow/background) */}
      <div
        className="absolute"
        style={{
          left: 60, right: 60,
          top: 8, bottom: 0,
          borderRadius: '80px 80px 0 0',
          border: '6px solid #6A4820',
          borderBottom: 'none',
          pointerEvents: 'none',
          zIndex: 22,
        }}
      />
    </div>
  );
}

// ── Coin float FX ──────────────────────────────────────────────────
function CoinFX({ fx }: { fx: { id: string; x: number; y: number; amount: number; large?: boolean } }) {
  if (fx.large) {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ left: 0, right: 0, top: fx.y, display: 'flex', justifyContent: 'center', zIndex: 50 }}
      >
        <motion.div
          className="flex items-center gap-1.5"
          style={{ whiteSpace: 'nowrap' }}
          initial={{ opacity: 0, y: 0, scale: 0.7 }}
          animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.7, 1.05, 1, 1] }}
          transition={{ duration: 2.0, times: [0, 0.15, 0.7, 1], ease: 'easeOut' }}
        >
          <span style={{ fontSize: 20, fontWeight: 900, color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>+</span>
          <span style={{ fontSize: 18 }}>🪙</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>{fmt(fx.amount)}</span>
        </motion.div>
      </div>
    );
  }
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: 0, right: 0, top: fx.y, display: 'flex', justifyContent: 'center', zIndex: 50 }}
    >
      <motion.div
        className="font-black"
        style={{ fontSize: 13, color: '#C76508', textShadow: '0 1px 4px rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}
        initial={{ opacity: 1, y: 0, scale: 1 }}
        animate={{ opacity: 0, y: -60, scale: 1.3 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      >
        +🪙{fmt(fx.amount)}
      </motion.div>
    </div>
  );
}


// ── Cafe interior ──────────────────────────────────────────────────
function CafeInterior({ onOpenFacility, onOpenSmartphone }: { onOpenFacility: () => void; onOpenSmartphone: () => void }) {
  const equipment = useGameStore(s => s.equipment);
  const albanetWorkers = useGameStore(s => s.albanetWorkers);
  const brewingId = useGameStore(s => s.brewingCustomerId);
  const brewTimer = useGameStore(s => s.brewTimer);
  const brewDuration = useGameStore(s => s.brewDuration);
  const openUpgrade = useGameStore(s => s.openUpgrade);

  const isBrewing = !!brewingId;
  const brewPct = isBrewing ? Math.min(1, brewTimer / brewDuration) : 0;

  const drip = equipment.find(e => e.id === 'drip_coffee')!;
  const espresso = equipment.find(e => e.id === 'espresso_machine');
  const waterPump = equipment.find(e => e.id === 'water_pump');
  const bathhouse = equipment.find(e => e.id === 'bathhouse');

  const dripProg = drip.level > 0
    ? drip.productionProgress / getProductionTimeMs(drip)
    : 0;
  const espProg = espresso && espresso.level > 0
    ? espresso.productionProgress / getProductionTimeMs(espresso)
    : 0;
  const pumpProg = waterPump && waterPump.level > 0
    ? waterPump.productionProgress / getProductionTimeMs(waterPump)
    : 0;

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{ minHeight: 0 }}
    >
      {/* Tile wall background */}
      <div className="absolute inset-0 tile-wall" />

      {/* ── 2nd Floor: Drip Coffee + Ladder + Dolce ─── */}

      {/* BrewButton floats above drip machine — paddingLeft: 52 shifts center over drip (ladder 44 + margin 4 + half offset) */}
      <div className="absolute flex items-center justify-center"
        style={{ top: -5, left: 0, right: 0, height: 50, zIndex: 12, pointerEvents: 'none', paddingLeft: 52 }}>
        <div style={{ pointerEvents: 'auto' }}>
          <BrewButton />
        </div>
      </div>

      {/* Ladder + Dolce (LEFT) + Drip machine (RIGHT) — bottom-aligned (touch counter) */}
      <div className="absolute flex items-end justify-center"
        style={{ top: 21, left: 0, right: 0, height: 120, zIndex: 4 }}>

        {/* 스텝래더 (상단 플랫폼 + A-프레임) */}
        <div className="relative flex-shrink-0" style={{ width: 44, height: 85, marginRight: 4 }}>
          <svg width={44} height={85} viewBox="0 0 52 90"
            style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* === 상단 플랫폼 === */}
            {/* 표면 */}
            <rect x={2} y={1} width={48} height={12} rx={3} fill="#D8A030" />
            {/* 앞면 두께 */}
            <rect x={2} y={10} width={48} height={6} rx={2} fill="#B07820" />
            {/* 좌우 지지대 */}
            <rect x={5} y={15} width={5} height={9} rx={1.5} fill="#9A6420" />
            <rect x={42} y={15} width={5} height={9} rx={1.5} fill="#9A6420" />

            {/* === 다리 (A-프레임) === */}
            <line x1={7} y1={24} x2={3} y2={88} stroke="#8B5E2A" strokeWidth={5} strokeLinecap="round" />
            <line x1={45} y1={24} x2={49} y2={88} stroke="#8B5E2A" strokeWidth={5} strokeLinecap="round" />

            {/* === 발판 (다리 각도에 맞게) === */}
            {[0.12, 0.27, 0.42, 0.57, 0.72, 0.87].map((t, i) => {
              const y = 24 + 64 * t;
              const lx = 7 - 4 * t;
              const rx = 45 + 4 * t;
              return <line key={i} x1={lx} y1={y} x2={rx} y2={y} stroke="#A0722A" strokeWidth={4} strokeLinecap="round" />;
            })}

            {/* === 가로 보강재 (중간) === */}
            <line x1={5} y1={56} x2={47} y2={56} stroke="#8B5E2A" strokeWidth={2.5} strokeLinecap="round" />

            {/* === 발받침 === */}
            <ellipse cx={3} cy={88} rx={5} ry={2.5} fill="#6A4010" />
            <ellipse cx={49} cy={88} rx={5} ry={2.5} fill="#6A4010" />
          </svg>

          {/* Dolce — 플랫폼 위에 서 있음 */}
          <div className="absolute" style={{ top: -30, left: 3, zIndex: 5 }}>
            <motion.img src={dolceImg} alt="Dolce"
              style={{ width: 38, height: 38, objectFit: 'contain', imageRendering: 'crisp-edges' }}
              animate={!!brewingId ? { y: [0, -4, 0] } : { y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: !!brewingId ? 0.7 : 2 }} />
          </div>
        </div>

        {/* Drip machine on the RIGHT */}
        <button onClick={() => openUpgrade('drip_coffee')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
          <HandDripSVG level={drip.level} progress={dripProg} scale={0.85} showCup={isBrewing} brewPct={brewPct} />
        </button>
      </div>

      {/* 2nd ↔ 1st floor counter */}
      <div className="absolute counter-wood"
        style={{ top: 129, left: 0, right: 0, height: 18, zIndex: 2 }} />
      {/* Shadow below 2nd floor */}
      <div className="absolute"
        style={{ top: 129, left: 0, right: 0, height: 20,
          background: 'linear-gradient(180deg,rgba(0,0,0,0.14),transparent)',
          zIndex: 3, pointerEvents: 'none' }} />

      {/* ── 1st Floor: Espresso (L) + WaterPump (R) ─── */}

      {/* 1st floor wood shelf */}
      <div className="absolute counter-wood"
        style={{ top: 147, left: 0, right: 0, height: 14, zIndex: 2 }} />

      {/* 1st floor MACHINES */}
      <div className="absolute flex"
        style={{ top: 168, left: 0, right: 0, zIndex: 4 }}>

        <div className="flex-1 flex flex-col items-center">
          {espresso && espresso.level > 0 && (
            <button onClick={() => openUpgrade('espresso_machine')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <EspressoSVG level={espresso.level} progress={espProg} scale={0.82} />
            </button>
          )}
        </div>

        {/* Water pump: marginLeft 조정 (노즐 연장 길이만큼 왼쪽 이동) */}
        <div className="flex-1 flex flex-col items-center" style={{ marginLeft: 14 }}>
          {waterPump && waterPump.level > 0 && (
            <button onClick={() => openUpgrade('water_pump')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <WaterPumpSVG level={waterPump.level} progress={pumpProg} scale={0.82} showBaseWorker />
            </button>
          )}
        </div>
      </div>

      {/* 1st floor WORKERS */}
      <div className="absolute flex"
        style={{ bottom: 25, left: 0, right: 0, zIndex: 4 }}>

        {/* Espresso side: base worker always, hired worker only when hired — 그룹 전체 15px 왼쪽 */}
        <div className="flex-1 flex justify-center items-end">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, position: 'relative', left: -15 }}>
            {espresso && espresso.level > 0 && (
              <motion.img src={espressoBaseworkerImg} alt="espresso base worker"
                style={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0 }}
                animate={{ x: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 0.8 }} />
            )}
            {espresso && espresso.level > 0 && (albanetWorkers['espresso_machine'] ?? 0) > 0 && (
              <motion.img src={espressoWorkerImg} alt="espresso worker"
                style={{ width: 46, height: 46, objectFit: 'contain' }}
                animate={{ x: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 0.8 }} />
            )}
          </div>
        </div>

        {/* Water pump side: hired worker only when hired (base worker is inside SVG) */}
        <div className="flex-1 flex justify-center" style={{ marginLeft: 14 }}>
          {waterPump && waterPump.level > 0 && (albanetWorkers['water_pump'] ?? 0) > 0 && (
            <motion.img src={waterpumpWorkerImg} alt="waterpump worker"
              style={{ width: 58, height: 58, objectFit: 'contain', position: 'relative', left: -48 }}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 1.5 }} />
          )}
        </div>
      </div>

      {/* Bathhouse / rest area */}
      {bathhouse && bathhouse.level > 0 && (
        <button
          onClick={() => openUpgrade('bathhouse')}
          className="absolute flex flex-col items-center"
          style={{
            bottom: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer',
            zIndex: 5,
          }}
        >
          <svg width={70} height={60} viewBox="0 0 70 60">
            {/* Stone rim */}
            <ellipse cx={35} cy={32} rx={30} ry={20} fill="#A0A090" stroke="#808078" strokeWidth={3} />
            {/* Water */}
            <ellipse cx={35} cy={30} rx={24} ry={16} fill="#5ABDA0" opacity={0.85} />
            {/* Water shimmer */}
            <ellipse cx={35} cy={28} rx={18} ry={8} fill="rgba(120,220,200,0.4)" />
            {/* Steps */}
            <rect x={20} y={36} width={30} height={6} rx={2} fill="#909088" />
            <rect x={24} y={40} width={22} height={5} rx={2} fill="#808078" />
            {/* Lv badge */}
          </svg>
          <div style={{ fontSize: 8, fontWeight: 900, color: '#2D5016', background: '#E8F4E0', border: '1px solid #4A8028', borderRadius: 4, padding: '1px 4px' }}>
            목욕탕 Lv.{bathhouse.level}
          </div>
        </button>
      )}

      {/* Right-side quick buttons */}
      <div
        className="absolute right-2 flex flex-col gap-2"
        style={{ top: 219, zIndex: 20 }}
      >
        {[
          { icon: '🛠️', label: '시설', onClick: onOpenFacility },
          { icon: '📱', label: '스마트폰', onClick: onOpenSmartphone },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.85)',
              border: '2px solid #D4C0A0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              fontSize: 18,
            }}
            title={btn.label}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Floor */}
      <div
        className="absolute counter-wood"
        style={{ bottom: 0, left: 0, right: 0, height: 55, zIndex: 0 }}
      />

    </div>
  );
}

// ── Main CafeView ──────────────────────────────────────────────────
export default function CafeView({ onOpenFacility, onOpenSmartphone }: { onOpenFacility: () => void; onOpenSmartphone: () => void }) {
  const coinFXs = useGameStore(s => s.coinFXs);

  return (
    <div
      className="flex flex-col"
      style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
    >
      <WindowZone />
      <div
        className="counter-wood"
        style={{ height: 20, flexShrink: 0, borderTop: '3px solid #C49060', borderBottom: '3px solid #5A3020' }}
      />
      <CafeInterior onOpenFacility={onOpenFacility} onOpenSmartphone={onOpenSmartphone} />

      {/* Coin FX — CafeView 전체 기준으로 렌더링 (overflow 없음) */}
      <AnimatePresence>
        {coinFXs.map(fx => (
          <CoinFX key={fx.id} fx={fx} />
        ))}
      </AnimatePresence>
    </div>
  );
}
