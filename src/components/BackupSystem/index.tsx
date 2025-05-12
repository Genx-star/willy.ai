import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';

interface Backup {
  id: string;
  date: string;
  size: string;
  type: 'automatic' | 'manual';
}

const BackupSystem: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    setLoading(true);
    setError(null);
    try {
      // Implementare la logica di backup
      const newBackup: Backup = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        size: '2.5 MB',
        type: 'manual'
      };
      setBackups([newBackup, ...backups]);
    } catch (err) {
      setError('Errore durante la creazione del backup');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (backup: Backup) => {
    setSelectedBackup(backup);
    setOpenDialog(true);
  };

  const confirmRestore = async () => {
    if (!selectedBackup) return;
    setLoading(true);
    setError(null);
    try {
      // Implementare la logica di ripristino
      setOpenDialog(false);
    } catch (err) {
      setError('Errore durante il ripristino del backup');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Implementare la logica di eliminazione
      setBackups(backups.filter(backup => backup.id !== id));
    } catch (err) {
      setError('Errore durante l\'eliminazione del backup');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sistema di Backup</Typography>
        <Button
          variant="contained"
          startIcon={<CloudDownloadIcon />}
          onClick={handleCreateBackup}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Crea Backup'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <List>
          {backups.map((backup) => (
            <ListItem key={backup.id}>
              <ListItemText
                primary={new Date(backup.date).toLocaleString()}
                secondary={
                  <>
                    Dimensione: {backup.size} | Tipo: {backup.type}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="ripristina"
                  onClick={() => handleRestore(backup)}
                  sx={{ mr: 1 }}
                >
                  <RestoreIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="elimina"
                  onClick={() => handleDelete(backup.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Conferma Ripristino</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler ripristinare il backup del{' '}
            {selectedBackup &&
              new Date(selectedBackup.date).toLocaleString()}?
            Questa azione sovrascriverà i dati attuali.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annulla</Button>
          <Button
            onClick={confirmRestore}
            variant="contained"
            color="warning"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Ripristina'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BackupSystem;