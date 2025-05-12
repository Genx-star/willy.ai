import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

const features = [
  {
    title: 'Text Generation',
    description: 'Create engaging social media posts with AI-powered text generation',
    icon: <TextFieldsIcon sx={{ fontSize: 40 }} />,
    color: '#2196f3'
  },
  {
    title: 'Image Creation',
    description: 'Generate custom images from text descriptions using advanced AI',
    icon: <ImageIcon sx={{ fontSize: 40 }} />,
    color: '#4caf50'
  },
  {
    title: 'Video Production',
    description: 'Create short, engaging videos with AI-powered editing tools',
    icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />,
    color: '#f44336'
  },
  {
    title: 'Audio Generation',
    description: 'Generate music, sound effects, and voice-overs using AI',
    icon: <AudiotrackIcon sx={{ fontSize: 40 }} />,
    color: '#ff9800'
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to WILLY.AI
        </Typography>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
          Your AI-powered social content creation platform
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/create')}
          sx={{ borderRadius: 8 }}
        >
          Start Creating
        </Button>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                    height: 80,
                    color: feature.color
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to transform your social media content?
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/create')}
          sx={{ mt: 2, borderRadius: 8 }}
        >
          Get Started Now
        </Button>
      </Box>
    </Box>
  );
};

export default Home;