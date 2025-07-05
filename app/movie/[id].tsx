import { storageService } from '@/services/storage';
import { tmdbApi } from '@/services/tmdb';
import { APIError } from '@/types/errors';
import { MovieDetails, Video } from '@/types/movie';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Initializes movie details and saved state on component mount
 */
const initializeMovieData = async (
  movieId: number,
  setMovie: (movie: MovieDetails | null) => void,
  setTrailer: (trailer: Video | null) => void,
  setLoading: (loading: boolean) => void,
  setIsSaved: (saved: boolean) => void
) => {
  await Promise.all([
    loadMovieDetailsData(movieId, setMovie, setTrailer, setLoading),
    checkMovieSavedStatus(movieId, setIsSaved)
  ]);
};

/**
 * Loads movie details and trailer information in parallel
 */
const loadMovieDetailsData = async (
  movieId: number,
  setMovie: (movie: MovieDetails | null) => void,
  setTrailer: (trailer: Video | null) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    const [movieDetails, videos] = await Promise.all([
      tmdbApi.getMovieDetails(movieId),
      tmdbApi.getMovieVideos(movieId)
    ]);
    setMovie(movieDetails);
    
    const youtubeTrailer = videos.results?.find(
      (video: Video) => video.site === 'YouTube' && video.type === 'Trailer'
    );
    setTrailer(youtubeTrailer || null);
  } catch (error) {
    const errorMessage = error instanceof APIError ? error.message : 'Failed to load movie details';
    Alert.alert('Error', errorMessage);
    console.error('Error loading movie details:', error);
  } finally {
    setLoading(false);
  }
};

/**
 * Checks if movie is saved in local storage
 */
const checkMovieSavedStatus = async (
  movieId: number,
  setIsSaved: (saved: boolean) => void
) => {
  const saved = await storageService.isMovieSaved(movieId);
  setIsSaved(saved);
};

/**
 * Movie Detail Screen Component
 * Displays comprehensive movie information including trailer playback
 * Handles saving/removing movies from local storage
 */
export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [trailer, setTrailer] = useState<Video | null>(null);

  useEffect(() => {
    const movieId = Number(id);
    initializeMovieData(movieId, setMovie, setTrailer, setLoading, setIsSaved);
  }, [id]);



  /**
   * Toggles movie save state in local storage
   * Provides user feedback through alerts
   */
  const handleSaveMovie = async () => {
    if (!movie) return;

    try {
      if (isSaved) {
        await storageService.removeMovie(movie.id);
        setIsSaved(false);
        Alert.alert('Success', 'Movie removed from saved list');
      } else {
        // Save complete movie data for offline access
        await storageService.saveMovie(movie);
        setIsSaved(true);
        Alert.alert('Success', 'Movie saved successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof APIError ? error.message : 'Failed to save movie';
      Alert.alert('Error', errorMessage);
    }
  };

  /**
   * Opens YouTube trailer in external browser/app
   * Uses deep linking to YouTube mobile app when available
   */
  const openTrailer = () => {
    if (trailer) {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50">
        <Text className="text-lg text-neutral-600">Loading movie details...</Text>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50">
        <Text className="text-lg text-neutral-600">Movie not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-row items-center p-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#404040" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-neutral-900 flex-1">Movie Details</Text>
        <TouchableOpacity onPress={handleSaveMovie}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isSaved ? "#0ea5e9" : "#737373"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <Image
          source={tmdbApi.getImageUrl(movie.backdrop_path || movie.poster_path)}
          style={{ width: "100%", height: 225 }}
          contentFit="cover"
        />
        
        <View className="p-4">
          <Text className="text-3xl font-bold text-neutral-900 mb-2">{movie.title}</Text>
          
          {movie.tagline && (
            <Text className="text-lg italic text-neutral-600 mb-4">{movie.tagline}</Text>
          )}
          
          <View className="flex-row items-center mb-4">
            <Text className="text-accent-500 text-lg font-semibold mr-4">
              ⭐ {movie.vote_average.toFixed(1)}
            </Text>
            <Text className="text-neutral-600">
              {new Date(movie.release_date).getFullYear()}
            </Text>
            {movie.runtime && (
              <Text className="text-neutral-600 ml-4">{movie.runtime} min</Text>
            )}
          </View>

          {movie.genres && movie.genres.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {movie.genres.map((genre) => (
                <View key={genre.id} className="bg-primary-100 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-primary-800 text-sm">{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {trailer && (
            <TouchableOpacity 
              onPress={openTrailer}
              className="bg-red-600 rounded-lg p-4 mb-4 flex-row items-center justify-center"
            >
              <Ionicons name="play" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Watch Trailer</Text>
            </TouchableOpacity>
          )}

          <Text className="text-lg font-semibold text-neutral-900 mb-2">Overview</Text>
          <Text className="text-neutral-700 leading-6 mb-4">{movie.overview}</Text>

          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-semibold text-neutral-900 mb-3">Details</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-neutral-600">Status</Text>
                <Text className="text-neutral-900">{movie.status}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-600">Original Language</Text>
                <Text className="text-neutral-900">{movie.original_language.toUpperCase()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-600">Vote Count</Text>
                <Text className="text-neutral-900">{movie.vote_count.toLocaleString()}</Text>
              </View>
              {movie.budget > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-neutral-600">Budget</Text>
                  <Text className="text-neutral-900">${movie.budget.toLocaleString()}</Text>
                </View>
              )}
              {movie.revenue > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-neutral-600">Revenue</Text>
                  <Text className="text-neutral-900">${movie.revenue.toLocaleString()}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}