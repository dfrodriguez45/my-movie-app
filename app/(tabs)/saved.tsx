import MovieCard from '@/components/MovieCard';
import { storageService } from '@/services/storage';
import { MovieDetails } from '@/types/movie';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedScreen() {
  const [savedMovies, setSavedMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSavedMovies = async () => {
    try {
      const movies = await storageService.getSavedMovies();
      setSavedMovies(movies);
    } catch (error) {
      console.error('Error loading saved movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadSavedMovies();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50">
        <Text className="text-lg text-neutral-600">Loading saved movies...</Text>
      </SafeAreaView>
    );
  }

  if (savedMovies.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50">
        <Text className="text-lg text-neutral-600 text-center px-8">
          No saved movies yet.{'\n'}Save movies from the Movies tab to see them here.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-neutral-900 mb-4">Saved Movies</Text>
        <FlatList
          data={savedMovies}
          renderItem={({ item }) => <MovieCard movie={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </SafeAreaView>
  );
}