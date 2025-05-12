import React, { useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Tag {
  id: string;
  name: string;
  color: string;
  description: string;
}

const TagManager: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setCurrentTag(tag);
    } else {
      setCurrentTag(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTag(null);
  };

  const handleSaveTag = (event: React.FormEvent) => {
    event.preventDefault();
    // Implementare la logica di salvataggio
    handleCloseDialog();
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestione Tag</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Tag
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Cerca tag"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Paper>
        <List>
          {filteredTags.map((tag) => (
            <ListItem key={tag.id}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={tag.name}
                      size="small"
                      sx={{ backgroundColor: tag.color, mr: 2 }}
                    />
                    <Typography>{tag.name}</Typography>
                  </Box>
                }
                secondary={tag.description}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="modifica"
                  onClick={() => handleOpenDialog(tag)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="elimina"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentTag ? 'Modifica Tag' : 'Nuovo Tag'}
        </DialogTitle>
        <form onSubmit={handleSaveTag}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nome Tag"
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
              label="Colore"
              type="color"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annulla</Button>
            <Button type="submit" variant="contained">
              Salva
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TagManager;