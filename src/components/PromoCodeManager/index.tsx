import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';

import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import { usePromoStore } from '../../stores/promoStore';
import { subscriptionPlans } from '../../services/subscription';

interface CreatePromoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (planId: string, durationDays: number, maxUses?: number) => void;
}

const CreatePromoDialog = ({ open, onClose, onSubmit }: CreatePromoDialogProps) => {
  const [planId, setPlanId] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [maxUses, setMaxUses] = useState<number | ''>('');

  const handleSubmit = () => {
    onSubmit(planId, durationDays, maxUses ? Number(maxUses) : undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crea Nuovo Codice Promozionale</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Piano Premium</InputLabel>
          <Select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            label="Piano Premium"
          >
            {subscriptionPlans.filter(plan => plan.id !== 'free').map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {plan.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Durata (giorni)"
          type="number"
          value={durationDays}
          onChange={(e) => setDurationDays(Number(e.target.value))}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Numero massimo di utilizzi (opzionale)"
          type="number"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value ? Number(e.target.value) : '')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!planId || durationDays <= 0}>
          Crea
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PromoCodeManager = () => {
  const {
    promoCodes,
    isLoading,
    error,
    createPromoCode,
    getAllPromoCodes,
    deactivatePromoCode
  } = usePromoStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    getAllPromoCodes();
  }, [getAllPromoCodes]);

  const handleCreatePromo = async (planId: string, durationDays: number, maxUses?: number) => {
    try {
      await createPromoCode(planId, durationDays, maxUses);
    } catch (error) {
      console.error('Errore durante la creazione del codice promozionale:', error);
    }
  };

  const handleDeactivate = async (code: string) => {
    try {
      await deactivatePromoCode(code);
    } catch (error) {
      console.error('Errore durante la disattivazione del codice:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Gestione Codici Promozionali</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Nuovo Codice
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Codice</TableCell>
                <TableCell>Piano</TableCell>
                <TableCell>Durata (giorni)</TableCell>
                <TableCell>Utilizzi</TableCell>
                <TableCell>Stato</TableCell>
                <TableCell>Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promoCodes.map((code) => (
                <TableRow key={code.code}>
                  <TableCell>{code.code}</TableCell>
                  <TableCell>
                    {subscriptionPlans.find(plan => plan.id === code.planId)?.name}
                  </TableCell>
                  <TableCell>{code.durationDays}</TableCell>
                  <TableCell>
                    {code.usedBy?.length || 0}
                    {code.maxUses ? ` / ${code.maxUses}` : ''}
                  </TableCell>
                  <TableCell>
                    {code.isActive ? (
                      <Typography color="success.main">Attivo</Typography>
                    ) : (
                      <Typography color="error.main">Disattivato</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {code.isActive && (
                      <Tooltip title="Disattiva codice">
                        <IconButton onClick={() => handleDeactivate(code.code)} color="warning">
                          <BlockIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreatePromoDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreatePromo}
      />
    </Box>
  );
};

export default PromoCodeManager;