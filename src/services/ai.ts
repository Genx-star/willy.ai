import axios from 'axios';

interface GenerateContentParams {
  prompt: string;
  type: 'text' | 'image' | 'video' | 'audio';
}

interface GenerateContentResponse {
  content: string;
  status: 'success' | 'error';
  message?: string;
}

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1';

export const generateContent = async ({ prompt, type }: GenerateContentParams): Promise<GenerateContentResponse> => {
  try {
    switch (type) {
      case 'text':
        const textResponse = await axios.post(
          `${API_ENDPOINT}/chat/completions`,
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return {
          status: 'success',
          content: textResponse.data.choices[0].message.content,
        };

      case 'image':
        const imageResponse = await axios.post(
          `${API_ENDPOINT}/images/generations`,
          {
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'url',
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return {
          status: 'success',
          content: imageResponse.data.data[0].url,
        };

      case 'video':
        // TODO: Implementare la generazione video quando disponibile
        return {
          status: 'error',
          message: 'La generazione video non è ancora disponibile',
        };

      case 'audio':
        const audioResponse = await axios.post(
          `${API_ENDPOINT}/audio/speech`,
          {
            model: 'tts-1',
            input: prompt,
            voice: 'alloy',
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        const audioBlob = new Blob([audioResponse.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        return {
          status: 'success',
          content: audioUrl,
        };

      default:
        return {
          status: 'error',
          message: 'Tipo di contenuto non supportato',
        };
    }
  } catch (error) {
    console.error('Errore durante la generazione del contenuto:', error);
    return {
      content: '',
      status: 'error',
      message: 'Si è verificato un errore durante la generazione del contenuto',
    };
  }
};