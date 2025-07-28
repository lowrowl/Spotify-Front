import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, FlatList, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getArtist, getArtistTopTracks } from '../services/music';

export default function ArtistDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { artistId } = route.params;
  const { width } = useWindowDimensions();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const data = await getArtist(artistId);
        setArtist(data);
        const topTracks = await getArtistTopTracks(artistId);
        setTracks(topTracks || []);
      } catch (err) {
        console.error('Error al cargar el artista:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [artistId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8e24aa" />
      </View>
    );
  }

  if (!artist) {
    return (
      <View style={[styles.gradient, styles.container]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.errorText}>No se pudo cargar el artista.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.gradient, styles.container]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image source={{ uri: artist.picture_big || artist.picture_medium }} style={styles.image} />
      </View>
      <Text style={styles.title}>{artist.name}</Text>
      <Text style={styles.infoText}>Fans: {artist.nb_fan?.toLocaleString() || 'N/A'}</Text>
      <Text style={styles.sectionTitle}>Top Canciones</Text>
      <FlatList
        data={tracks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('SongDetail', { songId: item.id })} style={styles.trackItem}>
            <Image source={{ uri: item.album?.cover_small }} style={styles.trackImage} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.trackAlbum} numberOfLines={1}>{item.album?.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, backgroundColor: '#2a1746' },
  container: { padding: 20, minHeight: '100%' },
  loadingContainer: { flex: 1, backgroundColor: '#181818', alignItems: 'center', justifyContent: 'center' },
  backIcon: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 8, alignSelf: 'flex-start', marginBottom: 10 },
  imageContainer: { alignItems: 'center', marginBottom: 24 },
  image: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#222' },
  title: { color: '#fff', fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  infoText: { color: '#b3b3b3', fontSize: 16, textAlign: 'center', marginBottom: 18 },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16, marginTop: 18 },
  trackItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  trackImage: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  trackInfo: { flex: 1 },
  trackTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  trackAlbum: { color: '#b3b3b3', fontSize: 14 },
  errorText: { color: '#ff6b6b', fontSize: 18, textAlign: 'center', marginTop: 20 },
});
