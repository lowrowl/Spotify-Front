import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createPlaylist, deletePlaylist, getUserPlaylists } from '../services/playlist';
import { useNavigation } from '@react-navigation/native';

export default function PlaylistScreen() {
  const navigation = useNavigation();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const data = await getUserPlaylists();
      setPlaylists(data);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar las playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handleCreate = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Nombre requerido', 'Ingresa un nombre para la playlist');
      return;
    }
    setCreating(true);
    try {
      await createPlaylist(newPlaylistName);
      setModalVisible(false);
      setNewPlaylistName('');
      Alert.alert('Éxito', 'Playlist creada');
      loadPlaylists();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la playlist');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Eliminar Playlist',
      '¿Estás seguro de eliminar esta playlist?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive', onPress: async () => {
            try {
              await deletePlaylist(id);
              Alert.alert('Eliminada', 'Playlist eliminada correctamente');
              loadPlaylists();
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar la playlist');
            }
          }
        }
      ]
    );
  };

  const renderPlaylist = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item.id })}
      activeOpacity={0.8}
    >
      <Text style={styles.playlistName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={22} color="#e57373" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Playlists</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={32} color="#8e24aa" />
        <Text style={styles.addBtnText}>Crear Playlist</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={item => item.id}
          renderItem={renderPlaylist}
          contentContainerStyle={{ paddingTop: 16 }}
          ListEmptyComponent={<Text style={{ color: '#fff', marginTop: 32 }}>No tienes playlists aún.</Text>}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la playlist"
              placeholderTextColor="#aaa"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              editable={!creating}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} disabled={creating}>
                <Text style={styles.cancelBtn}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} disabled={creating}>
                <Text style={styles.createBtn}>{creating ? 'Creando...' : 'Crear'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 12,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  playlistItem: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#fff',
  },
  playlistName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(33,0,58,0.92)',
    borderRadius: 20,
    padding: 24,
    width: '85%',
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
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  cancelBtn: {
    color: '#aaa',
    fontSize: 16,
    marginRight: 24,
  },
  createBtn: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
