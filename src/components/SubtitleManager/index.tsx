import { useState, } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TranslateIcon from '@mui/icons-material/Translate';
import SaveIcon from '@mui/icons-material/Save';

interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  language: string;
}

interface SubtitleManagerProps {
  videoSrc: string;
  onSave: (subtitles: Subtitle[]) => void;
}

const SubtitleManager = ({  onSave }: SubtitleManagerProps) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('it');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSubtitle, setEditingSubtitle] = useState<string | null>(null);

  const languages = [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'ar', label: 'Arabic' },
    { code: 'hi', label: 'Hindi' }
  ];

  const generateSubtitles = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Qui implementeremo la chiamata all'API di speech-to-text
      // Per ora simuliamo una risposta
      const generatedSubtitles: Subtitle[] = [
        {
          id: '1',
          startTime: 0,
          endTime: 2,
          text: 'Esempio di sottotitolo generato automaticamente',
          language: selectedLanguage
        }
      ];
      setSubtitles(generatedSubtitles);
    } catch (error) {
      setError('Errore durante la generazione dei sottotitoli');
    } finally {
      setIsGenerating(false);
    }
  };

  const translateSubtitles = async (targetLanguage: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      // Qui implementeremo la chiamata all'API di traduzione
      // Per ora simuliamo una traduzione
      const translatedSubtitles = subtitles.map(subtitle => ({
        ...subtitle,
        id: Date.now().toString(),
        language: targetLanguage,
        text: `Sottotitolo tradotto in ${languages.find(l => l.code === targetLanguage)?.label}`
      }));
      setSubtitles([...subtitles, ...translatedSubtitles]);
    } catch (error) {
      setError('Errore durante la traduzione dei sottotitoli');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditSubtitle = (subtitleId: string, newText: string) => {
    setSubtitles(subtitles.map(subtitle =>
      subtitle.id === subtitleId ? { ...subtitle, text: newText } : subtitle
    ));
    setEditingSubtitle(null);
  };

  const handleDeleteSubtitle = (subtitleId: string) => {
    setSubtitles(subtitles.filter(subtitle => subtitle.id !== subtitleId));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Gestione Sottotitoli
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lingua Principale</InputLabel>
          <Select
            value={selectedLanguage}
            label="Lingua Principale"
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isGenerating}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={generateSubtitles}
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} /> : <TranslateIcon />}
        >
          Genera Sottotitoli
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <List>
          {subtitles.map((subtitle) => (
            <ListItem key={subtitle.id}>
              <ListItemText
                primary={
                  editingSubtitle === subtitle.id ? (
                    <TextField
                      fullWidth
                      value={subtitle.text}
                      onChange={(e) => handleEditSubtitle(subtitle.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    subtitle.text
                  )
                }
                secondary={`${formatTime(subtitle.startTime)} → ${formatTime(subtitle.endTime)} | ${languages.find(l => l.code === subtitle.language)?.label}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => setEditingSubtitle(editingSubtitle === subtitle.id ? null : subtitle.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteSubtitle(subtitle.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Traduci in</InputLabel>
          <Select
            value=""
            label="Traduci in"
            onChange={(e) => translateSubtitles(e.target.value)}
            disabled={isGenerating || subtitles.length === 0}
          >
            {languages
              .filter(lang => lang.code !== selectedLanguage)
              .map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(subtitles)}
          disabled={subtitles.length === 0}
          startIcon={<SaveIcon />}
        >
          Salva Sottotitoli
        </Button>
      </Box>
    </Box>
  );
};

export default SubtitleManager;