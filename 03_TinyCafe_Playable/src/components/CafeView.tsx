import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getProductionTimeMs } from '../store/gameStore';
import CatCustomer from './CatCustomer';
import dolceImg from '../../TinyCafe_reference_img/Dolce.png';
import mouseImg from '../../TinyCafe_reference_img/mouse_workers.png';

// ── Equipment SVGs ─────────────────────────────────────────────────

function HandDripSVG({ level, progress }: { level: number; progress: number }) {
  const circ = 2 * Math.PI * 18;
  const offset = circ * (1 - Math.min(1, progress));
  return (
    <div className="flex flex-col items-center" style={{ width: 90, position: 'relative' }}>
      <svg width={90} height={100} viewBox="0 0 90 100" style={{ overflow: 'visible' }}>
        {/* Coffee sack */}
        <rect x={52} y={58} width={32} height={38} rx={4} fill="#C8A870" />
        <rect x={56} y={62} width={24} height={16} rx={3} fill="#B89060" />
        <text x={68} y={73} textAnchor="middle" fontSize={6} fill="#8A6030" fontWeight="bold">COFFEE</text>
        <ellipse cx={68} cy={58} rx={16} ry={5} fill="#D4B880" />

        {/* Tripod legs */}
        <line x1={45} y1={90} x2={15} y2={95} stroke="#8B5E2A" strokeWidth={4} strokeLinecap="round" />
        <line x1={45} y1={90} x2={45} y2={96} stroke="#8B5E2A" strokeWidth={4} strokeLinecap="round" />
        <line x1={45} y1={90} x2={52} y2={95} stroke="#8B5E2A" strokeWidth={4} strokeLinecap="round" />
        {/* Tripod top bar */}
        <line x1={20} y1={52} x2={52} y2={52} stroke="#8B5E2A" strokeWidth={3} strokeLinecap="round" />
        <line x1={20} y1={52} x2={45} y2={90} stroke="#8B5E2A" strokeWidth={3} strokeLinecap="round" />
        <line x1={52} y1={52} x2={45} y2={90} stroke="#8B5E2A" strokeWidth={3} strokeLinecap="round" />

        {/* Dripper cone */}
        <path d="M24 52 L36 78 L36 82 L34 88 L46 88 L44 82 L44 78 L56 52 Z" fill="#F5F0E8" stroke="#D4C8B0" strokeWidth={1.5} />
        <path d="M26 56 L54 56" stroke="#D4C8B0" strokeWidth={1} opacity="0.5" />

        {/* Filter paper inside */}
        <path d="M29 58 L36 78 L44 78 L51 58 Z" fill="#FDECD0" opacity="0.6" />

        {/* Coffee drip */}
        {progress > 0 && progress < 1 && (
          <motion.line
            x1={40} y1={88} x2={40} y2={95}
            stroke="#5A3010"
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ y2: [92, 97, 92] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
        )}

        {/* Cup at bottom */}
        <ellipse cx={40} cy={97} rx={10} ry={4} fill="#F5F0E8" />
        <path d="M30 97 L32 108 Q40 112 48 108 L50 97" fill="#F5F0E8" stroke="#D4C8B0" strokeWidth={1} />

        {/* Progress ring around dripper */}
        {level > 0 && (
          <circle
            cx={40} cy={65} r={18}
            fill="none"
            stroke="#FFD700"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 40 65)"
            opacity={0.7}
            style={{ transition: 'stroke-dashoffset 0.4s linear' }}
          />
        )}
      </svg>

      {/* Level badge */}
      <div
        className="absolute top-0 right-0 flex items-center justify-center font-black text-white rounded-md px-1"
        style={{
          fontSize: 8,
          background: '#2D5016',
          border: '1px solid #4A8028',
          minWidth: 26,
          height: 16,
        }}
      >
        Lv.{level}
      </div>
    </div>
  );
}

function EspressoSVG({ level, progress }: { level: number; progress: number }) {
  const circ = 2 * Math.PI * 20;
  const offset = circ * (1 - Math.min(1, progress));
  // Yellow arc gauge on dial
  const dialCirc = 2 * Math.PI * 14;
  const dialOffset = dialCirc * (1 - Math.min(1, progress));

  return (
    <div className="flex flex-col items-center" style={{ width: 100, position: 'relative' }}>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        {/* Machine body */}
        <rect x={18} y={20} width={64} height={72} rx={10} fill="#F0ECE4" stroke="#D8D0C0" strokeWidth={2} />

        {/* Top shadow panel */}
        <rect x={18} y={20} width={64} height={18} rx={10} fill="#E0D8CC" />
        <rect x={18} y={30} width={64} height={8} fill="#E0D8CC" />

        {/* Dial circle on body */}
        <circle cx={52} cy={52} r={20} fill="#2A2A2A" />
        <circle cx={52} cy={52} r={16} fill="#1A1A1A" />

        {/* Coffee bean logo on dial */}
        <ellipse cx={52} cy={52} rx={7} ry={9} fill="#8B5E2A" />
        <path d="M52 43 Q56 52 52 61" stroke="#5A3A10" strokeWidth={1.5} fill="none" />

        {/* Yellow gauge arc */}
        <circle
          cx={52} cy={52} r={14}
          fill="none"
          stroke="#FFD700"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={dialCirc}
          strokeDashoffset={dialOffset}
          transform="rotate(-90 52 52)"
          style={{ transition: 'stroke-dashoffset 0.4s linear' }}
        />

        {/* Outer progress ring */}
        {level > 0 && (
          <circle
            cx={52} cy={52} r={20}
            fill="none"
            stroke="rgba(255,215,0,0.3)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 52 52)"
            style={{ transition: 'stroke-dashoffset 0.4s linear' }}
          />
        )}

        {/* Knobs on top */}
        <circle cx={34} cy={25} r={5} fill="#C8C0B0" />
        <circle cx={50} cy={25} r={5} fill="#C8C0B0" />
        <circle cx={66} cy={25} r={5} fill="#C8C0B0" />

        {/* Portafilter arm */}
        <rect x={6} y={64} width={18} height={10} rx={5} fill="#8B5E2A" />
        <ellipse cx={7} cy={69} rx={6} ry={5} fill="#6A4020" />

        {/* Steam wand */}
        <rect x={76} y={50} width={6} height={24} rx={3} fill="#C8C0B0" />
        <ellipse cx={79} cy={74} rx={5} ry={3} fill="#B0A890" />

        {/* Coffee output + cup */}
        <rect x={40} y={86} width={24} height={3} rx={1.5} fill="#C8C0B0" />

        {/* ESPRESSO label */}
        <rect x={22} y={78} width={56} height={10} rx={3} fill="#2A2A2A" />
        <text x={50} y={86} textAnchor="middle" fontSize={6} fill="#FFD700" fontWeight="bold" letterSpacing={1}>
          ESPRESSO
        </text>

        {/* Drip indicator */}
        {progress > 0.1 && progress < 1 && (
          <motion.line
            x1={50} y1={90} x2={50} y2={96}
            stroke="#3A2010"
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ y2: [93, 97, 93] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        )}

        {/* Cup on tray */}
        <ellipse cx={50} cy={97} rx={10} ry={4} fill="#F5F0E8" />
        <path d="M40 97 L42 106 Q50 110 58 106 L60 97" fill="#F5F0E8" stroke="#D4C8B0" strokeWidth={1} />
      </svg>

      {/* Level badge */}
      <div
        className="absolute top-0 right-0 flex items-center justify-center font-black text-white rounded-md px-1"
        style={{
          fontSize: 8,
          background: '#2D5016',
          border: '1px solid #4A8028',
          minWidth: 26,
          height: 16,
        }}
      >
        Lv.{level}
      </div>
    </div>
  );
}

// ── Dolce sprite ───────────────────────────────────────────────────
// ── Dolce sprite ───────────────────────────────────────────────────

function DolceSprite({ isBrewing }: { isBrewing: boolean }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: 60 }}>
      <motion.img
        src={dolceImg}
        alt="Dolce"
        style={{ width: 54, height: 54, objectFit: 'contain', imageRendering: 'crisp-edges' }}
        animate={isBrewing
          ? { y: [0, -4, 0] }
          : { y: [0, -3, 0] }
        }
        transition={{ repeat: Infinity, duration: isBrewing ? 0.6 : 2 }}
      />
      <div
        className="font-black text-white rounded-full px-2 py-0.5"
        style={{ fontSize: 8, background: 'linear-gradient(135deg,#C05010,#E07030)' }}
      >
        돌체
      </div>
    </div>
  );
}

// ── Worker mouse sprite ───────────────────────────────────────────
// ── Worker mouse sprite ───────────────────────────────────────────

function WorkerMouse({ isWorking }: { isWorking: boolean }) {
  return (
    <motion.img
      src={mouseImg}
      alt="worker"
      style={{ width: 36, height: 36, objectFit: 'contain' }}
      animate={isWorking
        ? { rotate: [-8, 8, -8] }
        : { y: [0, -2, 0] }
      }
      transition={{ repeat: Infinity, duration: isWorking ? 0.5 : 2.5 }}
    />
  );
}

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

  // Check if the desired equipment is unlocked
  const canBrew = waitingCustomer
    ? equipment.some(e => e.id === waitingCustomer.desiredMenuId && e.level > 0)
    : false;

  const brewPct = isBrewing ? Math.min(1, brewTimer / brewDuration) : 0;
  const R = 26;
  const circ = 2 * Math.PI * R;
  const dashoffset = circ * (1 - brewPct);

  return (
    <motion.button
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: 62,
        height: 62,
        background: 'linear-gradient(135deg,#27AE60,#1E8449)',
        border: '3px solid rgba(255,255,255,0.4)',
        boxShadow: '0 4px 16px rgba(46,204,113,0.5)',
        cursor: isPulsing && canBrew ? 'pointer' : 'default',
        outline: 'none',
      }}
      animate={isPulsing && canBrew ? {
        boxShadow: [
          '0 4px 16px rgba(46,204,113,0.5)',
          '0 4px 28px rgba(46,204,113,0.9)',
          '0 4px 16px rgba(46,204,113,0.5)',
        ],
        scale: [1, 1.06, 1],
      } : {}}
      transition={{ repeat: Infinity, duration: 1.2 }}
      whileTap={canBrew ? { scale: 0.9 } : {}}
      onClick={isPulsing && canBrew ? tapBrew : undefined}
    >
      {/* Brew arc progress */}
      {isBrewing && (
        <svg
          width={62} height={62}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx={31} cy={31} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={5}
          />
          <circle
            cx={31} cy={31} r={R}
            fill="none"
            stroke="white"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 31 31)"
            style={{ transition: 'stroke-dashoffset 0.15s linear' }}
          />
        </svg>
      )}

      {/* Kettle icon */}
      <svg width={30} height={30} viewBox="0 0 30 30" style={{ zIndex: 1 }}>
        <ellipse cx={14} cy={18} rx={11} ry={8} fill="white" />
        <rect x={4} y={12} width={20} height={3} rx={1.5} fill="white" />
        <path d="M24 15 Q30 12 29 18 Q30 22 24 20" fill="white" />
        <rect x={10} y={8} width={4} height={5} rx={2} fill="white" />
        <path d="M10 8 Q14 4 18 8" stroke="white" strokeWidth={2} fill="none" strokeLinecap="round" />
      </svg>

      {/* "주문" label when ready to brew */}
      {isPulsing && canBrew && (
        <motion.div
          className="absolute -bottom-5 left-1/2 font-black text-white rounded-full px-2"
          style={{ fontSize: 9, transform: 'translateX(-50%)', background: '#1E8449', whiteSpace: 'nowrap' }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          탭!
        </motion.div>
      )}

      {/* Lock indicator if equipment not unlocked */}
      {waitingCustomer && !canBrew && (
        <div className="absolute -top-1 -right-1" style={{ fontSize: 14 }}>🔒</div>
      )}
    </motion.button>
  );
}

// ── Window zone ────────────────────────────────────────────────────
function WindowZone() {
  const customers = useGameStore(s => s.customers);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 200, flexShrink: 0 }}
    >
      {/* Brick wall background */}
      <div className="absolute inset-0 brick-wall" />

      {/* Sky visible through top gap */}
      <div
        className="absolute"
        style={{ top: 0, left: 0, right: 0, height: 12, background: '#B8CCE0' }}
      />

      {/* Large arched window frame */}
      <div
        className="absolute"
        style={{
          left: 30, right: 30,
          top: 8, bottom: 0,
          borderRadius: '80px 80px 0 0',
          border: '6px solid #6A4820',
          borderBottom: 'none',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        {/* City blur background inside glass */}
        <div className="absolute inset-0 city-bg" />

        {/* Blurry buildings */}
        <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: 110 }}>
          {/* Building silhouettes */}
          <div className="absolute" style={{ left: 0, bottom: 0, width: 60, height: 90, background: '#7090A8', borderRadius: '4px 4px 0 0', opacity: 0.6 }} />
          <div className="absolute" style={{ left: 50, bottom: 0, width: 45, height: 70, background: '#8098A8', borderRadius: '4px 4px 0 0', opacity: 0.5 }} />
          <div className="absolute" style={{ left: 90, bottom: 0, width: 70, height: 100, background: '#6888A0', borderRadius: '4px 4px 0 0', opacity: 0.6 }} />
          <div className="absolute" style={{ right: 0, bottom: 0, width: 55, height: 80, background: '#7898A8', borderRadius: '4px 4px 0 0', opacity: 0.5 }} />
          <div className="absolute" style={{ right: 45, bottom: 0, width: 65, height: 110, background: '#6080A0', borderRadius: '4px 4px 0 0', opacity: 0.7 }} />
        </div>

        {/* Glass sheen effect */}
        <div
          className="absolute"
          style={{
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Cat customers (inside the window glass overlay) */}
        <div className="absolute" style={{ left: -30, right: -30, bottom: 0, height: 150, overflow: 'visible' }}>
          <AnimatePresence>
            {customers.map(c => (
              <CatCustomer key={c.id} customer={c} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Window frame outer shadow */}
      <div
        className="absolute"
        style={{
          left: 24, right: 24,
          top: 2, bottom: 0,
          borderRadius: '84px 84px 0 0',
          border: '10px solid #3A2808',
          borderBottom: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Window sill / ledge */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 22, background: 'linear-gradient(180deg,#8B6240,#6A4820)' }}
      />

      {/* Counter shelf items */}
      <div className="absolute" style={{ bottom: 8, left: 44, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        {/* Tips jar */}
        <div style={{ position: 'relative', width: 22, height: 30 }}>
          <div style={{
            width: 22, height: 30,
            borderRadius: '3px 3px 5px 5px',
            background: 'rgba(180,220,255,0.6)',
            border: '2px solid rgba(100,160,220,0.7)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: 3,
            overflow: 'hidden',
          }}>
            <div style={{ fontSize: 6, fontWeight: 900, color: '#4080B0' }}>TIPS</div>
            <div style={{ fontSize: 9 }}>🪙</div>
          </div>
        </div>
        {/* Coffee cup */}
        <div style={{ width: 20, height: 20, borderRadius: '3px 3px 6px 6px', background: '#F5F0E8', border: '2px solid #D4C0A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
          ☕
        </div>
      </div>

      {/* Pendant lamp */}
      <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: 3, height: 20, background: '#5A3A20', margin: '0 auto' }} />
        <div style={{ width: 28, height: 18, borderRadius: '4px 4px 50% 50%', background: '#E8D0A0', border: '2px solid #C0A060', boxShadow: '0 4px 12px rgba(255,220,100,0.4)' }} />
      </div>
    </div>
  );
}

// ── Coin float FX ──────────────────────────────────────────────────
function CoinFX({ fx }: { fx: { id: string; x: number; y: number; amount: number } }) {
  return (
    <motion.div
      className="absolute font-black pointer-events-none"
      style={{ left: fx.x, top: fx.y, zIndex: 50, fontSize: 13, color: '#FFD700', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -60, scale: 1.3 }}
      transition={{ duration: 1.6, ease: 'easeOut' }}
    >
      +{fx.amount}🪙
    </motion.div>
  );
}

// ── Cafe interior ──────────────────────────────────────────────────
function CafeInterior() {
  const equipment = useGameStore(s => s.equipment);
  const brewingId = useGameStore(s => s.brewingCustomerId);
  const coinFXs = useGameStore(s => s.coinFXs);
  const openUpgrade = useGameStore(s => s.openUpgrade);

  const drip = equipment.find(e => e.id === 'drip_coffee')!;
  const espresso = equipment.find(e => e.id === 'espresso_machine');
  const bathhouse = equipment.find(e => e.id === 'bathhouse');

  const dripProg = drip.level > 0
    ? drip.productionProgress / getProductionTimeMs(drip)
    : 0;
  const espProg = espresso && espresso.level > 0
    ? espresso.productionProgress / getProductionTimeMs(espresso)
    : 0;

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{ minHeight: 0 }}
    >
      {/* Tile wall background */}
      <div className="absolute inset-0 tile-wall" />

      {/* Upper wood shelf */}
      <div
        className="absolute counter-wood"
        style={{ top: 0, left: 0, right: 0, height: 14, zIndex: 2 }}
      />

      {/* Equipment shelf surface */}
      <div
        className="absolute"
        style={{
          top: 0, left: 8, right: 8, height: 130,
          background: 'rgba(255,248,235,0.6)',
          borderRadius: '0 0 10px 10px',
          border: '2px solid #C4A070',
          borderTop: 'none',
          zIndex: 1,
        }}
      />

      {/* Equipment row */}
      <div
        className="absolute flex items-end gap-4 px-4"
        style={{ top: 10, left: 0, right: 0, zIndex: 3 }}
      >
        {/* Drip coffee - always shown (starts at lv1) */}
        <button
          onClick={() => openUpgrade('drip_coffee')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <HandDripSVG level={drip.level} progress={dripProg} />
        </button>

        {/* Espresso machine - shown if unlocked */}
        {espresso && espresso.level > 0 ? (
          <button
            onClick={() => openUpgrade('espresso_machine')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <EspressoSVG level={espresso.level} progress={espProg} />
          </button>
        ) : (
          /* Locked slot */
          <button
            onClick={() => openUpgrade('espresso_machine')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div
              className="flex flex-col items-center justify-center rounded-xl"
              style={{
                width: 90, height: 100,
                background: 'rgba(0,0,0,0.12)',
                border: '2px dashed #C0A070',
              }}
            >
              <span style={{ fontSize: 22 }}>🔒</span>
              <span style={{ fontSize: 8, color: '#8A6040', fontWeight: 700, marginTop: 3 }}>
                {espresso ? `${espresso.unlockCost}🪙` : ''}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Worker mice at equipment */}
      <div
        className="absolute flex gap-2 items-end"
        style={{ top: 100, left: 16, zIndex: 4 }}
      >
        <WorkerMouse isWorking={dripProg > 0 && dripProg < 1} />
        {espresso && espresso.level > 0 && (
          <WorkerMouse isWorking={espProg > 0 && espProg < 1} />
        )}
      </div>

      {/* Counter divider below shelf */}
      <div
        className="absolute counter-wood"
        style={{ top: 130, left: 0, right: 0, height: 18, zIndex: 2 }}
      />

      {/* Dolce + brew button area */}
      <div
        className="absolute flex flex-col items-center"
        style={{ top: 148, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
      >
        <BrewButton />
        <div style={{ marginTop: 8 }}>
          <DolceSprite isBrewing={!!brewingId} />
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
        style={{ top: 160, zIndex: 6 }}
      >
        {[
          { icon: '📘', label: '캣북' },
          { icon: '🔧', label: '업그레이드' },
          { icon: '📱', label: '스마트폰' },
          { icon: '📬', label: '우편' },
        ].map(btn => (
          <button
            key={btn.label}
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
        className="absolute wood-floor"
        style={{ bottom: 0, left: 0, right: 0, height: '40%', zIndex: 0 }}
      />

      {/* Floor shadow near counter */}
      <div
        className="absolute"
        style={{
          top: 148,
          left: 0, right: 0,
          height: 16,
          background: 'linear-gradient(180deg,rgba(0,0,0,0.12),transparent)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Coin FX */}
      <AnimatePresence>
        {coinFXs.map(fx => (
          <CoinFX key={fx.id} fx={fx} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Main CafeView ──────────────────────────────────────────────────
export default function CafeView() {
  return (
    <div
      className="flex flex-col"
      style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
    >
      {/* Window zone: exterior + cat customers */}
      <WindowZone />

      {/* Counter ledge divider */}
      <div
        className="counter-wood"
        style={{ height: 20, flexShrink: 0, borderTop: '3px solid #C49060', borderBottom: '3px solid #5A3020' }}
      />

      {/* Cafe interior */}
      <CafeInterior />
    </div>
  );
}
