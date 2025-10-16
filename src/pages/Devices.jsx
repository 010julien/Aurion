import { useEffect, useState } from 'react'
import {
  Lightbulb,
  Wind,
  Tv,
  Fan,
  Plus,
  Clock,
  Power,
  Calendar,
  Home
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toggle from '../components/common/Toggle'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'

const Devices = () => {
  const { 
    devices, 
    loadDevices, 
    toggleDevice, 
    scheduleDevice,
    addDevice,
    devicesLoading 
  } = useApp()

  const [selectedRoom, setSelectedRoom] = useState('all')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [scheduleData, setScheduleData] = useState({
    type: 'daily',
    time: '',
    action: 'on',
    days: [],
  })
  const [newDeviceData, setNewDeviceData] = useState({
    name: '',
    type: 'light',
    room: '',
    power: 0,
  })

  useEffect(() => {
    loadDevices()
  }, [])

  // Obtenir les pièces uniques
  const rooms = ['all', ...new Set(devices.map(d => d.room))]

  // Filtrer les appareils par pièce
  const filteredDevices = selectedRoom === 'all' 
    ? devices 
    : devices.filter(d => d.room === selectedRoom)

  // Grouper par pièce pour l'affichage
  const devicesByRoom = filteredDevices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = []
    }
    acc[device.room].push(device)
    return acc
  }, {})

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'light':
        return Lightbulb
      case 'climate':
        return Wind
      case 'entertainment':
        return Tv
      case 'fan':
        return Fan
      default:
        return Power
    }
  }

  const openScheduleModal = (device) => {
    setSelectedDevice(device)
    setShowScheduleModal(true)
    setScheduleData({
      type: 'daily',
      time: '',
      action: 'on',
      days: [],
    })
  }

  const handleScheduleSubmit = async () => {
    if (!selectedDevice || !scheduleData.time) return

    await scheduleDevice(selectedDevice.id, scheduleData)
    setShowScheduleModal(false)
    setSelectedDevice(null)
  }

  const handleAddDevice = () => {
    if (!newDeviceData.name || !newDeviceData.room) return

    addDevice(newDeviceData)
    setShowAddModal(false)
    setNewDeviceData({ name: '', type: 'light', room: '', power: 0 })
  }

  if (devicesLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contrôle des Appareils</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez et programmez vos appareils connectés
          </p>
        </div>
        
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Ajouter un appareil
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total appareils</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {devices.filter(d => d.status).length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Actifs</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-gray-600">
            {devices.filter(d => !d.status).length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Éteints</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {rooms.length - 1}
          </p>
          <p className="text-sm text-gray-600 mt-1">Pièces</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {rooms.map((room) => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedRoom === room
                  ? 'bg-aurion text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {room === 'all' ? '🏠 Toutes les pièces' : `📍 ${room}`}
            </button>
          ))}
        </div>
      </Card>

      {/* Devices by Room */}
      <div className="space-y-6">
        {Object.entries(devicesByRoom).map(([room, roomDevices]) => (
          <Card key={room}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Home className="w-5 h-5 mr-2" />
                {room}
              </h2>
              <Badge variant={roomDevices.some(d => d.status) ? 'success' : 'default'}>
                {roomDevices.filter(d => d.status).length}/{roomDevices.length} actifs
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomDevices.map((device) => {
                const Icon = getDeviceIcon(device.type)
                return (
                  <div
                    key={device.id}
                    className={`p-4 border-2 rounded-xl transition-all duration-150 ${
                      device.status
                        ? 'border-aurion bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 ${
                          device.status
                            ? 'bg-aurion text-white scale-105'
                            : 'bg-gray-200 text-gray-500 scale-100'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {device.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {device.type}
                          </p>
                        </div>
                      </div>
                      
                      <Toggle
                        enabled={device.status}
                        onChange={() => toggleDevice(device.id)}
                      />
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Consommation</span>
                        <span className="font-semibold text-gray-900">
                          {device.power}W
                        </span>
                      </div>

                      {device.temperature && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Température</span>
                          <span className="font-semibold text-gray-900">
                            {device.temperature}°C
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">État</span>
                        <Badge variant={device.status ? 'success' : 'default'}>
                          {device.status ? 'Allumé' : 'Éteint'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        icon={Clock}
                        onClick={() => openScheduleModal(device)}
                      >
                        Programmer
                      </Button>
                      <Button
                        variant={device.status ? 'danger' : 'primary'}
                        size="sm"
                        fullWidth
                        onClick={() => toggleDevice(device.id)}
                      >
                        {device.status ? 'Éteindre' : 'Allumer'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title={`Programmer ${selectedDevice?.name}`}
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowScheduleModal(false)}
              fullWidth
            >
              Annuler
            </Button>
            <Button
              onClick={handleScheduleSubmit}
              disabled={!scheduleData.time}
              fullWidth
            >
              Enregistrer
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de programmation
            </label>
            <select
              value={scheduleData.type}
              onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurion focus:border-transparent"
            >
              <option value="once">Une fois</option>
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>

          <Input
            label="Heure"
            type="time"
            value={scheduleData.time}
            onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
            icon={Clock}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScheduleData({ ...scheduleData, action: 'on' })}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                  scheduleData.action === 'on'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                ✓ Allumer
              </button>
              <button
                onClick={() => setScheduleData({ ...scheduleData, action: 'off' })}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                  scheduleData.action === 'off'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                ✕ Éteindre
              </button>
            </div>
          </div>

          {scheduleData.type === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jours de la semaine
              </label>
              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const days = scheduleData.days.includes(index)
                        ? scheduleData.days.filter(d => d !== index)
                        : [...scheduleData.days, index]
                      setScheduleData({ ...scheduleData, days })
                    }}
                    className={`py-2 rounded-lg font-medium text-sm transition-all ${
                      scheduleData.days.includes(index)
                        ? 'bg-aurion text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Device Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un nouvel appareil"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddModal(false)} fullWidth>
              Annuler
            </Button>
            <Button onClick={handleAddDevice} disabled={!newDeviceData.name || !newDeviceData.room} fullWidth>
              Ajouter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nom de l'appareil"
            value={newDeviceData.name}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, name: e.target.value })}
            placeholder="ex: Lumière Salon"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type d'appareil</label>
            <select
              value={newDeviceData.type}
              onChange={(e) => setNewDeviceData({ ...newDeviceData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurion focus:border-transparent"
            >
              <option value="light">💡 Lumière</option>
              <option value="climate">❄️ Climatiseur</option>
              <option value="fan">🌀 Ventilateur</option>
              <option value="entertainment">📺 Divertissement</option>
              <option value="appliance">🔌 Électroménager</option>
            </select>
          </div>

          <Input
            label="Pièce"
            value={newDeviceData.room}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, room: e.target.value })}
            placeholder="ex: Salon, Chambre, Cuisine"
            required
          />

          <Input
            label="Puissance (Watts)"
            type="number"
            value={newDeviceData.power}
            onChange={(e) => setNewDeviceData({ ...newDeviceData, power: parseInt(e.target.value) || 0 })}
            placeholder="ex: 60"
          />
        </div>
      </Modal>
    </div>
  )
}

export default Devices
