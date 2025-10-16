import axios from 'axios'

// Configuration de base d'Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const DEMO = import.meta.env.VITE_ENABLE_DEMO === 'true'
const FRONT_ONLY = import.meta.env.VITE_FRONT_ONLY === 'true'

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Erreur de réponse du serveur
      switch (error.response.status) {
        case 401:
          // Token expiré ou invalide
          localStorage.removeItem('token')
          if (!(DEMO || FRONT_ONLY)) {
            window.location.href = '/login'
          }
          break
        case 403:
          console.error('Accès refusé')
          break
        case 404:
          console.error('Ressource non trouvée')
          break
        case 500:
          console.error('Erreur serveur')
          break
        default:
          console.error('Erreur:', error.response.data.message)
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      console.error('Pas de réponse du serveur. Vérifiez votre connexion.')
    } else {
      console.error('Erreur:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
