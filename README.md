# Movie App - Expo SDK 53 + NativeWind

A movie application built with Expo SDK 53 and NativeWind that consumes the TMDB API, featuring animated carousels and trailer playback functionality.

## 📦 Setup Instructions

### Installing Dependencies
```bash
npm install
```

### Running the App

**iOS:**
```bash
npx expo start --ios
```

**Android:**
```bash
npx expo start --android
```

**Development Server:**
```bash
npx expo start
```

### Environment Variables Configuration

1. Get your TMDB API key from [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Create/update `.env` file in the root directory:
```env
EXPO_PUBLIC_API_KEY_TMDB=your_api_key_here
```
3. The app will automatically use this environment variable

## 🚀 Implemented Features

- ✅ **Popular and Upcoming Movies List** with horizontal scrolling
- ✅ **Detailed Movie View** with comprehensive information
- ✅ **Local Movie Saving** with offline persistence using AsyncStorage
- ✅ **Tab Navigation** between "Movies" and "Saved" screens
- ✅ **Animated Movie Carousel** with fade transitions
- ✅ **Trailer Playback** integration with YouTube
- ✅ **Responsive Design** using NativeWind/Tailwind CSS
- ✅ **Error Handling** with user-friendly messages
- ✅ **Pull-to-Refresh** functionality

## 🧭 Navigation Structure

### Architecture
- **Expo Router** with file-based routing system
- **Tab Navigator** for main navigation (Movies/Saved)
- **Stack Navigator** for detailed views

### Navigation Flow
```
├── (tabs)/                 # Tab Navigator
│   ├── index.tsx          # Movies Screen (Popular & Upcoming)
│   └── saved.tsx          # Saved Movies Screen
└── movie/[id].tsx         # Movie Details Screen (Stack)
```

### Navigation Patterns
- **Tab Navigation**: Bottom tabs for primary screens
- **Stack Navigation**: Push/pop for detail views
- **Deep Linking**: Dynamic routes for movie details
- **Programmatic Navigation**: Using `expo-router` for seamless transitions

## 🏗️ Architecture & Technology Decisions

### Core Technologies
- **Expo SDK 53**: Latest stable version for cross-platform development
- **NativeWind**: Tailwind CSS for React Native styling
- **TypeScript**: Type safety and better developer experience
- **Expo Router**: File-based routing system

### State Management
- **React Hooks**: useState, useEffect for local component state
- **No Global State**: Simple app doesn't require Redux/Zustand
- **AsyncStorage**: Persistent local storage for saved movies

### API & Data Layer
- **TMDB API**: RESTful API consumption
- **Custom API Service**: Centralized HTTP client with error handling
- **Parallel Requests**: Promise.all for optimized loading
- **Image Optimization**: expo-image for better performance

### UI/UX Decisions
- **NativeWind**: Utility-first CSS framework for consistent styling
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Native Components**: Platform-specific UI elements
- **Smooth Animations**: React Native Animated API for carousel transitions

## ⚠️ Error Handling

### Network Error Management
- **Custom APIError Class**: Structured error handling
- **HTTP Status Codes**: Proper TMDB API error code handling
- **Timeout Handling**: 10-second request timeout
- **User-Friendly Messages**: Translated error messages for users

### Edge Cases
- **Empty States**: Graceful handling of no data scenarios
- **Loading States**: Visual feedback during API calls
- **Offline Support**: Cached data for saved movies
- **Invalid Data**: Fallback values and error boundaries

### TMDB API Error Codes
- **Code 7**: Invalid API key configuration
- **Code 6**: Invalid movie ID
- **Network Errors**: Connection and timeout handling

## Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx        # Tab navigator configuration
│   ├── index.tsx          # Movies screen (Popular & Upcoming)
│   └── saved.tsx          # Saved movies screen
├── movie/[id].tsx         # Dynamic movie details screen
└── _layout.tsx            # Root layout with stack navigator

components/
├── MovieCard.tsx          # Reusable movie card component
└── MovieCarousel.tsx      # Animated carousel component

services/
├── tmdb.ts               # TMDB API service with error handling
└── storage.ts            # AsyncStorage service for persistence

types/
├── movie.ts              # Movie and video type definitions
└── errors.ts             # Error handling types
```