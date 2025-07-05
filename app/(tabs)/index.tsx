import MovieCard from '@/components/MovieCard';
import MovieCarousel from '@/components/MovieCarousel';
import { tmdbApi } from '@/services/tmdb';
import { APIError } from '@/types/errors';
import { Movie } from '@/types/movie';
import { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoviesScreen() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shuffleArray = (array: Movie[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadMovies = async () => {
    try {
      setError(null);
      const [popular, upcoming] = await Promise.all([
        tmdbApi.getPopularMovies(),
        tmdbApi.getUpcomingMovies()
      ]);
      setPopularMovies(shuffleArray(popular));
      setUpcomingMovies(upcoming);
    } catch (error) {
      const errorMessage = error instanceof APIError ? error.message : 'Failed to load movies';
      setError(errorMessage);
      if (error instanceof APIError && error.statusCode === 7) {
        Alert.alert('Configuration Error', errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMovies();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50">
        <Text className="text-lg text-neutral-600">Loading movies...</Text>
      </SafeAreaView>
    );
  }

  if (error && popularMovies.length === 0 && upcomingMovies.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50 px-8">
        <Text className="text-lg text-accent-600 text-center mb-4">⚠️ Error</Text>
        <Text className="text-neutral-600 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={['bottom']}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <MovieCarousel movies={popularMovies} />
        
        <View className="p-4">
          <Text className="text-2xl font-bold text-neutral-900 mb-4">Popular Movies</Text>
          <FlatList
            data={popularMovies}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          />
          
          <Text className="text-2xl font-bold text-neutral-900 mb-4">Upcoming Movies</Text>
          <FlatList
            data={upcomingMovies}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
