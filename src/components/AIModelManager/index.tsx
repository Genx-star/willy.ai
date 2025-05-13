import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Grid,
  Chip,
  LinearProgress,
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import UpdateIcon from '@mui/icons-material/Update';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';


interface ModelInfo {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'updating' | 'error';
  lastUpdate: Date;
  performance: number;
  size: number;
  capabilities: string[];
}

interface UpdateStatus {
  inProgress: boolean;
  progress: number;
  stage: string;
  error: string | null;
}

const AIModelManager = () => {
  const [models, setModels] = useState<ModelInfo[]>([
    {
      id: '1',
      name: 'WILLY-GPT',
      version: '2.0.0',
      status: 'active',
      lastUpdate: new Date(),
      performance: 0.92,
      size: 2.5,
      capabilities: ['Generazione Testo', 'Analisi Sentimenti', 'Classificazione']
    },
    {
      id: '2',
      name: 'WILLY-Vision',
      version: '1.5.0',
      status: 'active',
      lastUpdate: new Date(Date.now() - 86400000),
      performance: 0.88,
      size: 1.8,
      capabilities: ['Riconoscimento Immagini', 'Segmentazione', 'OCR']
    }
  ]);

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    inProgress: false,
    progress: 0,
    stage: '',
    error: null
  });

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);

  useEffect(() => {
    // Simulazione del monitoraggio continuo dei modelli
    const monitoringInterval = setInterval(async () => {
      try {
        await checkModelsStatus();
      } catch (error) {
        console.error('Errore durante il monitoraggio dei modelli:', error);
      }
    }, 10000);

    return () => clearInterval(monitoringInterval);
  }, []);

  const checkModelsStatus = async () => {
    // Qui implementeremo la logica per verificare lo stato dei modelli
    // Per ora simuliamo un aggiornamento casuale delle performance
    setModels(prevModels =>
      prevModels.map(model => ({
        ...model,
        performance: Math.min(0.99, model.performance + Math.random() * 0.01 - 0.005)
      }))
    );
  };

  const startModelUpdate = async (model: ModelInfo) => {
    setUpdateStatus({
      inProgress: true,
      progress: 0,
      stage: 'Inizializzazione aggiornamento',
      error: null
    });

    try {
      // Simulazione del processo di aggiornamento
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUpdateStatus(prev => ({
          ...prev,
          progress: i,
          stage: getUpdateStage(i)
        }));
      }

      // Aggiornamento completato con successo
      setModels(prevModels =>
        prevModels.map(m =>
          m.id === model.id
            ? {
                ...m,
                version: incrementVersion(m.version),
                lastUpdate: new Date(),
                status: 'active'
              }
            : m
        )
      );

      setUpdateStatus({
        inProgress: false,
        progress: 100,
        stage: 'Aggiornamento completato',
        error: null
      });
    } catch (error) {
      setUpdateStatus(prev => ({
        ...prev,
        inProgress: false,
        error: 'Errore durante l\'aggiornamento del modello'
      }));
    }
  };

  const getUpdateStage = (progress: number): string => {
    if (progress < 20) return 'Download nuovi parametri';
    if (progress < 40) return 'Validazione modello';
    if (progress < 60) return 'Aggiornamento pesi';
    if (progress < 80) return 'Ottimizzazione performance';
    if (progress < 100) return 'Finalizzazione';
    return 'Completato';
  };

  const incrementVersion = (version: string): string => {
    const parts = version.split('.');
    parts[2] = (parseInt(parts[2]) + 1).toString();
    return parts.join('.');
  };

  const handleUpdateClick = (model: ModelInfo) => {
    setSelectedModel(model);
    setShowUpdateDialog(true);
  };

  const confirmUpdate = () => {
    if (selectedModel) {
      startModelUpdate(selectedModel);
      setShowUpdateDialog(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CloudSyncIcon color="primary" />
        Gestione Modelli AI
      </Typography>

      <Grid container spacing={3}>
        {models.map(model => (
          <Grid item xs={12} md={6} key={model.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {model.name} v{model.version}
                </Typography>
                <Chip
                  icon={
                    model.status === 'active' ? (
                      <CheckCircleIcon />
                    ) : model.status === 'updating' ? (
                      <UpdateIcon />
                    ) : (
                      <ErrorIcon />
                    )
                  }
                  label={model.status === 'active' ? 'Attivo' : model.status === 'updating' ? 'Aggiornamento' : 'Errore'}
                  color={model.status === 'active' ? 'success' : model.status === 'updating' ? 'primary' : 'error'}
                />
              </Box>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Performance"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={model.performance * 100}
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography variant="body2">
                          {(model.performance * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Capacità"
                    secondary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {model.capabilities.map((cap, index) => (
                          <Chip key={index} label={cap} size="small" />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  Ultimo aggiornamento: {model.lastUpdate.toLocaleString()}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<UpdateIcon />}
                  onClick={() => handleUpdateClick(model)}
                  disabled={updateStatus.inProgress}
                >
                  Aggiorna Modello
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {updateStatus.inProgress && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Stato Aggiornamento
          </Typography>
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress variant="determinate" value={updateStatus.progress} />
          </Box>
          <Typography variant="body2" color="textSecondary">
            {updateStatus.stage} ({updateStatus.progress}%)
          </Typography>
        </Paper>
      )}

      {updateStatus.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {updateStatus.error}
        </Alert>
      )}

      <Dialog open={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}>
        <DialogTitle>Conferma Aggiornamento</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler aggiornare il modello {selectedModel?.name}?
            Questo processo potrebbe richiedere alcuni minuti.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>Annulla</Button>
          <Button onClick={confirmUpdate} variant="contained" color="primary">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIModelManager;