import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import TranslateIcon from '@mui/icons-material/Translate';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: string;
}

interface ChatAssistantProps {
  onSuggestionClick?: (suggestion: string) => void;
}

const ChatAssistant = ({ onSuggestionClick }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('it');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const contextualSuggestions = [
    'Come posso aiutarti con il video?',
    'Vuoi aggiungere dei sottotitoli?',
    'Hai bisogno di effetti speciali?',
    'Posso aiutarti con l\'editing audio?'
  ];

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simula una risposta dell'assistente
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Capisco la tua richiesta. Come posso aiutarti nello specifico?',
        sender: 'assistant',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      // Implementa la logica per fermare la registrazione
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        // Implementa la logica per iniziare la registrazione
      } catch (error) {
        console.error('Errore nell\'accesso al microfono:', error);
      }
    }
  };

  return (
    <Paper sx={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 350,
      height: 500,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: 3,
      zIndex: 1000
    }}>
      <Box sx={{
        p: 2,
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon />
          <Typography variant="h6">Assistente</Typography>
        </Box>
        <FormControl size="small" sx={{ width: 120 }}>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              gap: 1,
              mb: 2
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: message.sender === 'assistant' ? 'primary.main' : 'secondary.main' }}>
                {message.sender === 'assistant' ? <SmartToyIcon /> : <PersonIcon />}
              </Avatar>
            </ListItemAvatar>
            <Paper
              sx={{
                p: 1,
                bgcolor: message.sender === 'user' ? 'secondary.light' : 'grey.100',
                maxWidth: '70%'
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" color="textSecondary">
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </Paper>
          </ListItem>
        ))}
        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {contextualSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              size="small"
              variant="outlined"
              onClick={() => {
                setInputText(suggestion);
                if (onSuggestionClick) {
                  onSuggestionClick(suggestion);
                }
              }}
            >
              {suggestion}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Scrivi un messaggio..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            size="small"
          />
          <Tooltip title="Registra messaggio vocale">
            <IconButton
              color={isRecording ? 'error' : 'primary'}
              onClick={toggleRecording}
            >
              {isRecording ? <StopIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatAssistant;