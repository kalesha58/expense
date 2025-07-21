import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import SplashScreenComponent from './SplashScreen';
import { initDatabase } from "@/services/sqlite"; // ✅ Import your SQLite init function

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Persist splash state across the app session
let splashShown = false;

// Root layout with authentication check
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(!splashShown);

  useEffect(() => {
    if (!splashShown) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        splashShown = true;
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, []);

  if (isLoading) {
    return <SplashScreenComponent />;
  }
  if (showSplash) {
    return <SplashScreenComponent />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="select-department" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // await initDatabase(); // ✅ Properly initialize SQLite here
        console.log("SQLite DB initialized ✅");
      } catch (e) {
        console.error("DB Initialization failed", e);
      } finally {
        setDbReady(true);
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!dbReady) {
    return <SplashScreenComponent />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
