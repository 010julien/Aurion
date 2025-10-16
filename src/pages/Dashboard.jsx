import { useEffect, useState } from 'react'
import { 
  Zap, 
  Shield, 
  Lightbulb, 
  AlertTriangle,
  TrendingUp,
  Home,
  Clock,
  Activity
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import StatCard from '../components/common/StatCard'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toggle from '../components/common/Toggle'
import Badge from '../components/common/Badge'

const Dashboard = () => {
  const { 
    devices, 
    loadDevices, 
    toggleDevice,
    sensors,
    loadSecurity,
    alerts,
    energyData,
    loadEnergy,
    settings,
    toggleAwayMode
  } = useApp()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        loadDevices(),
        loadSecurity(),
        loadEnergy()
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  // Grouper les appareils par pièce
  const devicesByRoom = devices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = []
    }
    acc[device.room].push(device)
    return acc
  }, {})

  // Statistiques
  const activeDevices = devices.filter(d => d.status).length
  const totalDevices = devices.length
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length
  const activeSensors = sensors.filter(s => s.status === 'active').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-aurion mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de Bord</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vue d'ensemble de votre maison intelligente
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode Absence</span>
          <Toggle 
            enabled={settings.awayMode}
            onChange={toggleAwayMode}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Appareils actifs"
          value={`${activeDevices}/${totalDevices}`}
          icon={Lightbulb}
          color="blue"
          trend="up"
          trendValue={`${Math.round((activeDevices/totalDevices) * 100)}% actifs`}
        />
        
        <StatCard
          title="Consommation actuelle"
          value={`${energyData?.current || 0} kW`}
          icon={Zap}
          color="yellow"
          trend={energyData?.trend || 'neutral'}
          trendValue={energyData?.trendPercentage ? `${energyData.trendPercentage}%` : null}
          description={`${energyData?.cost || 0} FCFA aujourd'hui`}
        />
        
        <StatCard
          title="Sécurité"
          value={`${activeSensors} capteurs`}
          icon={Shield}
          color={unacknowledgedAlerts > 0 ? 'red' : 'green'}
          description={unacknowledgedAlerts > 0 ? `${unacknowledgedAlerts} alerte(s)` : 'Tous les systèmes OK'}
        />
        
        <StatCard
          title="Statut système"
          value="En ligne"
          icon={Activity}
          color="green"
          description="Tous les systèmes fonctionnent"
        />
      </div>

      {/* Alertes importantes */}
      {unacknowledgedAlerts > 0 && (
        <Card className="border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">
                Alertes en attente
              </h3>
              <p className="text-sm text-yellow-800">
                Vous avez {unacknowledgedAlerts} alerte(s) de sécurité non acquittée(s).
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/security'}
            >
              Voir les alertes
            </Button>
          </div>
        </Card>
      )}

      {/* Pièces de la maison */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Aperçu par pièce
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/devices'}
          >
            Gérer les appareils
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(devicesByRoom).map(([room, roomDevices]) => (
            <Card key={room} hover>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{room}</h3>
                <Badge variant={roomDevices.some(d => d.status) ? 'success' : 'default'}>
                  {roomDevices.filter(d => d.status).length}/{roomDevices.length} actifs
                </Badge>
              </div>

              <div className="space-y-3">
                {roomDevices.map((device) => (
                  <div 
                    key={device.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-150 ${
                      device.status 
                        ? 'bg-green-50 border border-green-200 shadow-sm' 
                        : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                        device.status ? 'bg-green-100 scale-105' : 'bg-gray-200 scale-100'
                      }`}>
                        <Lightbulb className={`w-4 h-4 transition-colors duration-150 ${
                          device.status ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {device.name}
                        </p>
                        {device.power && (
                          <p className="text-xs text-gray-500">
                            {device.power}W
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Toggle
                      enabled={device.status}
                      onChange={() => toggleDevice(device.id)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activité récente */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Activité récente
          </h2>
        </div>

        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                alert.severity === 'critical' ? 'bg-red-500' :
                alert.severity === 'warning' ? 'bg-yellow-500' :
                alert.severity === 'info' ? 'bg-blue-500' :
                'bg-green-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {alert.location} • {new Date(alert.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>
              <Badge variant={
                alert.severity === 'critical' ? 'error' :
                alert.severity === 'warning' ? 'warning' :
                'info'
              }>
                {alert.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
