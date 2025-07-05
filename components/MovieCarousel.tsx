import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import { tmdbApi } from '../services/tmdb';
import { Movie } from '../types/movie';

interface MovieCarouselProps {
  movies: Movie[];
}

const { width } = Dimensions.get('window');

/**
 * Animated Movie Carousel Component
 * Auto-rotates through movies with smooth fade transitions
 * Displays movie logos when available, falls back to titles
 */
export default function MovieCarousel({ movies }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  // Animation value for smooth fade transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;

  /**
   * Auto-rotation effect with smooth fade animation
   * Changes movie every 3 seconds with 300ms fade transition
   */
  useEffect(() => {
    if (movies.length === 0) return;
    
    const interval = setInterval(() => {
      // Fade out -> change content -> fade in sequence
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true, // Better performance
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Change movie index during fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [movies.length, fadeAnim]);

  useEffect(() => {
    if (movies.length === 0) return;
    
    const loadLogo = async () => {
      try {
        const images = await tmdbApi.getMovieImages(movies[currentIndex].id);
        const logo = images.logos?.find((logo: any) => logo.iso_639_1 === 'en') || images.logos?.[0];
        setLogoUrl(logo ? tmdbApi.getImageUrl(logo.file_path) : null);
      } catch (error) {
        setLogoUrl(null);
      }
    };
    
    loadLogo();
  }, [currentIndex, movies]);

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <Pressable
      className="relative"
      onPress={() => router.push(`/movie/${currentMovie.id}`)}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={tmdbApi.getImageUrl(currentMovie.backdrop_path || currentMovie.poster_path)}
          style={{ width, height: 400 }}
          contentFit="cover"
        />
      </Animated.View>
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 items-center">
        {logoUrl ? (
          <Image
            source={logoUrl}
            style={{ width: 200, height: 60 }}
            contentFit="contain"
          />
        ) : (
          <Text className="text-white text-xl font-bold" numberOfLines={2}>
            {currentMovie.title}
          </Text>
        )}
        <Text className="text-white/80 text-sm mt-2">
          ⭐ {currentMovie.vote_average.toFixed(1)} • {new Date(currentMovie.release_date).getFullYear()}
        </Text>
      </View>
    </Pressable>
  );
}