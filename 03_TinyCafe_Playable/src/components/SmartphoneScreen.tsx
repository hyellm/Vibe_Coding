import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import FacilityScreen from './FacilityScreen';
import AlbanetScreen from './AlbanetScreen';
import RecipeScreen from './RecipeScreen';

type AppScreen = 'home' | 'facility' | 'albanet' | 'recipe';

const APPS = [
  { id: 'facility', icon: '🛠️', label: '시설', bg: '#E8A020' },
  { id: 'albanet', icon: '🐭', label: '알바넷', bg: '#52B788' },
  { id: 'recipe', icon: '📋', label: '레시피', bg: '#E84060' },
  { id: 'catbook', icon: '📘', label: 'Catbook', bg: '#4A90D9' },
  { id: 'mail', icon: '📬', label: '메일', bg: '#9B59B6' },
  { id: 'camera', icon: '📷', label: '카메라', bg: '#5A5A5A' },
  { id: 'settings', icon: '⚙️', label: '설정', bg: '#7A7A7A' },
  { id: 'newgame', icon: '🔄', label: '새 게임', bg: '#C0392B' },
];

export default function SmartphoneScreen({ onClose }: { onClose: () => void }) {
  const [appScreen, setAppScreen] = useState<AppScreen>('home');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const resetGame = useGameStore(s => s.resetGame);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', zIndex: 75 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Phone frame */}
      <motion.div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 310,
          height: 580,
          background: '#F0EDE8',
          borderRadius: 40,
          border: '6px solid #2A2A2A',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: 'spring', damping: 22 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1" style={{ background: '#1A1A1A' }}>
          <span style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>19:11</span>
          <div style={{ width: 60, height: 12, background: '#2A2A2A', borderRadius: 6 }} />
          <div className="flex gap-1 items-center">
            <span style={{ fontSize: 10, color: 'white' }}>📶</span>
            <span style={{ fontSize: 10, color: 'white' }}>🔋</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {appScreen === 'home' && (
              <motion.div
                key="home"
                className="absolute inset-0 flex flex-col"
                style={{ background: '#F0EDE8', padding: '12px 0' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* User card */}
                <div className="flex items-center gap-3 px-5 py-3 mx-3 rounded-2xl mb-4"
                  style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div className="flex items-center justify-center rounded-full"
                    style={{ width: 44, height: 44, background: '#2D5016', fontSize: 22 }}>🐱</div>
                  <div>
                    <div className="font-black" style={{ fontSize: 11, color: '#1A1A1A' }}>GUEST#1호점카페</div>
                    <div className="mt-1" style={{ width: 80, height: 6, background: '#EEE', borderRadius: 3 }}>
                      <div style={{ width: '40%', height: '100%', background: '#E84060', borderRadius: 3 }} />
                    </div>
                  </div>
                </div>

                {/* App grid */}
                <div className="grid grid-cols-4 gap-3 px-4">
                  {APPS.map(app => (
                    <button
                      key={app.id}
                      onClick={() => {
                        if (app.id === 'facility' || app.id === 'albanet' || app.id === 'recipe') {
                          setAppScreen(app.id as AppScreen);
                        } else if (app.id === 'newgame') {
                          setShowResetConfirm(true);
                        }
                      }}
                      className="flex flex-col items-center gap-1"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-center rounded-2xl"
                        style={{ width: 52, height: 52, background: app.bg, fontSize: 26 }}>
                        {app.icon}
                      </div>
                      <span style={{ fontSize: 10, color: '#3A3A3A', fontWeight: 700 }}>{app.label}</span>
                    </button>
                  ))}
                </div>

                {/* Reset confirmation popup */}
                {showResetConfirm && (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.55)', zIndex: 10 }}>
                    <div className="rounded-3xl p-5 mx-5" style={{ background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                      <div className="font-black text-center mb-2" style={{ fontSize: 16, color: '#1A1A1A' }}>
                        새 게임 시작
                      </div>
                      <div className="text-center mb-4" style={{ fontSize: 13, color: '#5A5A5A', lineHeight: 1.6 }}>
                        코인·치즈·하트·미션·장비 레벨이<br />모두 초기화됩니다.<br />정말로 다시 시작하시겠습니까?
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="flex-1 py-3 rounded-2xl font-black"
                          style={{ fontSize: 14, background: '#E8E0D4', border: 'none', cursor: 'pointer', color: '#5A3A20' }}
                        >
                          아니요
                        </button>
                        <button
                          onClick={() => {
                            resetGame();
                            setShowResetConfirm(false);
                            onClose();
                          }}
                          className="flex-1 py-3 rounded-2xl font-black text-white"
                          style={{ fontSize: 14, background: '#C0392B', border: 'none', cursor: 'pointer' }}
                        >
                          예
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {appScreen === 'facility' && (
              <FacilityScreen key="facility" onClose={() => setAppScreen('home')} />
            )}
            {appScreen === 'albanet' && (
              <AlbanetScreen key="albanet" onClose={() => setAppScreen('home')} />
            )}
            {appScreen === 'recipe' && (
              <RecipeScreen key="recipe" onClose={() => setAppScreen('home')} />
            )}
          </AnimatePresence>
        </div>

        {/* Home button */}
        <div className="flex justify-center py-3" style={{ background: '#1A1A1A' }}>
          <button
            onClick={appScreen === 'home' ? onClose : () => setAppScreen('home')}
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, background: '#2A2A2A', border: '2px solid #4A4A4A', cursor: 'pointer', fontSize: 18 }}
          >
            {appScreen === 'home' ? '✕' : '⌂'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
