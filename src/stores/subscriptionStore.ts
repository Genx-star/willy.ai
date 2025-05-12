import { create } from 'zustand';
import { createSubscription, cancelSubscription, updateSubscription, type SubscriptionPlan, type UserSubscription } from '../services/subscription';

interface SubscriptionState {
  currentPlan: SubscriptionPlan | null;
  subscription: UserSubscription | null;
  isLoading: boolean;
  error: string | null;
  createSubscription: (customerId: string, priceId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  updateSubscription: (subscriptionId: string, newPriceId: string) => Promise<void>;
  setCurrentPlan: (plan: SubscriptionPlan) => void;
  setSubscription: (subscription: UserSubscription) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentPlan: null,
  subscription: null,
  isLoading: false,
  error: null,

  createSubscription: async (customerId: string, priceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createSubscription(customerId, priceId);
      set({ subscription: response });
    } catch (error) {
      set({ error: 'Errore durante la creazione dell\'abbonamento' });
    } finally {
      set({ isLoading: false });
    }
  },

  cancelSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await cancelSubscription(subscriptionId);
      set({ subscription: null });
    } catch (error) {
      set({ error: 'Errore durante la cancellazione dell\'abbonamento' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSubscription: async (subscriptionId: string, newPriceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateSubscription(subscriptionId, newPriceId);
      set({ subscription: response });
    } catch (error) {
      set({ error: 'Errore durante l\'aggiornamento dell\'abbonamento' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentPlan: (plan: SubscriptionPlan) => {
    set({ currentPlan: plan });
  },

  setSubscription: (subscription: UserSubscription) => {
    set({ subscription });
  }
}));