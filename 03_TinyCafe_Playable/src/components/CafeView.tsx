import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, CUSTOMER_PATH_Y, TABLE_Y } from '../store/gameStore';
import EquipmentCard from './EquipmentCard';
import ShowcasePanel from './ShowcasePanel';
import WorkerChar from './WorkerChar';
import CustomerChar from './CustomerChar';

const TABLE_POSITIONS = [
  { x: 50, y: TABLE_Y },
  { x: 155, y: TABLE_Y },
  { x: 260, y: TABLE_Y },
];

function Table({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: 70,
        height: 50,
        borderRadius: 10,
        background: 'linear-gradient(160deg,#C47830,#A05A20)',
        border: '2px solid #7A3A10',
        boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
      }}
    >
      {/* Table legs */}
      <div
        className="absolute bottom-0 left-2"
        style={{ width: 6, height: 14, background: '#7A3A10', borderRadius: 3 }}
      />
      <div
        className="absolute bottom-0 right-2"
        style={{ width: 6, height: 14, background: '#7A3A10', borderRadius: 3 }}
      />
    </div>
  );
}

function CoinFloatFX({ fx }: { fx: { id: string; x: number; y: number; amount: number; createdAt: number } }) {
  return (
    <motion.div
      key={fx.id}
      className="absolute font-black text-yellow-300 pointer-events-none"
      style={{ left: fx.x, top: fx.y, zIndex: 40, fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -65, scale: 1.4 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
    >
      +{fx.amount}🪙
    </motion.div>
  );
}

function WallDecor() {
  return (
    <>
      {/* Clock */}
      <div
        className="absolute flex items-center justify-center font-black"
        style={{
          left: 12,
          top: 10,
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#F5E0C0,#E8C8A0)',
          border: '3px solid #C4832A',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: 16,
          color: '#7A4828',
        }}
      >
        🕐
      </div>

      {/* Chalkboard sign */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: 8,
          width: 90,
          height: 58,
          borderRadius: 8,
          background: '#2D5016',
          border: '3px solid #8B6914',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ fontSize: 9, color: '#E8F4E0', fontWeight: 900 }}>TINY CAFE</div>
        <div style={{ fontSize: 7, color: '#B8D4B0', marginTop: 2 }}>🍵 · ☕ · 🍩</div>
        <div style={{ fontSize: 7, color: '#90B890', marginTop: 1 }}>OPEN 7:00 - 22:00</div>
      </div>

      {/* Tip jar */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 14,
          top: 8,
          width: 30,
          height: 38,
          borderRadius: '4px 4px 6px 6px',
          background: 'rgba(180,220,255,0.5)',
          border: '2px solid rgba(100,160,220,0.6)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          fontSize: 9,
          fontWeight: 900,
          color: '#4080B0',
        }}
      >
        <div className="text-center" style={{ fontSize: 7 }}>
          <div>TIPS</div>
          <div style={{ fontSize: 10 }}>🪙</div>
        </div>
      </div>
    </>
  );
}

export default function CafeView() {
  const equipment = useGameStore(s => s.equipment);
  const workers = useGameStore(s => s.workers);
  const customers = useGameStore(s => s.customers);
  const showcase = useGameStore(s => s.showcase);
  const coinFXs = useGameStore(s => s.coinFXs);
  const coins = useGameStore(s => s.resources.coins);
  const openShop = useGameStore(s => s.openShop);

  const row1Eq = equipment.filter(eq => eq.position.y < 180);
  const row2Eq = equipment.filter(eq => eq.position.y >= 180);

  const dolce = workers.find(w => w.id === 'dolce');
  const otherWorkers = workers.filter(w => w.id !== 'dolce');

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: 390, flex: 1 }}
    >
      {/* ── Kitchen wall background ─────────────────────────────── */}
      <div
        className="absolute"
        style={{
          top: 0, left: 0, right: 0,
          height: 310,
          background: 'linear-gradient(180deg,#F5DEB3 0%,#EDCB90 60%,#DDB870 100%)',
        }}
      >
        {/* Brick pattern */}
        <div
          className="absolute inset-0 brick-overlay"
          style={{ opacity: 0.6 }}
        />
        <WallDecor />
      </div>

      {/* ── Counter bar ─────────────────────────────────────────── */}
      <div
        className="absolute counter-wood"
        style={{
          top: 307,
          left: 0,
          right: 0,
          height: 44,
          borderTop: '3px solid #C49060',
          borderBottom: '3px solid #5A3020',
          zIndex: 10,
        }}
      />

      {/* Counter bar edge highlight */}
      <div
        className="absolute"
        style={{
          top: 307,
          left: 0,
          right: 0,
          height: 4,
          background: 'rgba(255,220,160,0.5)',
          zIndex: 11,
        }}
      />

      {/* ── Floor ───────────────────────────────────────────────── */}
      <div
        className="absolute wood-floor"
        style={{
          top: 351,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Floor shadow near counter */}
      <div
        className="absolute"
        style={{
          top: 351,
          left: 0,
          right: 0,
          height: 20,
          background: 'linear-gradient(180deg,rgba(0,0,0,0.2),transparent)',
          zIndex: 1,
        }}
      />

      {/* ── Tables ──────────────────────────────────────────────── */}
      {TABLE_POSITIONS.map(t => (
        <Table key={t.x} x={t.x} y={t.y} />
      ))}

      {/* ── Equipment cards ─────────────────────────────────────── */}
      {row1Eq.map(eq => (
        <EquipmentCard
          key={eq.id}
          equipment={eq}
          coins={coins}
          onClick={() => openShop(eq.id)}
          row={1}
        />
      ))}
      {row2Eq.map(eq => (
        <EquipmentCard
          key={eq.id}
          equipment={eq}
          coins={coins}
          onClick={() => openShop(eq.id)}
          row={2}
        />
      ))}

      {/* ── Showcase panel ──────────────────────────────────────── */}
      <ShowcasePanel showcase={showcase} />

      {/* ── Counter showcase extension (below panel, on counter) ─ */}
      <div
        className="absolute"
        style={{
          left: 255,
          top: 308,
          width: 128,
          height: 43,
          background: 'rgba(255,245,220,0.6)',
          borderLeft: '2px solid #C4832A',
          borderRight: '2px solid #C4832A',
          zIndex: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          fontWeight: 900,
          color: '#7A4828',
        }}
      >
        ← 주문 픽업
      </div>

      {/* ── Workers ─────────────────────────────────────────────── */}
      {otherWorkers.map(w => (
        <WorkerChar key={w.id} worker={w} />
      ))}
      {dolce && <WorkerChar worker={dolce} isDolce />}

      {/* ── Customers ───────────────────────────────────────────── */}
      <AnimatePresence>
        {customers.map(c => (
          <CustomerChar key={c.id} customer={c} />
        ))}
      </AnimatePresence>

      {/* ── Coin FX ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {coinFXs.map(fx => (
          <CoinFloatFX key={fx.id} fx={fx} />
        ))}
      </AnimatePresence>

      {/* ── Customer path guide (subtle) ────────────────────────── */}
      <div
        className="absolute"
        style={{
          top: CUSTOMER_PATH_Y + 18,
          left: 0,
          right: 260,
          height: 1,
          background: 'rgba(160,100,40,0.2)',
          zIndex: 0,
        }}
      />
    </div>
  );
}
