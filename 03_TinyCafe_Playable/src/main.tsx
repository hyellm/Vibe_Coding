import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const GAME_W = 390;
const GAME_H = 844;

function ScaledApp() {
  useEffect(() => {
    const applyScale = () => {
      const root = document.getElementById('root');
      if (!root) return;
      const scale = Math.min(window.innerWidth / GAME_W, window.innerHeight / GAME_H);
      root.style.transform = `scale(${scale})`;
    };
    applyScale();
    window.addEventListener('resize', applyScale);
    return () => window.removeEventListener('resize', applyScale);
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ScaledApp />
  </React.StrictMode>
);
