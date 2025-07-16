import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS } from '@/constants/theme';

type ThemeType = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  colors: typeof COLORS.light | typeof COLORS.dark;
  shadows: typeof SHADOWS.light | typeof SHADOWS.dark;
  setTheme: (theme: ThemeType) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  colors: COLORS.light,
  shadows: SHADOWS.light,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  // Determine if we're in dark mode based on theme setting and system preference
  const isDark = 
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  
  // Get the appropriate colors and shadows based on dark/light mode
  const colors = isDark ? COLORS.dark : COLORS.light;
  const shadows = isDark ? SHADOWS.dark : SHADOWS.light;

  // Load saved theme preference on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Function to change theme and save preference
  const setTheme = async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        colors,
        shadows,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};