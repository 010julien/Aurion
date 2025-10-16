import api from './api'

export const authService = {
  // Connexion
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      // Mode démo : accepter n'importe quel email/mot de passe
      if (import.meta.env.DEV) {
        console.log('🚀 Mode démo activé - Connexion simulée')
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
      throw error
    }
  },

  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      // Mode démo
      if (import.meta.env.DEV) {
        console.log('🚀 Mode démo activé - Inscription simulée')
        return {
          user: {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
          },
          token: 'demo_token_' + Date.now(),
        }
      }
      throw error
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.log('Déconnexion locale')
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      // Mode démo : récupérer depuis localStorage
      if (import.meta.env.DEV) {
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
