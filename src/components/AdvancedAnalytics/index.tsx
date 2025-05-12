import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

interface AnalyticsData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie';
  data: any;
  lastUpdate: Date;
  refreshInterval: number;
}

interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  value: number;
  trend: number;
  color: string;
}

const AdvancedAnalytics: React.FC = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [charts, setCharts] = useState<AnalyticsData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(refreshData, 60000); // Aggiorna ogni minuto
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    setIsLoading(true);
    // Simulazione del caricamento dei dati
    setTimeout(() => {
      setWidgets([
        {
          id: '1',
          title: 'Utenti Attivi',
          type: 'users',
          value: 1250,
          trend: 15,
          color: '#4CAF50',
        },
        {
          id: '2',
          title: 'Conversioni',
          type: 'conversions',
          value: 85,
          trend: -5,
          color: '#2196F3',
        },
        {
          id: '3',
          title: 'Tempo Medio Sessione',
          type: 'session',
          value: 320,
          trend: 8,
          color: '#FF9800',
        },
        {
          id: '4',
          title: 'Tasso di Rimbalzo',
          type: 'bounce',
          value: 25,
          trend: -12,
          color: '#F44336',
        },
      ]);

      setCharts([
        {
          id: '1',
          title: 'Andamento Utenti',
          type: 'line',
          data: {},
          lastUpdate: new Date(),
          refreshInterval: 300000,
        },
        {
          id: '2',
          title: 'Distribuzione Dispositivi',
          type: 'pie',
          data: {},
          lastUpdate: new Date(),
          refreshInterval: 600000,
        },
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const refreshData = () => {
    // Implementare la logica di aggiornamento dei dati in tempo reale
    loadDashboardData();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddWidget = () => {
    setOpenDialog(true);
  };

  const handleSaveWidget = (event: React.FormEvent) => {
    event.preventDefault();
    setOpenDialog(false);
    // Implementare la logica di salvataggio del widget
  };

  const handleExportData = () => {
    // Implementare la logica di esportazione dei dati
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChartIcon color="primary" />
          Analytics Avanzate
        </Typography>

        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddWidget}
            sx={{ mr: 1 }}
          >
            Aggiungi Widget
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Esporta Dati
          </Button>
        </Box>
      </Box>

      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        {widgets.map((widget) => (
          <Grid item xs={12} sm={6} md={3} key={widget.id}>
            <Card>
              <CardHeader
                action={
                  <IconButton aria-label="impostazioni" onClick={handleMenuClick}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={widget.title}
              />
              <CardContent>
                <Typography variant="h4" sx={{ color: widget.color }}>
                  {widget.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: widget.trend > 0 ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {widget.trend > 0 ? '+' : ''}{widget.trend}% rispetto al periodo precedente
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {charts.map((chart) => (
          <Grid item xs={12} md={6} key={chart.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{chart.title}</Typography>
                <Tooltip title="Aggiorna dati">
                  <IconButton onClick={refreshData}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              {/* Qui implementeremo i grafici con una libreria come recharts o chart.js */}
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {chart.type === 'line' && <TimelineIcon sx={{ fontSize: 100, color: 'action.disabled' }} />}
                {chart.type === 'pie' && <PieChartIcon sx={{ fontSize: 100, color: 'action.disabled' }} />}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Ultimo aggiornamento: {chart.lastUpdate.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Modifica</MenuItem>
        <MenuItem onClick={handleMenuClose}>Elimina</MenuItem>
        <MenuItem onClick={handleMenuClose}>Configura aggiornamenti</MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Aggiungi Nuovo Widget</DialogTitle>
        <form onSubmit={handleSaveWidget}>
          <DialogContent>
            <TextField
              fullWidth
              label="Titolo"
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo di Widget</InputLabel>
              <Select label="Tipo di Widget" required>
                <MenuItem value="counter">Contatore</MenuItem>
                <MenuItem value="chart">Grafico</MenuItem>
                <MenuItem value="list">Lista</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Intervallo di Aggiornamento</InputLabel>
              <Select label="Intervallo di Aggiornamento" required>
                <MenuItem value={60000}>1 minuto</MenuItem>
                <MenuItem value={300000}>5 minuti</MenuItem>
                <MenuItem value={900000}>15 minuti</MenuItem>
                <MenuItem value={3600000}>1 ora</MenuItem>
              </Select>
            </FormControl>
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

export default AdvancedAnalytics;