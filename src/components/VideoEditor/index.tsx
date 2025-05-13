import { useState, useRef, useEffect } from "react";
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
  Divider,
  FormControlLabel,
  Alert // Aggiunto Alert
} from "@mui/material";
// import { obfuscate } from "javascript-obfuscator";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import SubtitleManager from "../SubtitleManager"; // Rimosso import di SubtitleManagerProps
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
// import SpeedIcon from "@mui/icons-material/Speed"; // Rimosso perché non utilizzato (TS6133)
// import VolumeUpIcon from "@mui/icons-material/VolumeUp"; // Rimosso perché non utilizzato (TS6133)
import TuneIcon from "@mui/icons-material/Tune";
import Switch from '@mui/material/Switch';

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
  const instanceId = useRef(uuidv4());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyInstance = async () => {
      try {
        const timestamp = Date.now();
        const hash = CryptoJS.SHA256(`${instanceId.current}_${timestamp}`).toString();
        const isValid = hash.length > 0;
        if (!isValid) {
          console.error("Istanza non autorizzata");
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Errore durante la verifica:", error);
        setIsAuthenticated(false);
      }
    };
    verifyInstance();

    const debugProtection = () => {
      const startTime = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        setIsAuthenticated(false);
      }
    };
    const interval = setInterval(debugProtection, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          console.warn("Rilevata manipolazione del DOM");
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [_subtitles, _setSubtitles] = useState<Subtitle[]>([]); // setSubtitles non è usato, quindi rinominato _setSubtitles
  const [videoUrl, setVideoUrl] = useState(videoSrc || "");
  const [error, setError] = useState<string | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [aiEnhancement, setAiEnhancement] = useState(true);

  const imageObjectUrls = useRef<string[]>([]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        setDuration(videoRef.current?.duration || 0);
      });
      videoRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
      });
    }
    return () => {
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl);
      }
      imageObjectUrls.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">
          Accesso non autorizzato. Questa istanza non è stata verificata.
        </Typography>
      </Box>
    );
  }

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

  const handleTimeChange = (_event: Event, newValue: number | number[]) => {
    if (videoRef.current && typeof newValue === "number") {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const addTextOverlay = () => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: "Nuovo Testo",
      position: { x: 50, y: 50 },
      fontSize: 24,
      color: "#ffffff"
    };
    setTextOverlays([...textOverlays, newText]);
    addToUndoStack("addText", newText);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith("video/")) {
        try {
          setError(null);
          const processedBlob = await addCopyrightProtection(file);
          if (videoObjectUrl) {
            URL.revokeObjectURL(videoObjectUrl);
          }
          const newVideoObjectUrl = URL.createObjectURL(processedBlob);
          setVideoObjectUrl(newVideoObjectUrl);
          if (videoRef.current) {
            videoRef.current.src = newVideoObjectUrl;
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Errore durante il caricamento del video da file");
        }
      } else if (file.type.startsWith("image/")) {
        addImageOverlay(file);
      }
    }
  };

  const addImageOverlay = async (fileOrUrl: File | string) => {
    try {
      let imageBlob: Blob;
      if (typeof fileOrUrl === "string") {
        const copyrightCheck = await checkCopyrightStatus(fileOrUrl);
        if (!copyrightCheck.isValid) {
          throw new Error("L'immagine potrebbe essere protetta da copyright. Verifica di avere i diritti necessari.");
        }
        const response = await fetch(fileOrUrl);
        if (!response.ok) throw new Error("Immagine non accessibile");
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.startsWith("image/")) {
          throw new Error("Il file deve essere un'immagine valida");
        }
        imageBlob = await response.blob();
      } else {
        if (!fileOrUrl.type.startsWith("image/")) {
          throw new Error("Il file deve essere un'immagine valida");
        }
        imageBlob = fileOrUrl;
      }

      const protectedImageBlob = await addCopyrightProtection(imageBlob);
      const objectUrl = URL.createObjectURL(protectedImageBlob);
      imageObjectUrls.current.push(objectUrl);

      const newImage: ImageOverlay = {
        id: Date.now().toString(),
        src: objectUrl,
        position: { x: 50, y: 50 },
        scale: 1
      };
      setImageOverlays(prevOverlays => [...prevOverlays, newImage]);
      addToUndoStack("addImage", newImage);
      setError(null);
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
      switch (lastAction.action) {
        case "addText":
          setTextOverlays(textOverlays.filter(t => t.id !== lastAction.data.id));
          break;
        case "addImage":
          {
            const overlayToRemove = imageOverlays.find(i => i.id === lastAction.data.id);
            if (overlayToRemove) {
              URL.revokeObjectURL(overlayToRemove.src);
              imageObjectUrls.current = imageObjectUrls.current.filter(url => url !== overlayToRemove.src);
            }
            setImageOverlays(imageOverlays.filter(i => i.id !== lastAction.data.id));
            break;
          }
      }
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const lastAction = redoStack[redoStack.length - 1];
      setRedoStack(redoStack.slice(0, -1));
      setUndoStack([...undoStack, lastAction]);
      switch (lastAction.action) {
        case "addText":
          setTextOverlays([...textOverlays, lastAction.data]);
          break;
        case "addImage":
          setImageOverlays([...imageOverlays, lastAction.data]);
          break;
      }
    }
  };

  const handleSave = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (selectedFilter) {
          applyFilter(ctx, selectedFilter);
        }
        textOverlays.forEach(overlay => {
          ctx.font = `${overlay.fontSize}px Arial`;
          ctx.fillStyle = overlay.color;
          ctx.fillText(overlay.text, overlay.position.x, overlay.position.y);
        });
        imageOverlays.forEach(overlay => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(
              img,
              overlay.position.x,
              overlay.position.y,
              img.width * overlay.scale,
              img.height * overlay.scale
            );
          }
          img.onerror = () => console.error("Errore caricamento immagine overlay per il salvataggio");
          img.src = overlay.src;
        });
        setTimeout(() => {
            canvas.toBlob(blob => {
                if (blob) {
                onSave(blob);
                }
            }, "video/mp4");
        }, 500);
      }
    }
  };

  const applyFilter = (ctx: CanvasRenderingContext2D, filter: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    switch (filter) {
      case "grayscale":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
        }
        break;
      case "sepia":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
          data[i] = (r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = (r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = (r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const handleVideoUrlSubmit = async () => {
    try {
      setError(null);
      const copyrightCheck = await checkCopyrightStatus(videoUrl);
      if (!copyrightCheck.isValid) {
        throw new Error("Il contenuto potrebbe essere protetto da copyright. Assicurati di avere i diritti necessari per utilizzarlo.");
      }
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error("URL non valido o video non accessibile");
      }
      const contentType = response.headers.get("content-type");
      const fileExtension = videoUrl.split(".").pop()?.toLowerCase();
      const validVideoExtensions = ["mp4", "webm", "ogg", "mov"];
      if ((!contentType || !contentType.startsWith("video/")) &&
          (!fileExtension || !validVideoExtensions.includes(fileExtension))) {
        throw new Error("Il file deve essere un video valido (formati supportati: MP4, WebM, OGG, MOV)");
      }
      const blob = await response.blob();
      const processedBlob = await addCopyrightProtection(blob);
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl);
      }
      const newVideoObjectUrl = URL.createObjectURL(processedBlob);
      setVideoObjectUrl(newVideoObjectUrl);
      if (videoRef.current) {
        videoRef.current.src = newVideoObjectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il caricamento del video");
    }
  };

  interface CopyrightCheckResult {
    isValid: boolean;
    message: string;
    confidence: number;
    detectedSource?: string;
  }

  const checkCopyrightStatus = async (url: string): Promise<CopyrightCheckResult> => {
    try {
      const response = await fetch("https://api.copyrightdetection.ai/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_COPYRIGHT_API_KEY}`
        },
        body: JSON.stringify({ url, type: "video", checkOptions: { checkVisual: true, checkAudio: true, checkText: true }})
      });
      if (!response.ok) throw new Error("Errore durante la verifica del copyright");
      const result = await response.json();
      if (!result.isValid && result.confidence > 0.8) {
        const alternatives = await findCopyrightFreeAlternatives(url);
        return { isValid: false, message: `Contenuto protetto da copyright. Suggerimenti alternativi: ${alternatives.join(", ")}`, confidence: result.confidence, detectedSource: result.source };
      }
      return { isValid: result.isValid, message: result.message, confidence: result.confidence };
    } catch (error) {
      console.error("Errore nel controllo del copyright:", error);
      return { isValid: false, message: "Impossibile verificare il copyright. Verificare manualmente.", confidence: 0 };
    }
  };

  const findCopyrightFreeAlternatives = async (url: string): Promise<string[]> => {
    try {
      const response = await fetch("https://api.copyrightfree.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_COPYRIGHT_FREE_API_KEY}`
        },
        body: JSON.stringify({ originalUrl: url, type: "video" })
      });
      if (!response.ok) throw new Error("Errore nella ricerca di alternative copyright-free");
      const results = await response.json();
      return results.alternatives.map((alt: any) => alt.url);
    } catch (error) {
      console.error("Errore nella ricerca di alternative copyright-free:", error);
      return [];
    }
  };

  const addCopyrightProtection = async (blob: Blob): Promise<Blob> => {
    console.log("Simulazione: Aggiunta protezione copyright al blob video/immagine.");
    return blob;
  };

  // Funzione per gestire il salvataggio dei sottotitoli da SubtitleManager
  const handleSaveSubtitles = (subtitlesToSave: Subtitle[]) => {
    // Qui puoi fare ciò che serve con i sottotitoli salvati,
    // ad esempio, salvarli nello stato del VideoEditor o inviarli a un backend.
    console.log("Sottotitoli salvati da SubtitleManager:", subtitlesToSave);
    _setSubtitles(subtitlesToSave); // Ora _setSubtitles è usato
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Editor Video Avanzato
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="URL Video Esterno (MP4, WebM, OGG, MOV)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button fullWidth variant="contained" onClick={handleVideoUrlSubmit} sx={{ height: "100%" }}>
            Carica Video da URL
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button fullWidth component="label" variant="outlined" sx={{ height: "100%" }}>
            Carica Video da File
            <input type="file" hidden accept="video/*,image/*" onChange={handleFileChange} />
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ position: "relative", width: "100%", aspectRatio: "16/9", backgroundColor: "black" }}>
        <video
          ref={videoRef}
          src={videoObjectUrl || videoSrc}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          crossOrigin="anonymous"
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </Paper>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 2 }}>
        <IconButton onClick={togglePlay} color="primary">
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleTimeChange}
          aria-labelledby="continuous-slider"
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Typography variant="body2">
          {new Date(currentTime * 1000).toISOString().substr(14, 5)} / {new Date(duration * 1000).toISOString().substr(14, 5)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
        <Button startIcon={<UndoIcon />} onClick={undo} disabled={undoStack.length === 0}>
          Annulla
        </Button>
        <Button startIcon={<RedoIcon />} onClick={redo} disabled={redoStack.length === 0}>
          Ripristina
        </Button>
        <Button startIcon={<SaveIcon />} onClick={handleSave} variant="contained">
          Salva Modifiche
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(_e, val) => setActiveTab(val)} centered sx={{ mb: 2 }}>
        <Tab label="Controlli Base" />
        <Tab label="Testo Overlay" />
        <Tab label="Immagine Overlay" />
        <Tab label="Filtri" />
        <Tab label="Sottotitoli" />
        <Tab label="Avanzate" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Controlli Base</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}><Typography>Velocità:</Typography></Grid>
            <Grid item xs={10}>
              <Slider value={speed} onChange={(_e, val) => setSpeed(val as number)} min={0.5} max={2} step={0.1} marks valueLabelDisplay="auto" />
            </Grid>
            <Grid item xs={2}><Typography>Volume:</Typography></Grid>
            <Grid item xs={10}>
              <Slider value={volume} onChange={(_e, val) => setVolume(val as number)} min={0} max={1} step={0.01} marks valueLabelDisplay="auto" />
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Testo Overlay</Typography>
          <Button onClick={addTextOverlay} variant="outlined" sx={{ mb: 1 }}>
            Aggiungi Testo
          </Button>
          {textOverlays.map(overlay => (
            <Box key={overlay.id} sx={{ mb: 1, p: 1, border: "1px solid grey" }}>
              <TextField label="Testo" defaultValue={overlay.text} fullWidth margin="dense" />
            </Box>
          ))}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Immagine Overlay</Typography>
          <Button component="label" variant="outlined" sx={{ mb: 1 }}>
            Carica Immagine
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          <TextField
            fullWidth
            label="URL Immagine Esterna"
            variant="outlined"
            size="small"
            sx={{ mb:1 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addImageOverlay((e.target as HTMLInputElement).value);
              }
            }}
          />
          {imageOverlays.map(overlay => (
            <Box key={overlay.id} sx={{ mb: 1, p: 1, border: "1px solid grey" }}>
              <img src={overlay.src} alt="overlay" style={{ maxWidth: "100px", maxHeight: "100px" }} />
            </Box>
          ))}
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Filtri Video</Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel>Seleziona Filtro</InputLabel>
            <Select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} label="Seleziona Filtro">
              <MenuItem value="">Nessuno</MenuItem>
              <MenuItem value="grayscale">Scala di Grigi</MenuItem>
              <MenuItem value="sepia">Seppia</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      )}

      {activeTab === 4 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Gestione Sottotitoli</Typography>
          <SubtitleManager
            videoSrc={videoObjectUrl || videoSrc || ""}
            onSave={handleSaveSubtitles} // Aggiunta prop onSave
          />
        </Paper>
      )}

      {activeTab === 5 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Impostazioni Avanzate</Typography>
          <FormControlLabel
            control={<Switch checked={showAnalytics} onChange={(e) => setShowAnalytics(e.target.checked)} />}
            label="Mostra Analisi Video (Simulato)"
          />
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={<Switch checked={aiEnhancement} onChange={(e) => setAiEnhancement(e.target.checked)} />}
            label="Abilita Miglioramenti AI (Simulato)"
          />
          <Tooltip title="Configura i parametri specifici per i miglioramenti AI">
            <IconButton sx={{ ml:1 }} size="small">
              <TuneIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      )}

    </Box>
  );
};

export default VideoEditor;

