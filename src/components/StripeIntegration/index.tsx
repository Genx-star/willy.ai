import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';

interface StripeConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
}

interface PaymentEvent {
  id: string;
  type: string;
  amount: number;
  status: string;
  timestamp: Date;
  customer: string;
}

const StripeIntegration: React.FC = () => {
  const [config, setConfig] = useState<StripeConfig>({
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
    testMode: true,
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const handleConfigChange = (field: keyof StripeConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveConfig = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Qui implementeremo il salvataggio della configurazione
      setAlertMessage('Configurazione Stripe salvata con successo');
      setAlertSeverity('success');
      setShowAlert(true);
      // Simulazione del caricamento degli eventi
      loadPaymentEvents();
    } catch (error) {
      setAlertMessage('Errore durante il salvataggio della configurazione');
      setAlertSeverity('error');
      setShowAlert(true);
    }
    setTimeout(() => setShowAlert(false), 3000);
  };

  const loadPaymentEvents = () => {
    // Simulazione degli eventi di pagamento
    const mockEvents: PaymentEvent[] = [
      {
        id: '1',
        type: 'payment_intent.succeeded',
        amount: 29.99,
        status: 'succeeded',
        timestamp: new Date(),
        customer: 'customer@example.com',
      },
      {
        id: '2',
        type: 'subscription.created',
        amount: 99.99,
        status: 'active',
        timestamp: new Date(Date.now() - 3600000),
        customer: 'business@example.com',
      },
    ];
    setEvents(mockEvents);
  };

  return (
    <Box sx={{ p: 3 }}>
      {showAlert && (
        <Alert severity={alertSeverity} sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaymentIcon color="primary" />
        Integrazione Stripe
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Configurazione API
            </Typography>

            <form onSubmit={handleSaveConfig}>
              <TextField
                fullWidth
                label="Chiave Pubblica"
                value={config.publicKey}
                onChange={handleConfigChange('publicKey')}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Chiave Segreta"
                type={showSecretKey ? 'text' : 'password'}
                value={config.secretKey}
                onChange={handleConfigChange('secretKey')}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      edge="end"
                    >
                      {showSecretKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Segreto Webhook"
                type={showWebhookSecret ? 'text' : 'password'}
                value={config.webhookSecret}
                onChange={handleConfigChange('webhookSecret')}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      edge="end"
                    >
                      {showWebhookSecret ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.testMode}
                    onChange={handleConfigChange('testMode')}
                  />
                }
                label="Modalità Test"
              />

              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  Salva Configurazione
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Eventi di Pagamento
            </Typography>

            <List>
              {events.map((event) => (
                <ListItem key={event.id}>
                  <ListItemText
                    primary={`${event.type} - €${event.amount}`}
                    secondary={
                      <>
                        {event.customer}
                        <br />
                        {event.timestamp.toLocaleString()} - {event.status}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Elimina evento">
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StripeIntegration;