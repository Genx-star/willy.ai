import { useQuery } from "@tanstack/react-query";
import axios from "axios"; // Assicurati che axios sia installato: npm install axios

// --- Definizione dei Tipi (Idealmente in un file separato come ../types/presentation.ts) ---
interface Author {
  id: string;
  name: string;
  email: string;
}

interface Template {
  id: string;
  name: string;
}

interface Slide {
  id: string;
  order: number;
  type: "title" | "content" | "image" | "video" | "chart";
  title?: string; // Alcuni campi potrebbero essere opzionali
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  chartData?: any; // Usa un tipo più specifico se possibile
  notes?: string;
}

interface Analytics {
  views: number;
  likes: number;
  shares: number;
}

interface AISuggestions {
  contentImprovements: string[];
  designSuggestions: string[];
  trendingTopics: string[];
}

interface Permissions {
  canEdit: boolean;
  canShare: boolean;
  canDelete: boolean;
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  status: "draft" | "published" | "archived";
  author?: Author;
  template?: Template;
  slides: Slide[];
  analytics?: Analytics;
  aiSuggestions?: AISuggestions;
  permissions?: Permissions;
}

export interface FetchPresentationOptions {
  includeAnalytics?: boolean;
  includeAiSuggestions?: boolean;
}
// --- Fine Definizione dei Tipi ---

export const fetchPresentation = async (
  id: string,
  userToken: string, // Il token JWT dell'utente
  options: FetchPresentationOptions = {}
): Promise<Presentation> => {
  try {
    let url = `https://api.willy.ai/v1/presentations/${id}`;
    const queryParams = new URLSearchParams();

    if (options.includeAnalytics !== undefined) {
      queryParams.append("includeAnalytics", options.includeAnalytics.toString());
    }

    if (options.includeAiSuggestions !== undefined) {
      queryParams.append("includeAiSuggestions", options.includeAiSuggestions.toString());
    }

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await axios.get<Presentation>(url, {
      headers: {
        "Authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error("Autenticazione richiesta. Effettua il login per continuare.");
          case 403:
            throw new Error("Non hai i permessi per accedere a questa presentazione.");
          case 404:
            throw new Error("La presentazione richiesta non esiste.");
          case 500:
            throw new Error("Si è verificato un errore nel server. Riprova più tardi.");
          default:
            throw new Error(`Errore nella richiesta: ${error.response.statusText} (status: ${error.response.status})`);
        }
      }
    }
    // Gestione di errori generici o di rete
    throw new Error("Si è verificato un errore durante il recupero della presentazione. Controlla la tua connessione o riprova più tardi.");
  }
};

interface UsePresentationParams {
  id: string;
  userToken: string; // Token necessario per la chiamata API
  options?: FetchPresentationOptions;
  queryOptions?: {
    staleTime?: number;
    cacheTime?: number;
    enabled?: boolean;
    // Aggiungi altre opzioni di react-query se necessario
  };
}

export const usePresentation = ({ id, userToken, options, queryOptions }: UsePresentationParams) => {
  return useQuery<Presentation, Error>({
    queryKey: ["presentation", id, options], // La query key include l'id e le opzioni per il refetching
    queryFn: () => fetchPresentation(id, userToken, options),
    staleTime: queryOptions?.staleTime ?? 5 * 60 * 1000, // 5 minuti di default
    cacheTime: queryOptions?.cacheTime ?? 30 * 60 * 1000, // 30 minuti di default
    enabled: queryOptions?.enabled ?? !!(id && userToken), // Abilita la query solo se id e userToken sono presenti
    ...queryOptions, // Permette di sovrascrivere le opzioni di default
  });
};

