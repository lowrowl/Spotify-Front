import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPlaylistById, removeSongFromPlaylist } from '../services/playlist';
import { getTrack } from '../services/music';

export default function PlaylistDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { playlistId } = route.params;
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const loadPlaylist = async () => {
    setLoading(true);
    try {
      const data = await getPlaylistById(playlistId);
      const detailedSongs = await Promise.all(
        (data.idSong || []).map(async (id) => {
          try {
            const song = await getTrack(id);
            return song;
          } catch (e) {
            console.warn('No se pudo cargar canción con id', id);
            return null;
          }
        })
      );

      data.songs = detailedSongs.filter(Boolean); // Elimina nulls
      setPlaylist(data);
    } catch (e) {
      Alert.alert('Error', 'No se pudo cargar la playlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  const handleRemoveSong = async (songId) => {
    setRemoving(songId);
    try {
      await removeSongFromPlaylist(playlistId, songId);
      Alert.alert('Eliminada', 'Canción eliminada de la playlist');
      loadPlaylist();
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar la canción');
    } finally {
      setRemoving(null);
    }
  };

  const renderSong = ({ item }) => (
    <View style={styles.songItem}>
      <Image source={{ uri: item.imageUrl || item.album?.cover_medium || 'https://via.placeholder.com/100' }} style={styles.songImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.songArtist} numberOfLines={1}>{item.artist || item.artistName}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveSong(item.id)} disabled={removing === item.id}>
        <Ionicons name="trash" size={22} color="#e57373" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{playlist?.name || 'Playlist'}</Text>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={playlist?.songs || []}
          keyExtractor={item => item.id}
          renderItem={renderSong}
          contentContainerStyle={{ paddingTop: 16 }}
          ListEmptyComponent={<Text style={{ color: '#fff', marginTop: 32 }}>No hay canciones en esta playlist.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0930',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  backIcon: {
    position: 'absolute',
    top: 16,
    left: 8,
    zIndex: 10,
    backgroundColor: '#2d1b69',
    borderRadius: 20,
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  songItem: {
    backgroundColor: '#2d1b69',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songImage: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  songArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
});
