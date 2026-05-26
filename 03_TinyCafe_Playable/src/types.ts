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
  baseProductionTime: number; // seconds
  productName: string;
  productEmoji: string;
  baseCoinsPerItem: number;
  baseUpgradeCost: number;
  heartsOnUpgrade: number;
  unlockCost: number;
  level: number;
  productionProgress: number; // ms elapsed
}

export interface Worker {
  id: string;
  equipmentId: string | null; // which machine they're stationed at
  state: 'idle' | 'working';
  stateTimer: number;
}

export type CustomerType = 'cat1' | 'cat2';
export type CustomerState =
  | 'walking_in'
  | 'at_window'
  | 'brewing'
  | 'drinking'
  | 'satisfied'
  | 'walking_out';

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  x: number;
  direction: 'left' | 'right'; // 이동 방향: 'right'=왼쪽 진입→오른쪽 퇴장, 'left'=오른쪽 진입→왼쪽 퇴장
  timedOut: boolean; // 주문 타임아웃으로 퇴장 시 true → walking_out에서 angry 이미지 유지
  state: CustomerState;
  stateTimer: number;
  desiredMenuId: string;
  desiredEmoji: string;
  waitTimeout: number;
}

export interface CoinSlot {
  id: string;
  drinkEmoji: string;
  amount: number;
  createdAt: number;
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
