import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { initDatabase, getUser } from '../services/db';

// Screens
import RegistrationScreen from '../screens/RegistrationScreen';
import AboutScreen from '../screens/AboutScreen';
import TabNavigator from './TabNavigator';
import ChapterDetailScreen from '../screens/ChapterDetailScreen'; // 1. IMPORT THIS

export type RootStackParamList = {
    Registration: undefined;
    About: undefined;
    MainTabs: undefined;
    ChapterDetail: {
        id: number;
        title: string;
        tag: string;
        image: any;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

    useEffect(() => {
        const checkUserAndInitDB = async () => {
            try {
                await initDatabase();
                const user = await getUser();

                if (user) {
                    setInitialRoute('About');
                } else {
                    setInitialRoute('Registration');
                }
            } catch (e) {
                console.error("Initialization Error:", e);
                setInitialRoute('Registration');
            }
        };

        checkUserAndInitDB();
    }, []);

    if (initialRoute === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3e2c2c' }}>
                <ActivityIndicator size="large" color="#E8D4B0" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="About" component={AboutScreen} />
                <Stack.Screen name="MainTabs" component={TabNavigator} />

                {/* 2. REGISTER THE SCREEN HERE */}
                <Stack.Screen
                    name="ChapterDetail"
                    component={ChapterDetailScreen}
                    options={{ animation: 'slide_from_right' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
