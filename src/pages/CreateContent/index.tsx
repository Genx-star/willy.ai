import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Divider,
  Tooltip,
  Switch,
  Stack,
  LinearProgress
} from '@mui/material';
import SpeechToContent from '@/components/SpeechToContent';
import VideoEditor from '@/components/VideoEditor';
import AudioEditor from '@/components/AudioEditor';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { musicLibrary, musicGenres, musicMoods } from '@/data/musicLibrary';
import { useContentStore } from '@/stores/contentStore';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnalyticsIcon from '@mui/icons-material/Analytics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CreateContent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [aiOptimization, setAiOptimization] = useState(true);
  const [multiPlatform, setMultiPlatform] = useState(true);
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { isGenerating, generatedContent, error, generateContent, resetContent } = useContentStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    resetContent();
  };

  const handleGenerate = async () => {
    const contentType = ['text', 'image', 'video', 'audio'][activeTab] as 'text' | 'image' | 'video' | 'audio';
    await generateContent(prompt, contentType);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Create Content
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Ottimizzazione AI Avanzata">
            <FormControl component="fieldset">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>AI</Typography>
                <Switch
                  checked={aiOptimization}
                  onChange={(e) => setAiOptimization(e.target.checked)}
                  icon={<AutoAwesomeIcon />}
                  checkedIcon={<AutoAwesomeIcon color="primary" />}
                />
              </Stack>
            </FormControl>
          </Tooltip>
          
          <Tooltip title="Distribuzione Multi-piattaforma">
            <FormControl component="fieldset">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Multi</Typography>
                <Switch
                  checked={multiPlatform}
                  onChange={(e) => setMultiPlatform(e.target.checked)}
                  icon={<LanguageIcon />}
                  checkedIcon={<LanguageIcon color="primary" />}
                />
              </Stack>
            </FormControl>
          </Tooltip>

          <Tooltip title="Pianificazione Automatica">
            <FormControl component="fieldset">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Auto</Typography>
                <Switch
                  checked={autoSchedule}
                  onChange={(e) => setAutoSchedule(e.target.checked)}
                  icon={<ScheduleIcon />}
                  checkedIcon={<ScheduleIcon color="primary" />}
                />
              </Stack>
            </FormControl>
          </Tooltip>

          <Tooltip title="Analytics in Tempo Reale">
            <FormControl component="fieldset">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Analytics</Typography>
                <Switch
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  icon={<AnalyticsIcon />}
                  checkedIcon={<AnalyticsIcon color="primary" />}
                />
              </Stack>
            </FormControl>
          </Tooltip>
        </Stack>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="content creation tabs"
          variant="fullWidth"
        >
          <Tab icon={<TextFieldsIcon />} label="Text" />
          <Tab icon={<ImageIcon />} label="Image" />
          <Tab icon={<VideoLibraryIcon />} label="Video" />
          <Tab icon={<AudiotrackIcon />} label="Audio" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {(activeTab === 1 || activeTab === 2) && (
            <SpeechToContent
              contentType={activeTab === 1 ? 'image' : 'video'}
              onTranscriptionComplete={(text) => setPrompt(text)}
            />
          )}

          <Divider sx={{ my: 2 }} />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Inserisci il tuo prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              fullWidth
            >
              {isGenerating ? 'Generazione in Corso...' : 'Genera Contenuto'}
            </Button>
            
            {isGenerating && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={generationProgress} />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Ottimizzazione del contenuto: {generationProgress}%
                </Typography>
              </Box>
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShareIcon />}
                  onClick={() => console.log('Condividi')}
                >
                  Condividi
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<TrendingUpIcon />}
                  onClick={() => console.log('Analytics')}
                >
                  Analytics
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generated Text
                </Typography>
                {error ? (
                  <Alert severity="error">{error}</Alert>
                ) : (
                  <Typography>
                    {generatedContent.text || 'Your generated text will appear here...'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Generated Image
                    </Typography>
                    <Box
                      sx={{
                        height: 300,
                        backgroundColor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {error ? (
                        <Alert severity="error">{error}</Alert>
                      ) : generatedContent.image ? (
                        <img
                          src={generatedContent.image}
                          alt="Generated content"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      ) : (
                        <Typography color="textSecondary">
                          Your generated image will appear here...
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Editor Video
                </Typography>
                {error ? (
                  <Alert severity="error">{error}</Alert>
                ) : generatedContent.video ? (
                  <VideoEditor
                    videoSrc={generatedContent.video}
                    onSave={(editedVideo) => {
                      // Qui gestiamo il video modificato
                      console.log('Video modificato:', editedVideo);
                      // TODO: Implementare la logica di salvataggio
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography color="textSecondary">
                      Genera un video per iniziare a modificarlo...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Seleziona Musica di Sottofondo
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Genere Musicale</InputLabel>
                      <Select
                        value={selectedGenre}
                        label="Genere Musicale"
                        onChange={(e) => setSelectedGenre(e.target.value)}
                      >
                        <MenuItem value="">Tutti i Generi</MenuItem>
                        {musicGenres.map((genre) => (
                          <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Mood</InputLabel>
                      <Select
                        value={selectedMood}
                        label="Mood"
                        onChange={(e) => setSelectedMood(e.target.value)}
                      >
                        <MenuItem value="">Tutti i Mood</MenuItem>
                        {musicMoods.map((mood) => (
                          <MenuItem key={mood} value={mood}>{mood}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {musicLibrary
                        .filter(track => 
                          (!selectedGenre || track.genre.includes(selectedGenre)) &&
                          (!selectedMood || track.mood.includes(selectedMood))
                        )
                        .map((track) => (
                          <Card key={track.id} sx={{ mb: 2, p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle1">{track.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{track.artist}</Typography>
                                <Box sx={{ mt: 1 }}>
                                  {track.genre.map((g) => (
                                    <Chip key={g} label={g} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                  ))}
                                </Box>
                              </Box>
                              <Box>
                                <IconButton
                                  onClick={() => {
                                    if (selectedTrack === track.id && isPlaying) {
                                      audioPlayer?.pause();
                                      setIsPlaying(false);
                                    } else {
                                      if (audioPlayer) {
                                        audioPlayer.pause();
                                      }
                                      const newPlayer = new Audio(track.preview_url);
                                      newPlayer.play();
                                      setAudioPlayer(newPlayer);
                                      setSelectedTrack(track.id);
                                      setIsPlaying(true);
                                    }
                                  }}
                                >
                                  {selectedTrack === track.id && isPlaying ? 
                                    <PauseIcon /> : 
                                    <PlayArrowIcon />
                                  }
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        ))}
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    height: 100,
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {error ? (
                    <Alert severity="error">{error}</Alert>
                  ) : generatedContent.audio ? (
                    <AudioEditor
                      audioSrc={generatedContent.audio}
                      onSave={(editedAudio) => {
                        // Gestione dell'audio modificato
                        console.log('Audio modificato:', editedAudio);
                        // TODO: Implementare la logica di salvataggio
                      }}
                    />
                  ) : (
                    <Typography color="textSecondary">
                      Genera un audio per iniziare a modificarlo...
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateContent;