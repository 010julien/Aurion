import api from './api'

export const deviceService = {
  // Obtenir tous les appareils
  getDevices: async () => {
    try {
      const response = await api.get('/devices')
      return response.data
    } catch (error) {
      // En mode développement, retourner des données mockées
      if (import.meta.env.DEV) {
        return getMockDevices()
      }
      throw error
    }
  },

  // Obtenir un appareil spécifique
  getDevice: async (deviceId) => {
    const response = await api.get(`/devices/${deviceId}`)
    return response.data
  },

  // Basculer l'état d'un appareil (on/off)
  toggleDevice: async (deviceId) => {
    try {
      const response = await api.post(`/devices/${deviceId}/toggle`)
      return response.data
    } catch (error) {
      // Simulation en mode dev
      if (import.meta.env.DEV) {
        const devices = getMockDevices()
        const device = devices.find(d => d.id === deviceId)
        return { ...device, status: !device.status }
      }
      throw error
    }
  },

  // Programmer un appareil
  scheduleDevice: async (deviceId, schedule) => {
    const response = await api.post(`/devices/${deviceId}/schedule`, schedule)
    return response.data
  },

  // Obtenir les programmations d'un appareil
  getDeviceSchedules: async (deviceId) => {
    const response = await api.get(`/devices/${deviceId}/schedules`)
    return response.data
  },

  // Supprimer une programmation
  deleteSchedule: async (scheduleId) => {
    const response = await api.delete(`/devices/schedules/${scheduleId}`)
    return response.data
  },

  // Activer le mode absence
  setAwayMode: async (enabled) => {
    const response = await api.post('/devices/away-mode', { enabled })
    return response.data
  },

  // Obtenir l'état du mode absence
  getAwayMode: async () => {
    const response = await api.get('/devices/away-mode')
    return response.data
  },
}

// Données mockées pour le développement
function getMockDevices() {
  return [
    {
      id: 1,
      name: 'Lumière Salon',
      type: 'light',
      room: 'Salon',
      status: true,
      power: 60,
      icon: 'Lightbulb',
    },
    {
      id: 2,
      name: 'Climatiseur Chambre',
      type: 'climate',
      room: 'Chambre',
      status: false,
      power: 1200,
      temperature: 24,
      icon: 'Wind',
    },
    {
      id: 3,
      name: 'TV Salon',
      type: 'entertainment',
      room: 'Salon',
      status: true,
      power: 150,
      icon: 'Tv',
    },
    {
      id: 4,
      name: 'Réfrigérateur',
      type: 'appliance',
      room: 'Cuisine',
      status: true,
      power: 200,
      icon: 'Refrigerator',
    },
    {
      id: 5,
      name: 'Lumière Cuisine',
      type: 'light',
      room: 'Cuisine',
      status: false,
      power: 40,
      icon: 'Lightbulb',
    },
    {
      id: 6,
      name: 'Ventilateur Bureau',
      type: 'fan',
      room: 'Bureau',
      status: true,
      power: 75,
      icon: 'Fan',
    },
  ]
}
