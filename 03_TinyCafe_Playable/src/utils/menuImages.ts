import dripcoffeeImg from '../../TinyCafe_reference_img/dripcoffee_img.png';
import espressoImg from '../../TinyCafe_reference_img/espresso_img.png';
import americanoImg from '../../TinyCafe_reference_img/americano_img.png';

// keyed by productEmoji AND by recipe id
export const MENU_IMAGES: Record<string, string> = {
  '☕': dripcoffeeImg,
  '🍵': espressoImg,
  '🥤': americanoImg,
  'drip_coffee': dripcoffeeImg,
  'espresso': espressoImg,
  'americano': americanoImg,
};
