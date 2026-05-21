import { motion } from 'framer-motion';
import type { Worker } from '../types';

interface Props {
  worker: Worker;
  isDolce?: boolean;
}

export default function WorkerChar({ worker, isDolce = false }: Props) {
  const isWalking =
    worker.state === 'walking_to_equipment' || worker.state === 'walking_to_showcase';

  return (
    <motion.div
      className="absolute"
      style={{ zIndex: 20, pointerEvents: 'none' }}
      animate={{
        x: worker.targetX - 18,
        y: worker.targetY - 28,
      }}
      transition={{
        duration: isWalking ? 1.8 : 0.15,
        ease: 'linear',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Carrying item bubble */}
        {worker.carrying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
            style={{
              fontSize: 14,
              background: 'white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              width: 24,
              height: 24,
            }}
          >
            {worker.carrying}
          </motion.div>
        )}

        {/* Character body */}
        <motion.div
          style={{
            fontSize: isDolce ? 26 : 22,
            display: 'inline-block',
            transform: worker.facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
            filter: isDolce ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 'none',
          }}
          animate={
            isWalking
              ? { y: [0, -3, 0, -3, 0] }
              : worker.state === 'at_equipment'
              ? { rotate: [-5, 5, -5] }
              : { y: [0, -2, 0] }
          }
          transition={
            isWalking
              ? { repeat: Infinity, duration: 0.4 }
              : worker.state === 'at_equipment'
              ? { repeat: Infinity, duration: 0.5 }
              : { repeat: Infinity, duration: 2 }
          }
        >
          🐭
        </motion.div>

        {/* Name tag (only for Dolce) */}
        {isDolce && (
          <div
            className="font-black text-white rounded-full px-1 mt-0.5"
            style={{
              fontSize: 8,
              background: 'linear-gradient(135deg,#C05010,#E07030)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            돌체
          </div>
        )}
      </div>
    </motion.div>
  );
}
