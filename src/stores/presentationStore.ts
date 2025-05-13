import create from 'zustand';
// Se vuoi usare persist anche con questa versione, dovrai importarlo:
// import { persist } from 'zustand/middleware';
import { Presentation } from '../types/presentation'; // Assicurati che questo percorso sia corretto

// Definizione dell'interfaccia per lo stato delle presentazioni
export interface PresentationState {
  presentations: Presentation[];
  selectedPresentation: Presentation | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addPresentation: (presentation: Presentation) => Promise<void>;
  updatePresentation: (id: string, updates: Partial<Presentation>) => Promise<void>;
  deletePresentation: (id: string) => Promise<void>;
  setSelectedPresentation: (presentation: Presentation | null) => void;
  setLoading: (loading: boolean) => void; // Rinominato da isLoading a loading per coerenza con l'uso comune
  setError: (error: string | null) => void;
}

export const usePresentationStore = create<PresentationState>((set, _get) => ({
  presentations: [],
  selectedPresentation: null,
  isLoading: false, // Stato iniziale
  error: null,
  
  addPresentation: async (presentation) => {
    set({ isLoading: true, error: null });
    try {
      // In un'implementazione reale, qui ci sarebbe una chiamata API
      // console.log('Simulating API call to add presentation:', presentation);
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simula ritardo API
      set(state => ({
        presentations: [...state.presentations, presentation],
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Si è verificato un errore durante l\'aggiunta';
      set({ error: errorMessage, isLoading: false });
      // console.error('Error adding presentation:', errorMessage);
    }
  },
  
  updatePresentation: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // console.log('Simulating API call to update presentation:', id, updates);
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simula ritardo API
      set(state => ({
        presentations: state.presentations.map(p => 
          p.id === id ? { ...p, ...updates, lastModified: new Date() } : p
        ),
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Si è verificato un errore durante l\'aggiornamento';
      set({ error: errorMessage, isLoading: false });
      // console.error('Error updating presentation:', errorMessage);
    }
  },
  
  deletePresentation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // console.log('Simulating API call to delete presentation:', id);
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simula ritardo API
      set(state => ({
        presentations: state.presentations.filter(p => p.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Si è verificato un errore durante l\'eliminazione';
      set({ error: errorMessage, isLoading: false });
      // console.error('Error deleting presentation:', errorMessage);
    }
  },
  
  setSelectedPresentation: (presentation) => {
    set({ selectedPresentation: presentation });
  },
  
  setLoading: (loadingStatus) => { // parametro rinominato per chiarezza
    set({ isLoading: loadingStatus });
  },
  
  setError: (error) => {
    set({ error });
  }
}));

// Se volessi aggiungere persist a questa versione:
// export const usePresentationStore = create(
//   persist<PresentationState>(
//     (set, get) => ({
//       // ...tutta la logica che vedi sopra, da presentations: [] fino a setError: (error) => { ... }
//     }),
//     {
//       name: 'presentation-storage', // nome per il localStorage
//       getStorage: () => localStorage, // (o sessionStorage)
//     }
//   )
// );

