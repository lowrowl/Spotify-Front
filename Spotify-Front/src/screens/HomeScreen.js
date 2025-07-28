import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { getHomeData } from "../services/music";
import { getUserPlaylists } from "../services/playlist";
import { AudioContext } from "../contexts/AudioContext";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { playPreview } = useContext(AudioContext);
  const [tracks, setTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeContent = async () => {
    try {
      const data = await getHomeData();
      setTracks(data.recommendedTracks || []);
      setRecentTracks(data.recommendedArtists || []);
    } catch (error) {
      console.error("Error al obtener contenido del home:", error.message);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      const data = await getUserPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error("Error al obtener playlists del usuario:", error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchHomeContent(), fetchUserPlaylists()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const renderSection = (title, data, isPlaylist = false) => {
    const itemWidth = Math.max(Math.min(width * 0.36, 200), 120);
    return (
      <View style={{ marginBottom: 32 }}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id || item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (isPlaylist) return; // podrías abrir PlaylistDetail
                navigation.navigate('SongDetail', { songId: item.id });
              }}
              style={[styles.card, { width: itemWidth }]}
            >
              <Image
                source={{ uri: item.album?.cover_medium || item.picture_medium || 'https://via.placeholder.com/100' }}
                style={[styles.image, { width: itemWidth, height: itemWidth }]}
              />
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title || item.name}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.artist?.name || 'Artista'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Canciones recomendadas</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          style={styles.searchButton}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 80 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Ya mostramos el título arriba, solo la lista aquí */}
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id || item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('SongDetail', { songId: item.id })}
                style={[styles.card, { width: Math.max(Math.min(width * 0.36, 200), 120) }]}
              >
                <Image
                  source={{ uri: item.album?.cover_medium || item.picture_medium || 'https://via.placeholder.com/100' }}
                  style={[styles.image, { width: Math.max(Math.min(width * 0.36, 200), 120), height: Math.max(Math.min(width * 0.36, 200), 120) }]}
                />
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title || item.name}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {item.artist?.name || 'Artista'}
                </Text>
              </TouchableOpacity>
            )}
          />
          {renderSection("Escuchado Recientemente", recentTracks)}
          {renderSection("Mis Playlists", playlists, true)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0930",
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchButton: {
    padding: 8,
    backgroundColor: "transparent",
    borderRadius: 20,
  },
  card: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 10,
    marginRight: 16,
    alignItems: "center",
    // Sin sombra ni borde
  },
  image: {
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#222",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardSubtitle: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
  },
});
