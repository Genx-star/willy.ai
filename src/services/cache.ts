import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

interface CacheStore {
  items: Record<string, CacheItem<any>>;
  set: <T>(key: string, data: T, expiresIn?: number) => void;
  get: <T>(key: string) => T | null;
  remove: (key: string) => void;
  clear: () => void;
  isExpired: (key: string) => boolean;
}

const DEFAULT_EXPIRATION = 1000 * 60 * 60; // 1 ora

export const useCacheStore = create<CacheStore>(
  persist(
    (set, get) => ({
      items: {},

      set: (key, data, expiresIn = DEFAULT_EXPIRATION) => {
        set((state) => ({
          items: {
            ...state.items,
            [key]: {
              data,
              timestamp: Date.now(),
              expiresIn,
            },
          },
        }));
      },

      get: (key) => {
        const state = get();
        const item = state.items[key];

        if (!item) return null;

        // Verifica scadenza
        if (state.isExpired(key)) {
          state.remove(key);
          return null;
        }

        return item.data;
      },

      remove: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.items;
          return { items: rest };
        }),

      clear: () => set({ items: {} }),

      isExpired: (key) => {
        const item = get().items[key];
        if (!item) return true;

        return Date.now() - item.timestamp > item.expiresIn;
      },
    }),
    {
      name: 'cache-storage',
      getStorage: () => localStorage,
    }
  )
);

// Utility per il caching delle richieste API
export const withCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiresIn?: number
): Promise<T> => {
  const cache = useCacheStore.getState();
  const cachedData = cache.get<T>(key);

  if (cachedData) {
    return cachedData;
  }

  const data = await fetchFn();
  cache.set(key, data, expiresIn);
  return data;
};