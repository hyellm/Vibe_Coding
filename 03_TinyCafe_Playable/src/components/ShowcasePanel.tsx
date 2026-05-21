import { motion, AnimatePresence } from 'framer-motion';
import type { ShowcaseSlot } from '../types';

interface Props {
  showcase: Record<string, ShowcaseSlot>;
}

export default function ShowcasePanel({ showcase }: Props) {
  const items = Object.values(showcase).filter(s => s.count > 0);
  const hasItems = items.length > 0;

  return (
    <div
      className="absolute"
      style={{
        left: 255,
        top: 75,
        width: 128,
        height: 233,
        borderRadius: '12px 12px 0 0',
        background: 'rgba(255,245,225,0.92)',
        border: '2px solid #C4832A',
        borderBottom: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-center gap-1 py-1 font-black"
        style={{
          fontSize: 10,
          color: '#7A4828',
          background: 'linear-gradient(180deg,#F5D090,#EDBC70)',
          borderBottom: '1px solid #C4832A',
          flexShrink: 0,
        }}
      >
        🗂 진열대
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-hidden p-1 flex flex-col gap-1">
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div
              key={item.equipmentId}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              className="flex items-center gap-1 rounded-lg px-2 py-1"
              style={{
                background: 'linear-gradient(135deg,rgba(255,200,100,0.4),rgba(255,160,60,0.2))',
                border: '1px solid rgba(196,131,42,0.4)',
              }}
            >
              <span style={{ fontSize: 18 }}>{item.productEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate" style={{ fontSize: 9, color: '#7A4828' }}>
                  {item.productName}
                </div>
                <div style={{ fontSize: 8, color: '#A06030' }}>{item.coinsPerItem}🪙</div>
              </div>
              <motion.div
                className="font-black text-white rounded-full flex items-center justify-center"
                style={{
                  fontSize: 10,
                  background: 'linear-gradient(135deg,#52B788,#40916C)',
                  minWidth: 20,
                  height: 20,
                  padding: '0 4px',
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                ×{item.count}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!hasItems && (
          <div className="flex flex-col items-center justify-center flex-1 opacity-50">
            <span style={{ fontSize: 24 }}>📭</span>
            <span style={{ fontSize: 9, color: '#A06030' }} className="mt-1 font-bold">
              아이템 없음
            </span>
          </div>
        )}
      </div>

      {hasItems && (
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 3 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#52B788,#40916C,#52B788)' }} />
        </motion.div>
      )}
    </div>
  );
}
