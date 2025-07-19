import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Keyboard, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const inputAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(inputAnim, {
      toValue: -290,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    if (!search) {
      setFocused(false);
      Animated.timing(inputAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleChange = (text) => {
    setSearch(text);
    if (text.length > 0) {
      setResults([
        `Resultado para "${text}" 1`,
        `Resultado para "${text}" 2`,
        `Resultado para "${text}" 3`,
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backIcon}
      >
        <Ionicons name="arrow-back" size={28} color="#8e24aa" />
      </TouchableOpacity>
      <Animated.View style={[styles.animatedInput, { transform: [{ translateY: inputAnim }] }]}> 
        <LinearGradient
          colors={["#8e24aa", "#232526", "#181818"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradientInput}
        >
          <View style={styles.blurWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Buscar..."
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              returnKeyType="search"
            />
          </View>
        </LinearGradient>
        {(focused || search.length > 0) && (
          <View style={styles.resultsWrapper}>
            <FlatList
              data={results}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.resultItem}>
                  <Text style={styles.resultText}>{item}</Text>
                </View>
              )}
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </Animated.View>
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
  backIcon: {
    position: 'absolute',
    top: 24,
    left: 18,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 20,
  },
  animatedInput: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    zIndex: 2,
  },
  gradientInput: {
    width: '80%',
    borderRadius: 18,
    marginBottom: 8,
    padding: 2,
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    // Para Android
    backgroundColor: 'rgba(142,36,170,0.15)',
  },
  blurWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(35,37,38,0.55)',
    // Efecto de "vidrio esmerilado" simulado
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    // backdropFilter solo para web, ignorado en mobile
    // Para mobile, el color de fondo y opacidad simulan el blur
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#fff',
    borderWidth: 0,
    textAlign: 'center',
  },
  resultsWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    maxHeight: 250,
  },
  resultsList: {
    width: '90%',
    maxHeight: 250,
  },
  resultItem: {
    backgroundColor: '#232526',
    marginHorizontal: 24,
    marginVertical: 6,
    borderRadius: 8,
    padding: 14,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
  },
});
