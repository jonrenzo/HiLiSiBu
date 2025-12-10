import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppNavigator from './navigation/AppNavigator';
import "./global.css"

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        'Poppins_400Regular': Poppins_400Regular,
        'Poppins_700Bold': Poppins_700Bold,
        'Poppins_600SemiBold': Poppins_600SemiBold,

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
            <AppNavigator />
        </View>
    );
}
