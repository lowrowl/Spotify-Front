
import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioContext } from '../contexts/AudioContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function MiniPlayer() {
  // Ocultar el miniplayer al entrar a SongDetail
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const route = navigation.getState()?.routes?.slice(-1)[0];
      if (route?.name === 'SongDetail') setVisible(false);
    });
    return unsubscribe;
  }, [navigation]);
  const { currentTrack, isPlaying, togglePlayback, lastTracks, stopPlayback } = useContext(AudioContext);
  const [visible, setVisible] = useState(true);
  // Mostrar el miniplayer si hay una nueva canción
  React.useEffect(() => {
    if (currentTrack) setVisible(true);
  }, [currentTrack]);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  if (!currentTrack) return null;
  if (!visible) return null;

  // Responsividad: el player ocupa casi todo el ancho en móvil, menos en tablets
  const playerWidth = Math.max(Math.min(width * 0.8, 480), 260);

  // Buscar el id de la canción por nombre y artista si no está en currentTrack
  const getSongId = () => {
    if (currentTrack.id) return currentTrack.id;
    // Buscar en lastTracks si existe
    if (Array.isArray(lastTracks)) {
      const found = lastTracks.find(
        t => t.name === currentTrack.name && t.artists === currentTrack.artists
      );
      if (found && found.id) return found.id;
    }
    return null;
  };

  const handleImagePress = () => {
    const songId = getSongId();
    if (songId) {
      navigation.navigate('SongDetail', { songId });
    }
    // Si no se encuentra el id, no hace nada
  };

  return (
    <View style={styles.tabContainer} pointerEvents="box-none">
      <View style={styles.neumorphPlayer}> 
        <TouchableOpacity onPress={handleImagePress}>
          <Image source={{ uri: currentTrack.imageUrl }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.name}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artists}</Text>
        </View>
        <TouchableOpacity onPress={togglePlayback} style={styles.playBtn}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { stopPlayback(); setVisible(false); }} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    marginLeft: 8,
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  tabContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 96,
    alignItems: 'center',
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  neumorphPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 10,
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: '#21003a',
    borderWidth: 0,
    width: '100%',
    height: 72,
    minWidth: 0,
    maxWidth: '100%',
    // Sombra eliminada
    ...Platform.select({
      web: {
        boxShadow: 'none',
      },
    }),
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 18,
    marginRight: 14,
    backgroundColor: '#232323',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    }),
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 2,
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 14,
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  playBtn: {
    marginLeft: 8,
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
});
