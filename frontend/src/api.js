import axios from 'axios';

const API_BASE_URL = 'https://code-x2-0-amuhacks-5-0.vercel.app/api';

export const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/user`, userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_BASE_URL}/user/${userId}`, userData);
  return response.data;
};

export const getSchedule = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/schedule/${userId}`);
  return response.data;
};

export const updateProgress = async (userId, subjectId, completionPercentage) => {
  const response = await axios.put(`${API_BASE_URL}/update-progress/${userId}`, {
    subjectId,
    completionPercentage
  });
  return response.data;
};

export const generatePlan = async (planData) => {
  const response = await axios.post(`${API_BASE_URL}/user`, planData);
  return response.data;
};


