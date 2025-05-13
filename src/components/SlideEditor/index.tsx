import { Box, Paper, TextField, Button, Grid, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Definizione dell'interfaccia Slide (necessaria per risolvere TS2304)
// Assumiamo una struttura simile a quella usata in PresentationManager
interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'video' | 'chart'; // Aggiungi altri tipi se necessario
  content: {
    title?: string;
    text?: string;
    media?: string; // URL per immagini/video
    layout?: string; // Es. 'default', 'two-column', ecc.
    // Aggiungi altri campi specifici per tipo di slide se necessario
  };
}

interface SlideEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
}

const SlideEditor = ({ slides, onSlidesChange }: SlideEditorProps) => {
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type: 'content', // Tipo di default per una nuova slide
      content: {
        title: 'Nuova Slide',
        text: '',
        layout: 'default'
      }
    };
    onSlidesChange([...slides, newSlide]);
  };

  const handleDeleteSlide = (id: string) => {
    onSlidesChange(slides.filter(slide => slide.id !== id));
  };

  const handleSlideChange = (id: string, newContent: Partial<Slide['content']>) => {
    onSlidesChange(
      slides.map(slide =>
        slide.id === id
          ? { ...slide, content: { ...slide.content, ...newContent } }
          : slide
      )
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Editor Slide
      </Typography>
      <Grid container spacing={2}>
        {slides.map((slide, index) => (
          <Grid item xs={12} key={slide.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Slide {index + 1} ({slide.type})
                </Typography>
                <IconButton
                  onClick={() => handleDeleteSlide(slide.id)}
                  color="error"
                  aria-label={`Elimina slide ${index + 1}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                label="Titolo Slide"
                value={slide.content.title || ''}
                onChange={(e) =>
                  handleSlideChange(slide.id, { title: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Testo Slide"
                value={slide.content.text || ''}
                onChange={(e) =>
                  handleSlideChange(slide.id, { text: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              {/* Qui potresti aggiungere altri campi in base a slide.type */}
              {/* Esempio: se slide.type === 'image', mostra un campo per l'URL dell'immagine */}
              {slide.type === 'image' && (
                <TextField
                  fullWidth
                  label="URL Immagine"
                  value={slide.content.media || ''}
                  onChange={(e) => handleSlideChange(slide.id, { media: e.target.value })}
                  sx={{ mb: 2 }}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddSlide}
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Aggiungi Slide
      </Button>
    </Box>
  );
};

export default SlideEditor;

