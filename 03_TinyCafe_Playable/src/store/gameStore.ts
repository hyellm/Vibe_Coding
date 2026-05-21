import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resources, Equipment, Worker, Customer, ShowcaseSlot, CoinFX, Mission, TabName } from '../types';

// ── Layout constants (cafe view is 390 × 676px) ──────────────────
export const SHOWCASE_DELIVER_X = 310;
export const SHOWCASE_DELIVER_Y = 280;

const WORKER_HOME_X = 310;
const WORKER_HOME_Y = 284;
const WALK_DURATION = 1800;

export const CUSTOMER_PATH_Y = 382;
export const TABLE_Y = 468;

const TABLE_POSITIONS = [
  { x: 50, y: TABLE_Y },
  { x: 155, y: TABLE_Y },
  { x: 260, y: TABLE_Y },
];

const CAT_EMOJIS = ['🐱', '😸', '😺', '🙀', '😻', '😼', '🐈'];
const CAT_COLORS = ['#FF9F9F', '#FFD700', '#98D8C8', '#B8A9E8', '#F4A261', '#E9C46A'];
const CAT_NAMES = ['루나', '모카', '크림', '차이', '머랭', '타피', '코코', '망고', '비스킷', '와플', '소금', '버터'];

// ── Equipment pickup positions (where workers stand next to equipment) ──
const WORKER_PICKUP: Record<string, { x: number; y: number }> = {
  drip_coffee:       { x: 68,  y: 188 },
  donut_oven:        { x: 188, y: 188 },
  espresso_machine:  { x: 68,  y: 283 },
  cake_oven:         { x: 188, y: 283 },
  ice_cream:         { x: 300, y: 188 },
};

// ── Equipment templates ───────────────────────────────────────────
const EQUIPMENT_TEMPLATES: Omit<Equipment, 'level' | 'productionProgress' | 'itemsReady'>[] = [
  {
    id: 'drip_coffee',
    name: '드립 커피 머신',
    emoji: '☕',
    maxLevel: 10,
    baseProductionTime: 15,
    productName: '드립 커피',
    productEmoji: '☕',
    baseCoinsPerItem: 10,
    baseUpgradeCost: 80,
    heartsOnUpgrade: 5,
    unlockCost: 50,
    position: { x: 10, y: 75 },
  },
  {
    id: 'donut_oven',
    name: '도넛 오븐',
    emoji: '🍩',
    maxLevel: 10,
    baseProductionTime: 20,
    productName: '도넛',
    productEmoji: '🍩',
    baseCoinsPerItem: 8,
    baseUpgradeCost: 100,
    heartsOnUpgrade: 5,
    unlockCost: 80,
    position: { x: 130, y: 75 },
  },
  {
    id: 'espresso_machine',
    name: '에스프레소 머신',
    emoji: '🫖',
    maxLevel: 10,
    baseProductionTime: 10,
    productName: '에스프레소',
    productEmoji: '🫖',
    baseCoinsPerItem: 15,
    baseUpgradeCost: 150,
    heartsOnUpgrade: 8,
    unlockCost: 200,
    position: { x: 10, y: 198 },
  },
  {
    id: 'cake_oven',
    name: '케이크 오븐',
    emoji: '🎂',
    maxLevel: 10,
    baseProductionTime: 30,
    productName: '케이크',
    productEmoji: '🎂',
    baseCoinsPerItem: 25,
    baseUpgradeCost: 200,
    heartsOnUpgrade: 10,
    unlockCost: 350,
    position: { x: 130, y: 198 },
  },
];

const INITIAL_WORKERS: Worker[] = [
  {
    id: 'dolce',
    name: '돌체',
    currentX: WORKER_HOME_X,
    currentY: WORKER_HOME_Y,
    targetX: WORKER_HOME_X,
    targetY: WORKER_HOME_Y,
    walkStartX: WORKER_HOME_X,
    walkStartY: WORKER_HOME_Y,
    state: 'idle',
    stateTimer: 0,
    facingLeft: false,
    carrying: null,
    assignedEquipmentId: null,
  },
];

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'sell_5',
    description: '☕ 메뉴 아이템 5개 팔기',
    target: 5,
    current: 0,
    reward: { hearts: 10 },
    isCompleted: false,
  },
  {
    id: 'earn_150',
    description: '🪙 코인 150개 벌기',
    target: 150,
    current: 0,
    reward: { hearts: 15, gems: 2 },
    isCompleted: false,
  },
  {
    id: 'upgrade_1',
    description: '🔧 장비 1회 업그레이드',
    target: 1,
    current: 0,
    reward: { hearts: 20, gems: 1 },
    isCompleted: false,
  },
];

// ── Derived stats ─────────────────────────────────────────────────
export function getProductionTimeMs(eq: Equipment): number {
  return Math.max(3000, (eq.baseProductionTime * 1000) / Math.max(1, eq.level));
}

export function getCoinsPerItem(eq: Equipment): number {
  return Math.floor(eq.baseCoinsPerItem * (1 + (eq.level - 1) * 0.4));
}

export function getUpgradeCost(eq: Equipment): number {
  return Math.floor(eq.baseUpgradeCost * eq.level * 1.6);
}

// ── Store types ───────────────────────────────────────────────────
interface GameState {
  resources: Resources;
  equipment: Equipment[];
  workers: Worker[];
  showcase: Record<string, ShowcaseSlot>;
  customers: Customer[];
  coinFXs: CoinFX[];
  customerTimer: number;
  nextCustomerInterval: number;
  missions: Mission[];
  activeTab: TabName;
  totalCoinsEarned: number;
  totalItemsSold: number;
  upgradeCount: number;
  shopOpen: boolean;
  selectedEquipmentId: string | null;
  offlinePopup: { show: boolean; coins: number } | null;
  lastSaveTime: number;
  pendingMissionReward: string | null;
}

interface GameActions {
  tick: (delta: number) => void;
  buyEquipment: (id: string) => void;
  upgradeEquipment: (id: string) => void;
  setActiveTab: (tab: TabName) => void;
  openShop: (equipmentId?: string) => void;
  closeShop: () => void;
  dismissOfflinePopup: () => void;
  dismissMissionReward: () => void;
  hireWorker: () => void;
}

// ── Zustand store ─────────────────────────────────────────────────
export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      resources: { coins: 100, cheese: 10, hearts: 0, gems: 5 },
      equipment: EQUIPMENT_TEMPLATES.map(t => ({ ...t, level: 0, productionProgress: 0, itemsReady: 0 })),
      workers: INITIAL_WORKERS,
      showcase: {},
      customers: [],
      coinFXs: [],
      customerTimer: 0,
      nextCustomerInterval: 4000,
      missions: INITIAL_MISSIONS,
      activeTab: 'home',
      totalCoinsEarned: 0,
      totalItemsSold: 0,
      upgradeCount: 0,
      shopOpen: false,
      selectedEquipmentId: null,
      offlinePopup: null,
      lastSaveTime: Date.now(),
      pendingMissionReward: null,

      tick: (delta: number) => {
        set((state) => {
          if (delta <= 0) return state;

          // 1. Update equipment production
          const newEquipment = state.equipment.map(eq => {
            if (eq.level === 0) return eq;
            const ptMs = getProductionTimeMs(eq);
            const newProg = eq.productionProgress + delta;
            if (newProg >= ptMs && eq.itemsReady < 5) {
              return { ...eq, productionProgress: newProg - ptMs, itemsReady: eq.itemsReady + 1 };
            }
            return { ...eq, productionProgress: Math.min(newProg, ptMs) };
          });

          // 2. Update workers
          const newWorkers = state.workers.map(worker => {
            const w = { ...worker, stateTimer: worker.stateTimer + delta };

            if (w.state === 'idle') {
              const busyIds = new Set(
                state.workers.filter(ow => ow.id !== w.id && ow.assignedEquipmentId).map(ow => ow.assignedEquipmentId!)
              );
              const readyEq = newEquipment.find(eq => eq.level > 0 && eq.itemsReady > 0 && !busyIds.has(eq.id));
              if (readyEq) {
                const pickup = WORKER_PICKUP[readyEq.id] ?? { x: readyEq.position.x + 55, y: readyEq.position.y + 108 };
                w.state = 'walking_to_equipment';
                w.assignedEquipmentId = readyEq.id;
                w.walkStartX = w.currentX;
                w.walkStartY = w.currentY;
                w.targetX = pickup.x;
                w.targetY = pickup.y;
                w.facingLeft = pickup.x < w.currentX;
                w.stateTimer = 0;
              }
            } else if (w.state === 'walking_to_equipment') {
              const t = Math.min(w.stateTimer / WALK_DURATION, 1);
              w.currentX = w.walkStartX + (w.targetX - w.walkStartX) * t;
              w.currentY = w.walkStartY + (w.targetY - w.walkStartY) * t;
              if (w.stateTimer >= WALK_DURATION) {
                const eq = newEquipment.find(e => e.id === w.assignedEquipmentId);
                if (eq && eq.itemsReady > 0) {
                  const idx = newEquipment.findIndex(e => e.id === eq.id);
                  if (idx >= 0) newEquipment[idx] = { ...newEquipment[idx], itemsReady: newEquipment[idx].itemsReady - 1 };
                  w.carrying = eq.productEmoji;
                  w.state = 'at_equipment';
                  w.currentX = w.targetX;
                  w.currentY = w.targetY;
                  w.stateTimer = 0;
                } else {
                  w.state = 'idle';
                  w.assignedEquipmentId = null;
                  w.stateTimer = 0;
                }
              }
            } else if (w.state === 'at_equipment') {
              if (w.stateTimer >= 350) {
                w.state = 'walking_to_showcase';
                w.walkStartX = w.currentX;
                w.walkStartY = w.currentY;
                w.targetX = SHOWCASE_DELIVER_X;
                w.targetY = SHOWCASE_DELIVER_Y;
                w.facingLeft = SHOWCASE_DELIVER_X < w.currentX;
                w.stateTimer = 0;
              }
            } else if (w.state === 'walking_to_showcase') {
              const t = Math.min(w.stateTimer / WALK_DURATION, 1);
              w.currentX = w.walkStartX + (w.targetX - w.walkStartX) * t;
              w.currentY = w.walkStartY + (w.targetY - w.walkStartY) * t;
              if (w.stateTimer >= WALK_DURATION) {
                const eq = state.equipment.find(e => e.id === w.assignedEquipmentId);
                if (eq && w.carrying) {
                  // will be merged into showcase below
                  w._deliverEquipmentId = eq.id;
                }
                w.state = 'idle';
                w.carrying = null;
                w.assignedEquipmentId = null;
                w.currentX = SHOWCASE_DELIVER_X;
                w.currentY = SHOWCASE_DELIVER_Y;
                w.stateTimer = 0;
              }
            }

            return w;
          });

          // Collect deliveries from workers
          let newShowcase = { ...state.showcase };
          newWorkers.forEach(w => {
            const deliverId = (w as any)._deliverEquipmentId as string | undefined;
            if (deliverId) {
              const eq = state.equipment.find(e => e.id === deliverId);
              if (eq) {
                const coins = getCoinsPerItem(eq);
                const existing = newShowcase[eq.id];
                newShowcase[eq.id] = {
                  equipmentId: eq.id,
                  productEmoji: eq.productEmoji,
                  productName: eq.productName,
                  coinsPerItem: coins,
                  count: (existing?.count ?? 0) + 1,
                };
              }
              delete (w as any)._deliverEquipmentId;
            }
          });

          // 3. Spawn customers
          let newCustomerTimer = state.customerTimer + delta;
          let newNextInterval = state.nextCustomerInterval;
          let newCustomers = [...state.customers];

          if (newCustomerTimer >= newNextInterval && newCustomers.length < 4) {
            newCustomerTimer = 0;
            newNextInterval = 3500 + Math.random() * 3000;
            const takenTableX = new Set(newCustomers.filter(c => c.state === 'sitting').map(c => c.tableX));
            const freeTable = TABLE_POSITIONS.find(p => !takenTableX.has(p.x)) ?? TABLE_POSITIONS[0];
            newCustomers.push({
              id: `c_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              emoji: CAT_EMOJIS[Math.floor(Math.random() * CAT_EMOJIS.length)],
              name: CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)],
              x: -65,
              y: CUSTOMER_PATH_Y,
              targetX: 280,
              state: 'entering',
              stateTimer: 0,
              purchasedEmoji: null,
              coinsEarned: 0,
              tableX: freeTable.x,
              color: CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)],
            });
          }

          // 4. Update customers
          let coinsGained = 0;
          let itemsSold = 0;
          const newCoinFXs = [...state.coinFXs];

          newCustomers = newCustomers.map(c => {
            const customer = { ...c, stateTimer: c.stateTimer + delta };

            if (customer.state === 'entering') {
              const t = Math.min(customer.stateTimer / 1600, 1);
              customer.x = -65 + (customer.targetX + 65) * t;
              if (customer.stateTimer >= 1600) {
                customer.x = customer.targetX;
                customer.state = 'at_showcase';
                customer.stateTimer = 0;
              }
            } else if (customer.state === 'at_showcase') {
              const items = Object.values(newShowcase).filter(s => s.count > 0);
              if (items.length > 0) {
                const item = items[0];
                newShowcase = { ...newShowcase };
                if (newShowcase[item.equipmentId].count <= 1) {
                  delete newShowcase[item.equipmentId];
                } else {
                  newShowcase[item.equipmentId] = { ...item, count: item.count - 1 };
                }
                customer.purchasedEmoji = item.productEmoji;
                customer.coinsEarned = item.coinsPerItem;
                customer.state = 'sitting';
                customer.stateTimer = 0;
                coinsGained += item.coinsPerItem;
                itemsSold++;
                newCoinFXs.push({
                  id: `fx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                  x: customer.x + 15,
                  y: customer.y - 55,
                  amount: item.coinsPerItem,
                  createdAt: Date.now(),
                });
              } else if (customer.stateTimer >= 3200) {
                customer.state = 'leaving';
                customer.stateTimer = 0;
              }
            } else if (customer.state === 'sitting') {
              const t = Math.min(customer.stateTimer / 600, 1);
              customer.x = customer.targetX + (customer.tableX - customer.targetX) * t;
              customer.y = CUSTOMER_PATH_Y + (TABLE_Y - CUSTOMER_PATH_Y) * t;
              if (customer.stateTimer >= 4200) {
                customer.state = 'leaving';
                customer.stateTimer = 0;
              }
            } else if (customer.state === 'leaving') {
              const fromX = customer.state === 'leaving' && customer.stateTimer < 100 ? customer.x : customer.x;
              const t = Math.min(customer.stateTimer / 1600, 1);
              customer.x = fromX + (460 - fromX) * t;
            }

            return customer;
          }).filter(c => !(c.state === 'leaving' && c.stateTimer >= 1600));

          // 5. Cleanup old FX
          const now = Date.now();
          const filteredFXs = newCoinFXs.filter(fx => now - fx.createdAt < 2000);

          // 6. Update missions
          let newPendingReward = state.pendingMissionReward;
          const newMissions = state.missions.map(m => {
            if (m.isCompleted) return m;
            let newCurrent = m.current;
            if (m.id === 'sell_5') newCurrent = Math.min(m.target, m.current + itemsSold);
            if (m.id === 'earn_150') newCurrent = Math.min(m.target, m.current + coinsGained);
            const justCompleted = newCurrent >= m.target && !m.isCompleted;
            if (justCompleted) newPendingReward = m.id;
            return { ...m, current: newCurrent, isCompleted: newCurrent >= m.target };
          });

          // Collect hearts from completed missions
          let heartsGained = 0;
          let gemsGained = 0;
          if (newPendingReward && newPendingReward !== state.pendingMissionReward) {
            const completedMission = newMissions.find(m => m.id === newPendingReward);
            if (completedMission) {
              heartsGained = completedMission.reward.hearts;
              gemsGained = completedMission.reward.gems ?? 0;
            }
          }

          return {
            ...state,
            equipment: newEquipment,
            workers: newWorkers,
            showcase: newShowcase,
            customers: newCustomers,
            coinFXs: filteredFXs,
            customerTimer: newCustomerTimer,
            nextCustomerInterval: newNextInterval,
            missions: newMissions,
            pendingMissionReward: newPendingReward,
            resources: {
              ...state.resources,
              coins: state.resources.coins + coinsGained,
              cheese: state.resources.cheese + delta / 25000, // ~1 cheese per 25s
              hearts: state.resources.hearts + heartsGained,
              gems: state.resources.gems + gemsGained,
            },
            totalCoinsEarned: state.totalCoinsEarned + coinsGained,
            totalItemsSold: state.totalItemsSold + itemsSold,
            lastSaveTime: now,
          };
        });
      },

      buyEquipment: (id) => {
        set((state) => {
          const eq = state.equipment.find(e => e.id === id);
          if (!eq || eq.level > 0 || state.resources.coins < eq.unlockCost) return state;
          return {
            resources: { ...state.resources, coins: state.resources.coins - eq.unlockCost },
            equipment: state.equipment.map(e => e.id === id ? { ...e, level: 1, productionProgress: 0 } : e),
          };
        });
      },

      upgradeEquipment: (id) => {
        set((state) => {
          const eq = state.equipment.find(e => e.id === id);
          if (!eq || eq.level === 0 || eq.level >= eq.maxLevel) return state;
          const cost = getUpgradeCost(eq);
          if (state.resources.coins < cost) return state;
          const newMissions = state.missions.map(m =>
            m.id === 'upgrade_1' ? { ...m, current: Math.min(m.target, m.current + 1), isCompleted: m.current + 1 >= m.target } : m
          );
          return {
            resources: {
              ...state.resources,
              coins: state.resources.coins - cost,
              hearts: state.resources.hearts + eq.heartsOnUpgrade,
            },
            equipment: state.equipment.map(e => e.id === id ? { ...e, level: e.level + 1 } : e),
            upgradeCount: state.upgradeCount + 1,
            missions: newMissions,
          };
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      openShop: (equipmentId) => set({ shopOpen: true, selectedEquipmentId: equipmentId ?? null }),
      closeShop: () => set({ shopOpen: false, selectedEquipmentId: null }),
      dismissOfflinePopup: () => set({ offlinePopup: null }),
      dismissMissionReward: () => set({ pendingMissionReward: null }),

      hireWorker: () => {
        set((state) => {
          if (state.resources.cheese < 20) return state;
          const newId = `worker_${Date.now()}`;
          return {
            resources: { ...state.resources, cheese: state.resources.cheese - 20 },
            workers: [
              ...state.workers,
              {
                id: newId,
                name: `파트너 ${state.workers.length}`,
                currentX: WORKER_HOME_X - 20,
                currentY: WORKER_HOME_Y + 10,
                targetX: WORKER_HOME_X - 20,
                targetY: WORKER_HOME_Y + 10,
                walkStartX: WORKER_HOME_X - 20,
                walkStartY: WORKER_HOME_Y + 10,
                state: 'idle' as const,
                stateTimer: 0,
                facingLeft: false,
                carrying: null,
                assignedEquipmentId: null,
              },
            ],
          };
        });
      },
    }),
    {
      name: 'tiny-cafe-v1',
      partialize: (state) => ({
        resources: state.resources,
        equipment: state.equipment.map(e => ({ id: e.id, level: e.level })),
        missions: state.missions,
        totalCoinsEarned: state.totalCoinsEarned,
        totalItemsSold: state.totalItemsSold,
        upgradeCount: state.upgradeCount,
        lastSaveTime: state.lastSaveTime,
        workerCount: state.workers.length,
      }),
      merge: (saved: any, current) => {
        const s = saved as any;

        const equipment = current.equipment.map((eq: Equipment) => {
          const savedEq = s.equipment?.find((se: any) => se.id === eq.id);
          return savedEq ? { ...eq, level: savedEq.level } : eq;
        });

        const lastSave = s.lastSaveTime ?? Date.now();
        const offlineSecs = Math.min((Date.now() - lastSave) / 1000, 8 * 3600);
        let offlineCoins = 0;
        if (offlineSecs > 60) {
          equipment.forEach((eq: Equipment) => {
            if (eq.level > 0) {
              const pt = Math.max(3, eq.baseProductionTime / eq.level);
              const items = Math.floor(offlineSecs / pt);
              offlineCoins += items * getCoinsPerItem(eq);
            }
          });
        }

        return {
          ...current,
          resources: {
            ...(s.resources ?? current.resources),
            coins: (s.resources?.coins ?? 0) + offlineCoins,
          },
          equipment,
          missions: s.missions ?? current.missions,
          totalCoinsEarned: (s.totalCoinsEarned ?? 0) + offlineCoins,
          totalItemsSold: s.totalItemsSold ?? 0,
          upgradeCount: s.upgradeCount ?? 0,
          lastSaveTime: Date.now(),
          offlinePopup: offlineCoins > 10 ? { show: true, coins: Math.round(offlineCoins) } : null,
        };
      },
    }
  )
);
