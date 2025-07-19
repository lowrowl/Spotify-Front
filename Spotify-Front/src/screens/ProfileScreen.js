
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export default function ProfileScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#181818' },
      headerTitle: 'Perfil',
      headerTitleStyle: { color: '#fff', fontWeight: '700', fontSize: 22 },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Aquí puedes limpiar el token/sesión si lo usas
            navigation.replace('Login');
          }}
          style={{ marginRight: 18 }}
        >
          <Ionicons name="log-out-outline" size={26} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Perfil</Text>
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
