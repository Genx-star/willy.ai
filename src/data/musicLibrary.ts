interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string[];
  mood: string[];
  bpm: number;
  preview_url: string;
  license: string;
  source: string;
}

export const musicLibrary: MusicTrack[] = [
  {
    id: '1',
    title: 'Morning Light',
    artist: 'Audio Library',
    duration: '3:24',
    genre: ['Ambient', 'Lo-fi'],
    mood: ['Calm', 'Peaceful'],
    bpm: 85,
    preview_url: 'https://example.com/preview/morning-light',
    license: 'Creative Commons Attribution',
    source: 'YouTube Audio Library'
  },
  {
    id: '2',
    title: 'Urban Groove',
    artist: 'Soundstripe',
    duration: '2:45',
    genre: ['Hip Hop', 'Electronic'],
    mood: ['Energetic', 'Upbeat'],
    bpm: 120,
    preview_url: 'https://example.com/preview/urban-groove',
    license: 'Royalty Free',
    source: 'Soundstripe'
  },
  {
    id: '3',
    title: 'Cinematic Dreams',
    artist: 'Artlist',
    duration: '4:15',
    genre: ['Cinematic', 'Orchestral'],
    mood: ['Epic', 'Inspiring'],
    bpm: 95,
    preview_url: 'https://example.com/preview/cinematic-dreams',
    license: 'Royalty Free',
    source: 'Artlist'
  },
  {
    id: '4',
    title: 'Summer Vibes',
    artist: 'PremiumBeat',
    duration: '3:10',
    genre: ['Pop', 'Acoustic'],
    mood: ['Happy', 'Cheerful'],
    bpm: 110,
    preview_url: 'https://example.com/preview/summer-vibes',
    license: 'Standard License',
    source: 'PremiumBeat'
  }
];

export const musicGenres = [
  'Ambient',
  'Lo-fi',
  'Hip Hop',
  'Electronic',
  'Cinematic',
  'Orchestral',
  'Pop',
  'Acoustic',
  'Rock',
  'Jazz',
  'Classical',
  'Folk'
];

export const musicMoods = [
  'Calm',
  'Peaceful',
  'Energetic',
  'Upbeat',
  'Epic',
  'Inspiring',
  'Happy',
  'Cheerful',
  'Melancholic',
  'Dramatic',
  'Romantic',
  'Mysterious'
];

export const musicSources = [
  {
    name: 'YouTube Audio Library',
    url: 'https://studio.youtube.com/channel/audio',
    description: 'Libreria gratuita di musica senza copyright per creatori di contenuti YouTube'
  },
  {
    name: 'Soundstripe',
    url: 'https://www.soundstripe.com',
    description: 'Libreria premium con oltre 50.000 brani di alta qualità'
  },
  {
    name: 'Artlist',
    url: 'https://artlist.io',
    description: 'Musica royalty-free per video professionali e contenuti commerciali'
  },
  {
    name: 'PremiumBeat',
    url: 'https://www.premiumbeat.com',
    description: 'Libreria curata di musica di alta qualità per progetti multimediali'
  }
];