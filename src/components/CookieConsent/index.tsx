import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Link,
  Paper
} from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import SettingsIcon from '@mui/icons-material/Settings';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setOpen(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setOpen(false);
    setShowSnackbar(true);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowSettings(false);
    setOpen(false);
    setShowSnackbar(true);
  };

  const handlePreferenceChange = (name: keyof CookiePreferences) => {
    if (name === 'necessary') return; // I cookie necessari non possono essere disattivati
    setPreferences(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CookieIcon color="primary" />
          Preferenze Cookie
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Utilizziamo i cookie per migliorare la tua esperienza su WILLY.AI. Alcuni cookie sono necessari per il funzionamento del sito, mentre altri ci aiutano a capire come interagisci con esso, a fornire funzionalità social e a personalizzare i contenuti e la pubblicità.
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setShowSettings(true)}
              sx={{ mr: 1 }}
            >
              Personalizza
            </Button>
            <Button
              variant="contained"
              onClick={handleAcceptAll}
            >
              Accetta Tutti
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Impostazioni Cookie</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={preferences.necessary}
                  disabled
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" component="span">
                    Cookie Necessari
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Essenziali per il funzionamento del sito. Non possono essere disattivati.
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={preferences.functional}
                  onChange={() => handlePreferenceChange('functional')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" component="span">
                    Cookie Funzionali
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Permettono funzionalità avanzate e personalizzazione.
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={preferences.analytics}
                  onChange={() => handlePreferenceChange('analytics')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" component="span">
                    Cookie Analitici
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ci aiutano a capire come utilizzi il sito.
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={preferences.marketing}
                  onChange={() => handlePreferenceChange('marketing')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" component="span">
                    Cookie Marketing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Utilizzati per mostrarti pubblicità pertinenti.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Annulla</Button>
          <Button variant="contained" onClick={handleSavePreferences}>
            Salva Preferenze
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          variant="filled"
        >
          Le tue preferenze sui cookie sono state salvate
        </Alert>
      </Snackbar>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: 2,
          boxShadow: 3,
          cursor: 'pointer'
        }}
        onClick={() => setShowSettings(true)}
      >
        <CookieIcon color="primary" />
        <Typography variant="body2">
          Impostazioni Cookie
        </Typography>
      </Paper>
    </>
  );
};

export default CookieConsent;