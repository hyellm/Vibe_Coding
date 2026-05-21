import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useRef, useEffect, useState } from 'react';

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    setDisplay(value);
  }, [value]);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return Math.floor(n).toString();
  };

  return <span>{fmt(display)}</span>;
}

function ResourceChip({ icon, value, bg }: { icon: string; value: number; bg: string }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-full text-white font-bold text-xs"
      style={{ background: bg, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
    >
      <span className="text-sm leading-none">{icon}</span>
      <AnimatedNumber value={value} />
    </div>
  );
}

export default function HUD() {
  const resources = useGameStore(s => s.resources);

  return (
    <div
      className="flex items-center justify-between px-3"
      style={{
        height: 60,
        background: 'linear-gradient(180deg, #3D1F0F 0%, #5A2E14 100%)',
        borderBottom: '2px solid #8B5E3C',
        flexShrink: 0,
      }}
    >
      {/* Left: coins */}
      <ResourceChip icon="🪙" value={resources.coins} bg="linear-gradient(135deg,#E8A020,#C07010)" />

      <div className="flex gap-2">
        <ResourceChip icon="🧀" value={resources.cheese} bg="linear-gradient(135deg,#D4A820,#B08010)" />
        <ResourceChip icon="❤️" value={resources.hearts} bg="linear-gradient(135deg,#E84060,#C02040)" />
        <ResourceChip icon="💎" value={resources.gems} bg="linear-gradient(135deg,#8860E8,#6040C0)" />
      </div>

      {/* Title badge */}
      <div
        className="text-white font-black text-xs px-2 py-1 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.15)' }}
      >
        Tiny Cafe
      </div>
    </div>
  );
}
