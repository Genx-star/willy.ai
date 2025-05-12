export const trackError = async (error: Error) => {
  try {
    await fetch('/api/track-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    });
  } catch (trackingError) {
    console.error('Errore nel tracking:', trackingError);
  }
};