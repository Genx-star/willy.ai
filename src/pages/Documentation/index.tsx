import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import HelpIcon from '@mui/icons-material/Help';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documentation-tabpanel-${index}`}
      aria-labelledby={`documentation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Documentation = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const blogPosts = [
    {
      title: 'Introduzione all\'Intelligenza Artificiale',
      description: 'Una panoramica completa sull\'IA e le sue applicazioni nel mondo moderno.',
      image: '/blog/ai-intro.svg',
      date: '2024-02-10'
    },
    {
      title: 'Machine Learning: Concetti Base',
      description: 'Guida introduttiva al machine learning e ai suoi principali algoritmi.',
      image: '/blog/ml-basics.svg',
      date: '2024-02-08'
    },
    {
      title: 'Deep Learning e Reti Neurali',
      description: 'Esplorazione approfondita delle reti neurali e delle loro applicazioni.',
      image: '/blog/deep-learning.svg',
      date: '2024-02-05'
    }
  ];

  const faqItems = [
    {
      question: 'Cos\'è WILLY.AI?',
      answer: 'WILLY.AI è una piattaforma avanzata di intelligenza artificiale che offre soluzioni personalizzate per l\'automazione e l\'ottimizzazione dei processi aziendali.'
    },
    {
      question: 'Come posso iniziare a utilizzare WILLY.AI?',
      answer: 'Puoi iniziare registrando un account gratuito sulla nostra piattaforma. Dopo la registrazione, avrai accesso a un tutorial guidato che ti mostrerà tutte le funzionalità principali.'
    },
    {
      question: 'Quali sono i requisiti tecnici?',
      answer: 'WILLY.AI è una piattaforma basata su cloud, quindi tutto ciò di cui hai bisogno è un browser web moderno e una connessione internet stabile.'
    },
    {
      question: 'Come funziona il sistema di supporto?',
      answer: 'Offriamo supporto 24/7 attraverso il nostro chatbot integrato, email dedicata e documentazione completa. Per i clienti enterprise, forniamo anche supporto telefonico dedicato.'
    }
  ];

  const tutorials = [
    {
      title: 'Guida Introduttiva a WILLY.AI',
      description: 'Impara le basi della piattaforma in questo tutorial completo per principianti.',
      duration: '10:15',
      thumbnail: '/tutorials/getting-started.svg'
    },
    {
      title: 'Configurazione Avanzata',
      description: 'Scopri le funzionalità avanzate e come personalizzare WILLY.AI per le tue esigenze.',
      duration: '15:30',
      thumbnail: '/tutorials/advanced-setup.svg'
    },
    {
      title: 'Integrazione con API Esterne',
      description: 'Tutorial pratico sull\'integrazione di WILLY.AI con sistemi esterni.',
      duration: '12:45',
      thumbnail: '/tutorials/api-integration.svg'
    }
  ];

  const pageTitle = 'Documentazione WILLY.AI - Guide, FAQ e Tutorial';
  const pageDescription = 'Esplora la documentazione completa di WILLY.AI: guide dettagliate, FAQ, tutorial e risorse per ottimizzare la tua esperienza con la nostra piattaforma di intelligenza artificiale.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="WILLY.AI, documentazione, guide, FAQ, tutorial, intelligenza artificiale, automazione, social media" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href="https://willy.ai/documentation" />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }} component="main" role="main">
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: 'h3.fontSize', mb: 4 }}>
        Documentazione WILLY.AI
      </Typography>
      <Typography variant="h2" sx={{ fontSize: 'h5.fontSize', color: 'text.secondary', mb: 6 }}>
        Scopri tutte le risorse per sfruttare al meglio la nostra piattaforma
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="documentation tabs"
          centered
        >
          <Tab icon={<ArticleIcon />} label="Blog" />
          <Tab icon={<HelpIcon />} label="FAQ" />
          <Tab icon={<PlayCircleIcon />} label="Tutorial" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3} component="section" aria-label="Blog posts">
            {blogPosts.map((post, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }} component="article">
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.image}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.description}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                      Pubblicato il {post.date}
                    </Typography>
                    <Button 
                      variant="text" 
                      sx={{ mt: 1 }}
                      aria-label={`Leggi l'articolo completo su ${post.title}`}
                    >
                      Leggi di più
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List component="section" aria-label="Domande frequenti">
            {faqItems.map((item, index) => (
              <>
                <ListItem key={index} alignItems="flex-start" component="article">
                  <ListItemIcon>
                    <HelpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.question}
                    secondary={item.answer}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                {index < faqItems.length - 1 && <Divider />}
              </>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3} component="section" aria-label="Tutorial e guide">
            {tutorials.map((tutorial, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card component="article">
                  <CardMedia
                    component="img"
                    height="140"
                    image={tutorial.thumbnail}
                    alt={tutorial.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {tutorial.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tutorial.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <PlayCircleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="caption">
                        Durata: {tutorial.duration}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      aria-label={`Guarda il tutorial su ${tutorial.title}`}
                    >
                      Guarda il Tutorial
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
    </>
  );
};

export default Documentation;
