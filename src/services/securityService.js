import api from './api'

const DEMO = import.meta.env.VITE_ENABLE_DEMO === 'true'
const FRONT_ONLY = import.meta.env.VITE_FRONT_ONLY === 'true'

export const securityService = {
  // Obtenir tous les capteurs de sécurité
  getSensors: async () => {
    if (FRONT_ONLY || DEMO) {
      return getMockSensors()
    }
    const response = await api.get('/security/sensors')
    return response.data
  },

  // Obtenir un capteur spécifique
  getSensor: async (sensorId) => {
    if (FRONT_ONLY || DEMO) {
      return getMockSensors().find(s => s.id === sensorId)
    }
    const response = await api.get(`/security/sensors/${sensorId}`)
    return response.data
  },

  // Obtenir toutes les alertes
  getAlerts: async (limit = 50) => {
    if (FRONT_ONLY || DEMO) {
      return getMockAlerts().slice(0, limit)
    }
    const response = await api.get('/security/alerts', { params: { limit } })
    return response.data
  },

  // Acquitter une alerte
  acknowledgeAlert: async (alertId) => {
    if (FRONT_ONLY || DEMO) {
      return { id: alertId, acknowledged: true }
    }
    const response = await api.post(`/security/alerts/${alertId}/acknowledge`)
    return response.data
  },

  // Obtenir les statistiques de sécurité
  getStats: async (period = '7d') => {
    if (FRONT_ONLY || DEMO) {
      return getMockStats()
    }
    const response = await api.get('/security/stats', { params: { period } })
    return response.data
  },

  // Activer/désactiver un capteur
  toggleSensor: async (sensorId, enabled) => {
    if (FRONT_ONLY || DEMO) {
      const sensor = getMockSensors().find(s => s.id === sensorId)
      return { ...sensor, status: enabled ? 'active' : 'inactive' }
    }
    const response = await api.post(`/security/sensors/${sensorId}/toggle`, { enabled })
    return response.data
  },

  // Configurer les notifications
  configureNotifications: async (config) => {
    if (FRONT_ONLY || DEMO) {
      localStorage.setItem('security_notifications', JSON.stringify(config))
      return { success: true }
    }
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
