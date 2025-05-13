import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel, // Aggiunto FormControlLabel
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  // Tooltip, // Rimosso TS6133
  // Badge, // Rimosso TS6133
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
// import LinkedInIcon from "@mui/icons-material/LinkedIn"; // Rimosso TS6133
// import PinterestIcon from "@mui/icons-material/Pinterest"; // Rimosso TS6133
// import TikTokIcon from "@mui/icons-material/MusicVideo"; // Rimosso TS6133
// import InstagramIcon from "@mui/icons-material/Instagram"; // Rimosso TS6133
// import FacebookIcon from "@mui/icons-material/Facebook"; // Rimosso TS6133
// import XIcon from "@mui/icons-material/Twitter"; // Rimosso TS6133
// import YouTubeIcon from "@mui/icons-material/YouTube"; // Rimosso TS6133
// import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront"; // Rimosso TS6133
// import ChatIcon from "@mui/icons-material/Chat"; // Rimosso TS6133
// import WhatsAppIcon from "@mui/icons-material/WhatsApp"; // Rimosso TS6133
// import CameraIcon from "@mui/icons-material/Camera"; // Rimosso TS6133
// import PublicIcon from "@mui/icons-material/Public"; // Rimosso TS6133
// import BarChartIcon from "@mui/icons-material/BarChart"; // Rimosso TS6133
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Rimosso TS6133
// import BatchPredictionIcon from "@mui/icons-material/BatchPrediction"; // Rimosso TS6133
// import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Rimosso TS6133
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
// import CompareIcon from "@mui/icons-material/Compare"; // Rimosso TS6133
// import GroupsIcon from "@mui/icons-material/Groups"; // Rimosso TS6133
// import CampaignIcon from "@mui/icons-material/Campaign"; // Rimosso TS6133
import DeleteIcon from "@mui/icons-material/Delete";
// import TargetingIcon from "@mui/icons-material/TrackChanges"; // Rimosso TS6133
// import TimerIcon from "@mui/icons-material/Timer"; // Rimosso TS6133
// import MonitorHeartIcon from "@mui/icons-material/MonitorHeart"; // Rimosso TS6133
// import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied"; // Rimosso TS6133
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import { useSubscriptionStore } from "../../stores/subscriptionStore";
import { subscriptionPlans } from "../../services/subscription";
import PromoCodeManager from "../../components/PromoCodeManager";

interface SocialAccount {
  id: string;
  platform: "linkedin" | "pinterest" | "tiktok" | "instagram" | "facebook" | "x" | "youtube" | "snapchat" | "threads" | "whatsapp" | "bereal" | "mastodon";
  username: string;
  isActive: boolean;
}

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { /*currentPlan, subscription, isLoading, error,*/ createSubscription } = useSubscriptionStore(); // isLoading, error, currentPlan, subscription non usati
  const { user, /*signInWithGoogle, signInWithFacebook, signInWithTwitter, signInWithApple,*/ logout } = useAuthStore(); // signInWith... non usati
  
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { id: "1", platform: "linkedin", username: "account1@linkedin", isActive: true },
    { id: "2", platform: "linkedin", username: "account2@linkedin", isActive: false },
    { id: "3", platform: "pinterest", username: "account1@pinterest", isActive: true },
    { id: "4", platform: "tiktok", username: "account1@tiktok", isActive: true }
  ]);
  
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [newAccountPlatform, setNewAccountPlatform] = useState<SocialAccount["platform"]>("linkedin");
  const [newAccountUsername, setNewAccountUsername] = useState("");
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  // Le seguenti variabili di stato e le loro funzioni set non sono usate nel codice fornito o le funzioni set non sono chiamate
  // const [showAnalytics, setShowAnalytics] = useState(false); // Rimosso TS6133
  // const [showCalendar, setShowCalendar] = useState(false); // Rimosso TS6133
  // const [batchMode, setBatchMode] = useState(false); // Rimosso TS6133
  const [aiSuggestions, setAiSuggestions] = useState(false); // setAiSuggestions non è usato, ma aiSuggestions sì (in teoria)
  // const [predictiveAnalytics, setPredictiveAnalytics] = useState(false); // Rimosso TS6133
  // const [abTesting, setAbTesting] = useState(false); // Rimosso TS6133
  // const [teamCollaboration, setTeamCollaboration] = useState(false); // Rimosso TS6133
  // const [marketingAutomation, setMarketingAutomation] = useState(false); // Rimosso TS6133
  // const [competitorAnalysis, setCompetitorAnalysis] = useState(false); // Rimosso TS6133
  // const [audienceTargeting, setAudienceTargeting] = useState(false); // Rimosso TS6133
  // const [postTiming, setPostTiming] = useState(false); // Rimosso TS6133
  // const [performanceTracking, setPerformanceTracking] = useState(false); // Rimosso TS6133
  // const [sentimentAnalysis, setSentimentAnalysis] = useState(false); // Rimosso TS6133
  
  const handleAddAccount = () => {
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform: newAccountPlatform,
      username: newAccountUsername,
      isActive: true
    };
    setSocialAccounts([...socialAccounts, newAccount]);
    setIsAddAccountDialogOpen(false);
    setNewAccountUsername("");
  };

  const handleToggleAccount = (accountId: string) => {
    setSocialAccounts(socialAccounts.map(account => 
      account.id === accountId 
        ? { ...account, isActive: !account.isActive }
        : account
    ));
  };

  const handleRemoveAccount = (accountId: string) => {
    setSocialAccounts(socialAccounts.filter(account => account.id !== accountId));
  };

  const handleLanguageChange = (event: any) => { // Cambiato tipo per event per evitare errore TS se target non è HTMLInputElement
    i18n.changeLanguage(event.target.value);
  };

  const handleUpgrade = async (plan: typeof subscriptionPlans[0]) => {
    if (!plan.stripePriceId) return;
    try {
      await createSubscription("customer_id", plan.stripePriceId); // Assumendo che user.id sia customer_id
    } catch (err) {
      console.error("Errore durante l'upgrade:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {t("settings.title")}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <PromoCodeManager />
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
              Potenzia il Tuo Social Media Marketing
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
              Scegli il piano perfetto per far crescere la tua presenza online
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {subscriptionPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={3} key={plan.id}>
                <Card 
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6
                    },
                    ...(plan.id === "pro-premium" && {
                      borderColor: "primary.main",
                      borderWidth: 2,
                      borderStyle: "solid"
                    })
                  }}
                >
                  {plan.id === "pro-premium" && (
                    <Chip
                      label="Piano Consigliato"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontWeight: "bold"
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold", color: plan.id === "pro-premium" ? "primary.main" : "inherit" }}>
                      {plan.name}
                    </Typography>
                    {"originalPrice" in plan && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          textDecoration: "line-through", 
                          color: "text.secondary",
                          mb: 1
                        }}
                      >
                        {(plan as any).originalPrice}
                      </Typography>
                    )}
                    <Typography variant="h4" component="p" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
                      {plan.price}
                    </Typography>
                    {"discount" in plan && (
                      <Chip
                        label={(plan as any).discount}
                        color="error"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    )}
                    <Box sx={{ my: 3 }}>
                      {plan.features.map((feature, index) => (
                        <Typography 
                          key={index} 
                          variant="body1" 
                          sx={{ 
                            py: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.primary"
                          }}
                        >
                          <AutoFixHighIcon sx={{ mr: 1, color: "primary.main" }} />
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, justifyContent: "center" }}>
                    <Button 
                      variant={plan.id === "pro-premium" ? "contained" : "outlined"}
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() => handleUpgrade(plan)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: "bold",
                        "&:hover": {
                          transform: "scale(1.05)"
                        }
                      }}
                    >
                      {plan.id === "free" ? "Inizia Gratis" : "Attiva Ora"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ mb: 4 }}>
            <List>
              <ListItem>
                <ListItemText
                  primary={t("settings.darkMode")}
                  secondary={t("settings.darkModeDesc")}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={t("settings.emailNotifications")}
                  secondary={t("settings.emailNotificationsDesc")}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={t("settings.autoPublish")}
                  secondary={t("settings.autoPublishDesc")}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={autoPublish}
                    onChange={(e) => setAutoPublish(e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={t("settings.language")}
                  secondary={t("settings.languageDesc")}
                />
                <ListItemSecondaryAction>
                  <FormControl size="small">
                    <Select
                      value={i18n.language}
                      onChange={handleLanguageChange}
                      variant="standard"
                    >
                      <MenuItem value="it">Italiano</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Account Social"
                  secondary="Gestisci i tuoi account social per la pubblicazione multipla"
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsAddAccountDialogOpen(true)}
                  >
                    Aggiungi Account
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              {socialAccounts.map((account) => (
                <ListItem key={account.id}>
                  <ListItemText
                    primary={`${account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} - ${account.username}`}
                    secondary={account.isActive ? "Attivo" : "Inattivo"}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={account.isActive}
                      onChange={() => handleToggleAccount(account.id)}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveAccount(account.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              
              <Dialog open={isAddAccountDialogOpen} onClose={() => setIsAddAccountDialogOpen(false)}>
                <DialogTitle>Aggiungi Nuovo Account Social</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel id="platform-select-label">Piattaforma</InputLabel>
                    <Select
                      labelId="platform-select-label"
                      value={newAccountPlatform}
                      label="Piattaforma"
                      onChange={(e) => setNewAccountPlatform(e.target.value as SocialAccount["platform"])}
                    >
                      <MenuItem value="linkedin">LinkedIn</MenuItem>
                      <MenuItem value="pinterest">Pinterest</MenuItem>
                      <MenuItem value="tiktok">TikTok</MenuItem>
                      <MenuItem value="instagram">Instagram</MenuItem>
                      <MenuItem value="facebook">Facebook</MenuItem>
                      <MenuItem value="x">X (Twitter)</MenuItem>
                      <MenuItem value="youtube">YouTube</MenuItem>
                      <MenuItem value="snapchat">Snapchat</MenuItem>
                      <MenuItem value="threads">Threads</MenuItem>
                      <MenuItem value="whatsapp">WhatsApp</MenuItem>
                      <MenuItem value="bereal">BeReal</MenuItem>
                      <MenuItem value="mastodon">Mastodon</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Username/ID Account"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newAccountUsername}
                    onChange={(e) => setNewAccountUsername(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsAddAccountDialogOpen(false)}>Annulla</Button>
                  <Button onClick={handleAddAccount} disabled={!newAccountUsername}>Aggiungi</Button>
                </DialogActions>
              </Dialog>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.account.title")}
            </Typography>
            {user ? (
              <Box>
                <Typography variant="body1">{t("settings.account.loggedInAs")}: {user.email}</Typography>
                <Button variant="outlined" onClick={logout} sx={{ mt: 2 }}>
                  {t("settings.account.logout")}
                </Button>
              </Box>
            ) : (
              <Typography>{t("settings.account.notLoggedIn")}</Typography>
            )}
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.advanced.title")}
            </Typography>
            <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto">
              <Tab label={t("settings.advanced.tabs.general")} />
              <Tab label={t("settings.advanced.tabs.aiFeatures")} />
              <Tab label={t("settings.advanced.tabs.dataPrivacy")} />
            </Tabs>
            {activeTab === 0 && (
              <Box sx={{ pt: 2 }}>
                <FormControlLabel control={<Switch checked={aiSuggestions} onChange={(e) => setAiSuggestions(e.target.checked)} />} label={t("settings.advanced.general.aiSuggestions")} />
                <Typography variant="body2" color="text.secondary" sx={{mb:1}}>{t("settings.advanced.general.aiSuggestionsDesc")}</Typography>
                {/* Aggiungere altre impostazioni generali qui */}
              </Box>
            )}
            {activeTab === 1 && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle1">{t("settings.advanced.aiFeatures.title")}</Typography>
                {/* Aggiungere impostazioni specifiche per le funzionalità AI */}
              </Box>
            )}
            {activeTab === 2 && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle1">{t("settings.advanced.dataPrivacy.title")}</Typography>
                {/* Aggiungere impostazioni relative alla privacy dei dati */}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;

