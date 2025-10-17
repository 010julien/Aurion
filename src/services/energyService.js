import api from './api'

const DEMO = import.meta.env.VITE_ENABLE_DEMO === 'true'
const FRONT_ONLY = import.meta.env.VITE_FRONT_ONLY === 'true'
const FRONT_FALLBACK = !import.meta.env.VITE_API_URL

export const energyService = {
  // Obtenir la consommation actuelle
  getConsumption: async () => {
    if (FRONT_ONLY || DEMO || FRONT_FALLBACK) {
      return getMockConsumption()
    }
    const response = await api.get('/energy/consumption')
    return response.data
  },

  // Obtenir l'historique de consommation
  getHistory: async (period = '7d') => {
    if (FRONT_ONLY || DEMO || FRONT_FALLBACK) {
      return getMockHistory(period)
    }
    const response = await api.get('/energy/history', { params: { period } })
    return response.data
  },

  // Obtenir les statistiques énergétiques
  getStats: async (period = 'month') => {
    if (FRONT_ONLY || DEMO || FRONT_FALLBACK) {
      return getMockStats()
    }
    const response = await api.get('/energy/stats', { params: { period } })
    return response.data
  },

  // Obtenir les prévisions de consommation
  getForecast: async () => {
    if (FRONT_ONLY || DEMO || FRONT_FALLBACK) {
      return getMockForecast()
    }
    const response = await api.get('/energy/forecast')
    return response.data
  },

  // Obtenir la consommation par appareil
  getDeviceConsumption: async () => {
    if (FRONT_ONLY || DEMO || FRONT_FALLBACK) {
      return getMockDeviceConsumption()
    }
    const response = await api.get('/energy/devices')
    return response.data
  },

  // Définir un seuil d'alerte
  setAlertThreshold: async (threshold) => {
    const response = await api.post('/energy/alert-threshold', { threshold })
    return response.data
  },
}

// Données mockées
function getMockConsumption() {
  return {
    current: 2.4, // kW
    today: 18.5, // kWh
    cost: 3700, // FCFA
    trend: 'up',
    trendPercentage: 12,
  }
}

function getMockHistory(period) {
  const now = new Date()
  const data = []
  
  let points = 24
  let interval = 60 * 60 * 1000 // 1 heure
  
  if (period === '7d') {
    points = 7
    interval = 24 * 60 * 60 * 1000 // 1 jour
  } else if (period === '30d') {
    points = 30
    interval = 24 * 60 * 60 * 1000 // 1 jour
  }

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * interval)
    const consumption = 15 + Math.random() * 10 + Math.sin(i / 3) * 5
    
    data.push({
      timestamp,
      consumption: parseFloat(consumption.toFixed(2)),
      cost: parseFloat((consumption * 200).toFixed(0)),
    })
  }

  return data
}

function getMockStats() {
  return {
    totalConsumption: 425.8, // kWh ce mois
    totalCost: 85160, // FCFA
    averageDaily: 14.2, // kWh
    comparedToLastMonth: -8, // %
    peakHour: '19:00',
    peakConsumption: 3.2, // kW
    efficiency: 78, // %
  }
}

function getMockForecast() {
  return {
    nextDay: 16.2,
    nextWeek: 112.4,
    nextMonth: 442.0,
    estimatedCost: 88400, // FCFA
    confidence: 85, // %
  }
}

function getMockDeviceConsumption() {
  return [
    { device: 'Climatiseur', consumption: 185.2, percentage: 35, cost: 37040 },
    { device: 'Réfrigérateur', consumption: 120.5, percentage: 23, cost: 24100 },
    { device: 'Éclairage', consumption: 65.3, percentage: 12, cost: 13060 },
    { device: 'TV & Divertissement', consumption: 45.8, percentage: 9, cost: 9160 },
    { device: 'Ventilateurs', consumption: 38.2, percentage: 7, cost: 7640 },
    { device: 'Autres', consumption: 70.8, percentage: 14, cost: 14160 },
  ]
}
