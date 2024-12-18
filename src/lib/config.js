import { PUBLIC_API_DEV, PUBLIC_LOCAL_API_URL, PUBLIC_SERVER_API_URL, PUBLIC_PROD_API_URL, PUBLIC_BASE_AUTH, PUBLIC_BASE_QUIZ } from '$env/static/public';

const apiBaseUrl = PUBLIC_API_DEV === 'local' 
  ? PUBLIC_LOCAL_API_URL || 'http://localhost:3000/api'
  : PUBLIC_API_DEV === 'server' 
    ? PUBLIC_SERVER_API_URL 
    : PUBLIC_PROD_API_URL;

const config = {
  apiUrl: apiBaseUrl,
  getAuthUrl: (endpoint) => `${apiBaseUrl}${PUBLIC_BASE_AUTH}${endpoint}`,
  getQuizUrl: (endpoint) => `${apiBaseUrl}${PUBLIC_BASE_QUIZ}${endpoint}`,
};

export default config;