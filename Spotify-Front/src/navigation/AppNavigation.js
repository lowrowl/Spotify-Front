import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootStack from './RootStack';
import { AudioProvider } from '../contexts/AudioContext';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export default function AppNavigation() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const navigationRef = useRef();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;
        if (state) setInitialState(state);
      } catch (e) {} finally {
        setIsReady(true);
      }
    };
    restoreState();
  }, []);

  // Redirigir siempre al Home (Tabs) al recargar en web
  useEffect(() => {
    if (Platform.OS === 'web' && navigationRef.current) {
      // Esperar a que la navegación esté lista
      setTimeout(() => {
        try {
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
          });
        } catch (e) {}
      }, 100);
    }
  }, []);

  if (!isReady) return null;

  return (
    <AudioProvider>
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onStateChange={async (state) => {
          try {
            await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
          } catch (e) {}
        }}
      >
        <RootStack />
      </NavigationContainer>
    </AudioProvider>
  );
}
