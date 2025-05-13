import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon, // Aggiunto ListItemIcon
  ListItemSecondaryAction,
  IconButton,
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
  Tabs,
  Tab,
  Chip,
  Switch,
  Tooltip,
  Alert,
  // CircularProgress, // Rimosso TS6133
  // LinearProgress, // Rimosso TS6133
  // Badge, // Rimosso TS6133
  // Divider // Rimosso perché non utilizzato come segnalato dalla build
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Uno dei due EditIcon importati è ridondante
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ContentManageIcon from "@mui/icons-material/Article";
// import NotificationsIcon from "@mui/icons-material/Notifications"; // Rimosso TS6133 perché non utilizzato
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import StorageIcon from "@mui/icons-material/Storage";
import BackupIcon from "@mui/icons-material/Backup";
import RestoreIcon from "@mui/icons-material/Restore";
// import WarningIcon from "@mui/icons-material/Warning"; // Rimosso TS6133
import TimelineIcon from "@mui/icons-material/Timeline";
// Rimosso l'import duplicato di EditIcon
import HelpIcon from "@mui/icons-material/Help";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShareIcon from "@mui/icons-material/Share";
import { useTranslation } from "react-i18next";
// import { ChatAssistant } from "../../components/ChatAssistant"; // Rimosso TS6133
import PresentationManager from "../../components/PresentationManager";
import SocialMediaManager from "../../components/SocialMediaManager";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "suspended" | "pending";
  lastLogin: string;
}

interface StoragePlan {
  id: string;
  name: string;
  size: number; // in GB
  price: number; // prezzo mensile in EUR
  isActive: boolean;
}

interface SystemSettings {
  maintenanceMode: boolean;
  debugMode: boolean;
  aiAssistance: boolean;
  autoModeration: boolean;
  userRegistration: boolean;
  emailNotifications: boolean;
  aiEditingEnabled: boolean;
  aiSuggestions: boolean;
  competitorAnalysis: boolean;
  trendAnalysis: boolean;
  autoImplementation: boolean;
  liveChatEnabled: boolean;
  storagePlans: StoragePlan[];
  storageNotificationThreshold: number; // percentuale di utilizzo che attiva le notifiche
  autoSuggestUpgrade: boolean; // suggerimento automatico upgrade piano
}

interface SystemResources {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  activeUsers: number;
  lastBackup: string;
  projectStorage: {
    total: number;
    used: number;
    projects: number;
  };
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  source: string;
}

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string;
}

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Admin User", email: "admin@example.com", role: "admin", status: "active", lastLogin: "2024-01-20" },
    { id: "2", name: "Moderator", email: "mod@example.com", role: "moderator", status: "active", lastLogin: "2024-01-19" },
    { id: "3", name: "Regular User", email: "user@example.com", role: "user", status: "active", lastLogin: "2024-01-18" }
  ]);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    debugMode: false,
    aiAssistance: true,
    autoModeration: true,
    userRegistration: true,
    emailNotifications: true,
    aiEditingEnabled: true,
    aiSuggestions: true,
    competitorAnalysis: true,
    trendAnalysis: true,
    autoImplementation: false,
    liveChatEnabled: true,
    storageNotificationThreshold: 80, // notifica quando l'utilizzo supera l'80%
    autoSuggestUpgrade: true,
    storagePlans: [
      { id: "1", name: "Base", size: 50, price: 5, isActive: true },
      { id: "2", name: "Pro", size: 100, price: 8, isActive: true },
      { id: "3", name: "Business", size: 500, price: 25, isActive: true },
      { id: "4", name: "Enterprise", size: 1000, price: 45, isActive: true }
    ]
  });

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const [isLoading, setIsLoading] = useState(false); // Rimosso TS6133 (setIsLoading non era usato)

  const [systemResources, setSystemResources] = useState<SystemResources>({
    cpuUsage: 45,
    memoryUsage: 60,
    diskSpace: 75,
    activeUsers: 120,
    lastBackup: "2024-01-20 15:30",
    projectStorage: {
      total: 1000, // GB
      used: 350,  // GB
      projects: 125
    }
  });

  const [supportTickets, _setSupportTickets] = useState<SupportTicket[]>([
    {
      id: "1",
      userId: "3",
      userName: "Regular User",
      subject: "Problema con il caricamento dei contenuti",
      description: "Non riesco a caricare nuovi contenuti sulla piattaforma",
      status: "open",
      priority: "high",
      category: "Tecnico",
      createdAt: "2024-01-20 10:30",
      lastUpdated: "2024-01-20 10:30"
    },
    {
      id: "2",
      userId: "2",
      userName: "Moderator",
      subject: "Richiesta di nuove funzionalità",
      description: "Vorrei suggerire l'implementazione di nuove funzionalità per l'analisi dei dati",
      status: "in-progress",
      priority: "medium",
      category: "Suggerimento",
      createdAt: "2024-01-19 15:45",
      lastUpdated: "2024-01-20 09:15",
      assignedTo: "Admin User"
    }
  ]);

  const [systemLogs, _setSystemLogs] = useState<SystemLog[]>([
    {
      id: "1",
      timestamp: "2024-01-20 16:45",
      level: "info",
      message: "Backup automatico completato con successo",
      source: "Sistema di Backup"
    },
    {
      id: "2",
      timestamp: "2024-01-20 16:30",
      level: "warning",
      message: "Utilizzo della CPU superiore al 80%",
      source: "Monitoraggio Risorse"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulazione aggiornamento risorse di sistema
      setSystemResources(prev => ({
        ...prev,
        cpuUsage: Math.min(100, prev.cpuUsage + Math.random() * 10 - 5),
        memoryUsage: Math.min(100, prev.memoryUsage + Math.random() * 10 - 5),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUserAction = (user: User, action: "edit" | "delete") => {
    if (action === "edit") {
      setSelectedUser(user);
      setIsUserDialogOpen(true);
    } else if (action === "delete") {
      // Implementare la logica di eliminazione
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleSettingChange = (setting: keyof SystemSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveUser = () => {
    // Implementare la logica di salvataggio
    setIsUserDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <SecurityIcon color="primary" />
        {t("adminDashboard.title")}
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<PersonAddIcon />} label="Gestione Utenti" />
          <Tab icon={<SettingsIcon />} label="Impostazioni Sistema" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<ContentManageIcon />} label="Gestione Contenuti" />
          <Tab icon={<StorageIcon />} label="Risorse Sistema" />
          <Tab icon={<BackupIcon />} label="Backup e Ripristino" />
          <Tab icon={<EditIcon />} label="Modifiche AI" />
          <Tab icon={<AutoFixHighIcon />} label="Presentazioni AI" />
          <Tab icon={<ShareIcon />} label="Social Media AI" />
          <Tab icon={<HelpIcon />} label="Supporto Utenti" />
        </Tabs>
      </Paper>

      {/* Pannello Gestione Utenti */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Gestione Utenti</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setIsUserDialogOpen(true)}
            >
              Nuovo Utente
            </Button>
          </Box>

          <List>
            {users.map((user) => (
              <ListItem key={user.id} component={Paper} sx={{ mb: 2, p: 2 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {user.name}
                      <Chip
                        label={user.role}
                        color={user.role === "admin" ? "error" : user.role === "moderator" ? "warning" : "default"}
                        size="small"
                      />
                      <Chip
                        label={user.status}
                        color={user.status === "active" ? "success" : user.status === "suspended" ? "error" : "warning"}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={`Email: ${user.email} | Ultimo accesso: ${user.lastLogin}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleUserAction(user, "edit")}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleUserAction(user, "delete")}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Pannello Impostazioni Sistema */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon color="primary" />
                  Pacchetti Storage
                </Typography>
                <List>
                  {systemSettings.storagePlans.map((plan) => (
                    <ListItem key={plan.id}>
                      <ListItemText
                        primary={`${plan.name} - ${plan.size}GB`}
                        secondary={`€${plan.price}/mese`}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={plan.isActive}
                          onChange={() => {
                            setSystemSettings(prev => ({
                              ...prev,
                              storagePlans: prev.storagePlans.map(p =>
                                p.id === plan.id ? { ...p, isActive: !p.isActive } : p
                              )
                            }));
                          }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Impostazioni Generali
                </Typography>
                <List>
                  {Object.entries(systemSettings).filter(([key]) => key !== 'storagePlans').map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={t(`adminDashboard.settings.${key}`)}
                        secondary={t(`adminDashboard.settings.${key}Description`)}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={value as boolean} // Cast to boolean as value can be array
                          onChange={() => handleSettingChange(key as keyof SystemSettings)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assistenza AI
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  L'assistenza AI è attiva e sta monitorando il sistema
                </Alert>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AutoFixHighIcon color="primary" />
                  <Typography>Suggerimenti AI attivi</Typography>
                </Box>
                 {/* Qui potresti voler usare ChatAssistant se fosse necessario */}
                 {/* <ChatAssistant /> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Pannello Presentazioni AI */}
      {activeTab === 7 && (
        <Box>
          <PresentationManager />
        </Box>
      )}

      {/* Pannello Social Media AI */}
      {activeTab === 8 && (
        <Box>
          <SocialMediaManager />
        </Box>
      )}

      {/* Pannello Analytics */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistiche Utenti
                </Typography>
                {/* Implementare grafici e statistiche */}
                <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="textSecondary">Grafici in fase di caricamento...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance del Sistema
                </Typography>
                {/* Implementare metriche di performance */}
                <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="textSecondary">Metriche in fase di caricamento...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Pannello Risorse Sistema */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon color="primary" />
                  Utilizzo Risorse
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Utilizzo CPU" secondary={`${systemResources.cpuUsage.toFixed(1)}%`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Utilizzo Memoria" secondary={`${systemResources.memoryUsage.toFixed(1)}%`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Spazio Disco Utilizzato" secondary={`${systemResources.diskSpace.toFixed(1)}%`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Utenti Attivi" secondary={systemResources.activeUsers} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BackupIcon color="primary" />
                  Backup e Ripristino
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Ultimo backup: {systemResources.lastBackup}
                </Typography>
                <Button variant="contained" startIcon={<BackupIcon />} sx={{ mr: 1 }}>
                  Esegui Backup Ora
                </Button>
                <Button variant="outlined" startIcon={<RestoreIcon />}>
                  Ripristina da Backup
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TimelineIcon color="primary" />
                  Log di Sistema
                </Typography>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {systemLogs.map((log) => (
                    <ListItem key={log.id} divider>
                      <ListItemText
                        primary={log.message}
                        secondary={`${log.timestamp} - ${log.source}`}
                      />
                      <Chip label={log.level} color={log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'info'} size="small" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Pannello Supporto Utenti */}
      {activeTab === 9 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SupportAgentIcon color="primary" />
                  Ticket di Supporto
                </Typography>
                <List>
                  {supportTickets.map((ticket) => (
                    <ListItem key={ticket.id} divider>
                      <ListItemIcon>
                        {ticket.priority === "high" && <PriorityHighIcon color="error" />}
                        {ticket.priority === "medium" && <HelpIcon color="warning" />}
                        {ticket.priority === "low" && <HelpIcon color="info" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={ticket.subject}
                        secondary={`Utente: ${ticket.userName} - Stato: ${ticket.status} - Creato il: ${ticket.createdAt}`}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Visualizza Dettagli">
                          <IconButton edge="end">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chiudi Ticket">
                          <IconButton edge="end">
                            <CheckCircleIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Dialog per Modifica/Creazione Utente */}
      <Dialog open={isUserDialogOpen} onClose={() => setIsUserDialogOpen(false)}>
        <DialogTitle>{selectedUser ? "Modifica Utente" : "Nuovo Utente"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={selectedUser?.name || ""}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={selectedUser?.email || ""}
          />
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel>Ruolo</InputLabel>
            <Select defaultValue={selectedUser?.role || "user"}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel>Stato</InputLabel>
            <Select defaultValue={selectedUser?.status || "active"}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUserDialogOpen(false)}>Annulla</Button>
          <Button onClick={handleSaveUser}>Salva</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;

