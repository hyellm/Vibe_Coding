import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getUpgradeCost, getCoinsPerItem, getProductionTimeMs } from '../store/gameStore';
import { fmt } from '../utils/fmt';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span style={{ fontSize: 11, color: '#C0A080' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#FFD080', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function UpgradeModal() {
  const upgradeModalOpen = useGameStore(s => s.upgradeModalOpen);
  const selectedId = useGameStore(s => s.selectedEquipmentId);
  const equipment = useGameStore(s => s.equipment);
  const coins = useGameStore(s => s.resources.coins);
  const closeUpgrade = useGameStore(s => s.closeUpgrade);
  const buyEquipment = useGameStore(s => s.buyEquipment);
  const upgradeEquipment = useGameStore(s => s.upgradeEquipment);
  const openUpgrade = useGameStore(s => s.openUpgrade);

  const selected = equipment.find(e => e.id === selectedId);
  if (!selected && !upgradeModalOpen) return null;

  // Navigate between machines
  const upgradableEqs = equipment.filter(e => e.id !== 'bathhouse' || e.level > 0);
  const currentIdx = upgradableEqs.findIndex(e => e.id === selectedId);

  const goPrev = () => {
    const prev = upgradableEqs[(currentIdx - 1 + upgradableEqs.length) % upgradableEqs.length];
    openUpgrade(prev.id);
  };
  const goNext = () => {
    const next = upgradableEqs[(currentIdx + 1) % upgradableEqs.length];
    openUpgrade(next.id);
  };

  return (
    <AnimatePresence>
      {upgradeModalOpen && (
        <motion.div
          className="absolute inset-0 z-50"
          style={{ background: 'rgba(10,5,0,0.7)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeUpgrade}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg,#3D2010,#251005)',
              border: '2px solid #7A4828',
              borderBottom: 'none',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,200,100,0.35)' }} />
            </div>

            {selected ? (
              <EquipmentPanel
                eq={selected}
                coins={coins}
                onBuy={() => { buyEquipment(selected.id); }}
                onUpgrade={() => upgradeEquipment(selected.id)}
                onClose={closeUpgrade}
                onPrev={goPrev}
                onNext={goNext}
                showNav={upgradableEqs.length > 1}
              />
            ) : (
              <div className="p-6 text-center text-white font-bold">
                장비를 선택하세요
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PanelProps {
  eq: ReturnType<typeof useGameStore.getState>['equipment'][0];
  coins: number;
  onBuy: () => void;
  onUpgrade: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  showNav: boolean;
}

function EquipmentPanel({ eq, coins, onBuy, onUpgrade, onClose, onPrev, onNext, showNav }: PanelProps) {
  const isLocked = eq.level === 0;
  const upgradeCost = getUpgradeCost(eq);
  const coinsPerItem = getCoinsPerItem(eq);
  const prodSec = Math.round(getProductionTimeMs(eq) / 1000);
  const incomePerSec = fmt(coinsPerItem / prodSec);

  const canBuy = coins >= eq.unlockCost;
  const canUpgrade = !isLocked && coins >= upgradeCost && eq.level < eq.maxLevel;
  const isMaxed = eq.level >= eq.maxLevel;

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,200,100,0.15)' }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 26 }}>{eq.emoji}</span>
          <div>
            <div className="font-black text-white" style={{ fontSize: 15 }}>{eq.name}</div>
            <div style={{ fontSize: 10, color: '#FF9A3C' }}>
              {isLocked ? '구매 가능' : `커피 메뉴 판매가 상승`}
            </div>
          </div>
        </div>
        {!isLocked && (
          <div
            className="font-black text-white rounded-full px-3 py-0.5"
            style={{ fontSize: 12, background: 'linear-gradient(135deg,#E87830,#C05010)' }}
          >
            Lv. {eq.level}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-2" style={{ borderBottom: '1px solid rgba(255,200,100,0.1)' }}>
        {!isLocked && (
          <div style={{ fontSize: 13, color: '#98E898', fontWeight: 900, marginBottom: 6 }}>
            +🪙 {incomePerSec} / 초
          </div>
        )}
        <StatRow label="생산 시간" value={`${prodSec}초`} />
        <StatRow label="개당 코인" value={`${coinsPerItem}🪙`} />
      </div>

      {/* Upgrade / Buy button */}
      <div className="px-4 py-3">
        {isLocked ? (
          <motion.button
            className="w-full py-3.5 rounded-2xl font-black text-white"
            style={{
              fontSize: 16,
              background: canBuy
                ? 'linear-gradient(135deg,#52B788,#2D9E6A)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: canBuy ? 'pointer' : 'not-allowed',
              opacity: canBuy ? 1 : 0.5,
            }}
            whileTap={canBuy ? { scale: 0.96 } : {}}
            onClick={canBuy ? onBuy : undefined}
          >
            🪙 {fmt(eq.unlockCost)}
          </motion.button>
        ) : (
          <motion.button
            className="w-full py-3.5 rounded-2xl font-black text-white"
            style={{
              fontSize: 16,
              background: isMaxed
                ? 'rgba(255,255,255,0.12)'
                : canUpgrade
                ? 'linear-gradient(135deg,#52B788,#2D9E6A)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: canUpgrade ? 'pointer' : 'not-allowed',
              opacity: isMaxed ? 0.4 : canUpgrade ? 1 : 0.55,
            }}
            whileTap={canUpgrade ? { scale: 0.96 } : {}}
            onClick={canUpgrade ? onUpgrade : undefined}
          >
            {isMaxed ? '최대 레벨!' : `🪙 ${fmt(upgradeCost)}`}
          </motion.button>
        )}
      </div>

      {/* Navigation + close */}
      <div className="flex items-center justify-between px-6 pb-2">
        {showNav ? (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onPrev}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', fontSize: 18, cursor: 'pointer',
            }}
          >
            ‹
          </motion.button>
        ) : <div style={{ width: 40 }} />}

        {/* Close button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onClose}
          className="flex items-center justify-center rounded-full"
          style={{
            width: 42, height: 42,
            background: 'rgba(255,80,80,0.2)',
            border: '2px solid rgba(255,100,100,0.4)',
            color: '#FF8080', fontSize: 20, cursor: 'pointer',
          }}
        >
          ✕
        </motion.button>

        {showNav ? (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onNext}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', fontSize: 18, cursor: 'pointer',
            }}
          >
            ›
          </motion.button>
        ) : <div style={{ width: 40 }} />}
      </div>

      {/* Hire worker shortcut */}
      <div className="px-4">
        <button
          className="flex items-center gap-1 font-bold text-white rounded-xl px-3 py-1.5"
          style={{
            fontSize: 11,
            background: 'rgba(255,200,100,0.1)',
            border: '1px solid rgba(255,200,100,0.2)',
            cursor: 'pointer',
          }}
        >
          <span>🐭+</span>
          <span>직원 고용</span>
        </button>
      </div>
    </div>
  );
}
