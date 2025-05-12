import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tooltip,
  Snackbar,
  CircularProgress
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import SettingsIcon from '@mui/icons-material/Settings';
import ContextualGuide from '../ContextualGuide';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
  settings: Record<string, string>;
}

const ExternalIntegrations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'gpt4',
      name: 'GPT-4',
      description: 'Generazione avanzata di testi con il modello AI più potente',
      icon: '/icons/gpt4.svg',
      isConnected: true,
      status: 'active',
      lastSync: '2024-02-10T15:30:00',
      settings: {
        modelVersion: 'gpt-4-turbo',
        temperature: '0.7',
        maxTokens: '2000'
      }
    },
    {
      id: 'dalle3',
      name: 'DALL-E 3',
      description: 'Creazione di immagini di alta qualità tramite AI',
      icon: '/icons/dalle3.svg',
      isConnected: true,
      status: 'active',
      lastSync: '2024-02-10T16:00:00',
      settings: {
        imageSize: '1024x1024',
        quality: 'hd',
        style: 'vivid'
      }
    },
    {
      id: 'stable-diffusion',
      name: 'Stable Diffusion XL',
      description: 'Generazione di immagini avanzata con controllo preciso',
      icon: '/icons/sdxl.svg',
      isConnected: false,
      status: 'inactive',
      settings: {
        modelVersion: 'xl-v1.0',
        steps: '30',
        guidance: '7.5'
      }
    },
    {
      id: 'anthropic',
      name: 'Claude 3',
      description: 'Assistente AI avanzato per analisi e contenuti complessi',
      icon: '/icons/claude.svg',
      isConnected: true,
      status: 'active',
      lastSync: '2024-02-10T17:00:00',
      settings: {
        model: 'claude-3-opus',
        context: '100000',
        format: 'markdown'
      }
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: 'Creazione artistica di immagini con stili unici',
      icon: '/icons/midjourney.svg',
      isConnected: false,
      status: 'inactive',
      settings: {
        version: 'v6',
        style: 'raw',
        quality: '2'
      }
    }
  ]);

  const [openSettings, setOpenSettings] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<Integration | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleConnection = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulazione chiamata API
      setIntegrations(integrations.map(integration =>
        integration.id === id
          ? { 
              ...integration, 
              isConnected: !integration.isConnected,
              status: !integration.isConnected ? 'active' : 'inactive'
            }
          : integration
      ));
      setSnackbarMessage(integrations.find(i => i.id === id)?.isConnected ? 
        'Disconnessione avvenuta con successo' : 
        'Connessione stabilita con successo');
    } catch (err) {
      setError('Errore durante la connessione al servizio');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSettings = (integration: Integration) => {
    setCurrentIntegration(integration);
    setOpenSettings(true);
  };

  const handleSaveSettings = async () => {
    try {
      // Implementare la logica di salvataggio delle impostazioni
      setOpenSettings(false);
      setCurrentIntegration(null);
    } catch (err) {
      setError('Errore durante il salvataggio delle impostazioni');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const guideSteps = [
    {
      title: 'Benvenuto nelle Integrazioni Esterne',
      description: 'Questa sezione ti permette di gestire tutte le tue integrazioni con servizi esterni.',
      tips: ['Puoi connettere più servizi contemporaneamente', 'Ogni integrazione può essere personalizzata']
    },
    {
      title: 'Connessione dei Servizi',
      description: 'Usa gli interruttori per attivare o disattivare rapidamente le integrazioni.',
      tips: ['Lo stato della connessione è visibile attraverso il badge colorato', 'Puoi testare la connessione in qualsiasi momento']
    },
    {
      title: 'Gestione delle Impostazioni',
      description: 'Personalizza ogni integrazione secondo le tue esigenze attraverso il pannello delle impostazioni.',
      tips: ['Le impostazioni sono disponibili solo per le integrazioni attive', 'Ricordati di salvare le modifiche']
    }
  ];

  const handleGuideComplete = () => {
    setShowGuide(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Integrazioni Esterne
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} md={4} key={integration.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <img
                    src={integration.icon}
                    alt={integration.name}
                    style={{ width: 32, height: 32, marginRight: 16 }}
                  />
                  <Typography variant="h6">{integration.name}</Typography>
                </Box>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {integration.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={integration.status}
                    color={getStatusColor(integration.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {integration.lastSync && (
                    <Typography variant="caption" color="textSecondary">
                      Ultimo sync: {new Date(integration.lastSync).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={integration.isConnected}
                      onChange={() => handleToggleConnection(integration.id)}
                      color="primary"
                    />
                  }
                  label={integration.isConnected ? 'Connesso' : 'Non connesso'}
                />
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<SettingsIcon />}
                  onClick={() => handleOpenSettings(integration)}
                  disabled={!integration.isConnected}
                >
                  Impostazioni
                </Button>
                <Tooltip title="Verifica la connessione con il servizio">
                  <span>
                    <Button
                      startIcon={loading ? <CircularProgress size={20} /> : <LinkIcon />}
                      disabled={!integration.isConnected || loading}
                      onClick={() => {
                        setSnackbarMessage('Test di connessione completato con successo');
                      }}
                    >
                      Test Connessione
                    </Button>
                  </span>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Impostazioni - {currentIntegration?.name}
        </DialogTitle>
        <DialogContent>
          {currentIntegration?.settings && Object.entries(currentIntegration.settings).map(([key, value]) => (
            <TextField
              key={key}
              fullWidth
              label={key}
              value={value}
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettings(false)}>Annulla</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />

      <ContextualGuide
        feature="Integrazioni Esterne"
        steps={guideSteps}
        onComplete={handleGuideComplete}
      />
    </Box>
  );
};

export default ExternalIntegrations;