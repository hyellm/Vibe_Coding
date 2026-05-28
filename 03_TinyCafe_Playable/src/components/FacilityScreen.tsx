import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getCoinsPerItem, getProductionTimeMs, getUpgradeCost } from '../store/gameStore';
import { EquipmentSVG } from './EquipmentSVGs';
import type { Equipment } from '../types';

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'b';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'm';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return Math.floor(n).toString();
}

function getBuffText(eq: Equipment): string {
  if (eq.id === 'bathhouse') return '치즈 생산량 증가';
  return `${eq.name} 판매가 상승`;
}

// ── Machine Info Overlay ───────────────────────────────────────────
function MachineInfoOverlay({
  eq,
  onClose,
  onPrev,
  onNext,
  showNav,
}: {
  eq: Equipment;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  showNav: boolean;
}) {
  const coins = useGameStore(s => s.resources.coins);
  const albanetWorkers = useGameStore(s => s.albanetWorkers);
  const upgradeEquipment = useGameStore(s => s.upgradeEquipment);
  const buyEquipment = useGameStore(s => s.buyEquipment);

  const isLocked = eq.level === 0;
  const upgradeCost = getUpgradeCost(eq);
  const isMaxed = eq.level >= eq.maxLevel;
  const canBuy = coins >= eq.unlockCost;
  const canUpgrade = !isLocked && !isMaxed && coins >= upgradeCost;

  const prodSec = getProductionTimeMs(eq) / 1000;
  const mult = 1 + (albanetWorkers[eq.id] ?? 0);
  const incomePerSec = eq.id === 'bathhouse' ? null : ((getCoinsPerItem(eq) * mult) / prodSec).toFixed(1);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.82)', zIndex: 80 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Equipment SVG centered */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18 }}
        >
          <EquipmentSVG id={eq.id} level={eq.level} progress={0} scale={2.2} />
        </motion.div>
      </div>

      {/* Nav arrows */}
      {showNav && (
        <>
          <button onClick={onPrev} className="absolute" style={{ left: 8, top: '45%', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 22, cursor: 'pointer' }}>‹</button>
          <button onClick={onNext} className="absolute" style={{ right: 8, top: '45%', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 22, cursor: 'pointer' }}>›</button>
        </>
      )}

      {/* Info card */}
      <motion.div
        className="mx-4 mb-4 rounded-2xl p-4"
        style={{ background: 'white' }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: '#E8F4E0', fontSize: 20 }}>
              {eq.emoji}
            </div>
            <div>
              <div className="font-black" style={{ fontSize: 15, color: '#1A1A1A' }}>{eq.name}</div>
              <div style={{ fontSize: 11, color: '#52B788', fontWeight: 700 }}>{getBuffText(eq)}</div>
            </div>
          </div>
          {!isLocked && (
            <div className="font-black rounded-full px-3 py-1" style={{ fontSize: 12, background: '#52B788', color: 'white' }}>
              Lv.{eq.level}
            </div>
          )}
        </div>

        {/* Stats */}
        {incomePerSec && (
          <div className="font-black mb-3" style={{ fontSize: 14, color: '#4A90D9' }}>
            +🪙 {incomePerSec} / 초
          </div>
        )}

        {/* Action button */}
        {isLocked ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={canBuy ? () => buyEquipment(eq.id) : undefined}
            className="w-full py-3 rounded-2xl font-black text-white"
            style={{ fontSize: 15, background: canBuy ? '#52B788' : '#CCC', border: 'none', cursor: canBuy ? 'pointer' : 'not-allowed' }}
          >
            🪙 {fmt(eq.unlockCost)}
          </motion.button>
        ) : eq.id === 'drip_coffee' ? (
          <div className="w-full py-3 rounded-2xl text-center font-bold"
            style={{ fontSize: 13, background: '#F0EDE8', color: '#8A6040' }}>
            돌체 전용 장비
          </div>
        ) : (
          <motion.button
            whileTap={canUpgrade ? { scale: 0.96 } : {}}
            onClick={canUpgrade ? () => upgradeEquipment(eq.id) : undefined}
            className="w-full py-3 rounded-2xl font-black text-white"
            style={{ fontSize: 15, background: isMaxed ? '#CCC' : canUpgrade ? '#52B788' : '#AAA', border: 'none', cursor: canUpgrade ? 'pointer' : 'not-allowed' }}
          >
            {isMaxed ? '최대 레벨!' : `🪙 ${fmt(upgradeCost)}`}
          </motion.button>
        )}
      </motion.div>

      {/* Close button */}
      <div className="flex justify-center pb-4">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onClose}
          className="flex items-center justify-center rounded-full"
          style={{ width: 44, height: 44, background: 'rgba(255,80,80,0.25)', border: '2px solid rgba(255,100,100,0.5)', color: '#FF8080', fontSize: 22, cursor: 'pointer' }}
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Facility List ──────────────────────────────────────────────────
export default function FacilityScreen({ onClose }: { onClose: () => void }) {
  const equipment = useGameStore(s => s.equipment);
  const albanetWorkers = useGameStore(s => s.albanetWorkers);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const displayEqs = equipment.filter(e => e.id !== 'bathhouse');
  const selected = displayEqs.find(e => e.id === selectedId);
  const selectedIdx = displayEqs.findIndex(e => e.id === selectedId);

  const handlePrev = () => {
    const prev = displayEqs[(selectedIdx - 1 + displayEqs.length) % displayEqs.length];
    setSelectedId(prev.id);
  };
  const handleNext = () => {
    const next = displayEqs[(selectedIdx + 1) % displayEqs.length];
    setSelectedId(next.id);
  };

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
        <div className="font-black" style={{ fontSize: 18, color: '#1A1A1A' }}>시설</div>
      </div>

      {/* Branch label */}
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#EDE8DF', borderBottom: '1px solid #D8D0C4' }}>
        <span style={{ fontSize: 12, color: '#E8A020' }}>◆</span>
        <span className="font-black" style={{ fontSize: 13, color: '#3A2010' }}>1호점 카페</span>
        <span style={{ marginLeft: 'auto', fontSize: 14, color: '#5A3A20' }}>▲</span>
      </div>

      {/* Equipment list */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '8px 0' }}>
        {displayEqs.map(eq => {
          const isLocked = eq.level === 0;
          const prodSec = getProductionTimeMs(eq) / 1000;
          const mult = 1 + (albanetWorkers[eq.id] ?? 0);
          const incPerSec = ((getCoinsPerItem(eq) * mult) / prodSec).toFixed(1);
          const upgradeCost = getUpgradeCost(eq);

          return (
            <button
              key={eq.id}
              onClick={() => !isLocked && setSelectedId(eq.id)}
              className="w-full flex items-center gap-3 px-4 py-3"
              style={{ background: 'none', border: 'none', borderBottom: '1px solid #E8E0D4', cursor: isLocked ? 'default' : 'pointer', textAlign: 'left' }}
            >
              {/* Icon */}
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 52, height: 52, background: isLocked ? '#D8D0C4' : '#E8F4E0', fontSize: 28, opacity: isLocked ? 0.5 : 1 }}>
                {eq.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-black" style={{ fontSize: 13, color: isLocked ? '#AAA' : '#1A1A1A' }}>{eq.name}</div>
                <div style={{ fontSize: 11, color: '#52B788', fontWeight: 700 }}>{getBuffText(eq)}</div>
                {!isLocked && (
                  <div style={{ fontSize: 10, color: '#4A90D9', fontWeight: 700 }}>+🪙 {incPerSec} / 초</div>
                )}
              </div>

              {/* Right side */}
              {isLocked ? (
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 36, height: 36, background: '#D8D0C4' }}>
                  <span style={{ fontSize: 18 }}>🔒</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="font-black rounded-full px-2 py-0.5 text-white" style={{ fontSize: 11, background: '#52B788' }}>
                    Lv.{eq.level}
                  </div>
                  <div className="font-bold rounded-full px-2 py-0.5" style={{ fontSize: 9, background: '#E8F0FF', color: '#4A90D9' }}>
                    🪙{fmt(upgradeCost)}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Machine info overlay */}
      <AnimatePresence>
        {selected && (
          <MachineInfoOverlay
            eq={selected}
            onClose={() => setSelectedId(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            showNav={displayEqs.filter(e => e.level > 0).length > 1}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
