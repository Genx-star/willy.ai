import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useContentStore } from '@/stores/contentStore';

interface SpeechToContentProps {
  contentType: 'image' | 'video';
  onTranscriptionComplete: (text: string) => void;
}

const SpeechToContent = ({ contentType, onTranscriptionComplete }: SpeechToContentProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('it-IT');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const languages = [
    { code: 'it-IT', label: 'Italiano' },
    { code: 'en-US', label: 'English' },
    { code: 'es-ES', label: 'Español' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'de-DE', label: 'Deutsch' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        try {
          // Qui implementeremo la chiamata all'API di speech-to-text
          // Per ora simuliamo una risposta
          const transcription = 'Esempio di trascrizione del contenuto vocale';
          onTranscriptionComplete(transcription);
        } catch (error) {
          setError('Errore durante la trascrizione del contenuto vocale');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      setError('Errore nell\'accesso al microfono');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {contentType === 'image' ? 'Speech to Image' : 'Speech to Video'}
      </Typography>

      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Lingua</InputLabel>
        <Select
          value={selectedLanguage}
          label="Lingua"
          onChange={(e) => setSelectedLanguage(e.target.value)}
          disabled={isRecording}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          color={isRecording ? 'error' : 'primary'}
          onClick={isRecording ? stopRecording : startRecording}
          sx={{ width: 56, height: 56 }}
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </IconButton>
        <Typography color={isRecording ? 'error' : 'textSecondary'}>
          {isRecording ? 'Registrazione in corso...' : 'Premi per registrare'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default SpeechToContent;