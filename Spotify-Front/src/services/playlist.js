import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://spotify-back-production-b5ed.up.railway.app/api';

export const getUserPlaylists = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(
    `${BASE_URL}/playlist`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const createPlaylist = async (name) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.post(
    `${BASE_URL}/playlist`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getPlaylistById = async (id) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(
    `${BASE_URL}/playlist/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updatePlaylist = async (id, name) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.put(
    `${BASE_URL}/playlist/${id}`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deletePlaylist = async (id) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.delete(
    `${BASE_URL}/playlist/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.post(
    `${BASE_URL}/playlist/${playlistId}/songs`,
    { songId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.delete(
    `${BASE_URL}/playlist/${playlistId}/songs/${songId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
