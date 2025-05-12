import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';

interface GuideStep {
  title: string;
  description: string;
  tips: string[];
}

interface ContextualGuideProps {
  feature: string;
  steps: GuideStep[];
  onComplete?: () => void;
}

const ContextualGuide: React.FC<ContextualGuideProps> = ({ feature, steps, onComplete }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    const guideStatus = localStorage.getItem(`hasSeenGuide_${feature}`);
    setHasSeenGuide(!!guideStatus);
  }, [feature]);

  const handleOpen = () => {
    setOpen(true);
    setActiveStep(0);
  };

  const handleClose = () => {
    setOpen(false);
    if (!hasSeenGuide) {
      localStorage.setItem(`hasSeenGuide_${feature}`, 'true');
      setHasSeenGuide(true);
      if (onComplete) onComplete();
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = () => {
    handleClose();
  };

  // Mostra automaticamente la guida al primo accesso
  useEffect(() => {
    if (!hasSeenGuide) {
      setOpen(true);
    }
  }, [hasSeenGuide]);

  return (
    <>
      <Tooltip title="Apri guida">
        <IconButton
          onClick={handleOpen}
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'primary.light',
            },
          }}
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'visible',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Guida: {feature}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.title}>
                <StepLabel>{step.title}</StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography>{step.description}</Typography>
                    {step.tips.length > 0 && (
                      <Paper elevation={0} sx={{ bgcolor: 'primary.light', p: 2, mt: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Suggerimenti:</Typography>
                        {step.tips.map((tip, tipIndex) => (
                          <Typography
                            key={tipIndex}
                            variant="body2"
                            sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                          >
                            • {tip}
                          </Typography>
                        ))}
                      </Paper>
                    )}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleComplete : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Completa' : 'Avanti'}
                    </Button>
                    {index > 0 && (
                      <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Indietro
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>

        {activeStep === steps.length && (
          <DialogActions>
            <Alert severity="success" sx={{ width: '100%' }}>
              Hai completato la guida! Ora puoi iniziare a utilizzare tutte le funzionalità.
            </Alert>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default ContextualGuide;