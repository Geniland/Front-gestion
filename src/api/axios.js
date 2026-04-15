import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(config => {
  // On priorise le token admin, sinon le token site public
  const token = localStorage.getItem('token') || localStorage.getItem('site_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Intercepteur pour gérer l'expiration du token (401)
let isSessionExpiredAlertShown = false;

api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    // Éviter les alertes multiples
    if (!isSessionExpiredAlertShown) {
      isSessionExpiredAlertShown = true;
      
      // Nettoyage immédiat du stockage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('site_token');
      localStorage.removeItem('site_user');

      // Notification utilisateur
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      
      // Redirection selon le contexte
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin-login';
      } else {
        window.location.href = '/login';
      }
      
      // Réinitialiser le flag après un court instant au cas où
      setTimeout(() => { isSessionExpiredAlertShown = false; }, 5000);
    }
  }
  return Promise.reject(error);
});

export default api;
