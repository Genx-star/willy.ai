import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MemoryIcon from '@mui/icons-material/Memory';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import BiotechIcon from '@mui/icons-material/Biotech';

interface LearningMetrics {
  accuracy: number;
  confidence: number;
  learningRate: number;
  dataProcessed: number;
  modelVersion: string;
}

interface FeedbackData {
  id: string;
  content: string;
  timestamp: Date;
  processed: boolean;
}

const AILearningManager = () => {
  const [metrics, setMetrics] = useState<LearningMetrics>({
    accuracy: 0.85,
    confidence: 0.78,
    learningRate: 0.001,
    dataProcessed: 1000,
    modelVersion: '1.0.0'
  });

  const [feedbackQueue, setFeedbackQueue] = useState<FeedbackData[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulazione dell'aggiornamento continuo delle metriche
    const updateInterval = setInterval(async () => {
      try {
        await updateMetrics();
      } catch (error) {
        console.error('Errore durante l\'aggiornamento delle metriche:', error);
      }
    }, 5000);

    return () => clearInterval(updateInterval);
  }, []);

  const updateMetrics = async () => {
    try {
      // Qui implementeremo la chiamata all'API per ottenere le metriche aggiornate
      // Per ora simuliamo un aggiornamento
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        accuracy: Math.min(0.99, prevMetrics.accuracy + 0.01),
        confidence: Math.min(0.99, prevMetrics.confidence + 0.005),
        dataProcessed: prevMetrics.dataProcessed + 100
      }));
      setLastUpdateTime(new Date());
    } catch (error) {
      setError('Errore durante l\'aggiornamento delle metriche');
    }
  };

  const startLearning = async () => {
    setIsLearning(true);
    setError(null);
    try {
      // Qui implementeremo la logica per avviare il processo di apprendimento
      await processFeedbackQueue();
    } catch (error) {
      setError('Errore durante l\'avvio del processo di apprendimento');
    } finally {
      setIsLearning(false);
    }
  };

  const processFeedbackQueue = async () => {
    // Simulazione del processing del feedback
    const processedQueue = feedbackQueue.map(feedback => ({
      ...feedback,
      processed: true
    }));
    setFeedbackQueue(processedQueue);
  };

  const addFeedback = (content: string) => {
    const newFeedback: FeedbackData = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      processed: false
    };
    setFeedbackQueue([...feedbackQueue, newFeedback]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoFixHighIcon color="primary" />
        Gestione Apprendimento AI
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Metriche di Apprendimento
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DataUsageIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Accuratezza"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress
                        variant="determinate"
                        value={metrics.accuracy * 100}
                        size={24}
                      />
                      {`${(metrics.accuracy * 100).toFixed(1)}%`}
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Confidenza"
                  secondary={`${(metrics.confidence * 100).toFixed(1)}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MemoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Dati Processati"
                  secondary={metrics.dataProcessed.toLocaleString()}
                />
              </ListItem>
            </List>

            {lastUpdateTime && (
              <Typography variant="caption" color="textSecondary">
                Ultimo aggiornamento: {lastUpdateTime.toLocaleString()}
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Feedback e Apprendimento
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Aggiungi Feedback"
                multiline
                rows={2}
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    if (target.value.trim()) {
                      addFeedback(target.value.trim());
                      target.value = '';
                    }
                  }
                }}
              />
            </Box>

            <List>
              {feedbackQueue.map((feedback) => (
                <ListItem key={feedback.id}>
                  <ListItemIcon>
                    <BiotechIcon color={feedback.processed ? 'success' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={feedback.content}
                    secondary={feedback.timestamp.toLocaleString()}
                  />
                  <Chip
                    label={feedback.processed ? 'Processato' : 'In Coda'}
                    color={feedback.processed ? 'success' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<UpdateIcon />}
                onClick={startLearning}
                disabled={isLearning || feedbackQueue.length === 0}
              >
                {isLearning ? 'Apprendimento in corso...' : 'Avvia Apprendimento'}
              </Button>

              {isLearning && <CircularProgress size={24} />}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default AILearningManager;