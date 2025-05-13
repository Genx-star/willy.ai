import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  // Button, // Rimosso TS6133
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";

interface ContentItem {
  id: string;
  type: "text" | "image" | "video" | "audio";
  title: string;
  createdAt: string;
  preview: string;
}

const mockHistory: ContentItem[] = [
  {
    id: "1",
    type: "text",
    title: "Marketing Campaign Post",
    createdAt: "2023-08-10",
    preview: "Discover our latest innovation in AI-powered solutions..."
  },
  {
    id: "2",
    type: "image",
    title: "Product Showcase",
    createdAt: "2023-08-09",
    preview: "https://placeholder.com/300x200"
  },
  {
    id: "3",
    type: "video",
    title: "Tutorial Video",
    createdAt: "2023-08-08",
    preview: "https://placeholder.com/video"
  },
  {
    id: "4",
    type: "audio",
    title: "Podcast Intro",
    createdAt: "2023-08-07",
    preview: "https://placeholder.com/audio"
  }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<ContentItem[]>(mockHistory);

  const getContentIcon = (type: string) => {
    switch (type) {
      case "text":
        return <TextFieldsIcon />;
      case "image":
        return <ImageIcon />;
      case "video":
        return <VideoLibraryIcon />;
      case "audio":
        return <AudiotrackIcon />;
      default:
        return null;
    }
  };

  const handleDelete = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const handleShare = (id: string) => {
    // TODO: Implement sharing functionality
    console.log("Share content:", id);
  };

  const filteredHistory = history.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4">Content History</Typography>
        <TextField
          size="small"
          placeholder="Search content"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredHistory.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)"
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {getContentIcon(item.type)}
                  <Chip
                    label={item.type.toUpperCase()}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created on {item.createdAt}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {item.preview}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <IconButton
                  size="small"
                  onClick={() => handleShare(item.id)}
                  aria-label="share"
                >
                  <ShareIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(item.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredHistory.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No content found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default History;

