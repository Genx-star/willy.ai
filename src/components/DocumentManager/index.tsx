import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'word' | 'excel' | 'text';
  size: number;
  createdAt: Date;
  lastModified: Date;
  category: string;
  tags: string[];
  status: 'processing' | 'completed' | 'error';
  content?: string;
  thumbnail?: string;
}

interface ConversionJob {
  id: string;
  sourceDocument: Document;
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

const DocumentManager = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [conversionJobs, setConversionJobs] = useState<ConversionJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categorie predefinite per i documenti
  const categories = [
    { id: 'all', name: 'Tutte le Categorie' },
    { id: 'invoices', name: 'Fatture' },
    { id: 'contracts', name: 'Contratti' },
    { id: 'reports', name: 'Report' },
    { id: 'receipts', name: 'Ricevute' },
    { id: 'other', name: 'Altri' }
  ];

  // Gestione del caricamento dei documenti
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      // Simula il caricamento e il processamento dei documenti
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: getDocumentType(file.name),
          size: file.size,
          createdAt: new Date(),
          lastModified: new Date(),
          category: 'other',
          tags: [],
          status: 'processing'
        };
        setDocuments(prev => [...prev, newDocument]);

        // Simula il processamento del documento
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateDocumentStatus(newDocument.id, 'completed');
      }
    } catch (error) {
      console.error('Errore nel caricamento dei documenti:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Determina il tipo di documento in base all'estensione
  const getDocumentType = (filename: string): Document['type'] => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'doc':
      case 'docx': return 'word';
      case 'xls':
      case 'xlsx': return 'excel';
      default: return 'text';
    }
  };

  // Aggiorna lo stato di un documento
  const updateDocumentStatus = (documentId: string, status: Document['status']) => {
    setDocuments(documents.map(doc =>
      doc.id === documentId ? { ...doc, status } : doc
    ));
  };

  // Avvia la conversione di un documento
  const startDocumentConversion = (document: Document, targetFormat: string) => {
    const newJob: ConversionJob = {
      id: Date.now().toString(),
      sourceDocument: document,
      targetFormat,
      status: 'processing',
      progress: 0
    };
    setConversionJobs([...conversionJobs, newJob]);

    // Simula il processo di conversione
    simulateConversion(newJob.id);
  };

  // Simula il processo di conversione
  const simulateConversion = (jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setConversionJobs(jobs =>
        jobs.map(job =>
          job.id === jobId
            ? { ...job, progress, status: progress >= 100 ? 'completed' : 'processing' }
            : job
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoFixHighIcon color="primary" />
        {t('documentManager.title', 'Gestione Documenti')}
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab icon={<FolderIcon />} label={t('documentManager.tabs.documents', 'Documenti')} />
          <Tab icon={<AutoFixHighIcon />} label={t('documentManager.tabs.processing', 'Elaborazione')} />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('documentManager.upload.title', 'Carica Documenti')}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  startIcon={<UploadIcon />}
                  disabled={isUploading}
                >
                  {isUploading
                    ? t('documentManager.upload.uploading', 'Caricamento in corso...')
                    : t('documentManager.upload.button', 'Seleziona File')}
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                  />
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('documentManager.categories.title', 'Categorie')}
                </Typography>
                <List>
                  {categories.map((category) => (
                    <ListItem
                      key={category.id}
                      button
                      selected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <ListItemText primary={category.name} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder={t('documentManager.search.placeholder', 'Cerca documenti...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Box>

                <List>
                  {documents.map((document) => (
                    <ListItem key={document.id}>
                      <ListItemText
                        primary={document.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              size="small"
                              label={document.type.toUpperCase()}
                              color={document.status === 'completed' ? 'success' : 'default'}
                            />
                            <Typography variant="caption">
                              {new Date(document.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={t('documentManager.actions.convert', 'Converti')}>
                          <IconButton onClick={() => startDocumentConversion(document, 'pdf')}>
                            <PictureAsPdfIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('documentManager.actions.download', 'Scarica')}>
                          <IconButton>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('documentManager.actions.delete', 'Elimina')}>
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('documentManager.processing.title', 'Elaborazioni in Corso')}
                </Typography>
                <List>
                  {conversionJobs.map((job) => (
                    <ListItem key={job.id}>
                      <ListItemText
                        primary={`${job.sourceDocument.name} → ${job.targetFormat.toUpperCase()}`}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress
                              variant="determinate"
                              value={job.progress}
                              size={20}
                            />
                            <Typography variant="caption">
                              {job.status === 'completed'
                                ? t('documentManager.processing.completed', 'Completato')
                                : `${job.progress}%`}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DocumentManager;