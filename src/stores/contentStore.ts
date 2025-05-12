import { create } from 'zustand';
import { generateContent } from '../services/ai';

interface ContentState {
  isGenerating: boolean;
  generatedContent: {
    text: string;
    image: string;
    video: string;
    audio: string;
  };
  error: string | null;
  generateContent: (prompt: string, type: 'text' | 'image' | 'video' | 'audio') => Promise<void>;
  resetContent: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
  isGenerating: false,
  generatedContent: {
    text: '',
    image: '',
    video: '',
    audio: ''
  },
  error: null,

  generateContent: async (prompt, type) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await generateContent({ prompt, type });
      if (response.status === 'success') {
        set((state) => ({
          generatedContent: {
            ...state.generatedContent,
            [type]: response.content
          }
        }));
      } else {
        set({ error: response.message || 'Error generating content' });
      }
    } catch (error) {
      set({ error: 'Failed to generate content' });
    } finally {
      set({ isGenerating: false });
    }
  },

  resetContent: () => {
    set({
      generatedContent: {
        text: '',
        image: '',
        video: '',
        audio: ''
      },
      error: null
    });
  }
}));