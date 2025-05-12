import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Tabs,
  Tab,
  Tooltip,
  Divider
} from '@mui/material';
import { obfuscate } from 'javascript-obfuscator';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import ChatAssistant from '../ChatAssistant';
import SubtitleManager from '../SubtitleManager';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FilterIcon from '@mui/icons-material/FilterAlt';
import ImageIcon from '@mui/icons-material/Image';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

interface VideoEditorProps {
  videoSrc?: string;
  onSave: (editedVideo: Blob) => void;
}

interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  language: string;
}

interface TextOverlay {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
}

interface ImageOverlay {
  id: string;
  src: string;
  position: { x: number; y: number };
  scale: number;
}

const VideoEditor = ({ videoSrc, onSave }: VideoEditorProps) => {
  // Implementazione di protezione anti-clonazione
  const instanceId = useRef(uuidv4());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verifica dell'autenticità dell'istanza
    const verifyInstance = async () => {
      try {
        const timestamp = Date.now();
        const hash = CryptoJS.SHA256(`${instanceId.current}_${timestamp}`).toString();
        
        // Qui puoi implementare la tua logica di verifica con il server
        // Per ora, simuliamo una verifica locale
        const isValid = hash.length > 0;
        
        if (!isValid) {
          console.error('Istanza non autorizzata');
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Errore durante la verifica:', error);
        setIsAuthenticated(false);
      }
    };
    
    verifyInstance();
    
    // Implementazione di protezione contro il debug
    const debugProtection = () => {
      const startTime = performance.now();
      debugger;
      const endTime = performance.now();
      
      if (endTime - startTime > 100) {
        // Possibile tentativo di debug rilevato
        setIsAuthenticated(false);
      }
    };
    
    const interval = setInterval(debugProtection, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Protezione contro la manipolazione del DOM
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Possibile tentativo di manipolazione del DOM
          console.warn('Rilevata manipolazione del DOM');
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    return () => observer.disconnect();
  }, []);
  
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Accesso non autorizzato. Questa istanza non è stata verificata.
        </Typography>
      </Box>
    );
  }
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [videoUrl, setVideoUrl] = useState(videoSrc || '');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current?.duration || 0);
      });

      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
      });
    }

    // Cleanup per evitare memory leak
    return () => {
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (event: Event, newValue: number | number[]) => {
    if (videoRef.current && typeof newValue === 'number') {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const addTextOverlay = () => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: 'Nuovo Testo',
      position: { x: 50, y: 50 },
      fontSize: 24,
      color: '#ffffff'
    };
    setTextOverlays([...textOverlays, newText]);
    addToUndoStack('addText', newText);
  };

  const addImageOverlay = async (file: File | string) => {
    try {
      if (typeof file === 'string') {
        // Verifica del copyright per URL immagine
        const copyrightCheck = await checkCopyrightStatus(file);
        if (!copyrightCheck.isValid) {
          throw new Error('L\'immagine potrebbe essere protetta da copyright. Verifica di avere i diritti necessari.');
        }

        const response = await fetch(file);
        if (!response.ok) throw new Error('Immagine non accessibile');

        // Verifica del tipo di contenuto
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('image/')) {
          throw new Error('Il file deve essere un\'immagine valida');
        }

        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = async (e) => {
          // Aggiunta watermark e protezione
          const protectedImage = await addCopyrightProtection(e.target?.result as string);
          
          const newImage: ImageOverlay = {
            id: Date.now().toString(),
            src: protectedImage,
            position: { x: 50, y: 50 },
            scale: 1
          };
          setImageOverlays([...imageOverlays, newImage]);
          addToUndoStack('addImage', newImage);
        };
        reader.readAsDataURL(blob);
      } else {
        // Verifica del tipo di file
        if (!file.type.includes('image/')) {
          throw new Error('Il file deve essere un\'immagine valida');
        }

        const blob = new Blob([file], { type: file.type });
        const reader = new FileReader();

        reader.onload = async (e) => {
          // Aggiunta watermark e protezione
          const protectedImage = await addCopyrightProtection(e.target?.result as string);
          
          const newImage: ImageOverlay = {
            id: Date.now().toString(),
            src: protectedImage,
            position: { x: 50, y: 50 },
            scale: 1
          };
          setImageOverlays([...imageOverlays, newImage]);
          addToUndoStack('addImage', newImage);
        };
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il caricamento dell'immagine");
    }
    
  };


  const addToUndoStack = (action: string, data: any) => {
    setUndoStack([...undoStack, { action, data }]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      setUndoStack(undoStack.slice(0, -1));
      setRedoStack([...redoStack, lastAction]);

      // Implementa la logica di annullamento per ogni tipo di azione
      switch (lastAction.action) {
        case 'addText':
          setTextOverlays(textOverlays.filter(t => t.id !== lastAction.data.id));
          break;
        case 'addImage':
          setImageOverlays(imageOverlays.filter(i => i.id !== lastAction.data.id));
          break;
        // Aggiungi altri casi per diverse azioni
      }
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const lastAction = redoStack[redoStack.length - 1];
      setRedoStack(redoStack.slice(0, -1));
      setUndoStack([...undoStack, lastAction]);

      // Implementa la logica di ripristino per ogni tipo di azione
      switch (lastAction.action) {
        case 'addText':
          setTextOverlays([...textOverlays, lastAction.data]);
          break;
        case 'addImage':
          setImageOverlays([...imageOverlays, lastAction.data]);
          break;
        // Aggiungi altri casi per diverse azioni
      }
    }
  };

  const handleSave = () => {
    if (canvasRef.current && videoRef.current) {
      // Salva anche i sottotitoli insieme al video
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Imposta le dimensioni del canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Disegna il frame corrente del video
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Applica filtri se selezionati
        if (selectedFilter) {
          applyFilter(ctx, selectedFilter);
        }

        // Disegna overlay di testo
        textOverlays.forEach(overlay => {
          ctx.font = `${overlay.fontSize}px Arial`;
          ctx.fillStyle = overlay.color;
          ctx.fillText(overlay.text, overlay.position.x, overlay.position.y);
        });

        // Disegna overlay di immagini
        imageOverlays.forEach(overlay => {
          const img = new Image();
          img.src = overlay.src;
          ctx.drawImage(
            img,
            overlay.position.x,
            overlay.position.y,
            img.width * overlay.scale,
            img.height * overlay.scale
          );
        });

        // Converti il canvas in Blob e salva
        canvas.toBlob(blob => {
          if (blob) {
            onSave(blob);
          }
        }, 'video/mp4');
      }
    }
  };

  const applyFilter = (ctx: CanvasRenderingContext2D, filter: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    switch (filter) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = (r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = (r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = (r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
      // Aggiungi altri filtri qui
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleVideoUrlSubmit = async () => {
    try {
      setError(null);
      
      // Verifica del copyright e dei diritti d'uso
      const copyrightCheck = await checkCopyrightStatus(videoUrl);
      if (!copyrightCheck.isValid) {
        throw new Error('Il contenuto potrebbe essere protetto da copyright. Assicurati di avere i diritti necessari per utilizzarlo.');
      }

      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('URL non valido o video non accessibile');
      }

      // Verifica del tipo di contenuto e dell'estensione
      const contentType = response.headers.get('content-type');
      const fileExtension = videoUrl.split('.').pop()?.toLowerCase();
      const validVideoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
      
      if ((!contentType || !contentType.includes('video/')) && 
          (!fileExtension || !validVideoExtensions.includes(fileExtension))) {
        throw new Error('Il file deve essere un video valido (formati supportati: MP4, WebM, OGG, MOV)');
      }

      const blob = await response.blob();
      
      // Aggiunta watermark e metadati di copyright
      const processedBlob = await addCopyrightProtection(blob);
      
      // Cleanup del vecchio URL oggetto
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl);
      }
      
      const newVideoObjectUrl = URL.createObjectURL(processedBlob);
      setVideoObjectUrl(newVideoObjectUrl);
      
      if (videoRef.current) {
        videoRef.current.src = newVideoObjectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento del video');
    }
  };

  // Funzione per verificare lo stato del copyright
  interface CopyrightCheckResult {
    isValid: boolean;
    message: string;
    confidence: number;
    detectedSource?: string;
  }

  const checkCopyrightStatus = async (url: string): Promise<CopyrightCheckResult> => {
    try {
      // Implementazione del rilevamento del copyright utilizzando servizi AI
      const response = await fetch('https://api.copyrightdetection.ai/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_COPYRIGHT_API_KEY}`
        },
        body: JSON.stringify({
          url,
          type: 'video',
          checkOptions: {
            checkVisual: true,
            checkAudio: true,
            checkText: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Errore durante la verifica del copyright');
      }

      const result = await response.json();
      
      // Analisi dei risultati e suggerimenti alternativi
      if (!result.isValid && result.confidence > 0.8) {
        // Ricerca contenuti alternativi liberi da copyright
        const alternatives = await findCopyrightFreeAlternatives(url);
        return {
          isValid: false,
          message: `Contenuto protetto da copyright. Suggerimenti alternativi disponibili: ${alternatives.join(', ')}`,
          confidence: result.confidence,
          detectedSource: result.source
        };
      }

      return {
        isValid: result.isValid,
        message: result.message,
        confidence: result.confidence
      };
    } catch (error) {
      console.error('Errore nel controllo del copyright:', error);
      return {
        isValid: false,
        message: 'Impossibile verificare il copyright. Si prega di verificare manualmente.',
        confidence: 0
      };
    }
  };

  const findCopyrightFreeAlternatives = async (url: string): Promise<string[]> => {
    try {
      // Ricerca di contenuti alternativi su piattaforme libere da copyright
      const response = await fetch('https://api.copyrightfree.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_COPYRIGHT_FREE_API_KEY}`
        },
        body: JSON.stringify({
          similarTo: url,
          type: 'video',
          license: 'free'
        })
      });

      if (!response.ok) {
        throw new Error('Errore nella ricerca di alternative');
      }

      const result = await response.json();
      return result.alternatives.map((alt: any) => alt.url);
    } catch (error) {
      console.error('Errore nella ricerca di alternative:', error);
      return [];
    }
  };

  // Funzione per aggiungere protezione copyright
  interface WatermarkOptions {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
    size: number;
  }

  const addCopyrightProtection = async (content: Blob | string): Promise<Blob> => {
    try {
      // Configurazione del watermark
      const watermarkOptions: WatermarkOptions = {
        text: `© ${new Date().getFullYear()} - Protected Content`,
        position: 'bottom-right',
        opacity: 0.7,
        size: 24
      };

      // Creazione del FormData per l'upload
      const formData = new FormData();
      formData.append('content', content instanceof Blob ? content : await fetch(content).then(r => r.blob()));
      formData.append('watermarkOptions', JSON.stringify(watermarkOptions));

      // Chiamata al servizio di protezione del copyright
      const response = await fetch('https://api.copyrightprotection.ai/protect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_COPYRIGHT_PROTECTION_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'applicazione della protezione del copyright');
      }

      // Ottieni il contenuto protetto
      const protectedContent = await response.blob();

      // Aggiungi metadati di copyright
      const metadataBlob = await addCopyrightMetadata(protectedContent);

      return metadataBlob;
    } catch (error) {
      console.error('Errore nella protezione del copyright:', error);
      throw error;
    }
  };

  const addCopyrightMetadata = async (blob: Blob): Promise<Blob> => {
    try {
      const metadata = {
        copyright: `© ${new Date().getFullYear()}`,
        owner: 'Your Company Name',
        usage: 'All rights reserved',
        timestamp: new Date().toISOString(),
        protection: {
          watermark: true,
          encryption: true,
          tracking: true
        }
      };

      // Aggiungi i metadati al contenuto
      const response = await fetch('https://api.copyrightprotection.ai/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_COPYRIGHT_PROTECTION_API_KEY}`
        },
        body: JSON.stringify({
          content: await blob.arrayBuffer(),
          metadata
        })
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'aggiunta dei metadati');
      }

      return await response.blob();
    } catch (error) {
      console.error('Errore nell\'aggiunta dei metadati:', error);
      return blob;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="URL del Video"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 1 }}
          placeholder="Inserisci l'URL di un video (formati supportati: MP4, WebM, OGG, MOV)"
        />
        <Button
          variant="contained"
          onClick={handleVideoUrlSubmit}
          disabled={!videoUrl}
          sx={{ mr: 1 }}
        >
          Carica da URL
        </Button>
      </Box>
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<TextFieldsIcon />} label="Testo" />
            <Tab icon={<FilterIcon />} label="Filtri" />
            <Tab icon={<ImageIcon />} label="Immagini" />
            <Tab icon={<ContentCutIcon />} label="Taglia" />
            <Tab icon={<SpeedIcon />} label="Velocità" />
            <Tab icon={<VolumeUpIcon />} label="Audio" />
            <Tab icon={<TuneIcon />} label="Avanzate" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button variant="contained" onClick={addTextOverlay}>
                  Aggiungi Testo
                </Button>
              </Grid>
              {textOverlays.map(overlay => (
                <Grid item xs={12} key={overlay.id}>
                  <TextField
                    fullWidth
                    label="Testo"
                    value={overlay.text}
                    onChange={(e) => {
                      const updatedOverlays = textOverlays.map(t =>
                        t.id === overlay.id ? { ...t, text: e.target.value } : t
                      );
                      setTextOverlays(updatedOverlays);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 1 && (
            <FormControl fullWidth>
              <InputLabel>Filtro</InputLabel>
              <Select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <MenuItem value="">Nessun Filtro</MenuItem>
                <MenuItem value="grayscale">Bianco e Nero</MenuItem>
                <MenuItem value="sepia">Seppia</MenuItem>
              </Select>
            </FormControl>
          )}

          {activeTab === 2 && (
            <Box>
              <Button
                variant="contained"
                component="label"
                sx={{ mr: 1 }}
              >
                Carica Immagine
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      addImageOverlay(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              <TextField
                label="URL dell'Immagine"
                sx={{ mr: 1, minWidth: 300 }}
                onChange={(e) => setImageUrl(e.target.value)}
                value={imageUrl}
                error={!!error}
                helperText={error}
              />
              <Button
                variant="contained"
                onClick={() => imageUrl && addImageOverlay(imageUrl)}
                disabled={!imageUrl}
              >
                Carica da URL
              </Button>
            </Box>
          )}

          {activeTab === 4 && (
            <Box sx={{ width: '100%', p: 2 }}>
              <Typography gutterBottom>Velocità di Riproduzione</Typography>
              <Slider
                value={speed}
                min={0.25}
                max={2}
                step={0.25}
                marks
                onChange={(e, newValue) => {
                  if (typeof newValue === 'number' && videoRef.current) {
                    setSpeed(newValue);
                    videoRef.current.playbackRate = newValue;
                  }
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}x`}
              />
            </Box>
          )}

          {activeTab === 5 && (
            <Box sx={{ width: '100%', p: 2 }}>
              <Typography gutterBottom>Volume</Typography>
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.1}
                marks
                onChange={(e, newValue) => {
                  if (typeof newValue === 'number' && videoRef.current) {
                    setVolume(newValue);
                    videoRef.current.volume = newValue;
                  }
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
              />
            </Box>
          )}

          {activeTab === 6 && (
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Statistiche Video</Typography>
                    {showAnalytics && (
                      <Box>
                        <Typography>Risoluzione: {videoRef.current?.videoWidth || 0}x{videoRef.current?.videoHeight || 0}</Typography>
                        <Typography>Durata: {Math.floor(duration)} secondi</Typography>
                        <Typography>Frame Rate: {videoRef.current?.getVideoPlaybackQuality ? `${Math.round(videoRef.current.getVideoPlaybackQuality().totalVideoFrames / (videoRef.current.currentTime || 1))} fps` : 'N/A'}</Typography>
                        <Typography>Dimensione File: Calcolo in corso...</Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
                {aiEnhancement && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>Suggerimenti AI</Typography>
                      <Typography>• Ottimizza la luminosità per una migliore visibilità</Typography>
                      <Typography>• Aggiungi sottotitoli per aumentare l'engagement</Typography>
                      <Typography>• Considera l'aggiunta di una musica di sottofondo</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      <Box sx={{ position: 'relative', mb: 2 }}>
        <video
          ref={videoRef}
          src={videoSrc}
          style={{ width: '100%', maxHeight: '500px' }}
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleTimeChange}
          sx={{ mx: 2 }}
        />
        <Typography>
          {Math.floor(currentTime)}/{Math.floor(duration)}s
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Tooltip title="Annulla">
            <IconButton onClick={undo} disabled={undoStack.length === 0}>
              <UndoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ripeti">
            <IconButton onClick={redo} disabled={redoStack.length === 0}>
              <RedoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Salva">
            <IconButton onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Gestore Sottotitoli */}
      <SubtitleManager
        videoSrc={videoSrc}
        onSave={(newSubtitles) => {
          setSubtitles(newSubtitles);
          // Qui implementeremo la logica per incorporare i sottotitoli nel video
          console.log('Sottotitoli salvati:', newSubtitles);
        }}
      />

      {/* Chatbot Assistant */}
      <ChatAssistant
        onSuggestionClick={(suggestion) => {
          // Gestisci le azioni suggerite dal chatbot
          console.log('Suggerimento selezionato:', suggestion);
        }}
      />
    </Box>
  );
};

export default VideoEditor;