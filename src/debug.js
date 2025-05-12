// Script di diagnostica per rilevare problemi di rendering React

// Funzione per verificare se React è caricato correttamente
export function checkReactLoading() {
  console.log('Verifica del caricamento di React...');
  try {
    // Verifica se React è definito
    if (typeof React === 'undefined') {
      console.error('ERRORE: React non è definito. Controlla le importazioni.');
      return false;
    }
    console.log('React è caricato correttamente.');
    return true;
  } catch (error) {
    console.error('ERRORE durante la verifica di React:', error);
    return false;
  }
}

// Funzione per verificare se ReactDOM è caricato correttamente
export function checkReactDOMLoading() {
  console.log('Verifica del caricamento di ReactDOM...');
  try {
    // Verifica se ReactDOM è definito
    if (typeof ReactDOM === 'undefined') {
      console.error('ERRORE: ReactDOM non è definito. Controlla le importazioni.');
      return false;
    }
    console.log('ReactDOM è caricato correttamente.');
    return true;
  } catch (error) {
    console.error('ERRORE durante la verifica di ReactDOM:', error);
    return false;
  }
}

// Funzione per verificare se ci sono errori nel rendering
export function checkRenderingErrors() {
  console.log('Verifica degli errori di rendering...');
  try {
    // Verifica se il div root esiste
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('ERRORE: Elemento root non trovato. Controlla l\'HTML.');
      return false;
    }
    
    // Verifica se il div root ha figli
    if (rootElement.childNodes.length === 0) {
      console.error('ERRORE: Elemento root vuoto. Possibile errore di rendering.');
      return false;
    }
    
    console.log('Nessun errore di rendering rilevato.');
    return true;
  } catch (error) {
    console.error('ERRORE durante la verifica del rendering:', error);
    return false;
  }
}

// Funzione per verificare se ci sono errori nelle dipendenze
export function checkDependencies() {
  console.log('Verifica delle dipendenze...');
  try {
    // Verifica Material-UI
    if (typeof MaterialUI === 'undefined') {
      console.warn('AVVISO: MaterialUI non è definito globalmente (normale se importato come modulo).');
    }
    
    // Verifica Zustand
    if (typeof zustand === 'undefined') {
      console.warn('AVVISO: Zustand non è definito globalmente (normale se importato come modulo).');
    }
    
    console.log('Verifica delle dipendenze completata.');
    return true;
  } catch (error) {
    console.error('ERRORE durante la verifica delle dipendenze:', error);
    return false;
  }
}

// Funzione principale di diagnostica
export function runDiagnostics() {
  console.log('Avvio diagnostica WILLY.AI...');
  
  const reactLoaded = checkReactLoading();
  const reactDOMLoaded = checkReactDOMLoading();
  const renderingOK = checkRenderingErrors();
  const dependenciesOK = checkDependencies();
  
  if (reactLoaded && reactDOMLoaded && renderingOK && dependenciesOK) {
    console.log('Diagnostica completata: Nessun errore critico rilevato.');
  } else {
    console.error('Diagnostica completata: Sono stati rilevati errori. Controlla i messaggi precedenti.');
  }
}

// Esporta una funzione per verificare l'index.html
export function checkHTML() {
  console.log('Verifica del file index.html...');
  try {
    // Verifica se esiste il div root
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('ERRORE: Elemento con id "root" non trovato nell\'HTML.');
      return false;
    }
    
    // Verifica se ci sono script necessari
    const scripts = document.getElementsByTagName('script');
    if (scripts.length === 0) {
      console.warn('AVVISO: Nessuno script trovato nell\'HTML.');
    }
    
    console.log('Verifica HTML completata.');
    return true;
  } catch (error) {
    console.error('ERRORE durante la verifica dell\'HTML:', error);
    return false;
  }
}