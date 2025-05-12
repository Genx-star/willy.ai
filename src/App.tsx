import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import AppRoutes from './routes';
import Layout from './components/Layout';

function App() {
  const { theme } = useThemeStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;