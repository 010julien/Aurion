import api from './api'

export const securityService = {
  // Obtenir tous les capteurs de sécurité
  getSensors: async () => {
    try {
      const response = await api.get('/security/sensors')
      return response.data
    } catch (error) {
      // Données mockées pour le développement
      if (import.meta.env.DEV) {
        return getMockSensors()
      }
      throw error
    }
  },

  // Obtenir un capteur spécifique
  getSensor: async (sensorId) => {
    const response = await api.get(`/security/sensors/${sensorId}`)
    return response.data
  },

  // Obtenir toutes les alertes
  getAlerts: async (limit = 50) => {
    try {
      const response = await api.get('/security/alerts', { params: { limit } })
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        return getMockAlerts()
      }
      throw error
    }
  },

  // Acquitter une alerte
  acknowledgeAlert: async (alertId) => {
    const response = await api.post(`/security/alerts/${alertId}/acknowledge`)
    return response.data
  },

  // Obtenir les statistiques de sécurité
  getStats: async (period = '7d') => {
    try {
      const response = await api.get('/security/stats', { params: { period } })
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        return getMockStats()
      }
      throw error
    }
  },

  // Activer/désactiver un capteur
  toggleSensor: async (sensorId, enabled) => {
    const response = await api.post(`/security/sensors/${sensorId}/toggle`, { enabled })
    return response.data
  },

  // Configurer les notifications
  configureNotifications: async (config) => {
    const response = await api.post('/security/notifications/config', config)
    return response.data
  },
}

// Données mockées
function getMockSensors() {
  return [
    {
      id: 1,
      name: 'Détecteur de Mouvement - Entrée',
      type: 'motion',
      location: 'Entrée',
      status: 'active',
      battery: 85,
      lastTrigger: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      name: 'Détecteur de Fumée - Cuisine',
      type: 'smoke',
      location: 'Cuisine',
      status: 'active',
      battery: 92,
      lastTrigger: null,
    },
    {
      id: 3,
      name: 'Détecteur de Mouvement - Salon',
      type: 'motion',
      location: 'Salon',
      status: 'active',
      battery: 78,
      lastTrigger: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: 4,
      name: 'Détecteur d\'Incendie - Chambre',
      type: 'fire',
      location: 'Chambre',
      status: 'active',
      battery: 88,
      lastTrigger: null,
    },
    {
      id: 5,
      name: 'Détecteur de Mouvement - Garage',
      type: 'motion',
      location: 'Garage',
      status: 'inactive',
      battery: 45,
      lastTrigger: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]
}

function getMockAlerts() {
  return [
    {
      id: 1,
      type: 'motion',
      sensor: 'Détecteur de Mouvement - Entrée',
      location: 'Entrée',
      severity: 'warning',
      message: 'Mouvement détecté',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      acknowledged: false,
    },
    {
      id: 2,
      type: 'low_battery',
      sensor: 'Détecteur de Mouvement - Garage',
      location: 'Garage',
      severity: 'info',
      message: 'Batterie faible (45%)',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      acknowledged: false,
    },
    {
      id: 3,
      type: 'motion',
      sensor: 'Détecteur de Mouvement - Salon',
      location: 'Salon',
      severity: 'info',
      message: 'Mouvement détecté',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      acknowledged: true,
    },
    {
      id: 4,
      type: 'system',
      sensor: 'Système',
      location: 'Global',
      severity: 'success',
      message: 'Tous les capteurs sont opérationnels',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      acknowledged: true,
    },
  ]
}

function getMockStats() {
  return {
    totalSensors: 5,
    activeSensors: 4,
    totalAlerts: 24,
    criticalAlerts: 0,
    averageResponseTime: '2min',
    uptime: 99.8,
  }
}
