import { env } from '$env/dynamic/private';

const apiBaseUrl = env.PRIVATE_API_DEV == 'local' ?  
    env.PRIVATE_LOCAL_API_URL || 'http://localhost:3000/api' 
       : env.PRIVATE_API_DEV == 'server' 
          ? env.PRIVATE_SERVER_API_URL 
          : env.PRIVATE_PROD_API_URL;

export const config = {
  apiUrl: apiBaseUrl,
  getAuthUrl: (endpoint) => `${apiBaseUrl}${env.PRIVATE_BASE_AUTH}${endpoint}`,
  getQuizUrl: (endpoint) => `${apiBaseUrl}${env.PRIVATE_BASE_QUIZ}${endpoint}`,
};

export default config;