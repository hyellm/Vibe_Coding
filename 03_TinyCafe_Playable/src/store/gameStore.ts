import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Resources, Equipment, Worker, Customer, CustomerType,
  CoinSlot, CoinFX, Mission, TabName,
} from '../types';

// ── Layout helpers ─────────────────────────────────────────────────
export const WINDOW_CAT_Y = 90; // visual y of cat in window zone (for reference)

// ── Derived stats ──────────────────────────────────────────────────
export function getProductionTimeMs(eq: Equipment): number {
  return Math.max(3000, (eq.baseProductionTime * 1000) / Math.max(1, eq.level));
}
export function getCoinsPerItem(eq: Equipment): number {
  return Math.floor(eq.baseCoinsPerItem * (1 + (eq.level - 1) * 0.4));
}
export function getUpgradeCost(eq: Equipment): number {
  return Math.floor(eq.baseUpgradeCost * eq.level * 1.6);
}
export function getIncomePerSec(equipment: Equipment[]): number {
  return equipment.reduce((sum, eq) => {
    if (eq.level === 0) return sum;
    const ptSec = getProductionTimeMs(eq) / 1000;
    return sum + getCoinsPerItem(eq) / ptSec;
  }, 0);
}

// ── Equipment templates ────────────────────────────────────────────
const EQUIPMENT_TEMPLATES: Omit<Equipment, 'level' | 'productionProgress'>[] = [
  {
    id: 'drip_coffee',
    name: '핸드드립 세트',
    emoji: '☕',
    maxLevel: 50,
    baseProductionTime: 8,
    productName: '드립 커피',
    productEmoji: '☕',
    baseCoinsPerItem: 12,
    baseUpgradeCost: 80,
    heartsOnUpgrade: 5,
    unlockCost: 0, // starts unlocked (Lv.1)
  },
  {
    id: 'espresso_machine',
    name: '에스프레소 머신',
    emoji: '🫖',
    maxLevel: 50,
    baseProductionTime: 6,
    productName: '아메리카노',
    productEmoji: '🍵',
    baseCoinsPerItem: 20,
    baseUpgradeCost: 150,
    heartsOnUpgrade: 8,
    unlockCost: 200,
  },
  {
    id: 'bathhouse',
    name: '목욕탕',
    emoji: '🛁',
    maxLevel: 20,
    baseProductionTime: 30,
    productName: '치즈',
    productEmoji: '🧀',
    baseCoinsPerItem: 0,
    baseUpgradeCost: 300,
    heartsOnUpgrade: 10,
    unlockCost: 500,
  },
];

const CUSTOMER_DESIRED: Record<CustomerType, string> = {
  cat1: 'drip_coffee',
  cat2: 'espresso_machine',
};

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'install_drip',
    description: '핸드드립 머신 설치하기',
    target: 1, current: 1, // starts completed (drip starts at lv1)
    reward: { hearts: 10 }, isCompleted: true,
  },
  {
    id: 'serve_10',
    description: '손님 10명 서빙하기',
    target: 10, current: 0,
    reward: { hearts: 20 }, isCompleted: false,
  },
  {
    id: 'upgrade_drip',
    description: '핸드드립 머신 업그레이드하기',
    target: 1, current: 0,
    reward: { hearts: 25 }, isCompleted: false,
  },
  {
    id: 'install_espresso',
    description: '에스프레소 머신 설치하기',
    target: 1, current: 0,
    reward: { hearts: 30 }, isCompleted: false,
  },
  {
    id: 'serve_50',
    description: '손님 50명 서빙하기',
    target: 50, current: 0,
    reward: { hearts: 50 }, isCompleted: false,
  },
];

// ── Store types ────────────────────────────────────────────────────
interface GameState {
  resources: Resources;
  equipment: Equipment[];
  workers: Worker[];
  customers: Customer[];
  customerTimer: number;
  nextCustomerInterval: number;
  brewingCustomerId: string | null;
  brewTimer: number;
  brewDuration: number;
  brewEquipmentId: string | null;
  coinSlots: CoinSlot[];
  coinFXs: CoinFX[];
  missions: Mission[];
  pendingMissionReward: string | null;
  upgradeModalOpen: boolean;
  selectedEquipmentId: string | null;
  offlinePopup: { show: boolean; coins: number } | null;
  lastSaveTime: number;
  customersServed: number;
  upgradeCount: number;
  heartTarget: number;
  activeTab: TabName;
}

interface GameActions {
  tick: (delta: number) => void;
  tapBrew: () => void;
  collectSlot: (id: string) => void;
  buyEquipment: (id: string) => void;
  upgradeEquipment: (id: string) => void;
  openUpgrade: (id: string) => void;
  closeUpgrade: () => void;
  dismissOfflinePopup: () => void;
  dismissMissionReward: () => void;
  setActiveTab: (tab: TabName) => void;
}

// ── Store ──────────────────────────────────────────────────────────
export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      resources: { coins: 150, cheese: 0, hearts: 0, gems: 5 },
      equipment: EQUIPMENT_TEMPLATES.map(t => ({
        ...t,
        level: t.id === 'drip_coffee' ? 1 : 0,
        productionProgress: 0,
      })),
      workers: [
        { id: 'dolce', equipmentId: 'drip_coffee', state: 'idle', stateTimer: 0 },
      ],
      customers: [],
      customerTimer: 0,
      nextCustomerInterval: 4000,
      brewingCustomerId: null,
      brewTimer: 0,
      brewDuration: 0,
      brewEquipmentId: null,
      coinSlots: [],
      coinFXs: [],
      missions: INITIAL_MISSIONS,
      pendingMissionReward: null,
      upgradeModalOpen: false,
      selectedEquipmentId: null,
      offlinePopup: null,
      lastSaveTime: Date.now(),
      customersServed: 0,
      upgradeCount: 0,
      heartTarget: 1000,
      activeTab: 'home',

      tick: (delta: number) => {
        set((state) => {
          if (delta <= 0) return state;

          // 1. Equipment auto-production → coin slots
          let newCoinSlots = [...state.coinSlots];
          const newEquipment = state.equipment.map(eq => {
            if (eq.level === 0) return eq;
            if (eq.id === 'bathhouse') {
              // Bathhouse generates cheese passively
              return { ...eq, productionProgress: eq.productionProgress + delta };
            }
            const newProg = eq.productionProgress + delta;
            const ptMs = getProductionTimeMs(eq);
            if (newProg >= ptMs && newCoinSlots.length < 15) {
              newCoinSlots.push({
                id: `slot_${eq.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                drinkEmoji: eq.productEmoji,
                amount: getCoinsPerItem(eq),
                createdAt: Date.now(),
              });
              return { ...eq, productionProgress: newProg - ptMs };
            }
            return { ...eq, productionProgress: Math.min(newProg, ptMs) };
          });

          // Cheese from bathhouse
          const bathhouse = newEquipment.find(e => e.id === 'bathhouse' && e.level > 0);
          const cheeseGain = bathhouse ? delta / 10000 : 0; // ~0.1 cheese/s

          // 2. Spawn customers
          let newCustomerTimer = state.customerTimer + delta;
          let newNextInterval = state.nextCustomerInterval;
          let newCustomers = [...state.customers];
          const unlockedEq = newEquipment.filter(
            e => e.level > 0 && e.id !== 'bathhouse'
          );

          if (
            newCustomerTimer >= newNextInterval &&
            newCustomers.length === 0 &&
            unlockedEq.length > 0
          ) {
            newCustomerTimer = 0;
            newNextInterval = 5000 + Math.random() * 5000;
            const types: CustomerType[] = ['cat1', 'cat2'];
            const type = types[Math.floor(Math.random() * types.length)];
            const direction: 'left' | 'right' = Math.random() < 0.5 ? 'right' : 'left';
            const preferredId = CUSTOMER_DESIRED[type];
            const preferred = unlockedEq.find(e => e.id === preferredId);
            const eq = preferred ?? unlockedEq[Math.floor(Math.random() * unlockedEq.length)];
            // direction='right': 왼쪽(-130)에서 등장 → 중앙(150) → 오른쪽(480) 퇴장
            // direction='left' : 오른쪽(480)에서 등장 → 중앙(150) → 왼쪽(-130) 퇴장
            const startX = direction === 'right' ? -130 : 480;
            newCustomers.push({
              id: `c_${Date.now()}`,
              type,
              name: '',
              x: startX,
              direction,
              timedOut: false,
              state: 'walking_in',
              stateTimer: 0,
              desiredMenuId: eq.id,
              desiredEmoji: eq.productEmoji,
              waitTimeout: 15000,
            });
          }

          // 3. Brew timer
          let newBrewingId = state.brewingCustomerId;
          let newBrewTimer = state.brewTimer + delta;
          let newBrewDuration = state.brewDuration;
          let newBrewEquipmentId = state.brewEquipmentId;
          let customersServedGain = 0;

          if (newBrewingId && newBrewTimer >= newBrewDuration) {
            const brewedCustomer = newCustomers.find(c => c.id === newBrewingId);
            if (brewedCustomer) {
              const eq = newEquipment.find(e => e.id === newBrewEquipmentId);
              const amount = eq ? getCoinsPerItem(eq) * 3 : 30; // customer drink earns 3× auto
              newCoinSlots.push({
                id: `slot_serve_${Date.now()}`,
                drinkEmoji: brewedCustomer.desiredEmoji,
                amount,
                createdAt: Date.now(),
              });
              customersServedGain = 1;
              newCustomers = newCustomers.map(c =>
                c.id === newBrewingId ? { ...c, state: 'drinking' as const, stateTimer: 0 } : c
              );
            }
            newBrewingId = null;
            newBrewTimer = 0;
            newBrewEquipmentId = null;
          }

          // 4. Update customer states
          const removedIds = new Set<string>();
          newCustomers = newCustomers.map(c => {
            const timer = c.stateTimer + delta;

            if (c.state === 'walking_in') {
              const WALK_MS = 2200;
              const t = Math.min(timer / WALK_MS, 1);
              const CENTER_X = 195;
              const startX = c.direction === 'right' ? -130 : 480;
              const x = startX + (CENTER_X - startX) * t;
              if (timer >= WALK_MS) {
                return { ...c, x: CENTER_X, state: 'at_window' as const, stateTimer: 0 };
              }
              return { ...c, x, stateTimer: timer };
            }

            if (c.state === 'at_window') {
              // 15초 대기 시 화남 상태로 직접 퇴장 (timedOut=true → walking_out에서 angry 이미지 유지)
              if (timer >= c.waitTimeout) {
                return { ...c, state: 'walking_out' as const, stateTimer: 0, timedOut: true };
              }
              return { ...c, stateTimer: timer };
            }

            if (c.state === 'brewing') {
              // stateTimer tracks brewing progress for animation
              return { ...c, stateTimer: newBrewingId ? timer : c.stateTimer };
            }

            if (c.state === 'drinking') {
              if (timer >= 1800) {
                return { ...c, state: 'satisfied' as const, stateTimer: 0 };
              }
              return { ...c, stateTimer: timer };
            }

            if (c.state === 'satisfied') {
              if (timer >= 1200) {
                return { ...c, state: 'walking_out' as const, stateTimer: 0 };
              }
              return { ...c, stateTimer: timer };
            }

            if (c.state === 'walking_out') {
              const WALK_MS = 2000;
              const t = Math.min(timer / WALK_MS, 1);
              const CENTER_X = 195;
              // 진입 방향과 동일한 방향으로 직선 퇴장
              const exitX = c.direction === 'right' ? 480 : -130;
              const x = CENTER_X + (exitX - CENTER_X) * t;
              if (timer >= WALK_MS) {
                removedIds.add(c.id);
              }
              return { ...c, x, stateTimer: timer };
            }

            return { ...c, stateTimer: timer };
          }).filter(c => !removedIds.has(c.id));

          // 5. Update missions
          const newServedTotal = state.customersServed + customersServedGain;
          let newPendingReward = state.pendingMissionReward;
          const newMissions = state.missions.map(m => {
            if (m.isCompleted) return m;
            let newCurrent = m.current;
            if (m.id === 'serve_10' || m.id === 'serve_50') {
              newCurrent = Math.min(m.target, newServedTotal);
            }
            const done = newCurrent >= m.target;
            if (done && !m.isCompleted && !newPendingReward) {
              newPendingReward = m.id;
            }
            return { ...m, current: newCurrent, isCompleted: done };
          });

          // Collect heart rewards
          let heartsGained = 0;
          if (newPendingReward && newPendingReward !== state.pendingMissionReward) {
            const m = newMissions.find(m => m.id === newPendingReward);
            if (m) heartsGained = m.reward.hearts;
          }

          // 6. Clean up old FX
          const now = Date.now();
          const filteredFXs = state.coinFXs.filter(fx => now - fx.createdAt < 2000);

          return {
            ...state,
            equipment: newEquipment,
            customers: newCustomers,
            customerTimer: newCustomerTimer,
            nextCustomerInterval: newNextInterval,
            brewingCustomerId: newBrewingId,
            brewTimer: newBrewTimer,
            brewDuration: newBrewDuration,
            brewEquipmentId: newBrewEquipmentId,
            coinSlots: newCoinSlots,
            coinFXs: filteredFXs,
            missions: newMissions,
            pendingMissionReward: newPendingReward,
            customersServed: newServedTotal,
            resources: {
              ...state.resources,
              cheese: state.resources.cheese + cheeseGain,
              hearts: state.resources.hearts + heartsGained,
            },
            lastSaveTime: now,
          };
        });
      },

      tapBrew: () => {
        set((state) => {
          if (state.brewingCustomerId) return state; // already brewing
          const waiting = state.customers.find(c => c.state === 'at_window');
          if (!waiting) return state;
          const eq = state.equipment.find(
            e => e.id === waiting.desiredMenuId && e.level > 0
          );
          if (!eq) return state;

          return {
            ...state,
            brewingCustomerId: waiting.id,
            brewTimer: 0,
            brewDuration: Math.max(2000, getProductionTimeMs(eq) * 0.6),
            brewEquipmentId: eq.id,
            customers: state.customers.map(c =>
              c.id === waiting.id ? { ...c, state: 'brewing' as const, stateTimer: 0 } : c
            ),
          };
        });
      },

      collectSlot: (id: string) => {
        set((state) => {
          const slot = state.coinSlots.find(s => s.id === id);
          if (!slot) return state;
          return {
            ...state,
            coinSlots: state.coinSlots.filter(s => s.id !== id),
            resources: { ...state.resources, coins: state.resources.coins + slot.amount },
            coinFXs: [
              ...state.coinFXs,
              {
                id: `fx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                x: 195,
                y: 700,
                amount: slot.amount,
                createdAt: Date.now(),
              },
            ],
          };
        });
      },

      buyEquipment: (id: string) => {
        set((state) => {
          const eq = state.equipment.find(e => e.id === id);
          if (!eq || eq.level > 0 || state.resources.coins < eq.unlockCost) return state;

          const newMissions = state.missions.map(m => {
            if (m.id === 'install_espresso' && id === 'espresso_machine') {
              return { ...m, current: 1, isCompleted: true };
            }
            return m;
          });

          return {
            ...state,
            resources: { ...state.resources, coins: state.resources.coins - eq.unlockCost },
            equipment: state.equipment.map(e =>
              e.id === id ? { ...e, level: 1, productionProgress: 0 } : e
            ),
            missions: newMissions,
          };
        });
      },

      upgradeEquipment: (id: string) => {
        set((state) => {
          const eq = state.equipment.find(e => e.id === id);
          if (!eq || eq.level === 0 || eq.level >= eq.maxLevel) return state;
          const cost = getUpgradeCost(eq);
          if (state.resources.coins < cost) return state;

          const newMissions = state.missions.map(m => {
            if (m.id === 'upgrade_drip' && id === 'drip_coffee') {
              return { ...m, current: Math.min(m.target, m.current + 1), isCompleted: m.current + 1 >= m.target };
            }
            return m;
          });

          return {
            ...state,
            resources: {
              ...state.resources,
              coins: state.resources.coins - cost,
              hearts: state.resources.hearts + eq.heartsOnUpgrade,
            },
            equipment: state.equipment.map(e =>
              e.id === id ? { ...e, level: e.level + 1 } : e
            ),
            upgradeCount: state.upgradeCount + 1,
            missions: newMissions,
          };
        });
      },

      openUpgrade: (id: string) => set({ upgradeModalOpen: true, selectedEquipmentId: id }),
      closeUpgrade: () => set({ upgradeModalOpen: false, selectedEquipmentId: null }),
      dismissOfflinePopup: () => set({ offlinePopup: null }),
      dismissMissionReward: () => set({ pendingMissionReward: null }),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'tiny-cafe-v2',
      partialize: (state) => ({
        resources: state.resources,
        equipment: state.equipment.map(e => ({ id: e.id, level: e.level })),
        missions: state.missions,
        customersServed: state.customersServed,
        upgradeCount: state.upgradeCount,
        lastSaveTime: state.lastSaveTime,
      }),
      merge: (saved: unknown, current) => {
        const s = saved as Record<string, unknown> | null;
        if (!s) return current;

        const equipment = current.equipment.map((eq: Equipment) => {
          const savedEqs = s.equipment as Array<{ id: string; level: number }> | undefined;
          const savedEq = savedEqs?.find((se) => se.id === eq.id);
          return savedEq ? { ...eq, level: savedEq.level } : eq;
        });

        const lastSave = (s.lastSaveTime as number | undefined) ?? Date.now();
        const offlineSecs = Math.min((Date.now() - lastSave) / 1000, 8 * 3600);
        let offlineCoins = 0;
        if (offlineSecs > 60) {
          equipment.forEach((eq: Equipment) => {
            if (eq.level > 0 && eq.id !== 'bathhouse') {
              const pt = Math.max(3, getProductionTimeMs(eq) / 1000);
              const items = Math.floor(offlineSecs / pt);
              offlineCoins += items * getCoinsPerItem(eq);
            }
          });
        }

        const savedResources = s.resources as Resources | undefined;
        return {
          ...current,
          resources: {
            ...(savedResources ?? current.resources),
            coins: (savedResources?.coins ?? 0) + offlineCoins,
          },
          equipment,
          missions: (s.missions as Mission[] | undefined) ?? current.missions,
          customersServed: (s.customersServed as number | undefined) ?? 0,
          upgradeCount: (s.upgradeCount as number | undefined) ?? 0,
          lastSaveTime: Date.now(),
          offlinePopup: offlineCoins > 20 ? { show: true, coins: Math.round(offlineCoins) } : null,
        };
      },
    }
  )
);
