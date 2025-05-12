import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import HelpIcon from '@mui/icons-material/Help';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl: string;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'principiante' | 'intermedio' | 'avanzato';
  videoUrl?: string;
}

const Documentation = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Blog posts completi e dettagliati
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Guida Completa all\'Automazione dei Social Media con WILLY.AI',
      description: 'Una guida approfondita su come utilizzare le funzionalità di automazione di WILLY.AI per gestire efficacemente la tua presenza sui social media, risparmiando tempo e massimizzando l\'engagement.',
      date: '2024-01-20',
      category: 'Guide',
      imageUrl: '/blog/automation.svg'
    },
    {
      id: '2',
      title: 'Analisi Predittiva: Il Futuro del Social Media Marketing',
      description: 'Scopri come WILLY.AI utilizza l\'intelligenza artificiale avanzata per prevedere le tendenze dei contenuti e ottimizzare le tue strategie di marketing sui social media.',
      date: '2024-01-15',
      category: 'Tecnologia',
      imageUrl: '/blog/predictive.svg'
    },
    {
      id: '3',
      title: 'Strategie di Contenuto Multi-piattaforma',
      description: 'Impara a creare e adattare i tuoi contenuti per diverse piattaforme social utilizzando gli strumenti automatizzati di WILLY.AI.',
      date: '2024-01-10',
      category: 'Strategie',
      imageUrl: '/blog/multiplatform.svg'
    },
    {
      id: '4',
      title: 'Massimizzare il ROI con l\'Analisi dei Dati Social',
      description: 'Una guida pratica su come utilizzare le funzionalità di analisi di WILLY.AI per misurare e migliorare il ritorno sull\'investimento delle tue campagne social.',
      date: '2024-01-05',
      category: 'Analytics',
      imageUrl: '/blog/roi.svg'
    }
  ];

  // FAQ complete e dettagliate
  const faqs: FAQItem[] = [
    {
      question: 'Come posso iniziare a utilizzare WILLY.AI?',
      answer: 'Iniziare con WILLY.AI è semplice: 1) Registra un account gratuito, 2) Completa il processo di onboarding guidato, 3) Connetti i tuoi account social, 4) Esplora il dashboard e personalizza le tue impostazioni, 5) Inizia a creare e programmare i tuoi contenuti. Il nostro team di supporto è sempre disponibile per aiutarti durante questo processo.',
      category: 'Generale'
    },
    {
      question: 'Quali piattaforme social sono supportate da WILLY.AI?',
      answer: 'WILLY.AI supporta tutte le principali piattaforme social: LinkedIn (inclusi i profili aziendali), Pinterest, TikTok, Instagram (post, storie e reels), Facebook (profili personali e pagine), X (Twitter), YouTube, Snapchat, Threads e WhatsApp Business. Aggiungiamo regolarmente il supporto per nuove piattaforme in base alle richieste degli utenti.',
      category: 'Piattaforme'
    },
    {
      question: 'Come funziona l\'automazione dei contenuti?',
      answer: 'L\'automazione dei contenuti di WILLY.AI utilizza l\'intelligenza artificiale per: 1) Generare contenuti originali basati sui tuoi input, 2) Ottimizzare i contenuti per ogni piattaforma, 3) Programmare i post negli orari di maggior engagement, 4) Analizzare le performance e suggerire miglioramenti. Puoi sempre rivedere e modificare i contenuti prima della pubblicazione.',
      category: 'Funzionalità'
    },
    {
      question: 'Quali sono i piani di abbonamento disponibili?',
      answer: 'Offriamo diversi piani per soddisfare le tue esigenze: Piano Free (funzionalità di base), Piano Pro (automazione avanzata), Piano Business (funzionalità complete per team) e Piano Enterprise (soluzioni personalizzate per grandi organizzazioni). Ogni piano include un periodo di prova gratuito.',
      category: 'Abbonamenti'
    },
    {
      question: 'Come posso misurare i risultati delle mie campagne?',
      answer: 'WILLY.AI offre strumenti di analytics completi che includono: metriche di engagement in tempo reale, analisi del sentiment, tracking del ROI, report personalizzabili, confronto con i competitor e previsioni basate sull\'AI. Puoi anche esportare i dati in vari formati per ulteriori analisi.',
      category: 'Analytics'
    }
  ];

  // Tutorial completi e strutturati
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Guida Introduttiva a WILLY.AI',
      description: 'Un tour completo delle funzionalità base di WILLY.AI: configurazione dell\'account, connessione dei social media e prime automazioni.',
      duration: '15 min',
      level: 'principiante',
      videoUrl: '/tutorials/getting-started.mp4'
    },
    {
      id: '2',
      title: 'Creazione di Contenuti Multi-piattaforma',
      description: 'Impara a utilizzare gli strumenti di generazione automatica dei contenuti e come ottimizzarli per ogni piattaforma social.',
      duration: '25 min',
      level: 'intermedio',
      videoUrl: '/tutorials/content-creation.mp4'
    },
    {
      id: '3',
      title: 'Analisi Avanzata e Ottimizzazione',
      description: 'Tecniche avanzate di analisi dei dati per ottimizzare le performance delle tue campagne social e massimizzare il ROI.',
      duration: '30 min',
      level: 'avanzato',
      videoUrl: '/tutorials/advanced-analytics.mp4'
    },
    {
      id: '4',
      title: 'Automazione del Workflow',
      description: 'Scopri come automatizzare completamente il tuo workflow di social media marketing utilizzando le funzionalità avanzate di WILLY.AI.',
      duration: '20 min',
      level: 'intermedio',
      videoUrl: '/tutorials/workflow-automation.mp4'
    },
    {
      id: '5',
      title: 'Strategie di Growth Hacking',
      description: 'Strategie avanzate per accelerare la crescita dei tuoi social media utilizzando le funzionalità di AI e automazione di WILLY.AI.',
      duration: '35 min',
      level: 'avanzato',
      videoUrl: '/tutorials/growth-hacking.mp4'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const getLevelColor = (level: Tutorial['level']) => {
    switch (level) {
      case 'principiante':
        return 'success';
      case 'intermedio':
        return 'warning';
      case 'avanzato':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BookIcon color="primary" />
        Documentazione e Risorse
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Cerca nella documentazione..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />

      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab icon={<ArticleIcon />} label="Blog" />
          <Tab icon={<HelpIcon />} label="FAQ" />
          <Tab icon={<PlayCircleIcon />} label="Tutorial" />
        </Tabs>
      </Paper>

      {currentTab === 0 && (
        <Grid container spacing={3}>
          {blogPosts.map(post => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={post.imageUrl}
                  alt={post.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip label={post.category} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 1 && (
        <Box>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  <HelpIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
                <Chip
                  label={faq.category}
                  size="small"
                  sx={{ mt: 1 }}
                  color="primary"
                  variant="outlined"
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {currentTab === 2 && (
        <Grid container spacing={3}>
          {tutorials.map(tutorial => (
            <Grid item xs={12} md={6} key={tutorial.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{tutorial.title}</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  {tutorial.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Chip
                      label={tutorial.level}
                      size="small"
                      color={getLevelColor(tutorial.level)}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      icon={<TipsAndUpdatesIcon />}
                      label={tutorial.duration}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<PlayCircleIcon />}
                    size="small"
                    href={tutorial.videoUrl}
                    target="_blank"
                  >
                    Guarda
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Documentation;