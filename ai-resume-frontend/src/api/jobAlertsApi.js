import api from './axiosConfig';

export const subscribeToJobAlerts = async (data) => {
  const response = await api.post('/job-alerts/subscribe', data);
  return response.data;
};

export const getJobAlerts = async () => {
  const response = await api.get('/job-alerts');
  return response.data;
};

export const deleteJobAlert = async (id) => {
  const response = await api.delete(`/job-alerts/${id}`);
  return response.data;
};
