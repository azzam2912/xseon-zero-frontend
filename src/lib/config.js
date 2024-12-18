import { env } from '$env/dynamic/public';

const apiBaseUrl = env.PUBLIC_API_DEV == 'local' ?  
    env.PUBLIC_LOCAL_API_URL || 'http://localhost:3000/api' 
       : (env.PUBLIC_API_DEV == 'server' ? env.PUBLIC_SERVER_API_URL : env.PUBLIC_PROD_API_URL);

export const config = {
  apiUrl: apiBaseUrl,
  getAuthUrl: (endpoint) => `${apiBaseUrl}${env.PUBLIC_BASE_AUTH}${endpoint}`,
  getQuizUrl: (endpoint) => `${apiBaseUrl}${env.PUBLIC_BASE_QUIZ}${endpoint}`,
};

export default config;