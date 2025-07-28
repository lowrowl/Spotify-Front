import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { searchTracks } from '../services/music';

export default function SearchScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (text) => {
    setSearch(text);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        searchMusic();
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const searchMusic = async () => {
    if (!search.trim()) return;
    try {
      setLoading(true);
      const tracks = await searchTracks(search);
      setResults(tracks || []);
    } catch (error) {
      console.error('Error al buscar música:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputWidth = Math.max(Math.min(width * 0.8, 480), 260);
  const imageSize = 48;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={[styles.searchBarWrapper, { width: inputWidth }]}>
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          placeholderTextColor="#ccc"
          value={search}
          onChangeText={handleChange}
          returnKeyType="search"
        />
      </View>

      <View style={{ height: 24 }} />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('SongDetail', { songId: item.id })}
              style={styles.resultItem}
            >
              <Image
                source={{ uri: item.album?.cover_medium || 'https://via.placeholder.com/100' }}
                style={[styles.image, { width: imageSize, height: imageSize }]}
              />
              <View style={styles.resultInfo}>
                <Text style={styles.resultText} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.artist?.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.resultsContainer}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#1a0930',
    paddingHorizontal: 0,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(33,0,58,0.92)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  searchBarWrapper: {
    marginBottom: 24,
    backgroundColor: 'rgba(33,0,58,0.92)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    padding: 10,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  resultsContainer: {
    paddingBottom: 30,
    paddingLeft: 16,
    paddingRight: 16,
    minHeight: 120,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33,0,58,0.92)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 80,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
    width: '100%',
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  artist: {
    color: '#ccc',
    fontSize: 14
  },
  image: {
    borderRadius: 12,
    backgroundColor: '#333',
    width: 64,
    height: 64,
    marginBottom: 0,
  }
});