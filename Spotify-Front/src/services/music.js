import API from './api';

export const searchTracks = async (query) => {
  const res = await API.get(`/music/search`, {
    params: { query, type: 'track' }
  });
  return res.data;
};

export const getTrack = async (id) => {
  const res = await API.get(`/music/${id}`);
  return res.data;
};

export const getTrackPreview = async (id) => {
  const res = await API.get(`/music/preview/${id}`);
  return res.data;
};

export const getSimilarTracks = async (id) => {
  const res = await API.get(`/music/track/${id}/similar`);
  return res.data;
};

export const getNextRecommendation = async (id) => {
  const res = await API.get(`/music/recommendation/${id}`);
  return res.data;
};

export const getHomeData = async () => {
  const res = await API.get('/music/home');
  return res.data;
};
