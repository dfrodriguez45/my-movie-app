import "@/global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{
        animation: "slide_from_left"
      }} />
      <Stack.Screen name="movie/[id]" options={{
        animation: "slide_from_right"
      }} />
    </Stack>
  );
}
