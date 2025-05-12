import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface SlideEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
}

const SlideEditor = ({ slides, onSlidesChange }: SlideEditorProps) => {
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type: 'content',
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

  const handleSlideChange = (id: string, content: Partial<Slide['content']>) => {
    onSlidesChange(
      slides.map(slide =>
        slide.id === id
          ? { ...slide, content: { ...slide.content, ...content } }
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">
                  Slide {index + 1}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteSlide(slide.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                label="Titolo"
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
                label="Contenuto"
                value={slide.content.text || ''}
                onChange={(e) =>
                  handleSlideChange(slide.id, { text: e.target.value })
                }
              />
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