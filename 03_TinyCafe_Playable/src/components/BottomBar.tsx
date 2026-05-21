import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { TabName } from '../types';

const TABS: { id: TabName; icon: string; label: string }[] = [
  { id: 'home',     icon: '🏠', label: '홈' },
  { id: 'branches', icon: '🌿', label: '지점' },
  { id: 'managers', icon: '👔', label: '매니저' },
  { id: 'shop',     icon: '🛒', label: '상점' },
  { id: 'catbook',  icon: '📖', label: '캣북' },
];

export default function BottomBar() {
  const activeTab = useGameStore(s => s.activeTab);
  const setActiveTab = useGameStore(s => s.setActiveTab);
  const openShop = useGameStore(s => s.openShop);

  const handleTab = (id: TabName) => {
    if (id === 'shop') {
      openShop();
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div
      className="flex items-center justify-around"
      style={{
        height: 64,
        background: 'linear-gradient(180deg,#3D1F0F,#2A1008)',
        borderTop: '2px solid #6A3C1C',
        flexShrink: 0,
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1"
            style={{
              background: isActive ? 'rgba(255,200,100,0.2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              minWidth: 60,
            }}
            whileTap={{ scale: 0.88 }}
            onClick={() => handleTab(tab.id)}
          >
            <motion.span
              style={{ fontSize: 22, display: 'block' }}
              animate={{ scale: isActive ? 1.15 : 1 }}
            >
              {tab.icon}
            </motion.span>
            <span
              className="font-bold"
              style={{
                fontSize: 9,
                color: isActive ? '#FFD080' : '#A07050',
              }}
            >
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-1 rounded-full"
                style={{ width: 4, height: 4, background: '#FFD080' }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
