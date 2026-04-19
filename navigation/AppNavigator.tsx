import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { initDatabase, getUser } from '../services/db';
import { supabase } from '../src/lib/supabase';
import type { Session } from '@supabase/supabase-js';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import AboutScreen from '../screens/AboutScreen';
import TabNavigator from './TabNavigator';
import ChapterDetailScreen from '../screens/ChapterDetailScreen';
// import ActivitiesMenuScreen from '../screens/ActivitiesMenuScreen'; // <-- Remove this, it's in TabNavigator
import ActivityContainerScreen from '../screens/activities/ActivityContainerScreen'; // <-- Import the correct screen

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  About: undefined;
  MainTabs: undefined;
  ActivityContainer: { rangeId: string; title: string };
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
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAuthAndInitDB = async () => {
      try {
        await initDatabase();

        const {
          data: { session: supabaseSession },
        } = await supabase.auth.getSession();
        setSession(supabaseSession);

        if (supabaseSession) {
          setInitialRoute('MainTabs');
        } else {
          setInitialRoute('Login');
        }
      } catch (e) {
        console.error('Initialization Error:', e);
        setInitialRoute('Login');
      }
    };

    checkAuthAndInitDB();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setInitialRoute('MainTabs');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (initialRoute === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3e2c2c',
        }}>
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
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="ChapterDetail"
          component={ChapterDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />

        {/* CORRECTED THIS PART */}
        <Stack.Screen
          name="ActivityContainer"
          component={ActivityContainerScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
