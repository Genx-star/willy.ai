import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  ListItemIcon
} from '@mui/material';
import PresentationAI from '../PresentationAI';
// import DocumentManager from '../DocumentManager'; // TS6133 Rimosso
import { useTranslation } from 'react-i18next';
// import AddIcon from '@mui/icons-material/Add'; // TS6133 Rimosso
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import UploadIcon from '@mui/icons-material/Upload';
// import TextFieldsIcon from '@mui/icons-material/TextFields'; // TS6133 Rimosso
// import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'; // TS6133 Rimosso
// import AudiotrackIcon from '@mui/icons-material/Audiotrack'; // TS6133 Rimosso
import StyleIcon from '@mui/icons-material/Style';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
// import FolderIcon from '@mui/icons-material/Folder'; // TS6133 Rimosso
// import ThumbUpIcon from '@mui/icons-material/ThumbUp'; // TS6133 Rimosso
// import ShareIcon from '@mui/icons-material/Share'; // TS6133 Rimosso
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { usePresentationStore } from '../../stores/presentationStore';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
}


interface Presentation {
  id: string;
  title: string;
  description: string;
  template: Template;
  slides: Slide[];
  createdAt: Date;
  lastModified: Date;
  status: 'draft' | 'published' | 'archived';
  analytics: {
    views: number;
    likes: number;
    shares: number;
    performance: number;
  };
  aiSuggestions: {
    contentImprovements: string[];
    designSuggestions: string[];
    trendingTopics: string[]; // Armonizzato per coerenza con lo store (presunto)
  };
}

interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'video' | 'chart';
  content: {
    title?: string;
    text?: string;
    media?: string;
    layout?: string;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

const analyzeContentWithAI = async (_content: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    contentImprovements: [
      'Aggiungi più dati statistici',
      'Rafforza la conclusione',
      'Includi casi studio'
    ],
    designSuggestions: [
      'Usa un layout più dinamico',
      'Aggiungi elementi visivi',
      'Ottimizza il contrasto dei colori'
    ],
    trendingTopics: [
      'Innovazione Sostenibile',
      'Digital Transformation',
      'Smart Working'
    ]
  };
};

// const getAISolution = async (_errorMessage: string) => { // TS6133: Rimosso perché non utilizzato
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return {
//     solution: 'Controlla i parametri di input e assicurati che siano validi',
//     confidence: 0.85
//   };
// };

const PresentationManager = () => {
  const { t } = useTranslation();
  const {
    presentations,
    addPresentation,
    setSelectedPresentation,
    setError,
  } = usePresentationStore();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [inputType, setInputType] = useState<'text' | 'video' | 'audio'>('text');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // _isUploading non veniva letto, ma setIsUploading sì. Tolto _ per chiarezza.

  const validateInput = (input: string): ValidationResult => {
    const errors: string[] = [];
    if (input.trim().length < 10) {
      errors.push('Il contenuto deve essere di almeno 10 caratteri');
    }
    if (input.trim().length > 5000) {
      errors.push('Il contenuto non può superare i 5000 caratteri');
    }
    return { isValid: errors.length === 0, errors };
  };

  const handleCreatePresentation = async () => {
    try {
      setIsProcessing(true);
      setIsAnalyzing(true);
      if (setError) setError(null);

      if (!selectedTemplate) {
        throw new Error('Seleziona un template per continuare');
      }

      const validation = validateInput(currentInput);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      const newPresentationData: Presentation = {
        id: Date.now().toString(),
        title: 'Nuova Presentazione',
        description: 'Generata con AI',
        template: selectedTemplate,
        slides: [],
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        analytics: { views: 0, likes: 0, shares: 0, performance: 0 },
        aiSuggestions: { contentImprovements: [], designSuggestions: [], trendingTopics: [] }
      };

      const aiAnalysis = await analyzeContentWithAI(currentInput);
      newPresentationData.aiSuggestions = aiAnalysis;
      // Assicurati che il tipo Presentation nello store accetti aiSuggestions.trendingTopics come TrendingTopicItem[]
      await addPresentation(newPresentationData);

      setNotification({ type: 'success', message: 'Presentazione creata con successo!' });
      setCurrentInput('');
      setSelectedTemplate(null);
    } catch (error) {
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Si è verificato un errore' });
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const handleEditPresentation = (presentationToEdit: Presentation) => {
    try {
      // Assicurati che il tipo Presentation nello store accetti aiSuggestions.trendingTopics come TrendingTopicItem[]
      setSelectedPresentation(presentationToEdit);
      setNotification({ type: 'info', message: 'Modalità modifica attivata' });
    } catch (error) {
      console.error('Errore durante la modifica:', error);
      setNotification({ type: 'error', message: 'Errore durante l\"apertura della modalità modifica' });
    }
  };

  // const handleError = async (error: Error) => { // TS6133: Rimosso perché non utilizzato (getAISolution rimosso)
  //   try {
  //     const aiSolution = await getAISolution(error.message);
  //     setNotification({ type: 'info', message: `Soluzione AI: ${aiSolution.solution}` });
  //   } catch (aiError) {
  //     setNotification({ type: 'error', message: 'Errore durante l\"analisi AI per l\"errore' });
  //   }
  // };

  const handleDeletePresentation = async (presentationId: string) => {
    try {
      const { deletePresentation } = usePresentationStore.getState();
      await deletePresentation(presentationId);
      setNotification({ type: 'success', message: 'Presentazione eliminata con successo' });
    } catch (error) {
      console.error('Errore durante l\"eliminazione:', error);
      setNotification({ type: 'error', message: 'Errore durante l\"eliminazione della presentazione' });
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const templates: Template[] = [
    { id: '1', name: 'Business Professional', category: 'business', thumbnail: 'business-template.svg', description: 'Template professionale per presentazioni aziendali' },
    { id: '2', name: 'Creative Portfolio', category: 'creative', thumbnail: 'creative-template.svg', description: 'Template creativo per portfolio e showcase' },
    { id: '3', name: 'Educational', category: 'education', thumbnail: 'education-template.svg', description: 'Template per contenuti educativi e formativi' }
  ];

  const categories = [
    { id: 'all', name: 'Tutte le Categorie' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creatività' },
    { id: 'education', name: 'Educazione' },
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, overflow: 'hidden' }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoFixHighIcon color="primary" />
        {t('presentationManager.title', 'Gestione Presentazioni')}
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={t('presentationManager.tabs.create', 'Crea Presentazione')} />
        <Tab label={t('presentationManager.tabs.myPresentations', 'Le Mie Presentazioni')} />
        <Tab label={t('presentationManager.tabs.aiAnalysis', 'Analisi AI')} />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('presentationManager.create.contentTitle', 'Contenuto Presentazione')}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('presentationManager.create.inputTypeLabel', 'Tipo di Input')}</InputLabel>
                  <Select value={inputType} label={t('presentationManager.create.inputTypeLabel', 'Tipo di Input')} onChange={(e) => setInputType(e.target.value as 'text' | 'video' | 'audio')}>
                    <MenuItem value="text">{t('presentationManager.create.inputType.text', 'Testo')}</MenuItem>
                    <MenuItem value="video">{t('presentationManager.create.inputType.video', 'Video')}</MenuItem>
                    <MenuItem value="audio">{t('presentationManager.create.inputType.audio', 'Audio')}</MenuItem>
                  </Select>
                </FormControl>
                {inputType === 'text' ? (
                  <TextField fullWidth multiline rows={6} placeholder={t('presentationManager.create.textPlaceholder', 'Inserisci il contenuto della tua presentazione...')} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} sx={{ mb: 2 }} />
                ) : inputType === 'video' ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => setIsUploading(true)} sx={{ mb: 2 }}>
                      {t('presentationManager.create.uploadVideo', 'Carica Video')}
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      {t('presentationManager.create.videoSupport', 'Supporta MP4, MOV, AVI fino a 500MB')}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => setIsUploading(true)} sx={{ mb: 2 }}>
                      {t('presentationManager.create.uploadAudio', 'Carica Audio')}
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      {t('presentationManager.create.audioSupport', 'Supporta MP3, WAV, M4A fino a 100MB')}
                    </Typography>
                  </Box>
                )}
                <Button aria-label={t('presentationManager.create.generateButtonLabel', 'Crea nuova presentazione')} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleCreatePresentation(); } }} variant="contained" fullWidth onClick={handleCreatePresentation} disabled={isProcessing || !currentInput || isUploading} startIcon={isProcessing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}>
                  {isProcessing ? (isAnalyzing ? t('presentationManager.create.analyzingButton', 'Analisi in corso...') : t('presentationManager.create.creatingButton', 'Creazione...')) : t('presentationManager.create.generateButton', 'Genera Presentazione con AI')}
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('presentationManager.create.templateTitle', 'Scegli Template')}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('presentationManager.create.categoryLabel', 'Categoria')}</InputLabel>
                  <Select value={selectedCategory} label={t('presentationManager.create.categoryLabel', 'Categoria')} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{t(`presentationManager.categories.${cat.id}`, cat.name)}</MenuItem>)}
                  </Select>
                </FormControl>
                <Grid container spacing={2}>
                  {templates.filter(t => selectedCategory === 'all' || t.category === selectedCategory).map(template => (
                    <Grid item xs={6} sm={4} md={6} key={template.id}>
                      <Card sx={{ cursor: 'pointer', border: selectedTemplate?.id === template.id ? '2px solid' : '1px solid transparent', borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'transparent', '&:hover': { borderColor: 'grey.400' } }} onClick={() => setSelectedTemplate(template)}>
                        <CardContent>
                          <Typography variant="subtitle1">{t(`presentationManager.templates.${template.id}.name`, template.name)}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t(`presentationManager.templates.${template.id}.description`, template.description)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {activeTab === 1 && (
         <Paper sx={{ p: 3, mt: 0 }}>
            <Typography variant="h6" gutterBottom>
              {t('presentationManager.myPresentations.title', 'Le Tue Presentazioni')}
            </Typography>
            <List>
              {presentations.length === 0 ? (
                <Alert severity="info">
                  {t('presentationManager.myPresentations.noPresentations', 'Non hai ancora creato nessuna presentazione. Usa il form sopra per iniziare.')}
                </Alert>
              ) : (
                presentations.map((p) => (
                  <ListItem key={p.id} sx={{ flexDirection: 'column', alignItems: 'stretch', borderBottom: '1px solid #eee', pb: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <ListItemText
                        primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{p.title}<Chip size="small" label={p.status} color={p.status === 'published' ? 'success' : 'default'} /></Box>}
                        secondary={<><Typography variant="body2" color="text.secondary">{p.description}</Typography><Typography variant="caption" color="text.secondary">{t('presentationManager.myPresentations.createdOn', 'Creata il')}: {new Date(p.createdAt).toLocaleDateString()}</Typography></>}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={t('presentationManager.myPresentations.actions.preview', 'Anteprima')}>
                          <IconButton edge="end" aria-label="preview">
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('presentationManager.myPresentations.actions.edit', 'Modifica')}>
                          <IconButton edge="end" aria-label="edit" onClick={() => handleEditPresentation(p)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('presentationManager.myPresentations.actions.delete', 'Elimina')}>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePresentation(p.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </Box>
                    {p.aiSuggestions && (p.aiSuggestions.contentImprovements.length > 0 || p.aiSuggestions.designSuggestions.length > 0 || p.aiSuggestions.trendingTopics.length > 0) && (
                      <Box sx={{ mt: 2, pl: 2, borderLeft: '3px solid', borderColor: 'primary.light', backgroundColor: 'action.hover', p:1 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {t('presentationManager.myPresentations.aiSuggestionsTitle', 'Suggerimenti AI')}
                        </Typography>
                        <Grid container spacing={2}>
                          {p.aiSuggestions.contentImprovements.length > 0 && <Grid item xs={12} sm={4}><Typography variant="caption" color="text.secondary">{t('presentationManager.myPresentations.contentImprovements', 'Miglioramenti Contenuto:')}</Typography><List dense>{p.aiSuggestions.contentImprovements.map((s, i) => <ListItem key={i}><ListItemIcon sx={{ minWidth: 30 }}><AutoFixHighIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText primary={s} /></ListItem>)}</List></Grid>}
                          {p.aiSuggestions.designSuggestions.length > 0 && <Grid item xs={12} sm={4}><Typography variant="caption" color="text.secondary">{t('presentationManager.myPresentations.designSuggestions', 'Suggerimenti Design:')}</Typography><List dense>{p.aiSuggestions.designSuggestions.map((s, i) => <ListItem key={i}><ListItemIcon sx={{ minWidth: 30 }}><StyleIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText primary={s} /></ListItem>)}</List></Grid>}
                          {p.aiSuggestions.trendingTopics.length > 0 && 
                            <Grid item xs={12} sm={4}>
                              <Typography variant="caption" color="text.secondary">{t('presentationManager.myPresentations.relatedTrends', 'Trend Correlati:')}</Typography>
                              <List dense>
                                {p.aiSuggestions.trendingTopics.map((topic, i) => (
                                  <ListItem key={i}>
                                    <ListItemIcon sx={{ minWidth: 30 }}><TrendingUpIcon fontSize="small" color="primary" /></ListItemIcon>
                                    {/* Accesso a topic.title è corretto se trendingTopics è TrendingTopicItem[] */}
                                    <ListItemText primary={topic} /> 
                                  </ListItem>
                                ))}
                              </List>
                            </Grid>}
                        </Grid>
                      </Box>
                    )}
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
      )}

      {activeTab === 2 && (
        <PresentationAI />
      )}

      {notification && (
        <Alert
          severity={notification.type}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}
    </Box>
  );
};

export default PresentationManager;

