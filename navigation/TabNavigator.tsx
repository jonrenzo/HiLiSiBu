import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CharactersScreen from '../screens/CharactersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ActivitiesMenuScreen from '../screens/ActivitiesMenuScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#4a342e',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,

          // Curve the top corners
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,

          // FIX: Absolute positioning to remove white corners
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#f5c170',
        tabBarInactiveTintColor: '#bcaaa4',
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Bold',
          fontSize: 10,
          marginTop: -4,
        },
      }}>
      <Tab.Screen
        name="Kabanata"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Mga Kabanata',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book-open" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tauhan"
        component={CharactersScreen}
        options={{
          tabBarLabel: 'Mga Tauhan',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesMenuScreen}
        options={{
          tabBarLabel: 'Gawain',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="puzzle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-alt" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
