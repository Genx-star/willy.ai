import { create } from 'zustand';
import { auth } from '../config/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      set({ error: 'Errore durante l\'accesso con Google' });
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithFacebook: async () => {
    try {
      set({ isLoading: true, error: null });
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      set({ error: 'Errore durante l\'accesso con Facebook' });
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithTwitter: async () => {
    try {
      set({ isLoading: true, error: null });
      const provider = new TwitterAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      set({ error: 'Errore durante l\'accesso con Twitter' });
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithApple: async () => {
    try {
      set({ isLoading: true, error: null });
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
    } catch (error) {
      set({ error: 'Errore durante l\'accesso con Apple' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      set({ error: 'Errore durante il logout' });
    }
  },
}));

// Ascolta i cambiamenti dello stato di autenticazione
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, isLoading: false });
});