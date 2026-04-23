import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeType: ThemeType;
  isDark: boolean;
  colors: typeof Colors.light;
  setThemeType: (type: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load saved preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (e) {
        console.error('Failed to load theme preference', e);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const handleSetThemeType = async (type: ThemeType) => {
    setThemeType(type);
    try {
      await AsyncStorage.setItem('app_theme', type);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  };

  if (!isReady) return null; // Or a blank View

  const isDark = themeType === 'dark' || (themeType === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ themeType, isDark, colors, setThemeType: handleSetThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
