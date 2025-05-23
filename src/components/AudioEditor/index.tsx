import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  IconButton,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import TuneIcon from '@mui/icons-material/Tune';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';

interface AudioEditorProps {
  audioSrc: string;
  onSave: (editedAudio: Blob) => void;
}

interface AudioEffect {
  id: string;
  type: 'volume' | 'speed' | 'equalizer';
  value: number;
  startTime: number;
  endTime: number;
}

const AudioEditor = ({ audioSrc, onSave }: AudioEditorProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Aggiunto nome variabile mancante
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [effects, setEffects] = useState<AudioEffect[]>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (_event: Event, newValue: number | number[]) => { // Aggiunto _event
    if (audioRef.current && typeof newValue === 'number') {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => { // Aggiunto _event
    if (audioRef.current && typeof newValue === 'number') {
      audioRef.current.volume = newValue;
      setVolume(newValue);
      addEffect('volume', newValue);
    }
  };

  const handleSpeedChange = (_event: Event, newValue: number | number[]) => { // Aggiunto _event
    if (audioRef.current && typeof newValue === 'number') {
      audioRef.current.playbackRate = newValue;
      setSpeed(newValue);
      addEffect('speed', newValue);
    }
  };

  const addEffect = (type: 'volume' | 'speed' | 'equalizer', value: number) => {
    const newEffect: AudioEffect = {
      id: Date.now().toString(),
      type,
      value,
      startTime: currentTime,
      endTime: currentTime + 1 // Durata predefinita di 1 secondo
    };
    setEffects([...effects, newEffect]);
    addToUndoStack('addEffect', newEffect);
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
        case 'addEffect':
          setEffects(effects.filter(e => e.id !== lastAction.data.id));
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

      switch (lastAction.action) {
        case 'addEffect':
          setEffects([...effects, lastAction.data]);
          break;
        // Aggiungi altri casi per diverse azioni
      }
    }
  };

  const handleSave = () => {
    if (audioRef.current) {
      // TODO: Implementare la logica di salvataggio audio con effetti
      // Per ora, simuliamo il salvataggio
      console.log('Salvataggio audio con effetti:', effects, 'Volume:', volume, 'Speed:', speed);
      const audioBlob = new Blob([], { type: 'audio/mp3' }); // Blob vuoto per ora
      onSave(audioBlob);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <audio ref={audioRef} src={audioSrc} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Aggiunto ref al canvas se necessario per visualizzazioni o elaborazioni future */}

      {/* Controlli principali */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Typography variant="body2">
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleTimeChange}
          sx={{ flexGrow: 1 }}
          aria-labelledby="time-slider"
        />
      </Box>

      {/* Tabs per i diversi controlli */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_event, newValue) => setActiveTab(newValue)} // Aggiunto _event
          aria-label="audio editor tabs"
        >
          <Tab icon={<VolumeUpIcon />} label="Volume" />
          <Tab icon={<SpeedIcon />} label="Velocità" />
          <Tab icon={<TuneIcon />} label="Equalizzatore" />
          <Tab icon={<ContentCutIcon />} label="Taglia" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {/* Tab Volume */}
          {activeTab === 0 && (
            <Box sx={{ width: '100%' }}>
              <Typography gutterBottom>Volume</Typography>
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.1}
                onChange={handleVolumeChange}
                marks
                valueLabelDisplay="auto"
                aria-labelledby="volume-slider"
              />
            </Box>
          )}

          {/* Tab Velocità */}
          {activeTab === 1 && (
            <Box sx={{ width: '100%' }}>
              <Typography gutterBottom>Velocità di Riproduzione</Typography>
              <Slider
                value={speed}
                min={0.5}
                max={2}
                step={0.1}
                onChange={handleSpeedChange}
                marks
                valueLabelDisplay="auto"
                aria-labelledby="speed-slider"
              />
            </Box>
          )}

          {/* Tab Equalizzatore */}
          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography gutterBottom>Bassi</Typography>
                <Slider
                  orientation="vertical"
                  defaultValue={0} // Considerare di usare useState per questi valori se devono essere controllati
                  min={-12}
                  max={12}
                  sx={{ height: 150 }}
                  aria-labelledby="bass-eq-slider"
                />
              </Grid>
              <Grid item xs={4}>
                <Typography gutterBottom>Medi</Typography>
                <Slider
                  orientation="vertical"
                  defaultValue={0}
                  min={-12}
                  max={12}
                  sx={{ height: 150 }}
                  aria-labelledby="mid-eq-slider"
                />
              </Grid>
              <Grid item xs={4}>
                <Typography gutterBottom>Alti</Typography>
                <Slider
                  orientation="vertical"
                  defaultValue={0}
                  min={-12}
                  max={12}
                  sx={{ height: 150 }}
                  aria-labelledby="treble-eq-slider"
                />
              </Grid>
            </Grid>
          )}

          {/* Tab Taglia */}
          {activeTab === 3 && (
            <Box sx={{ width: '100%' }}>
              <Typography gutterBottom>Seleziona l'intervallo da tagliare</Typography>
              <Slider
                value={[currentTime, currentTime + 1]} // Esempio, da rendere più dinamico
                max={duration}
                onChange={(_event, newValue) => { // Corretto: Aggiunto (_event, newValue)
                  // Implementa la logica per il taglio
                  console.log('Nuovo intervallo di taglio:', newValue);
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={formatTime}
                aria-labelledby="cut-range-slider"
                disableSwap
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Barra degli strumenti */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Salva Modifiche
        </Button>
      </Box>
    </Box>
  );
};

export default AudioEditor;

