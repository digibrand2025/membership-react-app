// src/constants/config.js

// IMPORTANT: Replace with your actual server URL
// For local development: use your computer's IP address (not localhost)
// Example: http://192.168.1.100/your-project/api/react-api
// For production: use your live domain

export const API_BASE_URL = 'http://sahanasewa.online/react-api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth.php`,
  VERIFY_TOKEN: `${API_BASE_URL}/verify-token.php`,
  SEARCH_MEMBER: `${API_BASE_URL}/search-member.php`,
};

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  light: '#f8fafc',
  dark: '#1e293b',
  white: '#ffffff',
  gray: '#6b7280',
};

export const STATUS_COLORS = {
  green: '#10b981',
  blue: '#3b82f6',
  orange: '#f59e0b',
  red: '#ef4444',
  gray: '#6b7280',
  black: '#1e293b',
};