import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PresentationManager from '../index';
import { usePresentationStore } from '../../../stores/presentationStore';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

// Mock dello store
jest.mock('../../../stores/presentationStore', () => ({
  usePresentationStore: jest.fn()
}));

describe('PresentationManager', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    (usePresentationStore as jest.Mock).mockImplementation(() => ({
      presentations: [],
      addPresentation: jest.fn(),
      setSelectedPresentation: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn()
    }));
  });

  it('dovrebbe renderizzare correttamente', () => {
    render(<PresentationManager />);
    expect(screen.getByText('Gestione Presentazioni')).toBeInTheDocument();
    expect(screen.getByText('Crea Nuova Presentazione')).toBeInTheDocument();
  });

  it('dovrebbe validare l\'input correttamente', async () => {
    render(<PresentationManager />);
    const input = screen.getByPlaceholderText('Inserisci il contenuto da analizzare...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    const createButton = screen.getByText('Crea Presentazione');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Il contenuto deve essere di almeno 10 caratteri')).toBeInTheDocument();
    });
  });

  it('dovrebbe gestire la selezione del template', () => {
    render(<PresentationManager />);
    const templateSelect = screen.getByLabelText('Seleziona Template');
    fireEvent.change(templateSelect, { target: { value: 'business' } });
    expect(templateSelect).toHaveValue('business');
  });

  it('dovrebbe creare una presentazione con successo', async () => {
    const mockAddPresentation = jest.fn();
    (usePresentationStore as jest.Mock).mockImplementation(() => ({
      presentations: [],
      addPresentation: mockAddPresentation,
      setSelectedPresentation: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn()
    }));

    render(<PresentationManager />);
    const input = screen.getByPlaceholderText('Inserisci il contenuto da analizzare...');
    fireEvent.change(input, { target: { value: 'Questo è un contenuto di test valido per la presentazione' } });
    
    const templateSelect = screen.getByLabelText('Seleziona Template');
    fireEvent.change(templateSelect, { target: { value: 'business' } });
    
    const createButton = screen.getByText('Crea Presentazione');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockAddPresentation).toHaveBeenCalled();
      expect(screen.getByText('Presentazione creata con successo!')).toBeInTheDocument();
    });
  });

  it('dovrebbe gestire gli errori durante la creazione', async () => {
    const mockSetError = jest.fn();
    (usePresentationStore as jest.Mock).mockImplementation(() => ({
      presentations: [],
      addPresentation: () => { throw new Error('Errore di test'); },
      setSelectedPresentation: jest.fn(),
      setLoading: jest.fn(),
      setError: mockSetError
    }));

    render(<PresentationManager />);
    const input = screen.getByPlaceholderText('Inserisci il contenuto da analizzare...');
    fireEvent.change(input, { target: { value: 'Contenuto test' } });
    
    const createButton = screen.getByText('Crea Presentazione');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalled();
      expect(screen.getByText('Si è verificato un errore')).toBeInTheDocument();
    });
  });
});


describe('Test di Rendering Base', () => {
  it('dovrebbe renderizzare tutti i componenti principali', () => {
    render(<PresentationManager />);
    
    // Verifica elementi principali
    expect(screen.getByText('Gestione Presentazioni')).toBeInTheDocument();
    expect(screen.getByText('Template Disponibili')).toBeInTheDocument();
    expect(screen.getByText('LeTue Presentazioni')).toBeInTheDocument();
  });

  it('dovrebbe mostrare il pulsante di creazione disabilitato inizialmente', () => {
    render(<PresentationManager />);
    const createButton = screen.getByText('Crea Presentazione');
    expect(createButton).toBeDisabled();
  });
});


describe('Test di Interazione Utente', () => {
  it('dovrebbe gestire il cambio di tipo di input', () => {
    render(<PresentationManager />);
    const selectInput = screen.getByLabelText('Tipo di Input');
    
    fireEvent.change(selectInput, { target: { value: 'video' } });
    expect(screen.getByText('Carica Video')).toBeInTheDocument();
    
    fireEvent.change(selectInput, { target: { value: 'audio' } });
    expect(screen.getByText('Carica Audio')).toBeInTheDocument();
  });

  it('dovrebbe filtrare i template per categoria', () => {
    render(<PresentationManager />);
    const categorySelect = screen.getByLabelText('Categoria');
    
    fireEvent.change(categorySelect, { target: { value: 'business' } });
    expect(screen.getByText('Business Professional')).toBeInTheDocument();
    expect(screen.queryByText('Creative Portfolio')).not.toBeInTheDocument();
  });
});


describe('Test di Validazione', () => {
  it('dovrebbe validare la lunghezza minima del contenuto', async () => {
    render(<PresentationManager />);
    const input = screen.getByPlaceholderText('Inserisci il testo o il prompt per la presentazione...');
    
    fireEvent.change(input, { target: { value: 'corto' } });
    const createButton = screen.getByText('Crea Presentazione');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Il contenuto deve essere di almeno 10 caratteri')).toBeInTheDocument();
    });
  });

  it('dovrebbe validare la selezione del template', async () => {
    render(<PresentationManager />);
    const input = screen.getByPlaceholderText('Inserisci il testo o il prompt per la presentazione...');
    
    fireEvent.change(input, { target: { value: 'Contenuto lungo abbastanza per il test' } });
    const createButton = screen.getByText('Crea Presentazione');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Seleziona un template per continuare')).toBeInTheDocument();
    });
  });
});


describe('Test di Gestione Errori', () => {
  it('dovrebbe gestire errori durante il caricamento file', async () => {
    render(<PresentationManager />);
    const fileInput = screen.getByLabelText('Carica Video');
    
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('Formato file non supportato')).toBeInTheDocument();
    });
  });

  it('dovrebbe gestire errori durante l\'analisi AI', async () => {
    const mockAnalyzeContent = jest.fn().mockRejectedValue(new Error('Errore analisi'));
    
    render(<PresentationManager />);
    // ... implementare test per errori durante l'analisi AI
  });
});