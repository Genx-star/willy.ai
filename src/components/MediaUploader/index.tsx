import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface MediaUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept: string;
  maxSize: number;
}

const MediaUploader = ({ onUpload, accept, maxSize }: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`Il file è troppo grande. Dimensione massima: ${maxSize / 1000000}MB`);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await onUpload(file);
    } catch (err) {
      setError('Errore durante il caricamento del file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="media-upload"
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      <label htmlFor="media-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          disabled={uploading}
        >
          {uploading ? 'Caricamento in corso...' : 'Carica File'}
        </Button>
      </label>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Formati supportati: {accept}
      </Typography>
    </Box>
  );
};

export default MediaUploader;