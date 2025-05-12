import { lazy } from 'react';

// Implementazione del lazy loading per i componenti principali
export const LazyStripeIntegration = lazy(() =>
  import('./StripeIntegration')
);

export const LazySecurityManager = lazy(() =>
  import('./SecurityManager')
);

export const LazySocialIntegrations = lazy(() =>
  import('./SocialIntegrations')
);

export const LazyAdvancedAnalytics = lazy(() =>
  import('./AdvancedAnalytics')
);

export const LazyPresentationManager = lazy(() =>
  import('./PresentationManager')
);

export const LazyPresentationAI = lazy(() =>
  import('./PresentationAI')
);

export const LazyDocumentManager = lazy(() =>
  import('./DocumentManager')
);

export const LazySocialMediaManager = lazy(() =>
  import('./SocialMediaManager')
);

export const LazyVideoEditor = lazy(() =>
  import('./VideoEditor')
);

export const LazyAudioEditor = lazy(() =>
  import('./AudioEditor')
);

export const LazyAnalytics = lazy(() =>
  import('./Analytics')
);