import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'draft' | 'completed';
  tags: string[];
}

const CampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  const handleOpenDialog = (campaign?: Campaign) => {
    if (campaign) {
      setCurrentCampaign(campaign);
    } else {
      setCurrentCampaign(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCampaign(null);
  };

  const handleSaveCampaign = (event: React.FormEvent) => {
    event.preventDefault();
    // Implementare la logica di salvataggio
    handleCloseDialog();
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestione Campagne</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuova Campagna
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} lg={4} key={campaign.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {campaign.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {campaign.description}
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                  {campaign.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={campaign.status}
                    color={campaign.status === 'active' ? 'success' : 'default'}
                  />
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(campaign)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentCampaign ? 'Modifica Campagna' : 'Nuova Campagna'}
        </DialogTitle>
        <form onSubmit={handleSaveCampaign}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nome Campagna"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Descrizione"
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Data Inizio"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Data Fine"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annulla</Button>
            <Button type="submit" variant="contained">
              Salva
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CampaignManager;