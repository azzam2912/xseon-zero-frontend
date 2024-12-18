import { userStore } from '$lib/stores/auth';
import config from '$lib/config';

export const authService = {
  async initializeAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(config.getAuthUrl('/profile'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          userStore.set(userData);
          return userData;
        } else {
          this.logout();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        this.logout();
      }
    }
    return null;
  },

  logout() {
    localStorage.removeItem('token');
    userStore.set(null);
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};