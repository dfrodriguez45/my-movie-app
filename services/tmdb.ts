import { APIError, ERROR_MESSAGES, TMDBError } from '@/types/errors';
import { Movie, MovieDetails } from '@/types/movie';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY_TMDB;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_BASE_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData: TMDBError = await response.json().catch(() => ({
      status_code: response.status,
      status_message: response.statusText,
      success: false
    }));
    
    const message = ERROR_MESSAGES[errorData.status_code as keyof typeof ERROR_MESSAGES] || errorData.status_message;
    throw new APIError(errorData.status_code, message);
  }
  return response.json();
};

const makeRequest = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    });
    
    clearTimeout(timeoutId);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof APIError) throw error;
    if (error.name === 'AbortError') {
      throw new APIError(0, 'Request timeout: Please try again');
    }
    if (error instanceof TypeError) {
      throw new APIError(0, 'Network error: Please check your internet connection');
    }
    throw new APIError(0, 'An unexpected error occurred');
  }
};

export const tmdbApi = {
  getPopularMovies: async (): Promise<Movie[]> => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      throw new APIError(7, 'API key not configured. Please add your TMDB API key.');
    }
    const data = await makeRequest(`${BASE_URL}/movie/popular`);
    return data.results || [];
  },

  getUpcomingMovies: async (): Promise<Movie[]> => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      throw new APIError(7, 'API key not configured. Please add your TMDB API key.');
    }
    const data = await makeRequest(`${BASE_URL}/movie/upcoming`);
    return data.results || [];
  },

  getMovieDetails: async (id: number): Promise<MovieDetails> => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      throw new APIError(7, 'API key not configured. Please add your TMDB API key.');
    }
    if (!id || id <= 0) {
      throw new APIError(6, 'Invalid movie ID provided');
    }
    return await makeRequest(`${BASE_URL}/movie/${id}`);
  },

  getMovieImages: async (id: number) => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      throw new APIError(7, 'API key not configured. Please add your TMDB API key.');
    }
    if (!id || id <= 0) {
      throw new APIError(6, 'Invalid movie ID provided');
    }
    return await makeRequest(`${BASE_URL}/movie/${id}/images`);
  },

  getMovieVideos: async (id: number) => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      throw new APIError(7, 'API key not configured. Please add your TMDB API key.');
    }
    if (!id || id <= 0) {
      throw new APIError(6, 'Invalid movie ID provided');
    }
    return await makeRequest(`${BASE_URL}/movie/${id}/videos`);
  },

  getImageUrl: (path: string) => {
    if (!path) return '';
    return `${IMAGE_BASE_URL}${path}`;
  },
};