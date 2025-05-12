// Definizione dei tipi per le icone e le emoji
interface IconItem {
  id: string;
  name: string;
  category: string;
  type: 'icon' | 'emoji';
  value: string;
  subscription: 'free' | 'basic' | 'pro' | 'enterprise';
}

// Categorie di icone e emoji
export const iconCategories = [
  'reactions',           // Reazioni ed emozioni
  'social_actions',      // Azioni social (like, share, comment)
  'content_creation',    // Creazione contenuti
  'storytelling',        // Elementi narrativi
  'marketing',           // Marketing e promozione
  'analytics',           // Analisi e metriche
  'engagement',          // Coinvolgimento utenti
  'trending',            // Tendenze e popolarità
  'seasonal',            // Stagionali e festività
  'branding',            // Elementi di brand
  'ai_tools',            // Strumenti AI
  'multimedia',          // Contenuti multimediali
  'communication',       // Comunicazione
  'weather',             // Meteo e ambiente
  'travel',              // Viaggi e luoghi
  'food',               // Cibo e bevande
  'sports',             // Sport e attività
  'music',              // Musica e audio
  'technology',         // Tecnologia
  'business'            // Business e lavoro
];

// Libreria completa di icone ed emoji
export const iconLibrary: IconItem[] = [
  // Reazioni ed emozioni (Free)
  {
    id: '1',
    name: 'Like',
    category: 'reactions',
    type: 'emoji',
    value: '👍',
    subscription: 'free'
  },
  {
    id: '2',
    name: 'Love',
    category: 'reactions',
    type: 'emoji',
    value: '❤️',
    subscription: 'free'
  },
  {
    id: '3',
    name: 'Laugh',
    category: 'reactions',
    type: 'emoji',
    value: '😂',
    subscription: 'free'
  },

  // Azioni social (Basic)
  {
    id: '4',
    name: 'Share',
    category: 'social_actions',
    type: 'emoji',
    value: '🔄',
    subscription: 'basic'
  },
  {
    id: '5',
    name: 'Comment',
    category: 'social_actions',
    type: 'emoji',
    value: '💬',
    subscription: 'basic'
  },

  // Creazione contenuti (Pro)
  {
    id: '6',
    name: 'Camera',
    category: 'content_creation',
    type: 'emoji',
    value: '📸',
    subscription: 'pro'
  },
  {
    id: '7',
    name: 'Video',
    category: 'content_creation',
    type: 'emoji',
    value: '🎥',
    subscription: 'pro'
  },

  // Storytelling (Pro)
  {
    id: '8',
    name: 'Book',
    category: 'storytelling',
    type: 'emoji',
    value: '📚',
    subscription: 'pro'
  },
  {
    id: '9',
    name: 'Magic',
    category: 'storytelling',
    type: 'emoji',
    value: '✨',
    subscription: 'pro'
  },

  // Marketing (Enterprise)
  {
    id: '10',
    name: 'Target',
    category: 'marketing',
    type: 'emoji',
    value: '🎯',
    subscription: 'enterprise'
  },
  {
    id: '11',
    name: 'Chart',
    category: 'marketing',
    type: 'emoji',
    value: '📊',
    subscription: 'enterprise'
  },

  // Analytics (Enterprise)
  {
    id: '12',
    name: 'Growth',
    category: 'analytics',
    type: 'emoji',
    value: '📈',
    subscription: 'enterprise'
  },
  {
    id: '13',
    name: 'Insights',
    category: 'analytics',
    type: 'emoji',
    value: '🔍',
    subscription: 'enterprise'
  },

  // Engagement (Basic)
  {
    id: '14',
    name: 'Party',
    category: 'engagement',
    type: 'emoji',
    value: '🎉',
    subscription: 'basic'
  },
  {
    id: '15',
    name: 'Fire',
    category: 'engagement',
    type: 'emoji',
    value: '🔥',
    subscription: 'basic'
  },

  // Trending (Pro)
  {
    id: '16',
    name: 'Rocket',
    category: 'trending',
    type: 'emoji',
    value: '🚀',
    subscription: 'pro'
  },
  {
    id: '17',
    name: 'Star',
    category: 'trending',
    type: 'emoji',
    value: '⭐',
    subscription: 'pro'
  },

  // Seasonal (Enterprise)
  {
    id: '18',
    name: 'Christmas',
    category: 'seasonal',
    type: 'emoji',
    value: '🎄',
    subscription: 'enterprise'
  },
  {
    id: '19',
    name: 'Summer',
    category: 'seasonal',
    type: 'emoji',
    value: '☀️',
    subscription: 'enterprise'
  },

  // Branding (Pro)
  {
    id: '20',
    name: 'Diamond',
    category: 'branding',
    type: 'emoji',
    value: '💎',
    subscription: 'pro'
  },
  {
    id: '21',
    name: 'Crown',
    category: 'branding',
    type: 'emoji',
    value: '👑',
    subscription: 'pro'
  }
];