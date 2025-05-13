import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
}

const PromptGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([
    {
      id: '1',
      name: 'Descrizione Prodotto',
      description: 'Template per generare descrizioni accattivanti di prodotti',
      template: 'Crea una descrizione persuasiva per [PRODOTTO] che evidenzi [CARATTERISTICHE_PRINCIPALI] e si rivolga a [PUBBLICO_TARGET].',
      category: 'marketing',
      tags: ['ecommerce', 'copywriting'],
      isFavorite: true
    },
    {
      id: '2',
      name: 'Post Social Media',
      description: 'Template per creare post social media coinvolgenti',
      template: 'Scrivi un post [PIATTAFORMA] che promuova [ARGOMENTO] utilizzando un tono [STILE] e includi [CALL_TO_ACTION].',
      category: 'social',
      tags: ['marketing', 'social media'],
      isFavorite: false
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'Tutte le Categorie' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'social', label: 'Social Media' },
    { value: 'content', label: 'Creazione Contenuti' },
    { value: 'seo', label: 'SEO' }
  ];

  const handleOpenDialog = (template?: PromptTemplate) => {
    if (template) {
      setCurrentTemplate(template);
    } else {
      setCurrentTemplate(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTemplate(null);
    setError(null);
  };

  const handleSaveTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    // Implementare la logica di salvataggio
    handleCloseDialog();
  };

  const handleGeneratePrompt = async (template: PromptTemplate) => {
    try {
      // Simulazione della generazione del prompt
      const generatedText = template.template.replace(
        /\[(.*?)\]/g,
        (match) => `[Inserisci ${match.slice(1, -1).toLowerCase()}]`
      );
      setGeneratedPrompt(generatedText);
    } catch (err) {
      setError('Errore durante la generazione del prompt');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const toggleFavorite = (id: string) => {
    setTemplates(templates.map(template =>
      template.id === id
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ));
  };

  const filteredTemplates = templates.filter(template =>
    (selectedCategory === 'all' || template.category === selectedCategory) &&
    (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generatore di Prompt
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Cerca template"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                label="Categoria"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Template Disponibili
          </Typography>
          <Grid container spacing={2}>
            {filteredTemplates.map((template) => (
              <Grid item xs={12} key={template.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{template.name}</Typography>
                      <IconButton
                        onClick={() => toggleFavorite(template.id)}
                        color={template.isFavorite ? 'primary' : 'default'}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      {template.description}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 2 }}>
                      {template.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {template.template}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<AutoFixHighIcon />}
                      onClick={() => handleGeneratePrompt(template)}
                    >
                      Genera Prompt
                    </Button>
                    <Button
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyPrompt}
                      disabled={!generatedPrompt}
                    >
                      Copia Prompt
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Prompt Generato
            </Typography>
            {generatedPrompt ? (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {generatedPrompt}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyPrompt}
                  fullWidth
                >
                  Copia negli Appunti
                </Button>
              </>
            ) : (
              <Typography color="textSecondary">
                Seleziona un template e genera un prompt per visualizzarlo qui
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ mt: 3 }}
      >
        Nuovo Template
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentTemplate ? 'Modifica Template' : 'Nuovo Template'}
        </DialogTitle>
        <form onSubmit={handleSaveTemplate}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nome Template"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Descrizione"
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Template"
              margin="normal"
              multiline
              rows={4}
              required
              helperText="Usa [PLACEHOLDER] per le variabili da sostituire"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Categoria</InputLabel>
              <Select
                label="Categoria"
                required
              >
                {categories.slice(1).map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tag (separati da virgola)"
              margin="normal"
              helperText="Inserisci i tag separati da virgola"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annulla</Button>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
              Salva
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PromptGenerator;