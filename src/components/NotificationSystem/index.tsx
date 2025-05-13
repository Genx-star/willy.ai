import React from 'react'; // Corretto: rimossa virgola dopo React
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material'; // Importato AlertColor come tipo

interface NotificationProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

const NotificationSystem: React.FC<NotificationProps> = ({
  open,
  message,
  severity,
  onClose
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSystem;

