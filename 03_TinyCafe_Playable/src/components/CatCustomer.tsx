import { motion, AnimatePresence } from 'framer-motion';
import type { Customer } from '../types';

import cat1Smile from '../../TinyCafe_reference_img/customer_cat1_smile.png';
import cat1Drink from '../../TinyCafe_reference_img/customer_cat1_drink.png';
import cat1Sad   from '../../TinyCafe_reference_img/customer_cat1_sad.png';
import cat1Angry from '../../TinyCafe_reference_img/customer_cat1_angry.png';
import cat2Smile from '../../TinyCafe_reference_img/customer_cat2_smile.png';
import cat2Drink from '../../TinyCafe_reference_img/customer_cat2_drink.png';
import cat2Sad   from '../../TinyCafe_reference_img/customer_cat2_sad.png';
import cat2Angry from '../../TinyCafe_reference_img/customer_cat2_angry.png';

const IMAGES = {
  cat1_smile: cat1Smile,
  cat1_drink: cat1Drink,
  cat1_sad:   cat1Sad,
  cat1_angry: cat1Angry,
  cat2_smile: cat2Smile,
  cat2_drink: cat2Drink,
  cat2_sad:   cat2Sad,
  cat2_angry: cat2Angry,
};

function getCatImage(c: Customer): string {
  const { type, state, stateTimer, timedOut } = c;

  if (state === 'drinking') return IMAGES[`${type}_drink`];

  // walking_out이면서 타임아웃 퇴장 → 화남 이미지 유지
  if (state === 'walking_out' && timedOut) return IMAGES[`${type}_angry`];

  // at_window: 대기 시간에 따라 감정 변화
  if (state === 'at_window') {
    if (stateTimer >= 12000) return IMAGES[`${type}_angry`];
    if (stateTimer >= 7000)  return IMAGES[`${type}_sad`];
  }

  return IMAGES[`${type}_smile`];
}

interface Props {
  customer: Customer;
}

export default function CatCustomer({ customer: c }: Props) {
  const isWalking = c.state === 'walking_in' || c.state === 'walking_out';
  const showOrderBubble = c.state === 'at_window' || c.state === 'brewing';

  const brewProgress = c.state === 'brewing'
    ? Math.min(1, c.stateTimer / 4000)
    : 0;

  // direction='left'(오른쪽→왼쪽 이동) 손님은 좌우 반전
  const flipX = c.direction === 'left' ? -1 : 1;

  return (
    <motion.div
      className="absolute"
      style={{
        left: c.x,
        top: 30,
        zIndex: 15,
        pointerEvents: 'none',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* 주문 말풍선 (음료 아이콘 + 제조 진행 원호) — 감정 이모지는 제거 */}
        <AnimatePresence>
          {showOrderBubble && (
            <motion.div
              key="order-bubble"
              initial={{ scale: 0, y: 6 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 6 }}
              transition={{ type: 'spring', damping: 18 }}
              className="absolute flex flex-col items-center"
              style={{ bottom: '100%', marginBottom: 6 }}
            >
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
                {c.state === 'brewing' && (
                  <div style={{ position: 'absolute', right: -8, top: -8, width: 20, height: 20 }}>
                    <svg width={20} height={20} viewBox="0 0 20 20">
                      <circle cx={10} cy={10} r={8} fill="none" stroke="#E0E0E0" strokeWidth={3} />
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
              <div style={{
                width: 0, height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid white',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 고양이 이미지 */}
        <motion.img
          src={getCatImage(c)}
          alt="customer"
          style={{
            width: 90,
            height: 'auto',
            objectFit: 'contain',
            transform: `scaleX(${flipX})`,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}
          animate={
            isWalking
              ? { y: [0, -4, 0, -4, 0] }
              : c.state === 'at_window'
              ? { y: [0, -2, 0] }
              : {}
          }
          transition={
            isWalking
              ? { repeat: Infinity, duration: 0.5 }
              : { repeat: Infinity, duration: 3 }
          }
        />
      </div>
    </motion.div>
  );
}
