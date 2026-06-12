import api from './axiosConfig';

export const generateOutreach = async (data) => {
  const response = await api.post('/outreach/generate', data);
  return response.data;
};
