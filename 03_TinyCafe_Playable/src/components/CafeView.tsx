import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getProductionTimeMs } from '../store/gameStore';
import CatCustomer from './CatCustomer';
import { HandDripSVG, EspressoSVG, WaterPumpSVG } from './EquipmentSVGs';
import dolceImg from '../../TinyCafe_reference_img/Dolce.png';
import espressoWorkerImg from '../../TinyCafe_reference_img/espresso_worker.png';
import waterpumpWorkerImg from '../../TinyCafe_reference_img/waterpump_worker.png';

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
  const R = 21;
  const circ = 2 * Math.PI * R;
  const dashoffset = circ * (1 - brewPct);

  return (
    <button
      className={`relative flex items-center justify-center rounded-full${isPulsing && canBrew ? ' brew-blink' : ''}`}
      style={{
        width: 50,
        height: 50,
        background: 'linear-gradient(135deg,#27AE60,#1E8449)',
        border: '3px solid rgba(255,255,255,0.4)',
        boxShadow: '0 0 12px rgba(46,204,113,0.3)',
        cursor: isPulsing && canBrew ? 'pointer' : 'default',
        outline: 'none',
      }}
      onClick={isPulsing && canBrew ? tapBrew : undefined}
    >
      {/* Brew arc progress */}
      {isBrewing && (
        <svg
          width={50} height={50}
          style={{ position: 'absolute', top: -2, left: -2 }}
        >
          <circle
            cx={25} cy={25} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={4}
          />
          <circle
            cx={25} cy={25} r={R}
            fill="none"
            stroke="white"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 25 25)"
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

      {/* Lock indicator if equipment not unlocked */}
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
        {/* === City Street Background === */}

        {/* Sky gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #4E9FCE 0%, #73BBDF 20%, #9CCDE8 50%, #C0E2F2 75%, #D8EDF8 100%)' }} />

        {/* Hazy far buildings */}
        <div className="absolute" style={{ bottom: 100, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', flexWrap: 'nowrap', overflow: 'hidden' }}>
          {[
            { w: 58, h: 62 }, { w: 38, h: 50 }, { w: 68, h: 80 },
            { w: 32, h: 54 }, { w: 52, h: 72 }, { w: 44, h: 55 },
          ].map((b, i) => (
            <div key={i} style={{ width: b.w, height: b.h, flexShrink: 0, background: `rgba(148,178,202,${0.36 + i * 0.02})`, borderRadius: '3px 3px 0 0' }} />
          ))}
        </div>

        {/* Main building — left */}
        <div className="absolute" style={{ left: 0, bottom: 95, width: 70, height: 178, background: '#7A8EA0', borderRadius: '4px 4px 0 0' }}>
          <div style={{ height: 10, background: 'rgba(0,0,0,0.2)', borderRadius: '4px 4px 0 0' }} />
          {Array.from({ length: 5 }, (_, r) => Array.from({ length: 2 }, (_, c) => ({ r, c }))).flat().map(({ r, c: col }, i) => (
            <div key={i} style={{ position: 'absolute', left: 9 + col * 32, top: 16 + r * 32, width: 20, height: 23, background: i === 6 ? 'rgba(255,240,148,0.88)' : 'rgba(178,210,240,0.58)', border: '1.5px solid rgba(78,105,125,0.38)', borderRadius: 2 }} />
          ))}
        </div>

        {/* Main building — center */}
        <div className="absolute" style={{ left: 73, bottom: 95, width: 88, height: 215, background: '#8A9EAF', borderRadius: '5px 5px 0 0' }}>
          <div style={{ height: 12, background: 'rgba(0,0,0,0.2)', borderRadius: '5px 5px 0 0' }} />
          {Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 }, (_, c) => ({ r, c }))).flat().map(({ r, c: col }, i) => (
            <div key={i} style={{ position: 'absolute', left: 8 + col * 27, top: 18 + r * 32, width: 18, height: 21, background: [4, 11, 14].includes(i) ? 'rgba(255,242,155,0.85)' : 'rgba(172,205,238,0.55)', border: '1.5px solid rgba(80,108,130,0.35)', borderRadius: 2 }} />
          ))}
        </div>

        {/* Main building — right */}
        <div className="absolute" style={{ right: 0, bottom: 95, width: 62, height: 158, background: '#728294', borderRadius: '4px 4px 0 0' }}>
          <div style={{ height: 9, background: 'rgba(0,0,0,0.2)', borderRadius: '4px 4px 0 0' }} />
          {Array.from({ length: 4 }, (_, r) => Array.from({ length: 2 }, (_, c) => ({ r, c }))).flat().map(({ r, c: col }, i) => (
            <div key={i} style={{ position: 'absolute', left: 8 + col * 30, top: 15 + r * 32, width: 19, height: 23, background: i === 3 ? 'rgba(255,243,158,0.85)' : 'rgba(176,208,238,0.58)', border: '1.5px solid rgba(74,100,120,0.38)', borderRadius: 2 }} />
          ))}
        </div>

        {/* Far sidewalk (across street) */}
        <div className="absolute" style={{ bottom: 87, left: 0, right: 0, height: 8, background: '#9AA2AA' }} />

        {/* Road */}
        <div className="absolute" style={{ bottom: 42, left: 0, right: 0, height: 45, background: '#5C6470' }}>
          <div style={{ position: 'absolute', top: '48%', left: 0, right: 0, borderTop: '2px dashed rgba(255,255,255,0.32)', transform: 'translateY(-50%)' }} />
        </div>

        {/* Curb */}
        <div className="absolute" style={{ bottom: 38, left: 0, right: 0, height: 4, background: '#8892A0' }} />

        {/* Near sidewalk (where cat walks) */}
        <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: 38, background: 'linear-gradient(180deg,#B4B0A8 0%,#C2BEB6 100%)' }}>
          <div style={{ position: 'absolute', top: 11, left: 0, right: 0, borderTop: '1px solid rgba(0,0,0,0.1)' }} />
          <div style={{ position: 'absolute', top: 23, left: 0, right: 0, borderTop: '1px solid rgba(0,0,0,0.07)' }} />
        </div>

        {/* Glass blue tint */}
        <div className="absolute inset-0" style={{ background: 'rgba(180,220,255,0.05)', pointerEvents: 'none' }} />
        {/* Glass sheen */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(140deg, rgba(255,255,255,0.2) 0%, transparent 45%)', pointerEvents: 'none' }} />
        {/* Glass reflection lines */}
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

      {/* Pendant lamp */}
      <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: 3, height: 20, background: '#5A3A20', margin: '0 auto' }} />
        <div style={{ width: 28, height: 18, borderRadius: '4px 4px 50% 50%', background: '#E8D0A0', border: '2px solid #C0A060', boxShadow: '0 4px 12px rgba(255,220,100,0.4)' }} />
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
function CafeInterior({ onOpenFacility, onOpenSmartphone }: { onOpenFacility: () => void; onOpenSmartphone: () => void }) {
  const equipment = useGameStore(s => s.equipment);
  const brewingId = useGameStore(s => s.brewingCustomerId);
  const coinFXs = useGameStore(s => s.coinFXs);
  const openUpgrade = useGameStore(s => s.openUpgrade);

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

      {/* BrewButton floats above drip machine */}
      <div className="absolute flex items-center justify-center"
        style={{ top: -5, left: 0, right: 0, height: 50, zIndex: 12, pointerEvents: 'none' }}>
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
          <HandDripSVG level={drip.level} progress={dripProg} scale={0.85} />
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

        <div className="flex-1 flex flex-col items-center" style={{ paddingTop: 7 }}>
          {waterPump && waterPump.level > 0 && (
            <button onClick={() => openUpgrade('water_pump')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <WaterPumpSVG level={waterPump.level} progress={pumpProg} scale={0.82} />
            </button>
          )}
        </div>
      </div>

      {/* 1st floor WORKERS — 바닥에 발 닿도록 */}
      <div className="absolute flex"
        style={{ bottom: 45, left: 0, right: 0, zIndex: 4 }}>

        <div className="flex-1 flex justify-center">
          {espresso && espresso.level > 0 && (
            <motion.img src={espressoWorkerImg} alt="espresso worker"
              style={{ width: 46, height: 46, objectFit: 'contain' }}
              animate={{ x: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 0.8 }} />
          )}
        </div>

        <div className="flex-1 flex justify-center">
          {waterPump && waterPump.level > 0 && (
            <motion.img src={waterpumpWorkerImg} alt="waterpump worker"
              style={{ width: 46, height: 46, objectFit: 'contain', position: 'relative', left: -35 }}
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
export default function CafeView({ onOpenFacility, onOpenSmartphone }: { onOpenFacility: () => void; onOpenSmartphone: () => void }) {
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
    </div>
  );
}
