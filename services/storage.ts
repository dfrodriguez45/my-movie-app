// @ts-ignore
import { APIError } from '@/types/errors';
import { MovieDetails } from '@/types/movie';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_MOVIES_KEY = 'saved_movies';

export const storageService = {
  saveMovie: async (movie: MovieDetails): Promise<void> => {
    try {
      if (!movie || !movie.id) {
        throw new APIError(6, 'Invalid movie data provided');
      }
      const savedMovies = await storageService.getSavedMovies();
      const updatedMovies = [...savedMovies.filter(m => m.id !== movie.id), movie];
      await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(0, 'Failed to save movie to storage');
    }
  },

  getSavedMovies: async (): Promise<MovieDetails[]> => {
    try {
      const savedMovies = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
      if (!savedMovies) return [];
      const parsed = JSON.parse(savedMovies);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error getting saved movies:', error);
      return [];
    }
  },

  removeMovie: async (movieId: number): Promise<void> => {
    try {
      if (!movieId || movieId <= 0) {
        throw new APIError(6, 'Invalid movie ID provided');
      }
      const savedMovies = await storageService.getSavedMovies();
      const updatedMovies = savedMovies.filter(m => m.id !== movieId);
      await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(0, 'Failed to remove movie from storage');
    }
  },

  isMovieSaved: async (movieId: number): Promise<boolean> => {
    try {
      if (!movieId || movieId <= 0) return false;
      const savedMovies = await storageService.getSavedMovies();
      return savedMovies.some(m => m.id === movieId);
    } catch (error) {
      console.error('Error checking if movie is saved:', error);
      return false;
    }
  },
};