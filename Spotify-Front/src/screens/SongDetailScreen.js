// SongDetailScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  useWindowDimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AudioContext } from '../contexts/AudioContext';
import { getTrack, getSimilarTracks } from '../services/music';
import { getUserPlaylists, addSongToPlaylist } from '../services/playlist';

export default function SongDetailScreen() {
  const { playPreview, currentTrack, isPlaying, togglePlayback, stopPlayback } = useContext(AudioContext);
  // Detener la música al salir de SongDetail
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      stopPlayback && stopPlayback();
    });
    return unsubscribe;
  }, [navigation, stopPlayback]);
  const navigation = useNavigation();
  const route = useRoute();
  const { songId } = route.params;

  const [song, setSong] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchSong = async () => {
    try {
      const data = await getTrack(songId);
      setSong(data);
      fetchSimilarTracks();
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar la información de la canción');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarTracks = async () => {
    try {
      setSimilarLoading(true);
      const similar = await getSimilarTracks(songId);
      setSimilarTracks(similar || []);
    } catch (err) {
      console.error("Error al cargar canciones similares:", err.message);
    } finally {
      setSimilarLoading(false);
    }
  };

  useEffect(() => {
    fetchSong();
  }, [songId]);

  const handlePlay = () => {
    if (!song?.preview) {
      Alert.alert('Sin preview', 'Esta canción no tiene un preview disponible.');
      return;
    }

    const trackData = {
      previewUrl: song.preview,
      imageUrl: song.album?.cover_big || song.album?.cover_medium,
      name: song.title,
      artists: song.artist?.name
    };

    if (currentTrack?.name === song.title && currentTrack?.artists === song.artist?.name) {
      togglePlayback();
    } else {
      playPreview(trackData);
    }
  };

  const openPlaylistModal = async () => {
    try {
      setPlaylistModal(true);
      const raw = await getUserPlaylists();
      const data = raw.map((p) => ({ ...p, id: p._id }));
      setPlaylists(data);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar tus playlists');
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!song || !song.id) return;
    setSaving(true);
    try {
      await addSongToPlaylist(playlistId, song.id);
      Alert.alert('Agregada', 'Canción agregada a la playlist');
      setPlaylistModal(false);
    } catch (err) {
      Alert.alert('Error', 'No se pudo agregar la canción');
    } finally {
      setSaving(false);
    }
  };

  const isCurrentTrack = currentTrack?.name === song?.title && currentTrack?.artists === song?.artist?.name;

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSimilarTrack = ({ item }) => (
    <TouchableOpacity
      style={styles.similarTrackItem}
      onPress={() => navigation.push('SongDetail', { songId: item.id })}
    >
      <Image source={{ uri: item.album?.cover_small }} style={styles.similarTrackImage} />
      <View style={styles.similarTrackInfo}>
        <Text style={styles.similarTrackTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.similarTrackArtist} numberOfLines={1}>{item.artist?.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!song) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.errorText}>No se pudo cargar la canción.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openPlaylistModal} style={styles.iconBtn}>
          <Ionicons name="heart-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Image
        source={
          song.album?.cover_big
            ? { uri: song.album.cover_big }
            : song.album?.cover_medium
              ? { uri: song.album.cover_medium }
              : song.album?.cover_small
                ? { uri: song.album.cover_small }
                : require('../../assets/icon.png')
        }
        style={styles.image}
      />
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist?.name}</Text>
      <Text style={styles.album}>{song.album?.title}</Text>

      <View style={styles.additionalInfo}>
        <Text style={styles.infoText}>Duración: {formatDuration(song.duration)}</Text>
        <Text style={styles.infoText}>Lanzamiento: {song.release_date?.slice(0, 4)}</Text>
        <Text style={styles.infoText}>Popularidad: {song.rank}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.playButton, !song.preview && styles.playButtonDisabled]} 
        onPress={handlePlay}
        disabled={!song.preview}
      >
        <Ionicons 
          name={isCurrentTrack && isPlaying ? "pause" : "play"} 
          size={24} 
          color="#fff" 
        />
        <Text style={styles.playText}>
          {!song.preview ? 'Sin Preview' : isCurrentTrack && isPlaying ? 'Pausar' : 'Reproducir'}
        </Text>
      </TouchableOpacity>

      {similarTracks.length > 0 && (
        <View style={styles.similarSection}>
          <Text style={styles.sectionTitle}>Canciones similares</Text>
          {similarLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FlatList
              data={similarTracks.slice(0, 5)}
              renderItem={renderSimilarTrack}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </View>
      )}

      {playlistModal && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Guardar en playlist</Text>
          {playlists.map((pl) => (
            <TouchableOpacity key={pl.id} style={styles.playlistBtn} onPress={() => handleAddToPlaylist(pl.id)}>
              <Text style={styles.playlistBtnText}>{pl.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setPlaylistModal(false)}>
            <Text style={{ color: '#ccc', marginTop: 12 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a0930',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 0,
    marginBottom: 16,
    backgroundColor: 'transparent',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 4,
  },
  album: {
    fontSize: 16,
    color: '#8e24aa',
    textAlign: 'center',
    marginBottom: 12,
  },
  additionalInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
  },
  playButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#fff',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  playText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  similarSection: {
    marginTop: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  similarTrackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  similarTrackImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  similarTrackInfo: {
    flex: 1,
  },
  similarTrackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  similarTrackArtist: {
    color: '#ccc',
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    backgroundColor: 'rgba(33,0,58,0.92)',
    top: '30%',
    left: '10%',
    right: '10%',
    padding: 24,
    borderRadius: 20,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  playlistBtn: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  playlistBtnText: {
    color: '#fff',
    fontSize: 16,
  },
});
