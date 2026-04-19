import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import './global.css';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular: Poppins_400Regular,
    Poppins_700Bold: Poppins_700Bold,
    Poppins_600SemiBold: Poppins_600SemiBold,
    GreatVibes: GreatVibes_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </View>
  );
}
