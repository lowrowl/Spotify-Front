import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#8e24aa', // morado
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 18,
          height: 64,
          borderRadius: 24,
          backgroundColor: 'rgba(35,37,38,0.85)',
          borderTopWidth: 0,
          shadowColor: '#8e24aa',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 16,
          paddingBottom: 8,
          paddingTop: 8,
          // Efecto "flotante" y difuminado leve
          // Si quieres blur real, se puede usar expo-blur con tabBarBackground
        },
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Playlist') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return (
            <Ionicons
              name={iconName}
              size={32}
              color={color}
              style={{ alignSelf: 'center' }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Playlist" component={PlaylistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
