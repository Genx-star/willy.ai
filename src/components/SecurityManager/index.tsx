import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  encryptionEnabled: boolean;
  passwordPolicy: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
}

const SecurityManager: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    encryptionEnabled: true,
    passwordPolicy: {
      minLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
    },
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Simulazione del caricamento delle impostazioni
    loadSecuritySettings();
    loadAuditLog();
  }, []);

  const loadSecuritySettings = () => {
    // Qui implementeremo il caricamento delle impostazioni dal backend
  };

  const loadAuditLog = () => {
    // Simulazione di voci del registro di audit
    setAuditLog([
      {
        id: '1',
        timestamp: new Date(),
        action: 'Login',
        user: 'admin@willy.ai',
        details: 'Accesso effettuato con successo',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000),
        action: 'Modifica Impostazioni',
        user: 'admin@willy.ai',
        details: 'Attivata autenticazione a due fattori',
      },
    ]);
  };

  const handleSettingChange = (setting: keyof SecuritySettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
    // Qui implementeremo il salvataggio delle impostazioni
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handlePasswordPolicyChange = () => {
    setOpenDialog(true);
  };

  const handleSavePasswordPolicy = (event: React.FormEvent) => {
    event.preventDefault();
    setOpenDialog(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {showAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Impostazioni di sicurezza aggiornate con successo
        </Alert>
      )}

      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecurityIcon color="primary" />
        Gestione Sicurezza
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Impostazioni di Sicurezza
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                />
              }
              label="Autenticazione a Due Fattori"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.encryptionEnabled}
                  onChange={(e) => handleSettingChange('encryptionEnabled', e.target.checked)}
                />
              }
              label="Crittografia End-to-End"
            />

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<VpnKeyIcon />}
                onClick={handlePasswordPolicyChange}
              >
                Configura Policy Password
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon />
              Registro Attività
            </Typography>

            <List>
              {auditLog.map((entry) => (
                <ListItem key={entry.id}>
                  <ListItemText
                    primary={entry.action}
                    secondary={
                      <>
                        {entry.user} - {entry.timestamp.toLocaleString()}
                        <br />
                        {entry.details}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Elimina voce">
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configura Policy Password</DialogTitle>
        <form onSubmit={handleSavePasswordPolicy}>
          <DialogContent>
            <TextField
              fullWidth
              type="number"
              label="Lunghezza minima password"
              value={settings.passwordPolicy.minLength}
              margin="normal"
              InputProps={{ inputProps: { min: 8 } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordPolicy.requireSpecialChars}
                />
              }
              label="Richiedi caratteri speciali"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordPolicy.requireNumbers}
                />
              }
              label="Richiedi numeri"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordPolicy.requireUppercase}
                />
              }
              label="Richiedi maiuscole"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annulla</Button>
            <Button type="submit" variant="contained">
              Salva
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SecurityManager;