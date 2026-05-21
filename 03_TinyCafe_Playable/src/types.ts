export interface Resources {
  coins: number;
  cheese: number;
  hearts: number;
  gems: number;
}

export interface Equipment {
  id: string;
  name: string;
  emoji: string;
  maxLevel: number;
  baseProductionTime: number;
  productName: string;
  productEmoji: string;
  baseCoinsPerItem: number;
  baseUpgradeCost: number;
  heartsOnUpgrade: number;
  unlockCost: number;
  position: { x: number; y: number };
  level: number;
  productionProgress: number;
  itemsReady: number;
}

export interface Worker {
  id: string;
  name: string;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  walkStartX: number;
  walkStartY: number;
  state: 'idle' | 'walking_to_equipment' | 'at_equipment' | 'walking_to_showcase';
  stateTimer: number;
  facingLeft: boolean;
  carrying: string | null;
  assignedEquipmentId: string | null;
  _deliverEquipmentId?: string;
}

export interface Customer {
  id: string;
  emoji: string;
  name: string;
  x: number;
  y: number;
  targetX: number;
  state: 'entering' | 'at_showcase' | 'sitting' | 'leaving';
  stateTimer: number;
  purchasedEmoji: string | null;
  coinsEarned: number;
  tableX: number;
  color: string;
}

export interface ShowcaseSlot {
  equipmentId: string;
  productEmoji: string;
  productName: string;
  coinsPerItem: number;
  count: number;
}

export interface CoinFX {
  id: string;
  x: number;
  y: number;
  amount: number;
  createdAt: number;
}

export interface Mission {
  id: string;
  description: string;
  target: number;
  current: number;
  reward: { hearts: number; gems?: number };
  isCompleted: boolean;
}

export type TabName = 'home' | 'branches' | 'managers' | 'shop' | 'catbook';
