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
  CircularProgress,
  LinearProgress,
  Badge,
  Divider
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TikTokIcon from '@mui/icons-material/MusicVideo';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';

interface SocialPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  type: 'text' | 'image' | 'video' | 'audio';
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

interface AnalyticsData {
  platform: string;
  engagement: number;
  reach: number;
  followers: number;
  growth: number;
  roi: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  audienceInsights: {
    demographics: string[];
    interests: string[];
    activeHours: string[];
  };
}

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
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
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
      socialAccounts: -1,
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
      socialAccounts: -1
    }
  ];

  // Funzione per generare contenuti con AI
  const generateContent = async () => {
    setIsGenerating(true);
    try {
      // Simulazione della generazione di contenuti con AI
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newSuggestion: ContentSuggestion = {
        id: Date.now().toString(),
        content: 'Contenuto generato automaticamente dall\'AI...',
        type: 'text',
        platform: 'linkedin',
        confidence: 0.85
      };
      setSuggestions([...suggestions, newSuggestion]);
    } catch (error) {
      console.error('Errore nella generazione del contenuto:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Funzione per pianificare un post
  const schedulePost = (suggestion: ContentSuggestion) => {
    const newPost: SocialPost = {
      id: Date.now().toString(),
      content: suggestion.content,
      platform: suggestion.platform,
      scheduledTime: new Date(Date.now() + 86400000), // Pianifica per domani
      status: 'scheduled'
    };
    setPosts([...posts, newPost]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoFixHighIcon color="primary" />
          {t('socialMediaManager.title', 'Social Media AI Manager')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<MonetizationOnIcon />}
          onClick={() => setShowPlansDialog(true)}
        >
          Piani Premium
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab icon={<ContentPasteIcon />} label={t('socialMediaManager.tabs.content', 'Contenuti')} />
          <Tab icon={<ScheduleIcon />} label={t('socialMediaManager.tabs.schedule', 'Pianificazione')} />
          <Tab icon={<AnalyticsIcon />} label={t('socialMediaManager.tabs.analytics', 'Analytics')} />
        </Tabs>
      </Paper>

      {/* Tab Contenuti */}
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
                    onChange={(e) => setSelectedPlatforms(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="linkedin"><LinkedInIcon sx={{ mr: 1 }} /> LinkedIn</MenuItem>
                    <MenuItem value="instagram"><InstagramIcon sx={{ mr: 1 }} /> Instagram</MenuItem>
                    <MenuItem value="facebook"><FacebookIcon sx={{ mr: 1 }} /> Facebook</MenuItem>
                    <MenuItem value="x"><XIcon sx={{ mr: 1 }} /> X</MenuItem>
                    <MenuItem value="tiktok"><TikTokIcon sx={{ mr: 1 }} /> TikTok</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateContent}
                  disabled={isGenerating}
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
                <List>
                  {suggestions.map((suggestion) => (
                    <ListItem key={suggestion.id}>
                      <ListItemText
                        primary={suggestion.content}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              size="small"
                              label={`${Math.round(suggestion.confidence * 100)}% Confidence`}
                              color={suggestion.confidence > 0.8 ? 'success' : 'warning'}
                            />
                            <Chip size="small" label={suggestion.platform} />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => schedulePost(suggestion)}>
                          <ScheduleIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab Pianificazione */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('socialMediaManager.scheduledPosts', 'Post Pianificati')}
                </Typography>
                <List>
                  {posts.map((post) => (
                    <ListItem key={post.id}>
                      <ListItemText
                        primary={post.content}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              size="small"
                              label={post.status}
                              color={post.status === 'published' ? 'success' : 'default'}
                            />
                            <Typography variant="body2">
                              {new Date(post.scheduledTime).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab Analytics */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              {t('socialMediaManager.analyticsInfo', 'Le metriche vengono aggiornate automaticamente ogni ora')}
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
                        {platform}
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Engagement Rate" secondary="5.2%" />
                          <LinearProgress variant="determinate" value={52} sx={{ width: 100 }} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Crescita Follower" secondary="+2.3%" />
                          <Chip size="small" color="success" label="+2.3%" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Post Performance" secondary="Ottima" />
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

      {/* Dialog Piani Premium */}
      <Dialog
        open={showPlansDialog}
        onClose={() => setShowPlansDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOnIcon color="primary" />
            Piani Premium
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {subscriptionPlans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: plan.isPopular ? 2 : 1,
                    borderColor: plan.isPopular ? 'primary.main' : 'divider'
                  }}
                >
                  {plan.isPopular && (
                    <Chip
                      label="Più Popolare"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 24,
                        px: 1
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      €{plan.price}
                      <Typography variant="caption" color="text.secondary">/mese</Typography>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <List dense>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant={plan.isPopular ? "contained" : "outlined"}
                      color="primary"
                      fullWidth
                    >
                      Seleziona Piano
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlansDialog(false)}>
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialMediaManager;