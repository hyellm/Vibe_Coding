import { motion } from 'framer-motion';
import type { Customer } from '../types';
import { CUSTOMER_PATH_Y, TABLE_Y } from '../store/gameStore';

interface Props {
  customer: Customer;
}

export default function CustomerChar({ customer: c }: Props) {
  const isSitting = c.state === 'sitting';
  const isLeaving = c.state === 'leaving';
  const facingLeft = isLeaving;

  const targetX =
    c.state === 'entering' || c.state === 'at_showcase'
      ? c.targetX - 20
      : c.state === 'sitting'
      ? c.tableX - 20
      : 470;

  const targetY =
    c.state === 'sitting'
      ? TABLE_Y - 20
      : CUSTOMER_PATH_Y - 20;

  const duration =
    c.state === 'entering' ? 1.6
    : c.state === 'sitting' ? 0.6
    : c.state === 'leaving' ? 1.6
    : 0.1;

  return (
    <motion.div
      key={c.id}
      className="absolute"
      style={{ zIndex: 18, pointerEvents: 'none' }}
      initial={{ x: -65, y: CUSTOMER_PATH_Y - 20 }}
      animate={{ x: targetX, y: targetY }}
      transition={{ duration, ease: 'linear' }}
    >
      <div className="relative flex flex-col items-center">
        {/* Purchased item display when sitting */}
        {isSitting && c.purchasedEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2"
            style={{
              fontSize: 14,
              background: 'white',
              borderRadius: '50%',
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }}
          >
            {c.purchasedEmoji}
          </motion.div>
        )}

        {/* Customer emoji */}
        <motion.div
          style={{
            fontSize: 24,
            display: 'inline-block',
            transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
            filter: `drop-shadow(0 2px 3px rgba(0,0,0,0.3))`,
          }}
          animate={
            isSitting
              ? { y: [0, -1, 0] }
              : { y: [0, -3, 0, -3, 0] }
          }
          transition={
            isSitting
              ? { repeat: Infinity, duration: 3 }
              : { repeat: Infinity, duration: 0.45 }
          }
        >
          {c.emoji}
        </motion.div>

        {/* Name tag */}
        <div
          className="font-bold text-white rounded-full px-1 mt-0.5"
          style={{
            fontSize: 8,
            background: c.color,
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        >
          {c.name}
        </div>
      </div>
    </motion.div>
  );
}
