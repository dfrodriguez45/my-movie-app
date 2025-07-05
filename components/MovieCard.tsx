import { tmdbApi } from '@/services/tmdb';
import { Movie } from '@/types/movie';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = tmdbApi.getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-md m-2 overflow-hidden"
      onPress={() => router.push(`/movie/${movie.id}`)}
      style={{ width: 150 }}
    >
      <Image
        source={imageUrl}
        placeholder="https://via.placeholder.com/300x450?text=No+Image"
        style={{ width: 150, height: 225 }}
        contentFit="cover"
      />
      <View className="p-3">
        <Text className="text-lg font-bold text-neutral-900 mb-1" numberOfLines={2}>
          {movie.title || 'Unknown Title'}
        </Text>
        <Text className="text-sm text-neutral-600 mb-2">
          {releaseYear}
        </Text>
        {rating && <View className="flex-row items-center">
          <Text className="text-accent-500 text-sm font-semibold">
            ⭐ {rating}
          </Text>
        </View>}
      </View>
    </TouchableOpacity>
  );
}