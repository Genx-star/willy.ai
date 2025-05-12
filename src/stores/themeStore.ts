import { create } from 'zustand';
import { createTheme, Theme } from '@mui/material';

interface ThemeStore {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6B00B3', // Viola profondo per trasmettere innovazione e potenza
      light: '#9D00FF', // Viola brillante per elementi interattivi
      dark: '#4A0080', // Viola scuro per contrasto
    },
    secondary: {
      main: '#00B8D4', // Blu elettrico per accenti moderni
      light: '#18FFFF', // Ciano neon per elementi di spicco
      dark: '#0088A3', // Blu profondo per contrasto
    },
    background: {
      default: '#F8F9FF', // Sfondo leggermente violaceo per coerenza
      paper: '#FFFFFF',
    },
    success: {
      main: '#00C853', // Verde brillante per feedback positivi
    },
    info: {
      main: '#00B0FF', // Blu chiaro per informazioni
    },
    warning: {
      main: '#FFD600', // Giallo brillante per avvisi
    },
    error: {
      main: '#FF1744', // Rosso vivace per errori
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9D00FF', // Viola neon per modalità scura
      light: '#B94DFF', // Viola chiaro per hover
      dark: '#7700CC', // Viola medio per contrasto
    },
    secondary: {
      main: '#00E5FF', // Ciano elettrico per accenti
      light: '#6EFFFF', // Ciano brillante per elementi interattivi
      dark: '#00B2CC', // Ciano profondo per contrasto
    },
    background: {
      default: '#0A0A1F', // Blu scurissimo per sfondo
      paper: '#13132D', // Blu scuro per elementi di superficie
    },
    success: {
      main: '#00E676', // Verde neon per feedback positivi
    },
    info: {
      main: '#40C4FF', // Blu brillante per informazioni
    },
    warning: {
      main: '#FFEA00', // Giallo neon per avvisi
    },
    error: {
      main: '#FF1744', // Rosso neon per errori
    },
  },
});

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false,
  theme: lightTheme,
  toggleTheme: () =>
    set((state) => ({
      isDarkMode: !state.isDarkMode,
      theme: state.isDarkMode ? lightTheme : darkTheme,
    })),
}));