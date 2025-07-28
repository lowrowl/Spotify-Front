import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, FlatList, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAlbum, getAlbumTracks } from '../services/music';

export default function AlbumDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { albumId } = route.params;
  const { width } = useWindowDimensions();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const data = await getAlbum(albumId);
        setAlbum(data);
        const albumTracks = await getAlbumTracks(albumId);
        setTracks(albumTracks || []);
      } catch (err) {
        console.error('Error al cargar el álbum:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8e24aa" />
      </View>
    );
  }

  if (!album) {
    return (
      <View style={[styles.gradient, styles.container]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.errorText}>No se pudo cargar el álbum.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.gradient, styles.container]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image source={{ uri: album.cover_big || album.cover_medium }} style={styles.image} />
      </View>
      <Text style={styles.title}>{album.title}</Text>
      <Text style={styles.infoText}>Artista: {album.artist?.name || 'N/A'}</Text>
      <Text style={styles.infoText}>Año: {album.release_date ? new Date(album.release_date).getFullYear() : 'N/A'}</Text>
      <Text style={styles.sectionTitle}>Canciones</Text>
      <FlatList
        data={tracks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('SongDetail', { songId: item.id })} style={styles.trackItem}>
            <Text style={styles.trackIndex}>{item.track_position || ''}</Text>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.trackDuration}>{item.duration ? `${Math.floor(item.duration/60)}:${(item.duration%60).toString().padStart(2,'0')}` : ''}</Text>
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
  image: { width: 180, height: 180, borderRadius: 18, backgroundColor: '#222' },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  infoText: { color: '#b3b3b3', fontSize: 16, textAlign: 'center', marginBottom: 6 },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16, marginTop: 18 },
  trackItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  trackIndex: { color: '#8e24aa', fontSize: 16, width: 28, textAlign: 'right', marginRight: 8 },
  trackInfo: { flex: 1 },
  trackTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  trackDuration: { color: '#b3b3b3', fontSize: 14 },
  errorText: { color: '#ff6b6b', fontSize: 18, textAlign: 'center', marginTop: 20 },
});
