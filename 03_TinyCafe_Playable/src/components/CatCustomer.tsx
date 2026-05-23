import { motion, AnimatePresence } from 'framer-motion';
import type { Customer } from '../types';

interface CatConfig {
  fur: string;
  furDark: string;
  outerCloth: string;
  innerCloth: string;
  eyeType: 'stern' | 'sad' | 'closed';
}

const CAT_CONFIGS: Record<string, CatConfig> = {
  nabi: {
    fur: '#B0A090',
    furDark: '#8A7868',
    outerCloth: '#2C3E50',
    innerCloth: '#3D5166',
    eyeType: 'stern',
  },
  luna: {
    fur: '#E8DCC8',
    furDark: '#C8B89A',
    outerCloth: '#3A6EA5',
    innerCloth: '#4A82BC',
    eyeType: 'sad',
  },
  mocha: {
    fur: '#9A9090',
    furDark: '#7A7070',
    outerCloth: '#7B4FA0',
    innerCloth: '#9060B8',
    eyeType: 'closed',
  },
};

function CatSVG({ type, isWalking }: { type: string; isWalking: boolean }) {
  const cfg = CAT_CONFIGS[type] ?? CAT_CONFIGS.nabi;
  const W = 72;
  const H = 88;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
        transform: isWalking ? undefined : undefined,
      }}
    >
      {/* Body / cloth */}
      <ellipse cx={36} cy={76} rx={28} ry={18} fill={cfg.outerCloth} />
      <ellipse cx={36} cy={70} rx={22} ry={16} fill={cfg.innerCloth} />

      {/* Neck */}
      <rect x={28} y={54} width={16} height={10} rx={4} fill={cfg.fur} />

      {/* Head */}
      <ellipse cx={36} cy={42} rx={24} ry={22} fill={cfg.fur} />

      {/* Ears */}
      <polygon points="14,26 8,8 24,20" fill={cfg.fur} />
      <polygon points="58,26 64,8 48,20" fill={cfg.fur} />
      {/* Inner ears */}
      <polygon points="16,24 12,12 22,20" fill="#F0A0A0" opacity="0.7" />
      <polygon points="56,24 60,12 50,20" fill="#F0A0A0" opacity="0.7" />

      {/* Eye whites */}
      <ellipse cx={27} cy={40} rx={6} ry={6.5} fill="white" />
      <ellipse cx={45} cy={40} rx={6} ry={6.5} fill="white" />

      {/* Eyes by type */}
      {cfg.eyeType === 'stern' && (
        <>
          <ellipse cx={27} cy={41} rx={4} ry={4} fill="#3A3A3A" />
          <ellipse cx={45} cy={41} rx={4} ry={4} fill="#3A3A3A" />
          {/* Pupils */}
          <ellipse cx={27.8} cy={40.2} rx={1.3} ry={1.3} fill="white" />
          <ellipse cx={45.8} cy={40.2} rx={1.3} ry={1.3} fill="white" />
          {/* Stern brows */}
          <line x1={21} y1={33} x2={32} y2={35.5} stroke={cfg.furDark} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={40} y1={35.5} x2={51} y2={33} stroke={cfg.furDark} strokeWidth={2.5} strokeLinecap="round" />
        </>
      )}
      {cfg.eyeType === 'sad' && (
        <>
          <ellipse cx={27} cy={41} rx={4} ry={4.5} fill="#3A3A3A" />
          <ellipse cx={45} cy={41} rx={4} ry={4.5} fill="#3A3A3A" />
          <ellipse cx={27.8} cy={40.2} rx={1.3} ry={1.3} fill="white" />
          <ellipse cx={45.8} cy={40.2} rx={1.3} ry={1.3} fill="white" />
          {/* Sad brows (inner corners raised) */}
          <line x1={21} y1={35.5} x2={32} y2={33} stroke={cfg.furDark} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={40} y1={33} x2={51} y2={35.5} stroke={cfg.furDark} strokeWidth={2.5} strokeLinecap="round" />
          {/* Teardrop */}
          <ellipse cx={24} cy={48} rx={2} ry={3} fill="#7BC8E8" opacity="0.85" />
        </>
      )}
      {cfg.eyeType === 'closed' && (
        <>
          {/* Closed-eye happy lines */}
          <path d="M21 40 Q27 46 33 40" stroke={cfg.furDark} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d="M39 40 Q45 46 51 40" stroke={cfg.furDark} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <ellipse cx={20} cy={48} rx={5} ry={3} fill="#FF9090" opacity="0.3" />
          <ellipse cx={52} cy={48} rx={5} ry={3} fill="#FF9090" opacity="0.3" />
        </>
      )}

      {/* Nose */}
      <path
        d="M33 50 L36 53 L39 50 Q36 48 33 50"
        fill="#C08080"
      />

      {/* Mouth */}
      <path d="M33 54 Q36 57 39 54" stroke="#C08080" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  customer: Customer;
}

export default function CatCustomer({ customer: c }: Props) {
  const isWalking = c.state === 'walking_in' || c.state === 'walking_out';
  const showBubble = c.state === 'at_window' || c.state === 'brewing';
  const showDrinking = c.state === 'drinking';
  const showSatisfied = c.state === 'satisfied';
  const showSad = c.state === 'sad';

  // Brew progress (0–1) when in brewing state
  const brewProgress = c.state === 'brewing'
    ? Math.min(1, c.stateTimer / 4000) // rough estimate
    : 0;

  return (
    <motion.div
      className="absolute"
      style={{
        left: c.x,
        top: 20,
        zIndex: 15,
        pointerEvents: 'none',
      }}
      animate={{ x: 0 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Speech bubble: order or reaction */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              key="order-bubble"
              initial={{ scale: 0, y: 6 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 6 }}
              transition={{ type: 'spring', damping: 18 }}
              className="absolute flex flex-col items-center"
              style={{ bottom: '100%', marginBottom: 6 }}
            >
              {/* Bubble content */}
              <div
                className="flex items-center gap-1 px-2 py-1.5 rounded-2xl font-bold"
                style={{
                  background: 'white',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                  fontSize: 11,
                  color: '#5A3820',
                  minWidth: 44,
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: 20 }}>{c.desiredEmoji}</span>
                {/* Brew progress arc if brewing */}
                {c.state === 'brewing' && (
                  <div
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: -8,
                      width: 20,
                      height: 20,
                    }}
                  >
                    <svg width={20} height={20} viewBox="0 0 20 20">
                      <circle
                        cx={10} cy={10} r={8}
                        fill="none"
                        stroke="#E0E0E0"
                        strokeWidth={3}
                      />
                      <circle
                        cx={10} cy={10} r={8}
                        fill="none"
                        stroke="#52B788"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeDasharray={50}
                        strokeDashoffset={50 * (1 - brewProgress)}
                        transform="rotate(-90 10 10)"
                        style={{ transition: 'stroke-dashoffset 0.2s linear' }}
                      />
                    </svg>
                  </div>
                )}
              </div>
              {/* Bubble tail */}
              <div style={{
                width: 0, height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid white',
              }} />
            </motion.div>
          )}

          {/* Drinking emoji */}
          {showDrinking && (
            <motion.div
              key="drinking"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute"
              style={{ bottom: '100%', marginBottom: 6, fontSize: 22 }}
            >
              {c.desiredEmoji}
            </motion.div>
          )}

          {/* Satisfied 😻 */}
          {showSatisfied && (
            <motion.div
              key="satisfied"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              exit={{ scale: 0 }}
              className="absolute"
              style={{ bottom: '100%', marginBottom: 6, fontSize: 26 }}
            >
              😻
            </motion.div>
          )}

          {/* Sad 😿 */}
          {showSad && (
            <motion.div
              key="sad"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0 }}
              className="absolute"
              style={{ bottom: '100%', marginBottom: 6, fontSize: 26 }}
            >
              😿
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cat body */}
        <motion.div
          animate={
            isWalking
              ? { y: [0, -3, 0, -3, 0] }
              : c.state === 'at_window'
              ? { y: [0, -2, 0] }
              : {}
          }
          transition={
            isWalking
              ? { repeat: Infinity, duration: 0.5 }
              : { repeat: Infinity, duration: 3 }
          }
          style={{
            transform: c.state === 'walking_out' ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          <CatSVG type={c.type} isWalking={isWalking} />
        </motion.div>

        {/* Name tag */}
        <div
          className="font-black text-white rounded-full px-2 py-0.5 mt-0.5"
          style={{
            fontSize: 8,
            background:
              c.type === 'nabi' ? '#8A7868' :
              c.type === 'luna' ? '#3A6EA5' : '#7B4FA0',
          }}
        >
          {c.name}
        </div>
      </div>
    </motion.div>
  );
}
