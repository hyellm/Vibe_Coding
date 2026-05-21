import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getUpgradeCost, getCoinsPerItem, getProductionTimeMs } from '../store/gameStore';

export default function ShopModal() {
  const shopOpen = useGameStore(s => s.shopOpen);
  const selectedId = useGameStore(s => s.selectedEquipmentId);
  const equipment = useGameStore(s => s.equipment);
  const coins = useGameStore(s => s.resources.coins);
  const cheese = useGameStore(s => s.resources.cheese);
  const closeShop = useGameStore(s => s.closeShop);
  const buyEquipment = useGameStore(s => s.buyEquipment);
  const upgradeEquipment = useGameStore(s => s.upgradeEquipment);
  const hireWorker = useGameStore(s => s.hireWorker);
  const workers = useGameStore(s => s.workers);

  const selected = equipment.find(e => e.id === selectedId);

  return (
    <AnimatePresence>
      {shopOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col"
          style={{ background: 'rgba(20,10,5,0.85)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeShop}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg,#3D2010,#251005)',
              border: '2px solid #6A3C1C',
              borderBottom: 'none',
              maxHeight: '80%',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,200,100,0.4)' }} />
            </div>

            {/* Title */}
            <div
              className="text-center font-black py-2 text-white"
              style={{ fontSize: 16, borderBottom: '1px solid rgba(255,200,100,0.2)' }}
            >
              {selected ? (selected.level === 0 ? '🛒 장비 구매' : '🔧 장비 업그레이드') : '🛒 상점'}
            </div>

            <div className="overflow-y-auto p-3" style={{ maxHeight: 'calc(80vh - 100px)' }}>
              {/* Single equipment detail view */}
              {selected ? (
                <EquipmentDetail
                  eq={selected}
                  coins={coins}
                  onBuy={() => { buyEquipment(selected.id); closeShop(); }}
                  onUpgrade={() => upgradeEquipment(selected.id)}
                  onClose={closeShop}
                />
              ) : (
                /* Full shop list view */
                <div className="flex flex-col gap-3">
                  <SectionTitle title="⚙️ 장비" />
                  {equipment.map(eq => (
                    <EquipmentListItem
                      key={eq.id}
                      eq={eq}
                      coins={coins}
                      onBuy={() => buyEquipment(eq.id)}
                      onUpgrade={() => upgradeEquipment(eq.id)}
                    />
                  ))}

                  <SectionTitle title="🐭 직원 고용" />
                  <WorkerHireCard cheese={cheese} workerCount={workers.length} onHire={hireWorker} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      className="font-black text-yellow-300 py-1 px-1"
      style={{ fontSize: 12, borderBottom: '1px solid rgba(255,200,100,0.2)' }}
    >
      {title}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span style={{ fontSize: 11, color: '#C0A080' }}>{label}</span>
      <span style={{ fontSize: 11, color: '#FFD080', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function EquipmentDetail({
  eq, coins, onBuy, onUpgrade, onClose,
}: {
  eq: ReturnType<typeof useGameStore.getState>['equipment'][0];
  coins: number;
  onBuy: () => void;
  onUpgrade: () => void;
  onClose: () => void;
}) {
  const upgradeCost = getUpgradeCost(eq);
  const coinsPerItem = getCoinsPerItem(eq);
  const prodTimeSec = Math.round(getProductionTimeMs(eq) / 1000);
  const canBuy = coins >= eq.unlockCost;
  const canUpgrade = eq.level > 0 && coins >= upgradeCost && eq.level < eq.maxLevel;

  return (
    <div className="flex flex-col gap-3">
      {/* Equipment info card */}
      <div
        className="rounded-2xl p-4 flex flex-col items-center gap-2"
        style={{ background: 'rgba(255,200,100,0.1)', border: '1px solid rgba(255,200,100,0.3)' }}
      >
        <span style={{ fontSize: 48 }}>{eq.emoji}</span>
        <div className="text-white font-black" style={{ fontSize: 16 }}>{eq.name}</div>
        {eq.level > 0 && (
          <div
            className="font-black text-white rounded-full px-3 py-0.5"
            style={{ fontSize: 12, background: 'linear-gradient(135deg,#E87830,#C05010)' }}
          >
            레벨 {eq.level} / {eq.maxLevel}
          </div>
        )}
      </div>

      {/* Stats */}
      <div
        className="rounded-xl p-3 flex flex-col gap-1"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <StatRow label="생산 시간" value={`${prodTimeSec}초`} />
        <StatRow label="개당 코인" value={`${coinsPerItem}🪙`} />
        <StatRow label="생산품" value={`${eq.productEmoji} ${eq.productName}`} />
        {eq.level > 0 && eq.level < eq.maxLevel && (
          <StatRow label="업그레이드 후 생산 시간" value={`${Math.round(getProductionTimeMs({ ...eq, level: eq.level + 1 }) / 1000)}초`} />
        )}
      </div>

      {/* Action buttons */}
      {eq.level === 0 ? (
        <motion.button
          className="w-full py-3 rounded-2xl font-black text-white"
          style={{
            fontSize: 16,
            background: canBuy
              ? 'linear-gradient(135deg,#E8A020,#C07010)'
              : 'rgba(255,255,255,0.1)',
            cursor: canBuy ? 'pointer' : 'not-allowed',
            border: 'none',
            opacity: canBuy ? 1 : 0.5,
          }}
          whileTap={canBuy ? { scale: 0.95 } : {}}
          onClick={canBuy ? onBuy : undefined}
        >
          {canBuy ? `구매하기 · ${eq.unlockCost}🪙` : `코인 부족 (${eq.unlockCost}🪙 필요)`}
        </motion.button>
      ) : (
        <motion.button
          className="w-full py-3 rounded-2xl font-black text-white"
          style={{
            fontSize: 16,
            background: canUpgrade
              ? 'linear-gradient(135deg,#52B788,#40916C)'
              : 'rgba(255,255,255,0.1)',
            cursor: canUpgrade ? 'pointer' : 'not-allowed',
            border: 'none',
            opacity: eq.level >= eq.maxLevel ? 0.4 : canUpgrade ? 1 : 0.6,
          }}
          whileTap={canUpgrade ? { scale: 0.95 } : {}}
          onClick={canUpgrade ? onUpgrade : undefined}
        >
          {eq.level >= eq.maxLevel
            ? '최대 레벨 달성!'
            : canUpgrade
            ? `업그레이드 · ${upgradeCost}🪙`
            : `코인 부족 (${upgradeCost}🪙 필요)`}
        </motion.button>
      )}
    </div>
  );
}

function EquipmentListItem({
  eq, coins, onBuy, onUpgrade,
}: {
  eq: ReturnType<typeof useGameStore.getState>['equipment'][0];
  coins: number;
  onBuy: () => void;
  onUpgrade: () => void;
}) {
  const isLocked = eq.level === 0;
  const upgradeCost = getUpgradeCost(eq);
  const canBuy = coins >= eq.unlockCost;
  const canUpgrade = !isLocked && coins >= upgradeCost && eq.level < eq.maxLevel;

  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{ background: 'rgba(255,200,100,0.08)', border: '1px solid rgba(255,200,100,0.2)' }}
    >
      <span style={{ fontSize: 32 }}>{eq.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-black text-white" style={{ fontSize: 13 }}>{eq.name}</div>
        <div style={{ fontSize: 10, color: '#C0A070' }}>
          {isLocked ? `${eq.unlockCost}🪙 구매` : `Lv.${eq.level} · ${getCoinsPerItem(eq)}🪙/개`}
        </div>
      </div>
      {isLocked ? (
        <motion.button
          className="font-black text-white rounded-xl px-3 py-1.5"
          style={{
            fontSize: 11,
            background: canBuy ? 'linear-gradient(135deg,#E8A020,#C07010)' : 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: canBuy ? 'pointer' : 'not-allowed',
            opacity: canBuy ? 1 : 0.5,
          }}
          whileTap={canBuy ? { scale: 0.9 } : {}}
          onClick={canBuy ? onBuy : undefined}
        >
          구매
        </motion.button>
      ) : (
        <motion.button
          className="font-black text-white rounded-xl px-3 py-1.5"
          style={{
            fontSize: 11,
            background: canUpgrade ? 'linear-gradient(135deg,#52B788,#40916C)' : 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: canUpgrade ? 'pointer' : 'default',
            opacity: eq.level >= eq.maxLevel ? 0.4 : canUpgrade ? 1 : 0.5,
          }}
          whileTap={canUpgrade ? { scale: 0.9 } : {}}
          onClick={canUpgrade ? onUpgrade : undefined}
        >
          {eq.level >= eq.maxLevel ? 'MAX' : `↑ ${upgradeCost}🪙`}
        </motion.button>
      )}
    </div>
  );
}

function WorkerHireCard({ cheese, workerCount, onHire }: { cheese: number; workerCount: number; onHire: () => void }) {
  const canHire = cheese >= 20;
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{ background: 'rgba(255,200,100,0.08)', border: '1px solid rgba(255,200,100,0.2)' }}
    >
      <span style={{ fontSize: 32 }}>🐭</span>
      <div className="flex-1 min-w-0">
        <div className="font-black text-white" style={{ fontSize: 13 }}>파트타임 직원</div>
        <div style={{ fontSize: 10, color: '#C0A070' }}>
          현재 {workerCount}명 · 20🧀 고용
        </div>
      </div>
      <motion.button
        className="font-black text-white rounded-xl px-3 py-1.5"
        style={{
          fontSize: 11,
          background: canHire ? 'linear-gradient(135deg,#D4A820,#B08010)' : 'rgba(255,255,255,0.1)',
          border: 'none',
          cursor: canHire ? 'pointer' : 'not-allowed',
          opacity: canHire ? 1 : 0.5,
        }}
        whileTap={canHire ? { scale: 0.9 } : {}}
        onClick={canHire ? onHire : undefined}
      >
        고용
      </motion.button>
    </div>
  );
}
