import { motion } from 'framer-motion';
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

  if (state === 'walking_out' && timedOut) return IMAGES[`${type}_angry`];

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

  return (
    <div
      className="absolute"
      style={{
        left: c.x,
        bottom: 0,
        zIndex: 15,
        pointerEvents: 'none',
        transform: 'translateX(-50%)',
      }}
    >
      <motion.img
        src={getCatImage(c)}
        alt="customer"
        style={{
          height: 213,
          width: 'auto',
          maxWidth: 'none',
          objectFit: 'contain',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
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
  );
}
