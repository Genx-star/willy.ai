import React from 'react';
import { Alert, Snackbar } from '@mui/material';

interface NotificationProps {
  notification: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
  onClose: () => void;
}

const Notification = ({ notification, onClose }: NotificationProps) => {
  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {notification && (
        <Alert
          onClose={onClose}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      )}
    </Snackbar>
  );
};

export default Notification;