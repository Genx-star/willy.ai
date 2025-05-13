import { Alert, Snackbar } from '@mui/material';

interface NotificationProps {
  notification: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
  onClose: () => void;
}

const Notification = ({ notification, onClose }: NotificationProps) => {
  // Se non c'è nessuna notifica, non renderizzare lo Snackbar
  if (!notification) {
    return null;
  }

  // Se c'è una notifica, renderizza lo Snackbar con l'Alert come figlio
  return (
    <Snackbar
      open={true} // open è true perché abbiamo già verificato che notification esista
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

