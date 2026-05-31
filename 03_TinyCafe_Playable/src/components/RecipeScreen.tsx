import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { MENU_IMAGES } from '../utils/menuImages';

interface RecipeData {
  id: string;
  name: string;
  emoji: string;
  lvBadge: number | null;
  ingredients: string;
  description: string;
  timeSeconds: number;
  coinPct: number;
  requiredEquipmentId: string | null;
  locked?: boolean;
}

const RECIPES: RecipeData[] = [
  {
    id: 'drip_coffee',
    name: '드립 커피',
    emoji: '☕',
    lvBadge: null,
    ingredients: '',
    description: '돌체가 정성스럽게 추출한 드립커피입니다. 그동안 갈고닦은 돌체의 커피 솜씨를 가장 잘 나타낼 수 있는 메뉴입니다. 여러분도 함께 물을 조절해주며, 최고의 바리스타가 되겠다는 꿈을 응원해주세요!',
    timeSeconds: 8,
    coinPct: 100,
    requiredEquipmentId: 'drip_coffee',
  },
  {
    id: 'espresso',
    name: '에스프레소',
    emoji: '🍵',
    lvBadge: 1,
    ingredients: '에스프레소',
    description: '깔끔한 크레마가 돋보이는 에스프레소입니다. 돌체에게 노하우를 전수받은 직원들이 열심히 추출해주고 있습니다. 설탕을 곁들여 마시면 다양한 맛을 즐겨볼 수 있답니다!',
    timeSeconds: 6,
    coinPct: 100,
    requiredEquipmentId: 'espresso_machine',
  },
  {
    id: 'americano',
    name: '아메리카노',
    emoji: '🥤',
    lvBadge: 1,
    ingredients: '에스프레소 + 물',
    description: '에스프레소에 물을 첨가한 아메리카노입니다. 에스프레소가 너무 써서 힘든 고양이도 아메리카노와 함께라면 커피의 향을 즐길 수 있게 될거예요!',
    timeSeconds: 11,
    coinPct: 100,
    requiredEquipmentId: 'water_pump',
  },
  {
    id: 'unknown',
    name: '???',
    emoji: '❓',
    lvBadge: null,
    ingredients: '',
    description: '',
    timeSeconds: 0,
    coinPct: 0,
    requiredEquipmentId: null,
    locked: true,
  },
];

// ── Recipe Detail ──────────────────────────────────────────────────
function RecipeDetail({ recipe, onBack }: { recipe: RecipeData; onBack: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F5F0E8', zIndex: 10 }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
    >
      {/* Title */}
      <div className="text-center pt-5 pb-2">
        <div className="font-black" style={{ fontSize: 20, color: '#1A1A1A' }}>레시피</div>
      </div>

      {/* Menu illustration */}
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center justify-center rounded-full"
          style={{ width: 140, height: 140, background: '#EDE8DF', fontSize: 72 }}>
          {MENU_IMAGES[recipe.id]
            ? <img src={MENU_IMAGES[recipe.id]} alt={recipe.name} style={{ width: 90, height: 90, objectFit: 'contain' }} />
            : recipe.emoji}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {recipe.lvBadge !== null && (
          <div className="font-black mb-1" style={{ fontSize: 13, color: '#52B788' }}>Lv.{recipe.lvBadge}</div>
        )}
        <div className="font-black mb-3" style={{ fontSize: 22, color: '#1A1A1A' }}>{recipe.name}</div>
        <div style={{ fontSize: 13, color: '#5A5A5A', lineHeight: 1.7 }}>{recipe.description}</div>

        <div className="flex items-center gap-4 mt-5">
          <div className="flex items-center gap-1">
            <span style={{ fontSize: 16 }}>⏱</span>
            <span className="font-bold" style={{ fontSize: 13, color: '#5A5A5A' }}>{recipe.timeSeconds}s</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: 16 }}>🪙</span>
            <span className="font-bold" style={{ fontSize: 13, color: '#5A5A5A' }}>{recipe.coinPct}%</span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-center py-4">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          className="flex items-center justify-center rounded-full"
          style={{ width: 44, height: 44, background: '#E0D8CC', border: 'none', cursor: 'pointer', fontSize: 20 }}
        >
          ←
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Recipe Home ────────────────────────────────────────────────────
export default function RecipeScreen({ onClose }: { onClose: () => void }) {
  const equipment = useGameStore(s => s.equipment);
  const [selected, setSelected] = useState<RecipeData | null>(null);

  const isUnlocked = (recipe: RecipeData) => {
    if (recipe.locked) return false;
    if (!recipe.requiredEquipmentId) return true;
    const eq = equipment.find(e => e.id === recipe.requiredEquipmentId);
    return (eq?.level ?? 0) > 0;
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#F5F0E8', zIndex: 70 }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-4 pb-2 gap-3" style={{ borderBottom: '1px solid #E0D8CC' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#5A3A20' }}>←</button>
        <div className="font-black" style={{ fontSize: 18, color: '#1A1A1A' }}>레시피</div>
      </div>

      {/* Category bar */}
      <div className="flex gap-2 px-4 py-3" style={{ borderBottom: '1px solid #E0D8CC' }}>
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 44, height: 44, background: '#2D5016' }}
        >
          <svg width={26} height={26} viewBox="0 0 26 26">
            <g transform="rotate(-30 13 13)">
              {/* Bean body */}
              <ellipse cx={13} cy={13} rx={7.5} ry={11} fill="white" />
              {/* Crease — S-curve through center */}
              <path
                d="M13 3.5 Q17 8 13 13 Q9 18 13 22.5"
                fill="none" stroke="#2D5016" strokeWidth={2} strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Recipe list */}
      <div className="flex-1 overflow-y-auto">
        {RECIPES.map(r => {
          const unlocked = isUnlocked(r);
          return (
            <button
              key={r.id}
              onClick={() => unlocked && !r.locked && setSelected(r)}
              className="w-full flex items-center gap-3 px-4 py-3"
              style={{ background: 'none', border: 'none', borderBottom: '1px solid #EDE8DF', cursor: unlocked && !r.locked ? 'pointer' : 'default', textAlign: 'left' }}
            >
              {/* Icon */}
              <div className="flex items-center justify-center rounded-full flex-shrink-0 relative"
                style={{ width: 48, height: 48, background: unlocked ? 'transparent' : '#D8D0C4', fontSize: 26 }}>
                {r.locked ? '?' : MENU_IMAGES[r.id]
                  ? <img src={MENU_IMAGES[r.id]} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                  : r.emoji}
                {r.lvBadge !== null && unlocked && !r.locked && (
                  <div className="absolute -bottom-1 -right-1 font-black rounded-md px-1"
                    style={{ fontSize: 8, background: '#52B788', color: 'white', minWidth: 22, textAlign: 'center' }}>
                    Lv.{r.lvBadge}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-black" style={{ fontSize: 14, color: unlocked ? '#1A1A1A' : '#AAA' }}>{r.name}</div>
                {r.ingredients && (
                  <div style={{ fontSize: 11, color: '#888' }}>{r.ingredients}</div>
                )}
              </div>

              {/* Arrow */}
              {unlocked && !r.locked && (
                <span style={{ color: '#CCC', fontSize: 18 }}>›</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Recipe detail overlay */}
      <AnimatePresence>
        {selected && (
          <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
