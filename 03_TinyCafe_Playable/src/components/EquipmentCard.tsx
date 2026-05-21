import { motion } from 'framer-motion';
import type { Equipment } from '../types';
import { getProductionTimeMs, getUpgradeCost, getCoinsPerItem } from '../store/gameStore';

interface Props {
  equipment: Equipment;
  coins: number;
  onClick: () => void;
  row: 1 | 2;
}

export default function EquipmentCard({ equipment: eq, coins, onClick, row }: Props) {
  const isLocked = eq.level === 0;
  const canBuy = coins >= eq.unlockCost;
  const canUpgrade = !isLocked && coins >= getUpgradeCost(eq) && eq.level < eq.maxLevel;
  const progress = isLocked ? 0 : eq.productionProgress / getProductionTimeMs(eq);
  const itemsReady = eq.itemsReady;

  const cardH = row === 1 ? 115 : 100;

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        left: eq.position.x,
        top: eq.position.y,
        width: 120,
        height: cardH,
        borderRadius: 12,
        background: isLocked
          ? 'linear-gradient(160deg,#9E8060,#7A5E40)'
          : 'linear-gradient(160deg,#FDE8C0,#F5D090)',
        border: `2px solid ${isLocked ? '#6A4828' : canUpgrade ? '#FFB830' : '#C4832A'}`,
        boxShadow: canUpgrade
          ? '0 0 12px rgba(255,184,48,0.6), 0 3px 8px rgba(0,0,0,0.3)'
          : '0 3px 8px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Level badge */}
      {!isLocked && (
        <div
          className="absolute top-1 right-1 font-black text-white rounded-full flex items-center justify-center"
          style={{
            fontSize: 9,
            background: 'linear-gradient(135deg,#E87830,#C05010)',
            minWidth: 20,
            height: 20,
            padding: '0 4px',
          }}
        >
          Lv.{eq.level}
        </div>
      )}

      {/* Items ready badge */}
      {itemsReady > 0 && (
        <motion.div
          className="absolute top-1 left-1 font-black text-white rounded-full flex items-center justify-center"
          style={{
            fontSize: 9,
            background: '#52B788',
            minWidth: 18,
            height: 18,
            padding: '0 3px',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          {itemsReady}
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full pb-4">
        <motion.span
          style={{ fontSize: row === 1 ? 30 : 26, lineHeight: 1 }}
          animate={isLocked ? {} : { y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          {eq.emoji}
        </motion.span>
        <span
          className="font-bold text-center leading-tight mt-1"
          style={{
            fontSize: 9,
            color: isLocked ? '#C8A880' : '#7A4828',
            maxWidth: 100,
          }}
        >
          {eq.name}
        </span>
        {!isLocked && (
          <span style={{ fontSize: 8, color: '#A06030', marginTop: 1 }}>
            {getCoinsPerItem(eq)}🪙/개
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!isLocked && (
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 8, background: 'rgba(0,0,0,0.15)' }}
        >
          <motion.div
            className="h-full"
            style={{
              background: progress >= 1
                ? 'linear-gradient(90deg,#52B788,#40916C)'
                : 'linear-gradient(90deg,#FF9F43,#E87830)',
              transformOrigin: 'left',
            }}
            animate={{ width: `${Math.min(100, progress * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
          style={{ background: 'rgba(30,15,5,0.55)' }}
        >
          <span style={{ fontSize: 20 }}>🔒</span>
          <div
            className="mt-1 font-black text-white rounded-full px-2 py-0.5 flex items-center gap-1"
            style={{
              fontSize: 10,
              background: canBuy
                ? 'linear-gradient(135deg,#E8A020,#C07010)'
                : 'rgba(255,255,255,0.2)',
            }}
          >
            {eq.unlockCost}🪙
          </div>
        </div>
      )}
    </motion.div>
  );
}
