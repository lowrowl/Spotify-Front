import React, { createContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playPreview = async (track, trackList = null, index = 0) => {
    if (!track?.previewUrl) {
      Alert.alert("Sin preview", "Esta canción no tiene un preview disponible.");
      return;
    }
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.previewUrl },
        { shouldPlay: true, volume: volume }
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Set playlist if provided
      if (trackList) {
        setPlaylist(trackList);
        setCurrentIndex(index);
      }
      
      await newSound.playAsync();
    } catch (err) {
      console.error("Error al reproducir el preview:", err.message);
      Alert.alert("Error", "No se pudo reproducir el preview.");
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const changeVolume = async (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (sound) {
      await sound.setVolumeAsync(clampedVolume);
    }
  };

  const playNext = async () => {
    if (playlist.length === 0) {
      Alert.alert('Sin playlist', 'No hay más canciones en la lista.');
      return;
    }
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    
    if (nextTrack) {
      await playPreview(nextTrack, playlist, nextIndex);
    }
  };

  const playPrevious = async () => {
    if (playlist.length === 0) {
      Alert.alert('Sin playlist', 'No hay más canciones en la lista.');
      return;
    }
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevTrack = playlist[prevIndex];
    
    if (prevTrack) {
      await playPreview(prevTrack, playlist, prevIndex);
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (e) {}
      setSound(null);
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setPlaylist([]);
    setCurrentIndex(0);
  };

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  return (
    <AudioContext.Provider
      value={{ 
        currentTrack, 
        isPlaying, 
        volume,
        playlist,
        currentIndex,
        playPreview, 
        togglePlayback,
        changeVolume,
        playNext,
        playPrevious,
        stopPlayback
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
