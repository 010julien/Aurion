import api from './api'

const DEMO = import.meta.env.VITE_ENABLE_DEMO === 'true'
const FRONT_ONLY = import.meta.env.VITE_FRONT_ONLY === 'true'

export const deviceService = {
  // Obtenir tous les appareils
  getDevices: async () => {
    if (FRONT_ONLY || DEMO) {
      return getMockDevices()
    }
    const response = await api.get('/devices')
    return response.data
  },

  // Obtenir un appareil spécifique
  getDevice: async (deviceId) => {
    if (FRONT_ONLY || DEMO) {
      return getMockDevices().find(d => d.id === deviceId)
    }
    const response = await api.get(`/devices/${deviceId}`)
    return response.data
  },

  // Basculer l'état d'un appareil (on/off)
  toggleDevice: async (deviceId) => {
    if (FRONT_ONLY || DEMO) {
      const devices = getMockDevices()
      const device = devices.find(d => d.id === deviceId)
      return { ...device, status: !device.status }
    }
    const response = await api.post(`/devices/${deviceId}/toggle`)
    return response.data
  },

  // Programmer un appareil
  scheduleDevice: async (deviceId, schedule) => {
    if (FRONT_ONLY || DEMO) {
      return { id: Date.now(), deviceId, ...schedule }
    }
    const response = await api.post(`/devices/${deviceId}/schedule`, schedule)
    return response.data
  },

  // Obtenir les programmations d'un appareil
  getDeviceSchedules: async (deviceId) => {
    if (FRONT_ONLY || DEMO) {
      return []
    }
    const response = await api.get(`/devices/${deviceId}/schedules`)
    return response.data
  },

  // Supprimer une programmation
  deleteSchedule: async (scheduleId) => {
    if (FRONT_ONLY || DEMO) {
      return { success: true }
    }
    const response = await api.delete(`/devices/schedules/${scheduleId}`)
    return response.data
  },

  // Activer le mode absence
  setAwayMode: async (enabled) => {
    if (FRONT_ONLY || DEMO) {
      localStorage.setItem('away_mode', JSON.stringify({ enabled }))
      return { enabled }
    }
    const response = await api.post('/devices/away-mode', { enabled })
    return response.data
  },

  // Obtenir l'état du mode absence
  getAwayMode: async () => {
    if (FRONT_ONLY || DEMO) {
      const raw = localStorage.getItem('away_mode')
      return raw ? JSON.parse(raw) : { enabled: false }
    }
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
