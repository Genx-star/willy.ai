import { create } from 'zustand';
import {
  PromoCode,
  ActivatedPromotion,
  createPromoCode,
  activatePromoCode,
  getActivePromotion,
  getAllPromoCodes,
  deactivatePromoCode
} from '../services/promoCode';

interface PromoState {
  promoCodes: PromoCode[];
  activePromotions: ActivatedPromotion[];
  isLoading: boolean;
  error: string | null;
  createPromoCode: (planId: string, durationDays: number, maxUses?: number) => Promise<PromoCode>;
  activatePromoCode: (userId: string, code: string) => Promise<ActivatedPromotion>;
  getActivePromotion: (userId: string) => Promise<ActivatedPromotion | null>;
  getAllPromoCodes: () => Promise<PromoCode[]>;
  deactivatePromoCode: (code: string) => Promise<void>;
}

export const usePromoStore = create<PromoState>((set, _get) => ({
  promoCodes: [],
  activePromotions: [],
  isLoading: false,
  error: null,

  createPromoCode: async (planId: string, durationDays: number, maxUses?: number) => {
    set({ isLoading: true, error: null });
    try {
      const newCode = createPromoCode(planId, durationDays, maxUses);
      set(state => ({
        promoCodes: [...state.promoCodes, newCode]
      }));
      return newCode;
    } catch (error) {
      set({ error: 'Errore durante la creazione del codice promozionale' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  activatePromoCode: async (userId: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      const activation = activatePromoCode(userId, code);
      set(state => ({
        activePromotions: [...state.activePromotions, activation]
      }));
      return activation;
    } catch (error) { 
      set({ error: "Errore durante l'attivazione del codice promozionale" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getActivePromotion: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const promotion = getActivePromotion(userId);
      return promotion;
    } catch (error) {
      set({ error: 'Errore durante il recupero della promozione attiva' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPromoCodes: async () => {
    set({ isLoading: true, error: null });
    try {
      const codes = getAllPromoCodes();
      set({ promoCodes: codes });
      return codes;
    } catch (error) {
      set({ error: 'Errore durante il recupero dei codici promozionali' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deactivatePromoCode: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      deactivatePromoCode(code);
      set(state => ({
        promoCodes: state.promoCodes.map(pc =>
          pc.code === code ? { ...pc, isActive: false } : pc
        )
      }));
    } catch (error) {
      set({ error: 'Errore durante la disattivazione del codice promozionale' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
