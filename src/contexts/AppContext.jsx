import { createContext, useContext, useState, useEffect } from 'react'
import { deviceService } from '../services/deviceService'
import { securityService } from '../services/securityService'
import { energyService } from '../services/energyService'

const AppContext = createContext(null)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp doit être utilisé dans un AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // État des appareils
  const [devices, setDevices] = useState([])
  const [devicesLoading, setDevicesLoading] = useState(false)

  // État de la sécurité
  const [sensors, setSensors] = useState([])
  const [alerts, setAlerts] = useState([])
  const [securityLoading, setSecurityLoading] = useState(false)

  // État énergétique
  const [energyData, setEnergyData] = useState(null)
  const [energyLoading, setEnergyLoading] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState([])

  // Paramètres
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings')
    return savedSettings ? JSON.parse(savedSettings) : {
      theme: 'light',
      language: 'fr',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      autoMode: false,
      awayMode: false,
    }
  })

  // Charger les appareils
  const loadDevices = async () => {
    try {
      setDevicesLoading(true)
      const data = await deviceService.getDevices()
      setDevices(data)
    } catch (error) {
      console.error('Erreur lors du chargement des appareils:', error)
      addNotification('Erreur de chargement des appareils', 'error')
    } finally {
      setDevicesLoading(false)
    }
  }

  // Charger les capteurs de sécurité
  const loadSecurity = async () => {
    try {
      setSecurityLoading(true)
      const [sensorsData, alertsData] = await Promise.all([
        securityService.getSensors(),
        securityService.getAlerts()
      ])
      setSensors(sensorsData)
      setAlerts(alertsData)
    } catch (error) {
      console.error('Erreur lors du chargement de la sécurité:', error)
      addNotification('Erreur de chargement des données de sécurité', 'error')
    } finally {
      setSecurityLoading(false)
    }
  }

  // Charger les données énergétiques
  const loadEnergy = async () => {
    try {
      setEnergyLoading(true)
      const data = await energyService.getConsumption()
      setEnergyData(data)
    } catch (error) {
      console.error('Erreur lors du chargement des données énergétiques:', error)
      addNotification('Erreur de chargement des données énergétiques', 'error')
    } finally {
      setEnergyLoading(false)
    }
  }

  // Basculer un appareil (mise à jour optimiste pour réactivité instantanée)
  const toggleDevice = async (deviceId) => {
    // Trouver l'appareil et inverser son état immédiatement
    const device = devices.find(d => d.id === deviceId)
    if (!device) return

    const newStatus = !device.status
    
    // Mise à jour optimiste : changer l'état immédiatement
    setDevices(devices.map(d => 
      d.id === deviceId ? { ...d, status: newStatus } : d
    ))
    
    addNotification(`Appareil ${newStatus ? 'allumé' : 'éteint'}`, 'success')
    
    // Envoyer la requête en arrière-plan
    try {
      await deviceService.toggleDevice(deviceId)
    } catch (error) {
      // En cas d'erreur, restaurer l'état précédent
      console.error('Erreur lors du basculement de l\'appareil:', error)
      setDevices(devices.map(d => 
        d.id === deviceId ? { ...d, status: !newStatus } : d
      ))
      addNotification('Erreur lors du contrôle de l\'appareil', 'error')
    }
  }

  // Programmer un appareil
  const scheduleDevice = async (deviceId, schedule) => {
    try {
      await deviceService.scheduleDevice(deviceId, schedule)
      addNotification('Programmation enregistrée avec succès', 'success')
      await loadDevices()
    } catch (error) {
      console.error('Erreur lors de la programmation:', error)
      addNotification('Erreur lors de la programmation', 'error')
    }
  }

  // Ajouter un nouvel appareil
  const addDevice = (newDevice) => {
    const device = {
      ...newDevice,
      id: devices.length + 1,
      status: false,
    }
    setDevices([...devices, device])
    addNotification(`Appareil "${device.name}" ajouté avec succès`, 'success')
  }

  // Supprimer un appareil
  const deleteDevice = (deviceId) => {
    setDevices(devices.filter(d => d.id !== deviceId))
    addNotification('Appareil supprimé', 'info')
  }

  // Acquitter une alerte
  const acknowledgeAlert = async (alertId) => {
    try {
      await securityService.acknowledgeAlert(alertId)
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a))
      addNotification('Alerte acquittée', 'success')
    } catch (error) {
      console.error('Erreur lors de l\'acquittement:', error)
      addNotification('Erreur lors de l\'acquittement de l\'alerte', 'error')
    }
  }

  // Ajouter un nouveau capteur
  const addSensor = (newSensor) => {
    const sensor = {
      ...newSensor,
      id: sensors.length + 1,
      status: 'active',
      battery: 100,
      lastTrigger: null,
    }
    setSensors([...sensors, sensor])
    addNotification(`Capteur "${sensor.name}" ajouté avec succès`, 'success')
  }

  // Supprimer un capteur
  const deleteSensor = (sensorId) => {
    setSensors(sensors.filter(s => s.id !== sensorId))
    addNotification('Capteur supprimé', 'info')
  }

  // Activer/désactiver le mode absence
  const toggleAwayMode = async () => {
    try {
      const newMode = !settings.awayMode
      setSettings({ ...settings, awayMode: newMode })
      addNotification(
        `Mode absence ${newMode ? 'activé' : 'désactivé'}`,
        'info'
      )
      // Appeler l'API pour activer le mode absence
      // await deviceService.setAwayMode(newMode)
    } catch (error) {
      console.error('Erreur lors du changement de mode:', error)
      addNotification('Erreur lors du changement de mode', 'error')
    }
  }

  // Ajouter une notification
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    }
    setNotifications(prev => [notification, ...prev].slice(0, 50)) // Garder les 50 dernières

    // Auto-supprimer après 5 secondes
    setTimeout(() => {
      removeNotification(notification.id)
    }, 5000)
  }

  // Supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Mettre à jour les paramètres
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    // Sauvegarder dans localStorage
    localStorage.setItem('settings', JSON.stringify(updated))
    
    // Appliquer le thème dark/light
    if (newSettings.theme) {
      if (newSettings.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Appliquer le thème au chargement et lors des changements
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.theme])

  const value = {
    // Appareils
    devices,
    devicesLoading,
    loadDevices,
    toggleDevice,
    scheduleDevice,
    addDevice,
    deleteDevice,

    // Sécurité
    sensors,
    alerts,
    securityLoading,
    loadSecurity,
    acknowledgeAlert,
    addSensor,
    deleteSensor,

    // Énergie
    energyData,
    energyLoading,
    loadEnergy,

    // Notifications
    notifications,
    addNotification,
    removeNotification,

    // Paramètres
    settings,
    updateSettings,
    toggleAwayMode,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
