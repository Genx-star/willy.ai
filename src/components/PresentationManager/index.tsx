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
import DocumentManager from '../DocumentManager';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import UploadIcon from '@mui/icons-material/Upload';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import StyleIcon from '@mui/icons-material/Style';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FolderIcon from '@mui/icons-material/Folder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { usePresentationStore } from '../../stores/presentationStore';

// Rimuovi l'importazione che causa conflitti e usa solo le definizioni locali
// import { Presentation, Template, Slide } from '../../types/presentation';

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
    trendingTopics: string[];
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
  // Simulazione analisi AI
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

const PresentationManager = () => {
  const { t } = useTranslation();
  const {
    presentations,
    addPresentation,
    setSelectedPresentation,
    setLoading,
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
  const [isUploading, setIsUploading] = useState(false);

  const validateInput = (input: string): ValidationResult => {
    const errors: string[] = [];
    
    if (input.trim().length < 10) {
      errors.push('Il contenuto deve essere di almeno 10 caratteri');
    }
    
    if (input.trim().length > 5000) {
      errors.push('Il contenuto non può superare i 5000 caratteri');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleCreatePresentation = async () => {
    try {
      setIsProcessing(true);
      setIsAnalyzing(true);
      setError(null);
      
      if (!selectedTemplate) {
        throw new Error('Seleziona un template per continuare');
      }
    
      const validation = validateInput(currentInput);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }
      
      const newPresentation: Presentation = {
        id: Date.now().toString(),
        title: 'Nuova Presentazione',
        description: 'Generata con AI',
        template: selectedTemplate,
        slides: [],
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
          performance: 0
        },
        aiSuggestions: {
          contentImprovements: [],
          designSuggestions: [],
          trendingTopics: []
        }
      };

      const aiAnalysis = await analyzeContentWithAI(currentInput);
      newPresentation.aiSuggestions = aiAnalysis;
      await addPresentation(newPresentation);
      
      setNotification({
        type: 'success',
        message: 'Presentazione creata con successo!'
      });
      
      // Reimposta lo stato
      setCurrentInput('');
      setSelectedTemplate(null);
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Si è verificato un errore'
      });
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const handleEditPresentation = (presentation: Presentation) => {
    try {
      setSelectedPresentation(presentation);
      setNotification({
        type: 'info',
        message: 'Modalità modifica attivata'
      });
    } catch (error) {
      console.error('Errore durante la modifica:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'apertura della modalità modifica'
      });
    }
  };

  const handleError = async (error: Error) => {
    try {
      const aiSolution = await getAISolution(error.message);
      setNotification({
        type: 'info',
        message: `Soluzione AI: ${aiSolution.solution}`
      });
    } catch (aiError) {
      setNotification({
        type: 'error',
        message: 'Errore durante l\'analisi AI'
      });
    }
  };

  const handleDeletePresentation = async (presentationId: string) => {
    try {
      const { deletePresentation } = usePresentationStore.getState();
      await deletePresentation(presentationId);
      
      setNotification({
        type: 'success',
        message: 'Presentazione eliminata con successo'
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'eliminazione della presentazione'
      });
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const templates: Template[] = [
    {
      id: '1',
      name: 'Business Professional',
      category: 'business',
      thumbnail: 'business-template.svg',
      description: 'Template professionale per presentazioni aziendali'
    },
    {
      id: '2',
      name: 'Creative Portfolio',
      category: 'creative',
      thumbnail: 'creative-template.svg',
      description: 'Template creativo per portfolio e showcase'
    },
    {
      id: '3',
      name: 'Educational',
      category: 'education',
      thumbnail: 'education-template.svg',
      description: 'Template per contenuti educativi e formativi'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tutte le Categorie' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creatività' },
    { id: 'education', name: 'Educazione' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'technology', name: 'Tecnologia' }
  ];

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        <AutoFixHighIcon color="primary" />
        Gestione Presentazioni
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Crea Presentazione" />
        <Tab label="Le Mie Presentazioni" />
        <Tab label="Analisi AI" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Contenuto Presentazione
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tipo di Input</InputLabel>
                  <Select
                    value={inputType}
                    label="Tipo di Input"
                    onChange={(e) => setInputType(e.target.value as 'text' | 'video' | 'audio')}
                  >
                    <MenuItem value="text">Testo</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                  </Select>
                </FormControl>
                
                {inputType === 'text' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Inserisci il contenuto della tua presentazione..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ) : inputType === 'video' ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Video
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP4, MOV, AVI fino a 500MB
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Audio
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP3, WAV, M4A fino a 100MB
                    </Typography>
                  </Box>
                )}
                
                <Button
                  aria-label="Crea nuova presentazione"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCreatePresentation();
                    }
                  }}
                  variant="contained"
                  fullWidth
                  onClick={handleCreatePresentation}
                  disabled={isProcessing || !currentInput}
                  startIcon={isProcessing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
                >
                  {isProcessing ? (isAnalyzing ? 'Analisi in corso...' : 'Creazione...') : 'Genera Presentazione con AI'}
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Scegli Template
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Categoria"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="all">Tutte le Categorie</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="education">Educazione</MenuItem>
                    <MenuItem value="creative">Creativo</MenuItem>
                  </Select>
                </FormControl>
                
                <Grid container spacing={2}>
                  {templates
                    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                    .map(template => (
                      <Grid item xs={6} key={template.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedTemplate?.id === template.id ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                          }}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardContent>
                            <Typography variant="subtitle1">{template.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {template.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              LeTue Presentazioni
            </Typography>
            <List>
              {presentations.length === 0 ? (
                <Alert severity="info">
                  Non hai ancora creato nessuna presentazione. Usa il form sopra per iniziare.
                </Alert>
              ) : (
                presentations.map((presentation) => (
                  <ListItem key={presentation.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {presentation.title}
                            <Chip 
                              size="small" 
                              label={presentation.status}
                              color={presentation.status === 'published' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {presentation.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Creata il: {presentation.createdAt.toLocaleDateString()}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                              <Chip size="small" icon={<PreviewIcon />} label={`${presentation.analytics.views} visualizzazioni`} />
                              <Chip size="small" icon={<ThumbUpIcon />} label={`${presentation.analytics.likes} likes`} />
                              <Chip size="small" icon={<ShareIcon />} label={`${presentation.analytics.shares} condivisioni`} />
                            </Box>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Anteprima">
                          <IconButton onClick={() => setSelectedPresentation(presentation)}>
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifica">
                          <IconButton onClick={() => handleEditPresentation(presentation)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Elimina">
                          <IconButton onClick={() => {
                            if (window.confirm('Sei sicuro di voler eliminare questa presentazione?')) {
                              handleDeletePresentation(presentation.id);
                            }
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </Box>
                    
                    {presentation.aiSuggestions && (
                      <Box sx={{ mt: 2, pl: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Suggerimenti AI
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Miglioramenti Contenuto:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.contentImprovements.map((suggestion, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <AutoFixHighIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={suggestion} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Suggerimenti Design:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.designSuggestions.map((suggestion, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <StyleIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={suggestion} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Trend Correlati:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.trendingTopics.map((topic, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <TrendingUpIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={topic} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </>
      ) : (
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

const PresentationManager = () => {
  const { t } = useTranslation();
  const {
    presentations,
    addPresentation,
    setSelectedPresentation,
    setLoading,
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
  const [isUploading, setIsUploading] = useState(false);

  const validateInput = (input: string): ValidationResult => {
    const errors: string[] = [];
    
    if (input.trim().length < 10) {
      errors.push('Il contenuto deve essere di almeno 10 caratteri');
    }
    
    if (input.trim().length > 5000) {
      errors.push('Il contenuto non può superare i 5000 caratteri');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleCreatePresentation = async () => {
    try {
      setIsProcessing(true);
      setIsAnalyzing(true);
      setError(null);
      
      if (!selectedTemplate) {
        throw new Error('Seleziona un template per continuare');
      }
    
      const validation = validateInput(currentInput);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }
      
      const newPresentation: Presentation = {
        id: Date.now().toString(),
        title: 'Nuova Presentazione',
        description: 'Generata con AI',
        template: selectedTemplate,
        slides: [],
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
          performance: 0
        },
        aiSuggestions: {
          contentImprovements: [],
          designSuggestions: [],
          trendingTopics: []
        }
      };

      const aiAnalysis = await analyzeContentWithAI(currentInput);
      newPresentation.aiSuggestions = aiAnalysis;
      await addPresentation(newPresentation);
      
      setNotification({
        type: 'success',
        message: 'Presentazione creata con successo!'
      });
      
      // Reimposta lo stato
      setCurrentInput('');
      setSelectedTemplate(null);
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Si è verificato un errore'
      });
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const handleEditPresentation = (presentation: Presentation) => {
    try {
      setSelectedPresentation(presentation);
      setNotification({
        type: 'info',
        message: 'Modalità modifica attivata'
      });
    } catch (error) {
      console.error('Errore durante la modifica:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'apertura della modalità modifica'
      });
    }
  };

  const handleError = async (error: Error) => {
    try {
      const aiSolution = await getAISolution(error.message);
      setNotification({
        type: 'info',
        message: `Soluzione AI: ${aiSolution.solution}`
      });
    } catch (aiError) {
      setNotification({
        type: 'error',
        message: 'Errore durante l\'analisi AI'
      });
    }
  };

  const handleDeletePresentation = async (presentationId: string) => {
    try {
      const { deletePresentation } = usePresentationStore.getState();
      await deletePresentation(presentationId);
      
      setNotification({
        type: 'success',
        message: 'Presentazione eliminata con successo'
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'eliminazione della presentazione'
      });
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const templates: Template[] = [
    {
      id: '1',
      name: 'Business Professional',
      category: 'business',
      thumbnail: 'business-template.svg',
      description: 'Template professionale per presentazioni aziendali'
    },
    {
      id: '2',
      name: 'Creative Portfolio',
      category: 'creative',
      thumbnail: 'creative-template.svg',
      description: 'Template creativo per portfolio e showcase'
    },
    {
      id: '3',
      name: 'Educational',
      category: 'education',
      thumbnail: 'education-template.svg',
      description: 'Template per contenuti educativi e formativi'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tutte le Categorie' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creatività' },
    { id: 'education', name: 'Educazione' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'technology', name: 'Tecnologia' }
  ];

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        <AutoFixHighIcon color="primary" />
        Gestione Presentazioni
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Crea Presentazione" />
        <Tab label="Le Mie Presentazioni" />
        <Tab label="Analisi AI" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Contenuto Presentazione
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tipo di Input</InputLabel>
                  <Select
                    value={inputType}
                    label="Tipo di Input"
                    onChange={(e) => setInputType(e.target.value as 'text' | 'video' | 'audio')}
                  >
                    <MenuItem value="text">Testo</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                  </Select>
                </FormControl>
                
                {inputType === 'text' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Inserisci il contenuto della tua presentazione..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ) : inputType === 'video' ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Video
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP4, MOV, AVI fino a 500MB
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Audio
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP3, WAV, M4A fino a 100MB
                    </Typography>
                  </Box>
                )}
                
                <Button
                  aria-label="Crea nuova presentazione"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCreatePresentation();
                    }
                  }}
                  variant="contained"
                  fullWidth
                  onClick={handleCreatePresentation}
                  disabled={isProcessing || !currentInput}
                  startIcon={isProcessing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
                >
                  {isProcessing ? (isAnalyzing ? 'Analisi in corso...' : 'Creazione...') : 'Genera Presentazione con AI'}
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Scegli Template
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Categoria"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="all">Tutte le Categorie</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="education">Educazione</MenuItem>
                    <MenuItem value="creative">Creativo</MenuItem>
                  </Select>
                </FormControl>
                
                <Grid container spacing={2}>
                  {templates
                    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                    .map(template => (
                      <Grid item xs={6} key={template.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedTemplate?.id === template.id ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                          }}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardContent>
                            <Typography variant="subtitle1">{template.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {template.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              LeTue Presentazioni
            </Typography>
            <List>
              {presentations.length === 0 ? (
                <Alert severity="info">
                  Non hai ancora creato nessuna presentazione. Usa il form sopra per iniziare.
                </Alert>
              ) : (
                presentations.map((presentation) => (
                  <ListItem key={presentation.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {presentation.title}
                            <Chip 
                              size="small" 
                              label={presentation.status}
                              color={presentation.status === 'published' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {presentation.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Creata il: {presentation.createdAt.toLocaleDateString()}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                              <Chip size="small" icon={<PreviewIcon />} label={`${presentation.analytics.views} visualizzazioni`} />
                              <Chip size="small" icon={<ThumbUpIcon />} label={`${presentation.analytics.likes} likes`} />
                              <Chip size="small" icon={<ShareIcon />} label={`${presentation.analytics.shares} condivisioni`} />
                            </Box>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Anteprima">
                          <IconButton onClick={() => setSelectedPresentation(presentation)}>
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifica">
                          <IconButton onClick={() => handleEditPresentation(presentation)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Elimina">
                          <IconButton onClick={() => {
                            if (window.confirm('Sei sicuro di voler eliminare questa presentazione?')) {
                              handleDeletePresentation(presentation.id);
                            }
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </Box>
                    
                    {presentation.aiSuggestions && (
                      <Box sx={{ mt: 2, pl: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Suggerimenti AI
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Miglioramenti Contenuto:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.contentImprovements.map((suggestion, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <AutoFixHighIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={suggestion} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Suggerimenti Design:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.designSuggestions.map((suggestion, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <StyleIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={suggestion} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Trend Correlati:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.trendingTopics.map((topic, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <TrendingUpIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={topic} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </>
      ) : (
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

const PresentationManager = () => {
  const { t } = useTranslation();
  const {
    presentations,
    addPresentation,
    setSelectedPresentation,
    setLoading,
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
  const [isUploading, setIsUploading] = useState(false);

  const validateInput = (input: string): ValidationResult => {
    const errors: string[] = [];
    
    if (input.trim().length < 10) {
      errors.push('Il contenuto deve essere di almeno 10 caratteri');
    }
    
    if (input.trim().length > 5000) {
      errors.push('Il contenuto non può superare i 5000 caratteri');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleCreatePresentation = async () => {
    try {
      setIsProcessing(true);
      setIsAnalyzing(true);
      setError(null);
      
      if (!selectedTemplate) {
        throw new Error('Seleziona un template per continuare');
      }
    
      const validation = validateInput(currentInput);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }
      
      const newPresentation: Presentation = {
        id: Date.now().toString(),
        title: 'Nuova Presentazione',
        description: 'Generata con AI',
        template: selectedTemplate,
        slides: [],
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
          performance: 0
        },
        aiSuggestions: {
          contentImprovements: [],
          designSuggestions: [],
          trendingTopics: []
        }
      };

      const aiAnalysis = await analyzeContentWithAI(currentInput);
      newPresentation.aiSuggestions = aiAnalysis;
      await addPresentation(newPresentation);
      
      setNotification({
        type: 'success',
        message: 'Presentazione creata con successo!'
      });
      
      // Reimposta lo stato
      setCurrentInput('');
      setSelectedTemplate(null);
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Si è verificato un errore'
      });
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const handleEditPresentation = (presentation: Presentation) => {
    try {
      setSelectedPresentation(presentation);
      setNotification({
        type: 'info',
        message: 'Modalità modifica attivata'
      });
    } catch (error) {
      console.error('Errore durante la modifica:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'apertura della modalità modifica'
      });
    }
  };

  const handleError = async (error: Error) => {
    try {
      const aiSolution = await getAISolution(error.message);
      setNotification({
        type: 'info',
        message: `Soluzione AI: ${aiSolution.solution}`
      });
    } catch (aiError) {
      setNotification({
        type: 'error',
        message: 'Errore durante l\'analisi AI'
      });
    }
  };

  const handleDeletePresentation = async (presentationId: string) => {
    try {
      const { deletePresentation } = usePresentationStore.getState();
      await deletePresentation(presentationId);
      
      setNotification({
        type: 'success',
        message: 'Presentazione eliminata con successo'
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'eliminazione della presentazione'
      });
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const templates: Template[] = [
    {
      id: '1',
      name: 'Business Professional',
      category: 'business',
      thumbnail: 'business-template.svg',
      description: 'Template professionale per presentazioni aziendali'
    },
    {
      id: '2',
      name: 'Creative Portfolio',
      category: 'creative',
      thumbnail: 'creative-template.svg',
      description: 'Template creativo per portfolio e showcase'
    },
    {
      id: '3',
      name: 'Educational',
      category: 'education',
      thumbnail: 'education-template.svg',
      description: 'Template per contenuti educativi e formativi'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tutte le Categorie' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creatività' },
    { id: 'education', name: 'Educazione' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'technology', name: 'Tecnologia' }
  ];

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        <AutoFixHighIcon color="primary" />
        Gestione Presentazioni
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Crea Presentazione" />
        <Tab label="Le Mie Presentazioni" />
        <Tab label="Analisi AI" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Contenuto Presentazione
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tipo di Input</InputLabel>
                  <Select
                    value={inputType}
                    label="Tipo di Input"
                    onChange={(e) => setInputType(e.target.value as 'text' | 'video' | 'audio')}
                  >
                    <MenuItem value="text">Testo</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                  </Select>
                </FormControl>
                
                {inputType === 'text' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Inserisci il contenuto della tua presentazione..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ) : inputType === 'video' ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Video
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP4, MOV, AVI fino a 500MB
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Audio
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP3, WAV, M4A fino a 100MB
                    </Typography>
                  </Box>
                )}
                
                <Button
                  aria-label="Crea nuova presentazione"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCreatePresentation();
                    }
                  }}
                  variant="contained"
                  fullWidth
                  onClick={handleCreatePresentation}
                  disabled={isProcessing || !currentInput}
                  startIcon={isProcessing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
                >
                  {isProcessing ? (isAnalyzing ? 'Analisi in corso...' : 'Creazione...') : 'Genera Presentazione con AI'}
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Scegli Template
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Categoria"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="all">Tutte le Categorie</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="education">Educazione</MenuItem>
                    <MenuItem value="creative">Creativo</MenuItem>
                  </Select>
                </FormControl>
                
                <Grid container spacing={2}>
                  {templates
                    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                    .map(template => (
                      <Grid item xs={6} key={template.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedTemplate?.id === template.id ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                          }}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardContent>
                            <Typography variant="subtitle1">{template.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {template.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              LeTue Presentazioni
            </Typography>
            <List>
              {presentations.length === 0 ? (
                <Alert severity="info">
                  Non hai ancora creato nessuna presentazione. Usa il form sopra per iniziare.
                </Alert>
              ) : (
                presentations.map((presentation) => (
                  <ListItem key={presentation.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {presentation.title}
                            <Chip 
                              size="small" 
                              label={presentation.status}
                              color={presentation.status === 'published' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {presentation.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Creata il: {presentation.createdAt.toLocaleDateString()}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                              <Chip size="small" icon={<PreviewIcon />} label={`${presentation.analytics.views} visualizzazioni`} />
                              <Chip size="small" icon={<ThumbUpIcon />} label={`${presentation.analytics.likes} likes`} />
                              <Chip size="small" icon={<ShareIcon />} label={`${presentation.analytics.shares} condivisioni`} />
                            </Box>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Anteprima">
                          <IconButton onClick={() => setSelectedPresentation(presentation)}>
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifica">
                          <IconButton onClick={() => handleEditPresentation(presentation)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Elimina">
                          <IconButton onClick={() => {
                            if (window.confirm('Sei sicuro di voler eliminare questa presentazione?')) {
                              handleDeletePresentation(presentation.id);
                            }
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </Box>
                    
                    {presentation.aiSuggestions && (
                      <Box sx={{ mt: 2, pl: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Suggerimenti AI
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Miglioramenti Contenuto:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.contentImprovements.map((suggestion, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <AutoFixHighIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={suggestion} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Suggerimenti Design:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.designSuggestions.map((suggestion, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <StyleIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={suggestion} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                              Trend Correlati:
                            </Typography>
                            <List dense>
                              {presentation.aiSuggestions.trendingTopics.map((topic, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <TrendingUpIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={topic} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </>
      ) : (
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

const PresentationManager = () => {
  const { t } = useTranslation();
  const {
    presentations,
    addPresentation,
    setSelectedPresentation,
    setLoading,
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
  const [isUploading, setIsUploading] = useState(false);

  const validateInput = (input: string): ValidationResult => {
    const errors: string[] = [];
    
    if (input.trim().length < 10) {
      errors.push('Il contenuto deve essere di almeno 10 caratteri');
    }
    
    if (input.trim().length > 5000) {
      errors.push('Il contenuto non può superare i 5000 caratteri');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleCreatePresentation = async () => {
    try {
      setIsProcessing(true);
      setIsAnalyzing(true);
      setError(null);
      
      if (!selectedTemplate) {
        throw new Error('Seleziona un template per continuare');
      }
    
      const validation = validateInput(currentInput);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }
      
      const newPresentation: Presentation = {
        id: Date.now().toString(),
        title: 'Nuova Presentazione',
        description: 'Generata con AI',
        template: selectedTemplate,
        slides: [],
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
          performance: 0
        },
        aiSuggestions: {
          contentImprovements: [],
          designSuggestions: [],
          trendingTopics: []
        }
      };

      const aiAnalysis = await analyzeContentWithAI(currentInput);
      newPresentation.aiSuggestions = aiAnalysis;
      await addPresentation(newPresentation);
      
      setNotification({
        type: 'success',
        message: 'Presentazione creata con successo!'
      });
      
      // Reimposta lo stato
      setCurrentInput('');
      setSelectedTemplate(null);
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Si è verificato un errore'
      });
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const handleEditPresentation = (presentation: Presentation) => {
    try {
      setSelectedPresentation(presentation);
      setNotification({
        type: 'info',
        message: 'Modalità modifica attivata'
      });
    } catch (error) {
      console.error('Errore durante la modifica:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'apertura della modalità modifica'
      });
    }
  };

  const handleError = async (error: Error) => {
    try {
      const aiSolution = await getAISolution(error.message);
      setNotification({
        type: 'info',
        message: `Soluzione AI: ${aiSolution.solution}`
      });
    } catch (aiError) {
      setNotification({
        type: 'error',
        message: 'Errore durante l\'analisi AI'
      });
    }
  };

  const handleDeletePresentation = async (presentationId: string) => {
    try {
      const { deletePresentation } = usePresentationStore.getState();
      await deletePresentation(presentationId);
      
      setNotification({
        type: 'success',
        message: 'Presentazione eliminata con successo'
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      setNotification({
        type: 'error',
        message: 'Errore durante l\'eliminazione della presentazione'
      });
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const templates: Template[] = [
    {
      id: '1',
      name: 'Business Professional',
      category: 'business',
      thumbnail: 'business-template.svg',
      description: 'Template professionale per presentazioni aziendali'
    },
    {
      id: '2',
      name: 'Creative Portfolio',
      category: 'creative',
      thumbnail: 'creative-template.svg',
      description: 'Template creativo per portfolio e showcase'
    },
    {
      id: '3',
      name: 'Educational',
      category: 'education',
      thumbnail: 'education-template.svg',
      description: 'Template per contenuti educativi e formativi'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tutte le Categorie' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creatività' },
    { id: 'education', name: 'Educazione' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'technology', name: 'Tecnologia' }
  ];

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        <AutoFixHighIcon color="primary" />
        Gestione Presentazioni
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Crea Presentazione" />
        <Tab label="Le Mie Presentazioni" />
        <Tab label="Analisi AI" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Contenuto Presentazione
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tipo di Input</InputLabel>
                  <Select
                    value={inputType}
                    label="Tipo di Input"
                    onChange={(e) => setInputType(e.target.value as 'text' | 'video' | 'audio')}
                  >
                    <MenuItem value="text">Testo</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                  </Select>
                </FormControl>
                
                {inputType === 'text' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Inserisci il contenuto della tua presentazione..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ) : inputType === 'video' ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Video
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP4, MOV, AVI fino a 500MB
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setIsUploading(true)}
                      sx={{ mb: 2 }}
                    >
                      Carica Audio
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Supporta MP3, WAV, M4A fino a 100MB
                    </Typography>
                  </Box>
                )}
                
                <Button
                  aria-label="Crea nuova presentazione"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCreatePresentation();
                    }
                  }}
                  variant="contained"
                  fullWidth
                  onClick={handleCreatePresentation}
                  disabled={isProcessing || !currentInput}
                  startIcon={isProcessing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
                >
                  {isProcessing ? (isAnalyzing ? 'Analisi in corso...' : 'Creazione...') : 'Genera Presentazione con AI'}
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Scegli Template
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Categoria"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="all">Tutte le Categorie</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="education">Educazione</MenuItem>
                    <MenuItem value="creative">Creativo</MenuItem>
                  </Select>
                </FormControl>
                
                <Grid container spacing={2}>
                  {templates
                    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                    .map(template => (
                      <Grid item xs={6} key={template.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedTemplate?.id === template.id ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                          }}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardContent>
                            <Typography variant="subtitle1">{template.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {template.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}