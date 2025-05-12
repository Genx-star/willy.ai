import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Presentation } from '../types/presentation';

interface PresentationState {
  presentations: Presentation[];
  selectedPresentation: Presentation | null;
  loading: boolean;
  error: string | null;
  addPresentation: (presentation: Presentation) => void;
  deletePresentation: (id: string) => void;
  setSelectedPresentation: (presentation: Presentation | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePresentationStore = create(
  persist<PresentationState>(
    (set) => ({
      presentations: [],
      selectedPresentation: null,
      loading: false,
      error: null,
      addPresentation: (presentation) =>
        set((state) => ({
          presentations: [...state.presentations, presentation],
        })),
      deletePresentation: (id) =>
        set((state) => ({
          presentations: state.presentations.filter((p) => p.id !== id),
        })),
      setSelectedPresentation: (presentation) =>
        set({ selectedPresentation: presentation }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'presentation-storage',
      getStorage: () => localStorage,
    }
  )
);
import { Presentation } from '../types/presentation';

interface PresentationState {
  presentations: Presentation[];
  selectedPresentation: Presentation | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addPresentation: (presentation: Presentation) => Promise<void>;
  updatePresentation: (id: string, updates: Partial<Presentation>) => Promise<void>;
  deletePresentation: (id: string) => Promise<void>;
  setSelectedPresentation: (presentation: Presentation | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  presentations: [],
  selectedPresentation: null,
  isLoading: false,
  error: null,
  
  addPresentation: async (presentation) => {
    set({ isLoading: true, error: null });
    try {
      // In un'implementazione reale, qui ci sarebbe una chiamata API
      // Per ora, aggiungiamo semplicemente alla lista locale
      set(state => ({
        presentations: [...state.presentations, presentation]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Si è verificato un errore' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updatePresentation: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      set(state => ({
        presentations: state.presentations.map(p => 
          p.id === id ? { ...p, ...updates, lastModified: new Date() } : p
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Si è verificato un errore' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  deletePresentation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      set(state => ({
        presentations: state.presentations.filter(p => p.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Si è verificato un errore' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setSelectedPresentation: (presentation) => {
    set({ selectedPresentation: presentation });
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  setError: (error) => {
    set({ error });
  }
}));