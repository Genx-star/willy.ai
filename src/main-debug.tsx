import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n' // Importazione del sistema di traduzione
import { runDiagnostics } from './debug'

// Aggiungi un gestore di errori globale
window.addEventListener('error', (event) => {
  console.error('Errore globale catturato:', event.error);
  // Mostra un messaggio di errore all'utente
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #d32f2f;">Si è verificato un errore</h2>
        <p>Si è verificato un errore durante il caricamento dell'applicazione.</p>
        <p>Dettagli: ${event.error?.message || 'Errore sconosciuto'}</p>
        <button onclick="location.reload()" style="padding: 8px 16px; background: #6B00B3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Ricarica la pagina
        </button>
      </div>
    `;
  }
});

// Aggiungi un gestore per le promise non gestite
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise non gestita:', event.reason);
});

// Esegui la diagnostica prima del rendering
runDiagnostics();

// Avvolgi l'app in un componente di fallback per gestire gli errori di rendering
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Errore nel rendering:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h2 style={{ color: '#d32f2f' }}>Errore di Rendering</h2>
          <p>Si è verificato un errore durante il rendering dell'applicazione.</p>
          <p>Dettagli: {this.state.error?.message || 'Errore sconosciuto'}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '8px 16px', background: '#6B00B3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Ricarica la pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente di caricamento per Suspense
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>
      <h2>Caricamento in corso...</h2>
      <p>Se questa schermata persiste, potrebbe esserci un problema di caricamento.</p>
    </div>
  </div>
);

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Elemento root non trovato nel DOM');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log('Rendering completato con successo');
} catch (error) {
  console.error('Errore durante il rendering:', error);
  // Mostra un messaggio di errore all'utente
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #d32f2f;">Errore di Inizializzazione</h2>
        <p>Si è verificato un errore durante l'inizializzazione dell'applicazione.</p>
        <p>Dettagli: ${error?.message || 'Errore sconosciuto'}</p>
        <button onclick="location.reload()" style="padding: 8px 16px; background: #6B00B3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Ricarica la pagina
        </button>
      </div>
    `;
  }
}