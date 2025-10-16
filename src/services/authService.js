import api from './api'

// Modes d'auth
const DEMO = import.meta.env.VITE_ENABLE_DEMO === 'true'
const FRONT_ONLY = import.meta.env.VITE_FRONT_ONLY === 'true'

// Identifiants par défaut pour le mode front-only
const FRONT_EMAIL = import.meta.env.VITE_FRONT_EMAIL || 'admin@aurion.tg'
const FRONT_PASSWORD = import.meta.env.VITE_FRONT_PASSWORD || 'admin123'

export const authService = {
  // Connexion
  login: async (email, password) => {
    // 100% Front: vérifier des identifiants locaux, sans réseau
    if (FRONT_ONLY) {
      if (email === FRONT_EMAIL && password === FRONT_PASSWORD) {
        const user = {
          id: 1,
          name: 'Administrateur',
          email: FRONT_EMAIL,
          phone: '+228 XX XX XX XX',
        }
        return {
          user,
          token: 'front_only_token_' + Date.now(),
        }
      }
      throw new Error('Identifiants invalides')
    }
    if (DEMO) {
      // Pas d'appel réseau en mode démo
      return {
        user: {
          id: 1,
          name: email.split('@')[0] || 'Utilisateur Demo',
          email: email,
          phone: '+228 XX XX XX XX',
        },
        token: 'demo_token_' + Date.now(),
      }
    }
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      // Mode démo : accepter n'importe quel email/mot de passe (DEV ou VITE_ENABLE_DEMO=true)
      // Déjà géré au-dessus
      throw error
    }
  },

  // Inscription
  register: async (userData) => {
    if (FRONT_ONLY) {
      const user = {
        id: Date.now(),
        name: userData.name || 'Utilisateur',
        email: userData.email || FRONT_EMAIL,
        phone: userData.phone || '+228 XX XX XX XX',
      }
      return { user, token: 'front_only_token_' + Date.now() }
    }
    if (DEMO) {
      return {
        user: {
          id: Date.now(),
          name: userData.name || 'Utilisateur Demo',
          email: userData.email,
          phone: userData.phone || '+228 XX XX XX XX',
        },
        token: 'demo_token_' + Date.now(),
      }
    }
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      // Déjà géré au-dessus
      throw error
    }
  },

  // Déconnexion
  logout: async () => {
    if (!FRONT_ONLY && !DEMO) {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.log('Déconnexion locale')
      }
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: async () => {
    if (FRONT_ONLY) {
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) return JSON.parse(demoUser)
      return {
        id: 1,
        name: 'Administrateur',
        email: FRONT_EMAIL,
      }
    }
    if (DEMO) {
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) {
        return JSON.parse(demoUser)
      }
      return {
        id: 1,
        name: 'Utilisateur Demo',
        email: 'demo@aurion.tg',
      }
    }
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      // Déjà géré au-dessus
      throw error
    }
  },

  // Mettre à jour le profil
  updateProfile: async (updates) => {
    const response = await api.put('/auth/profile', updates)
    return response.data
  },

  // Changer le mot de passe
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },

  // Réinitialiser le mot de passe
  resetPassword: async (email) => {
    const response = await api.post('/auth/reset-password', { email })
    return response.data
  },
}
