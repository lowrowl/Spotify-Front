import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function PlaylistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Playlist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#8e24aa', // morado
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
});
