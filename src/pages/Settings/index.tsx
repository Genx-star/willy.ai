import { useState } from 'react';
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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TikTokIcon from '@mui/icons-material/MusicVideo';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import ChatIcon from '@mui/icons-material/Chat';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CameraIcon from '@mui/icons-material/Camera';
import PublicIcon from '@mui/icons-material/Public';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CompareIcon from '@mui/icons-material/Compare';
import GroupsIcon from '@mui/icons-material/Groups';
import CampaignIcon from '@mui/icons-material/Campaign';
import DeleteIcon from '@mui/icons-material/Delete';
import TargetingIcon from '@mui/icons-material/TrackChanges';
import TimerIcon from '@mui/icons-material/Timer';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { subscriptionPlans } from '../../services/subscription';
import PromoCodeManager from '../../components/PromoCodeManager';



interface SocialAccount {
  id: string;
  platform: 'linkedin' | 'pinterest' | 'tiktok' | 'instagram' | 'facebook' | 'x' | 'youtube' | 'snapchat' | 'threads' | 'whatsapp' | 'bereal' | 'mastodon';
  username: string;
  isActive: boolean;
}

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { currentPlan, subscription, isLoading, error, createSubscription } = useSubscriptionStore();
  const { user, signInWithGoogle, signInWithFacebook, signInWithTwitter, signInWithApple, logout } = useAuthStore();
  
  // Stati per la gestione degli account social
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'linkedin', username: 'account1@linkedin', isActive: true },
    { id: '2', platform: 'linkedin', username: 'account2@linkedin', isActive: false },
    { id: '3', platform: 'pinterest', username: 'account1@pinterest', isActive: true },
    { id: '4', platform: 'tiktok', username: 'account1@tiktok', isActive: true }
  ]);
  
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [newAccountPlatform, setNewAccountPlatform] = useState<'linkedin' | 'pinterest' | 'tiktok' | 'instagram' | 'facebook' | 'x'>('linkedin');
  const [newAccountUsername, setNewAccountUsername] = useState('');
  
  // Altri stati dell'applicazione
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(false);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(false);
  const [abTesting, setAbTesting] = useState(false);
  const [teamCollaboration, setTeamCollaboration] = useState(false);
  const [marketingAutomation, setMarketingAutomation] = useState(false);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(false);
  const [audienceTargeting, setAudienceTargeting] = useState(false);
  const [postTiming, setPostTiming] = useState(false);
  const [performanceTracking, setPerformanceTracking] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false);
  
  // Gestione degli account social
  const handleAddAccount = () => {
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform: newAccountPlatform,
      username: newAccountUsername,
      isActive: true
    };
    setSocialAccounts([...socialAccounts, newAccount]);
    setIsAddAccountDialogOpen(false);
    setNewAccountUsername('');
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

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleUpgrade = async (plan: typeof subscriptionPlans[0]) => {
    if (!plan.stripePriceId) return;
    try {
      await createSubscription('customer_id', plan.stripePriceId);
    } catch (error) {
      console.error('Errore durante l\'upgrade:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {t('settings.title')}
      </Typography>

      {/* Sezione Gestione Codici Promozionali */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <PromoCodeManager />
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Potenzia il Tuo Social Media Marketing
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
              Scegli il piano perfetto per far crescere la tua presenza online
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {subscriptionPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={3} key={plan.id}>
                <Card 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    },
                    ...(plan.id === 'pro-premium' && {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                      borderStyle: 'solid'
                    })
                  }}
                >
                  {plan.id === 'pro-premium' && (
                    <Chip
                      label="Piano Consigliato"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: plan.id === 'pro-premium' ? 'primary.main' : 'inherit' }}>
                      {plan.name}
                    </Typography>
                    {'originalPrice' in plan && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          textDecoration: 'line-through', 
                          color: 'text.secondary',
                          mb: 1
                        }}
                      >
                        {plan.originalPrice}
                      </Typography>
                    )}
                    <Typography variant="h4" component="p" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {plan.price}
                    </Typography>
                    {'discount' in plan && (
                      <Chip
                        label={plan.discount}
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.primary'
                          }}
                        >
                          <AutoFixHighIcon sx={{ mr: 1, color: 'primary.main' }} />
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button 
                      variant={plan.id === 'pro-premium' ? 'contained' : 'outlined'}
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() => handleUpgrade(plan)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 'bold',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      {plan.id === 'free' ? 'Inizia Gratis' : 'Attiva Ora'}
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
                  primary={t('settings.darkMode')}
                  secondary={t('settings.darkModeDesc')}
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
                  primary={t('settings.emailNotifications')}
                  secondary={t('settings.emailNotificationsDesc')}
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
                  primary={t('settings.autoPublish')}
                  secondary={t('settings.autoPublishDesc')}
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
                  primary={t('settings.language')}
                  secondary={t('settings.languageDesc')}
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
                    secondary={account.isActive ? 'Attivo' : 'Inattivo'}
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
              
              {/* Dialog per aggiungere un nuovo account */}
              <Dialog open={isAddAccountDialogOpen} onClose={() => setIsAddAccountDialogOpen(false)}>
                <DialogTitle>Aggiungi Nuovo Account Social</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel>Piattaforma</InputLabel>
                    <Select
                      value={newAccountPlatform}
                      label="Piattaforma"
                      onChange={(e) => setNewAccountPlatform(e.target.value as SocialAccount['platform'])}
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
                      <MenuItem value="whatsapp">WhatsApp Business</MenuItem>
                      <MenuItem value="bereal">BeReal</MenuItem>
                      <MenuItem value="mastodon">Mastodon</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Username"
                    value={newAccountUsername}
                    onChange={(e) => setNewAccountUsername(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsAddAccountDialogOpen(false)}>Annulla</Button>
                  <Button onClick={handleAddAccount} variant="contained" disabled={!newAccountUsername}>
                    Aggiungi
                  </Button>
                </DialogActions>
              </Dialog>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Contenuti"
                  secondary="Visualizza statistiche e metriche dei tuoi contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Contenuti">
                    <IconButton
                      color={showAnalytics ? 'primary' : 'default'}
                      onClick={() => setShowAnalytics(!showAnalytics)}
                    >
                      <BarChartIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Calendario Editoriale"
                  secondary="Pianifica e gestisci i tuoi contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Calendario Editoriale">
                    <IconButton
                      color={showCalendar ? 'primary' : 'default'}
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <CalendarMonthIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Suggerimenti AI Personalizzati"
                  secondary="Ottimizza i contenuti basandoti sul comportamento degli utenti e sul successo precedente"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Suggerimenti AI">
                    <IconButton
                      color={aiSuggestions ? 'primary' : 'default'}
                      onClick={() => setAiSuggestions(!aiSuggestions)}
                    >
                      <AutoFixHighIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Predittiva"
                  secondary="Ottimizza gli orari di pubblicazione basandoti sui dati storici"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Predittiva">
                    <IconButton
                      color={predictiveAnalytics ? 'primary' : 'default'}
                      onClick={() => setPredictiveAnalytics(!predictiveAnalytics)}
                    >
                      <TrendingUpIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="A/B Testing Automatico"
                  secondary="Testa automaticamente diverse varianti dei tuoi contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="A/B Testing">
                    <IconButton
                      color={abTesting ? 'primary' : 'default'}
                      onClick={() => setAbTesting(!abTesting)}
                    >
                      <CompareIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Collaborazione Team"
                  secondary="Lavora in tempo reale con il tuo team sui contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Collaborazione Team">
                    <IconButton
                      color={teamCollaboration ? 'primary' : 'default'}
                      onClick={() => setTeamCollaboration(!teamCollaboration)}
                    >
                      <GroupsIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Automazione Marketing"
                  secondary="Suggerimenti automatici per le campagne marketing"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Automazione Marketing">
                    <IconButton
                      color={marketingAutomation ? 'primary' : 'default'}
                      onClick={() => setMarketingAutomation(!marketingAutomation)}
                    >
                      <Badge color="error" variant="dot" invisible={!marketingAutomation}>
                        <CampaignIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Competitiva"
                  secondary="Monitora e analizza le strategie dei competitor"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Competitiva">
                    <IconButton
                      color={competitorAnalysis ? 'primary' : 'default'}
                      onClick={() => setCompetitorAnalysis(!competitorAnalysis)}
                    >
                      <Badge color="error" variant="dot" invisible={!competitorAnalysis}>
                        <TrendingUpIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Targeting Audience"
                  secondary="Ottimizza il targeting del pubblico basato sui dati"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Targeting Audience">
                    <IconButton
                      color={audienceTargeting ? 'primary' : 'default'}
                      onClick={() => setAudienceTargeting(!audienceTargeting)}
                    >
                      <Badge color="error" variant="dot" invisible={!audienceTargeting}>
                        <TargetingIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Orari Ottimali"
                  secondary="Suggerimenti per gli orari migliori di pubblicazione"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Orari Ottimali">
                    <IconButton
                      color={postTiming ? 'primary' : 'default'}
                      onClick={() => setPostTiming(!postTiming)}
                    >
                      <Badge color="error" variant="dot" invisible={!postTiming}>
                        <TimerIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Monitoraggio Performance"
                  secondary="Traccia e analizza le performance delle campagne"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Monitoraggio Performance">
                    <IconButton
                      color={performanceTracking ? 'primary' : 'default'}
                      onClick={() => setPerformanceTracking(!performanceTracking)}
                    >
                      <Badge color="error" variant="dot" invisible={!performanceTracking}>
                        <MonitorHeartIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Sentiment"
                  secondary="Analizza il sentiment del pubblico verso i contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Sentiment">
                    <IconButton
                      color={sentimentAnalysis ? 'primary' : 'default'}
                      onClick={() => setSentimentAnalysis(!sentimentAnalysis)}
                    >
                      <Badge color="error" variant="dot" invisible={!sentimentAnalysis}>
                        <SentimentVerySatisfiedIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Generazione Batch"
                  secondary="Genera contenuti multipli con un singolo prompt"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Generazione Batch">
                    <IconButton
                      color={batchMode ? 'primary' : 'default'}
                      onClick={() => setBatchMode(!batchMode)}
                    >
                      <BatchPredictionIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            {t('auth.connectedAccounts')}
          </Typography>
          <Paper sx={{ p: 2, mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="social media accounts tabs"
            >
              <Tab label="Base" />
              <Tab label="Social" />
              <Tab label="Avanzate" />
            </Tabs>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Google" 
                  secondary={user?.providerData.some(p => p.providerId === 'google.com') ? t('auth.connected') : t('auth.notConnected')} 
                />
                <Button 
                  size="small" 
                  color={user?.providerData.some(p => p.providerId === 'google.com') ? 'error' : 'primary'}
                  onClick={user?.providerData.some(p => p.providerId === 'google.com') ? logout : signInWithGoogle}
                >
                  {user?.providerData.some(p => p.providerId === 'google.com') ? t('auth.disconnect') : t('auth.connect')}
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Facebook" 
                  secondary={user?.providerData.some(p => p.providerId === 'facebook.com') ? t('auth.connected') : t('auth.notConnected')} 
                />
                <Button 
                  size="small" 
                  color={user?.providerData.some(p => p.providerId === 'facebook.com') ? 'error' : 'primary'}
                  onClick={user?.providerData.some(p => p.providerId === 'facebook.com') ? logout : signInWithFacebook}
                >
                  {user?.providerData.some(p => p.providerId === 'facebook.com') ? t('auth.disconnect') : t('auth.connect')}
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Apple" 
                  secondary={user?.providerData.some(p => p.providerId === 'apple.com') ? t('auth.connected') : t('auth.notConnected')} 
                />
                <Button 
                  size="small" 
                  color={user?.providerData.some(p => p.providerId === 'apple.com') ? 'error' : 'primary'}
                  onClick={user?.providerData.some(p => p.providerId === 'apple.com') ? logout : signInWithApple}
                >
                  {user?.providerData.some(p => p.providerId === 'apple.com') ? t('auth.disconnect') : t('auth.connect')}
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={t('settings.language')}
                  secondary={t('settings.languageDesc')}
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
                    secondary={account.isActive ? 'Attivo' : 'Inattivo'}
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
              
              {/* Dialog per aggiungere un nuovo account */}
              <Dialog open={isAddAccountDialogOpen} onClose={() => setIsAddAccountDialogOpen(false)}>
                <DialogTitle>Aggiungi Nuovo Account Social</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel>Piattaforma</InputLabel>
                    <Select
                      value={newAccountPlatform}
                      label="Piattaforma"
                      onChange={(e) => setNewAccountPlatform(e.target.value as SocialAccount['platform'])}
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
                      <MenuItem value="whatsapp">WhatsApp Business</MenuItem>
                      <MenuItem value="bereal">BeReal</MenuItem>
                      <MenuItem value="mastodon">Mastodon</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Username"
                    value={newAccountUsername}
                    onChange={(e) => setNewAccountUsername(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsAddAccountDialogOpen(false)}>Annulla</Button>
                  <Button onClick={handleAddAccount} variant="contained" disabled={!newAccountUsername}>
                    Aggiungi
                  </Button>
                </DialogActions>
              </Dialog>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Contenuti"
                  secondary="Visualizza statistiche e metriche dei tuoi contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Contenuti">
                    <IconButton
                      color={showAnalytics ? 'primary' : 'default'}
                      onClick={() => setShowAnalytics(!showAnalytics)}
                    >
                      <BarChartIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Calendario Editoriale"
                  secondary="Pianifica e gestisci i tuoi contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Calendario Editoriale">
                    <IconButton
                      color={showCalendar ? 'primary' : 'default'}
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <CalendarMonthIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Suggerimenti AI Personalizzati"
                  secondary="Ottimizza i contenuti basandoti sul comportamento degli utenti e sul successo precedente"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Suggerimenti AI">
                    <IconButton
                      color={aiSuggestions ? 'primary' : 'default'}
                      onClick={() => setAiSuggestions(!aiSuggestions)}
                    >
                      <AutoFixHighIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Predittiva"
                  secondary="Ottimizza gli orari di pubblicazione basandoti sui dati storici"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Predittiva">
                    <IconButton
                      color={predictiveAnalytics ? 'primary' : 'default'}
                      onClick={() => setPredictiveAnalytics(!predictiveAnalytics)}
                    >
                      <TrendingUpIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="A/B Testing Automatico"
                  secondary="Testa automaticamente diverse varianti dei tuoi contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="A/B Testing">
                    <IconButton
                      color={abTesting ? 'primary' : 'default'}
                      onClick={() => setAbTesting(!abTesting)}
                    >
                      <CompareIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Collaborazione Team"
                  secondary="Lavora in tempo reale con il tuo team sui contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Collaborazione Team">
                    <IconButton
                      color={teamCollaboration ? 'primary' : 'default'}
                      onClick={() => setTeamCollaboration(!teamCollaboration)}
                    >
                      <GroupsIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Automazione Marketing"
                  secondary="Suggerimenti automatici per le campagne marketing"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Automazione Marketing">
                    <IconButton
                      color={marketingAutomation ? 'primary' : 'default'}
                      onClick={() => setMarketingAutomation(!marketingAutomation)}
                    >
                      <Badge color="error" variant="dot" invisible={!marketingAutomation}>
                        <CampaignIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Competitiva"
                  secondary="Monitora e analizza le strategie dei competitor"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Competitiva">
                    <IconButton
                      color={competitorAnalysis ? 'primary' : 'default'}
                      onClick={() => setCompetitorAnalysis(!competitorAnalysis)}
                    >
                      <Badge color="error" variant="dot" invisible={!competitorAnalysis}>
                        <TrendingUpIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Targeting Audience"
                  secondary="Ottimizza il targeting del pubblico basato sui dati"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Targeting Audience">
                    <IconButton
                      color={audienceTargeting ? 'primary' : 'default'}
                      onClick={() => setAudienceTargeting(!audienceTargeting)}
                    >
                      <Badge color="error" variant="dot" invisible={!audienceTargeting}>
                        <TargetingIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Orari Ottimali"
                  secondary="Suggerimenti per gli orari migliori di pubblicazione"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Orari Ottimali">
                    <IconButton
                      color={postTiming ? 'primary' : 'default'}
                      onClick={() => setPostTiming(!postTiming)}
                    >
                      <Badge color="error" variant="dot" invisible={!postTiming}>
                        <TimerIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Monitoraggio Performance"
                  secondary="Traccia e analizza le performance delle campagne"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Monitoraggio Performance">
                    <IconButton
                      color={performanceTracking ? 'primary' : 'default'}
                      onClick={() => setPerformanceTracking(!performanceTracking)}
                    >
                      <Badge color="error" variant="dot" invisible={!performanceTracking}>
                        <MonitorHeartIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analisi Sentiment"
                  secondary="Analizza il sentiment del pubblico verso i contenuti"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Analisi Sentiment">
                    <IconButton
                      color={sentimentAnalysis ? 'primary' : 'default'}
                      onClick={() => setSentimentAnalysis(!sentimentAnalysis)}
                    >
                      <Badge color="error" variant="dot" invisible={!sentimentAnalysis}>
                        <SentimentVerySatisfiedIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Generazione Batch"
                  secondary="Genera contenuti multipli con un singolo prompt"
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Generazione Batch">
                    <IconButton
                      color={batchMode ? 'primary' : 'default'}
                      onClick={() => setBatchMode(!batchMode)}
                    >
                      <BatchPredictionIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Subscription Plans
          </Typography>
          <Grid container spacing={3}>
            {isLoading && (
              <Grid item xs={12}>
                <Alert severity="info">Caricamento in corso...</Alert>
              </Grid>
            )}
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            {subscriptionPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={3} key={plan.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  {currentPlan?.id === plan.id && (
                    <Chip
                      label="Piano Attuale"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      gutterBottom
                      sx={{ color: 'primary.main' }}
                    >
                      {plan.price}
                    </Typography>
                    {plan.trialDays > 0 && (
                      <Typography
                        variant="subtitle2"
                        color="success.main"
                        gutterBottom
                      >
                        {plan.trialDays} giorni di prova gratuita
                      </Typography>
                    )}
                    <List dense>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant={currentPlan?.id === plan.id ? 'outlined' : 'contained'}
                      disabled={currentPlan?.id === plan.id || isLoading}
                      onClick={() => handleUpgrade(plan)}
                    >
                      {currentPlan?.id === plan.id ? 'Piano Attuale' : 
                       plan.trialDays > 0 ? `Prova Gratuita di ${plan.trialDays} Giorni` : 'Upgrade'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;