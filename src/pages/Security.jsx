import { useEffect, useState } from 'react'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Flame,
  Radio,
  Battery,
  Filter,
  Download,
  Plus
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import StatCard from '../components/common/StatCard'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const Security = () => {
  const { 
    sensors, 
    alerts, 
    loadSecurity, 
    acknowledgeAlert,
    addSensor,
    securityLoading 
  } = useApp()

  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSensorData, setNewSensorData] = useState({
    name: '',
    type: 'motion',
    location: '',
  })

  useEffect(() => {
    loadSecurity()
  }, [])

  // Statistiques
  const activeSensors = sensors.filter(s => s.status === 'active').length
  const lowBatterySensors = sensors.filter(s => s.battery < 20).length
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length
  const totalAlerts = alerts.length

  // Filtrer les alertes
  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unacknowledged' && alert.acknowledged) return false
      if (selectedFilter === 'acknowledged' && !alert.acknowledged) return false
    }
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false
    return true
  })

  const getSensorIcon = (type) => {
    switch (type) {
      case 'motion':
        return <Radio className="w-5 h-5" />
      case 'smoke':
      case 'fire':
        return <Flame className="w-5 h-5" />
      default:
        return <Eye className="w-5 h-5" />
    }
  }

  const getSensorColor = (status) => {
    return status === 'active' ? 'green' : 'red'
  }

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'success'
    }
  }

  const handleAddSensor = () => {
    if (!newSensorData.name || !newSensorData.location) return

    addSensor(newSensorData)
    setShowAddModal(false)
    setNewSensorData({ name: '', type: 'motion', location: '' })
  }

  if (securityLoading) {
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sécurité</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérez vos capteurs et surveillez les alertes de sécurité
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Capteurs actifs"
          value={`${activeSensors}/${sensors.length}`}
          icon={Shield}
          color="green"
          description="Tous les capteurs"
        />
        
        <StatCard
          title="Alertes critiques"
          value={criticalAlerts}
          icon={AlertTriangle}
          color={criticalAlerts > 0 ? 'red' : 'green'}
          description="Non acquittées"
        />
        
        <StatCard
          title="Batterie faible"
          value={lowBatterySensors}
          icon={Battery}
          color={lowBatterySensors > 0 ? 'yellow' : 'green'}
          description="Capteurs à remplacer"
        />
        
        <StatCard
          title="Total alertes"
          value={totalAlerts}
          icon={CheckCircle}
          color="blue"
          description="Dernières 24h"
        />
      </div>

      {/* Capteurs */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Capteurs de sécurité
          </h2>
          <Button variant="outline" size="sm" icon={Plus} onClick={() => setShowAddModal(true)}>
            Ajouter un capteur
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-aurion transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${getSensorColor(sensor.status)}-100 rounded-lg flex items-center justify-center text-${getSensorColor(sensor.status)}-600`}>
                    {getSensorIcon(sensor.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {sensor.name}
                    </h3>
                    <p className="text-xs text-gray-500">{sensor.location}</p>
                  </div>
                </div>
                <Badge variant={sensor.status === 'active' ? 'success' : 'error'}>
                  {sensor.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Batterie</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          sensor.battery > 50 ? 'bg-green-500' :
                          sensor.battery > 20 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${sensor.battery}%` }}
                      />
                    </div>
                    <span className="text-gray-900 font-medium">{sensor.battery}%</span>
                  </div>
                </div>

                {sensor.lastTrigger && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Dernier déclenchement</span>
                    <span className="text-gray-900">
                      {formatDistanceToNow(new Date(sensor.lastTrigger), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Historique des alertes */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Historique des alertes
          </h2>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-aurion focus:border-transparent"
              >
                <option value="all">Toutes</option>
                <option value="unacknowledged">Non acquittées</option>
                <option value="acknowledged">Acquittées</option>
              </select>
            </div>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-aurion focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="critical">Critique</option>
              <option value="warning">Attention</option>
              <option value="info">Information</option>
              <option value="success">Succès</option>
            </select>

            <Button variant="outline" size="sm" icon={Download}>
              Exporter
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">Aucune alerte à afficher</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 rounded-lg transition-all ${
                  alert.acknowledged 
                    ? 'bg-gray-50 border-gray-300' 
                    : alert.severity === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {alert.acknowledged ? (
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                      ) : alert.severity === 'critical' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {alert.message}
                        </h3>
                        <Badge variant={getAlertColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge variant="default">Acquittée</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          📍 {alert.location}
                        </span>
                        <span className="flex items-center">
                          🔔 {alert.sensor}
                        </span>
                        <span className="flex items-center">
                          🕐 {new Date(alert.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!alert.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acquitter
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Add Sensor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un nouveau capteur"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddModal(false)} fullWidth>
              Annuler
            </Button>
            <Button onClick={handleAddSensor} disabled={!newSensorData.name || !newSensorData.location} fullWidth>
              Ajouter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nom du capteur"
            value={newSensorData.name}
            onChange={(e) => setNewSensorData({ ...newSensorData, name: e.target.value })}
            placeholder="ex: Détecteur de Mouvement - Entrée"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de capteur</label>
            <select
              value={newSensorData.type}
              onChange={(e) => setNewSensorData({ ...newSensorData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurion focus:border-transparent"
            >
              <option value="motion">🚶 Détecteur de Mouvement</option>
              <option value="smoke">💨 Détecteur de Fumée</option>
              <option value="fire">🔥 Détecteur d'Incendie</option>
              <option value="door">🚪 Capteur de Porte</option>
              <option value="window">🪟 Capteur de Fenêtre</option>
            </select>
          </div>

          <Input
            label="Emplacement"
            value={newSensorData.location}
            onChange={(e) => setNewSensorData({ ...newSensorData, location: e.target.value })}
            placeholder="ex: Entrée, Salon, Cuisine"
            required
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 Le capteur sera automatiquement activé avec une batterie à 100%.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Security
