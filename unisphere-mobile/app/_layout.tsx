import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { 
  CormorantGaramond_600SemiBold, 
  CormorantGaramond_600SemiBold_Italic,
  CormorantGaramond_700Bold, 
  CormorantGaramond_400Regular_Italic 
} from '@expo-google-fonts/cormorant-garamond';
import { 
  Karla_400Regular, 
  Karla_500Medium, 
  Karla_700Bold 
} from '@expo-google-fonts/karla';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, userToken } = useAuth();
  
  const [fontsLoaded] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    CormorantGaramond_700Bold,
    CormorantGaramond_400Regular_Italic,
    Karla_400Regular,
    Karla_500Medium,
    Karla_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  const { colors, isDark } = useTheme();

  if (!fontsLoaded || isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="login" redirect={!!userToken} />
        <Stack.Screen name="signup" redirect={!!userToken} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="forgot-password" redirect={!!userToken} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" redirect={!userToken} />
        <Stack.Screen name="edit-profile" redirect={!userToken} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
           <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
});
