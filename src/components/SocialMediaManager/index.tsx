import { useState } from 'react';
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
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  // Divider, // Rimosso perché non utilizzato
  ListItemIcon, // Aggiunto per MonetizationOnIcon
  Tooltip, // Importato ma non utilizzato, verrà rimosso o utilizzato
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TikTokIcon from '@mui/icons-material/MusicVideo'; // Assumendo sia l'icona corretta per TikTok
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/Twitter'; // Assumendo sia l'icona corretta per X
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Aggiunto MonetizationOnIcon
import { useTranslation } from 'react-i18next';

interface SocialPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  type: 'text' | 'image' | 'video' | 'audio'; // Aggiunto type qui, se mancava
  performance?: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
    roi?: number;
  };
}

interface ContentSuggestion {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  platform: string;
  confidence: number;
  aiGenerated: boolean;
  targetAudience?: string;
  expectedEngagement?: number;
}

// Rimosso AnalyticsData e setAnalyticsData perché non utilizzati
// interface AnalyticsData {
//   platform: string;
//   engagement: number;
//   reach: number;
//   followers: number;
//   growth: number;
//   roi: number;
//   sentiment: 'positive' | 'neutral' | 'negative';
//   audienceInsights: {
//     demographics: string[];
//     interests: string[];
//     activeHours: string[];
//   };
// }

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  socialAccounts: number;
  isPopular?: boolean;
}

const SocialMediaManager = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  // const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]); // Rimosso perché non utilizzato
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'instagram', 'facebook']);
  const [showPlansDialog, setShowPlansDialog] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'business',
      name: 'Business',
      price: 99,
      features: [
        'Gestione di 5 account social',
        'Contenuti illimitati',
        'Generazione automatica contenuti AI',
        'Pianificazione automatica post',
        'Analytics base',
        'Supporto email prioritario'
      ],
      socialAccounts: 5
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      features: [
        'Account social illimitati',
        'Contenuti illimitati',
        'Generazione avanzata contenuti AI',
        'Pianificazione automatica ottimizzata',
        'Analytics avanzate con previsioni',
        'Gestione campagne pubblicitarie automatizzata',
        'Supporto dedicato 24/7',
        'Personalizzazione AI avanzata'
      ],
      socialAccounts: -1, // -1 per illimitato
      isPopular: true
    },
    {
      id: 'agency',
      name: 'Agency',
      price: 499,
      features: [
        'Gestione multi-cliente',
        'Account social illimitati',
        'Contenuti illimitati',
        'Suite completa strumenti AI',
        'Automazione totale workflow',
        'Analytics premium con reporting',
        'Gestione campagne multi-canale',
        'API personalizzata',
        'Account manager dedicato'
      ],
      socialAccounts: -1 // -1 per illimitato
    }
  ];

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newSuggestion: ContentSuggestion = {
        id: Date.now().toString(),
        content: 'Contenuto generato automaticamente dall\'AI...',
        type: 'text',
        platform: selectedPlatforms.length > 0 ? selectedPlatforms[0] : 'linkedin', // Usa una piattaforma selezionata o un default
        confidence: 0.85,
        aiGenerated: true, // Proprietà mancante aggiunta
      };
      setSuggestions(prevSuggestions => [...prevSuggestions, newSuggestion]);
    } catch (error) {
      console.error('Errore nella generazione del contenuto:', error);
      // Potresti voler mostrare una notifica all'utente qui
    } finally {
      setIsGenerating(false);
    }
  };

  const schedulePost = (suggestion: ContentSuggestion) => {
    const newPost: SocialPost = {
      id: Date.now().toString(),
      content: suggestion.content,
      platform: suggestion.platform,
      scheduledTime: new Date(Date.now() + 86400000), // Pianifica per domani
      status: 'scheduled',
      type: suggestion.type, // Aggiunto il tipo dal suggerimento
    };
    setPosts(prevPosts => [...prevPosts, newPost]);
    // Potresti voler rimuovere il suggerimento dalla lista dopo averlo pianificato
    setSuggestions(prevSuggestions => prevSuggestions.filter(s => s.id !== suggestion.id));
  };

  const handlePlatformChange = (event: any) => {
    const { target: { value } } = event;
    setSelectedPlatforms(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Ridotto gap se troppo spazio */}
          <AutoFixHighIcon color="primary" />
          {t('socialMediaManager.title', 'Social Media AI Manager')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<MonetizationOnIcon />}
          onClick={() => setShowPlansDialog(true)}
        >
          {t('socialMediaManager.premiumPlans', 'Piani Premium')}
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab icon={<ContentPasteIcon />} label={t('socialMediaManager.tabs.content', 'Contenuti')} />
          <Tab icon={<ScheduleIcon />} label={t('socialMediaManager.tabs.schedule', 'Pianificazione')} />
          <Tab icon={<AnalyticsIcon />} label={t('socialMediaManager.tabs.analytics', 'Analytics')} />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('socialMediaManager.generateContent', 'Genera Contenuti')}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('socialMediaManager.selectPlatforms', 'Seleziona Piattaforme')}</InputLabel>
                  <Select
                    multiple
                    value={selectedPlatforms}
                    onChange={handlePlatformChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="linkedin"><ListItemIcon><LinkedInIcon /></ListItemIcon>LinkedIn</MenuItem>
                    <MenuItem value="instagram"><ListItemIcon><InstagramIcon /></ListItemIcon>Instagram</MenuItem>
                    <MenuItem value="facebook"><ListItemIcon><FacebookIcon /></ListItemIcon>Facebook</MenuItem>
                    <MenuItem value="x"><ListItemIcon><XIcon /></ListItemIcon>X</MenuItem>
                    <MenuItem value="tiktok"><ListItemIcon><TikTokIcon /></ListItemIcon>TikTok</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateContent}
                  disabled={isGenerating || selectedPlatforms.length === 0}
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
                >
                  {isGenerating
                    ? t('socialMediaManager.generating', 'Generazione in corso...')
                    : t('socialMediaManager.generate', 'Genera Contenuti AI')}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('socialMediaManager.suggestions', 'Suggerimenti AI')}
                </Typography>
                {suggestions.length === 0 && !isGenerating && (
                    <Alert severity="info">{t('socialMediaManager.noSuggestions', 'Nessun suggerimento disponibile. Prova a generarne qualcuno!')}</Alert>
                )}
                <List>
                  {suggestions.map((suggestion) => (
                    <ListItem key={suggestion.id} divider>
                      <ListItemText
                        primary={suggestion.content}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={`${Math.round(suggestion.confidence * 100)}% Confidence`}
                              color={suggestion.confidence > 0.8 ? 'success' : (suggestion.confidence > 0.6 ? 'warning' : 'error')}
                            />
                            <Chip size="small" label={suggestion.platform} />
                            {suggestion.aiGenerated && <Chip size="small" label="AI Generated" variant="outlined" />}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={t('socialMediaManager.schedulePostTooltip', 'Pianifica questo post')}>
                          <IconButton onClick={() => schedulePost(suggestion)} edge="end">
                            <ScheduleIcon />
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

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('socialMediaManager.scheduledPosts', 'Post Pianificati')}
                </Typography>
                {posts.length === 0 && (
                    <Alert severity="info">{t('socialMediaManager.noScheduledPosts', 'Nessun post pianificato.')}</Alert>
                )}
                <List>
                  {posts.map((post) => (
                    <ListItem key={post.id} divider>
                      <ListItemText
                        primary={post.content}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={post.status}
                              color={post.status === 'published' ? 'success' : (post.status === 'scheduled' ? 'primary' : 'default')}
                            />
                            <Typography variant="body2">
                              {new Date(post.scheduledTime).toLocaleString()}
                            </Typography>
                            <Chip size="small" label={post.platform} />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={t('socialMediaManager.editPostTooltip', 'Modifica Post')}>
                          <IconButton edge="end" aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('socialMediaManager.deletePostTooltip', 'Elimina Post')}>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
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

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              {t('socialMediaManager.analyticsInfo', 'Le metriche vengono aggiornate automaticamente ogni ora. Dati simulati.')}
            </Alert>
            <Grid container spacing={2}>
              {selectedPlatforms.map((platform) => (
                <Grid item xs={12} sm={6} md={4} key={platform}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {platform === 'linkedin' && <LinkedInIcon />}
                        {platform === 'instagram' && <InstagramIcon />}
                        {platform === 'facebook' && <FacebookIcon />}
                        {platform === 'x' && <XIcon />}
                        {platform === 'tiktok' && <TikTokIcon />}
                        {platform.charAt(0).toUpperCase() + platform.slice(1)} {/* Capitalize platform name */}
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary={t('socialMediaManager.analytics.engagementRate', 'Engagement Rate')} secondary="5.2%" />
                          <LinearProgress variant="determinate" value={52} sx={{ width: '50%', ml:1 }} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={t('socialMediaManager.analytics.followerGrowth', 'Crescita Follower')} secondary="+2.3%" />
                          <Chip size="small" color="success" label="+2.3%" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={t('socialMediaManager.analytics.postPerformance', 'Post Performance')} secondary={t('socialMediaManager.analytics.excellent', 'Ottima')} />
                          <Chip size="small" color="success" label="A+" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={showPlansDialog}
        onClose={() => setShowPlansDialog(false)}
        aria-labelledby="subscription-plans-dialog-title"
      >
        <DialogTitle id="subscription-plans-dialog-title">
          {t('socialMediaManager.premiumPlansTitle', 'Scegli il Piano Willy AI Perfetto per Te')}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {t('socialMediaManager.premiumPlansDescription', 'Potenzia la tua strategia social con le funzionalità avanzate dei nostri piani premium. Scegli quello più adatto alle tue esigenze e inizia a crescere!')}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {subscriptionPlans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: plan.isPopular ? '2px solid primary.main' : '1px solid #e0e0e0' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    {plan.isPopular && (
                      <Chip label={t('socialMediaManager.popularPlan', 'Più Popolare')} color="primary" sx={{ mb: 1 }} />
                    )}
                    <Typography variant="h5" component="div" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      ${plan.price}<Typography component="span" variant="subtitle1">/mese</Typography>
                    </Typography>
                    <List dense>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <DialogActions sx={{ justifyContent: 'center', p:2 }}>
                    <Button variant="contained" fullWidth>
                      {t('socialMediaManager.choosePlan', 'Scegli Piano')}
                    </Button>
                  </DialogActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlansDialog(false)}>{t('common.close', 'Chiudi')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialMediaManager;

