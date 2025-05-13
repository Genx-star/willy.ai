import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface TutorialStep {
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialGuideProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ onComplete, onSkip }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // setHintMessage non è utilizzata, quindi la rinominiamo con _ per convenzione
  const [hintMessage, _setHintMessage] = useState(''); 

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Benvenuto in WILLY.AI',
      description: 'Ti guideremo attraverso le principali funzionalità della piattaforma.'
    },
    {
      title: 'Gestione Modelli AI',
      description: 'Qui puoi gestire e aggiornare i tuoi modelli di intelligenza artificiale.',
      target: '#ai-models-section'
    },
    {
      title: 'Integrazioni Esterne',
      description: 'Connetti la piattaforma con i tuoi servizi preferiti per automatizzare il tuo lavoro.',
      target: '#integrations-section'
    },
    {
      title: 'Gestione Tag',
      description: 'Organizza i tuoi contenuti con un sistema di tag personalizzato.',
      target: '#tag-manager'
    },
    {
      title: 'Campagne',
      description: 'Crea e gestisci le tue campagne di marketing in modo efficiente.',
      target: '#campaign-manager'
    }
  ];

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSkip = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
    if (onSkip) onSkip();
  };

  const handleComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
    if (onComplete) onComplete();
  };

  // Funzione displayHint commentata perché non utilizzata (causava TS6133 per setHintMessage)
  /*
  const displayHint = (message: string) => {
    _setHintMessage(message); // Aggiornato per usare _setHintMessage se si decommenta
    setShowHint(true);
  };
  */

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => setShowTutorial(true)} 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        aria-label="Apri guida tutorial"
      >
        <Tooltip title="Apri guida">
          <HelpIcon />
        </Tooltip>
      </IconButton>

      <Dialog
        open={showTutorial}
        onClose={handleSkip}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon color="primary" />
          Tutorial Guidato
          <IconButton
            onClick={handleSkip}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Chiudi tutorial"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {tutorialSteps.map((step, index) => (
              <Step key={step.title}>
                <StepLabel>{step.title}</StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  {/* Esempio di come potresti usare displayHint, se necessario */}
                  {/* <Button onClick={() => displayHint(Suggerimento per ${step.title})}>Mostra Suggerimento</Button> */}
                  <Box sx={{ mb: 2, mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={index === tutorialSteps.length - 1 ? handleComplete : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === tutorialSteps.length - 1 ? 'Completa' : 'Avanti'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Indietro
                    </Button>
                    <Button onClick={handleSkip} sx={{ mt: 1, mr: 1 }}>
                      Salta Tutorial
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showHint}
        autoHideDuration={6000}
        onClose={() => setShowHint(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowHint(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {hintMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TutorialGuide;

