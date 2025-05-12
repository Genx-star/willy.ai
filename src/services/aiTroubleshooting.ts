interface TroubleshootingResponse {
  solution: string;
  steps: string[];
  confidence: number;
}

export const getAISolution = async (error: string): Promise<TroubleshootingResponse> => {
  try {
    // Implementa qui la chiamata al servizio AI
    const response = await fetch('/api/troubleshoot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Errore nel servizio AI:', error);
    throw new Error('Impossibile ottenere una soluzione AI');
  }
};