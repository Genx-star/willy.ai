import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface SocialAccount {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  name: string;
  connected: boolean;
  lastSync: Date;
  metrics: {
    followers: number;
    engagement: number;
    posts: number;
  };
}

interface PostSchedule {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'published' | 'failed';
}

const SocialIntegrations: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [schedules, setSchedules] = useState<PostSchedule[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    // Simulazione del caricamento degli account social
    loadSocialAccounts();
    loadScheduledPosts();
  }, []);

  const loadSocialAccounts = () => {
    setAccounts([
      {
        id: '1',
        platform: 'facebook',
        name: 'WILLY.AI Official',
        connected: true,
        lastSync: new Date(),
        metrics: {
          followers: 5000,
          engagement: 3.2,
          posts: 150,
        },
      },
      {
        id: '2',
        platform: 'twitter',
        name: '@willyai',
        connected: true,
        lastSync: new Date(),
        metrics: {
          followers: 2500,
          engagement: 2.8,
          posts: 300,
        },
      },
    ]);
  };

  const loadScheduledPosts = () => {
    setSchedules([
      {
        id: '1',
        content: 'Scopri le nuove funzionalità di WILLY.AI!',
        platforms: ['facebook', 'twitter'],
        scheduledDate: new Date(Date.now() + 86400000),
        status: 'scheduled',
      },
    ]);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <FacebookIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      default:
        return <ShareIcon />;
    }
  };

  const handleConnect = (platform: string) => {
    // Implementare la logica di connessione
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSchedulePost = (event: React.FormEvent) => {
    event.preventDefault();
    setOpenDialog(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {showAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Operazione completata con successo
        </Alert>
      )}

      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShareIcon color="primary" />
        Integrazioni Social
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Collegati
            </Typography>

            <List>
              {accounts.map((account) => (
                <ListItem key={account.id}>
                  <ListItemAvatar>
                    <Avatar>{getPlatformIcon(account.platform)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={account.name}
                    secondary={
                      <>
                        {`${account.metrics.followers} follower • ${account.metrics.engagement}% engagement`}
                        <br />
                        {`Ultimo aggiornamento: ${account.lastSync.toLocaleString()}`}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Modifica">
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ mt: 2 }}
            >
              Collega Nuovo Account
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Post Programmati
            </Typography>

            <List>
              {schedules.map((schedule) => (
                <ListItem key={schedule.id}>
                  <ListItemText
                    primary={schedule.content}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Programmato per: {schedule.scheduledDate.toLocaleString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {schedule.platforms.map((platform) => (
                            <Chip
                              key={platform}
                              icon={getPlatformIcon(platform)}
                              label={platform}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Elimina">
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ mt: 2 }}
            >
              Programma Nuovo Post
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Programma Nuovo Post</DialogTitle>
        <form onSubmit={handleSchedulePost}>
          <DialogContent>
            <TextField
              fullWidth
              label="Contenuto del post"
              multiline
              rows={4}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Data e ora di pubblicazione"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annulla</Button>
            <Button type="submit" variant="contained">
              Programma
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SocialIntegrations;