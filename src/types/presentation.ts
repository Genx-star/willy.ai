// Creare questo nuovo file per le definizioni dei tipi
export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
}

export interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'video' | 'chart';
  content: {
    title?: string;
    text?: string;
    media?: string;
    layout?: string;
  };
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  template: Template;
  slides: Slide[];
  createdAt: Date;
  lastModified: Date;
  status: 'draft' | 'published' | 'archived';
  analytics: {
    views: number;
    likes: number;
    shares: number;
    performance: number;
  };
  aiSuggestions: {
    contentImprovements: string[];
    designSuggestions: string[];
    trendingTopics: string[];
  };
}