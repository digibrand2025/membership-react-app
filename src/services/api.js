// src/services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants/config';

// Create axios instance
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.log('API Error:', error.response || error.message);
    
    if (error.response) {
      // Server responded with error
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // No response received
      return Promise.reject({ error: 'Network error. Please check your connection.' });
    } else {
      // Request setup error
      return Promise.reject({ error: 'Request failed. Please try again.' });
    }
  }
);

// Auth Services
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      
      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        return response.data;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.VERIFY_TOKEN);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },
};

// Member Services
export const memberService = {
  searchMember: async (membershipId) => {
    try {
      const response = await api.post(API_ENDPOINTS.SEARCH_MEMBER, {
        membership_id: membershipId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;