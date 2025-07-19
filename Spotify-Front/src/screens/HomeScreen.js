import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        style={styles.searchIcon}
      >
        <Ionicons name="search" size={28} color="#8e24aa" />
      </TouchableOpacity>
      <Text style={styles.title}>Pantalla de Inicio</Text>
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
  searchIcon: {
    position: 'absolute',
    top: 24,
    left: 18,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 20,
  },
  title: {
    color: '#8e24aa', // morado
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
});
