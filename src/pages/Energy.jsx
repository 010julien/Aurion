import { useEffect, useState } from 'react'
import {
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  AlertCircle
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import StatCard from '../components/common/StatCard'
import { energyService } from '../services/energyService'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const Energy = () => {
  const { energyData, loadEnergy, energyLoading } = useApp()
  const [period, setPeriod] = useState('7d')
  const [historyData, setHistoryData] = useState([])
  const [stats, setStats] = useState(null)
  const [deviceConsumption, setDeviceConsumption] = useState([])

  useEffect(() => {
    loadEnergy()
    loadHistoryData()
    loadStats()
    loadDeviceConsumption()
  }, [period])

  const loadHistoryData = async () => {
    const data = await energyService.getHistory(period)
    setHistoryData(data)
  }

  const loadStats = async () => {
    const data = await energyService.getStats()
    setStats(data)
  }

  const loadDeviceConsumption = async () => {
    const data = await energyService.getDeviceConsumption()
    setDeviceConsumption(data)
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    if (period === '24h') {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  }

  if (energyLoading && !energyData) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suivi Énergétique</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analysez et optimisez votre consommation d'énergie
          </p>
        </div>
        
        <Button icon={Download} variant="outline">
          Exporter le rapport
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Consommation actuelle"
          value={`${energyData?.current || 0} kW`}
          icon={Zap}
          color="yellow"
          trend={energyData?.trend}
          trendValue={energyData?.trendPercentage ? `${energyData.trendPercentage}%` : null}
        />
        
        <StatCard
          title="Aujourd'hui"
          value={`${energyData?.today || 0} kWh`}
          icon={Calendar}
          color="blue"
          description={`${energyData?.cost || 0} FCFA`}
        />
        
        <StatCard
          title="Ce mois"
          value={`${stats?.totalConsumption || 0} kWh`}
          icon={TrendingUp}
          color="green"
          trend={stats?.comparedToLastMonth > 0 ? 'up' : 'down'}
          trendValue={stats?.comparedToLastMonth ? `${Math.abs(stats.comparedToLastMonth)}%` : null}
          description={`${stats?.totalCost || 0} FCFA`}
        />
        
        <StatCard
          title="Efficacité"
          value={`${stats?.efficiency || 0}%`}
          icon={DollarSign}
          color="purple"
          description="Score d'optimisation"
        />
      </div>

      {/* Alert si surconsommation */}
      {energyData?.current > 3 && (
        <Card className="border-l-4 border-orange-500 bg-orange-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">
                Consommation élevée détectée
              </h3>
              <p className="text-sm text-orange-800">
                Votre consommation actuelle ({energyData.current} kW) est supérieure à la normale. 
                Pensez à éteindre les appareils non utilisés.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Period Selector */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Historique de consommation
          </h2>
          <div className="flex space-x-2">
            {[
              { value: '24h', label: '24h' },
              { value: '7d', label: '7 jours' },
              { value: '30d', label: '30 jours' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  period === p.value
                    ? 'bg-aurion text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
              labelFormatter={(value) => new Date(value).toLocaleString('fr-FR')}
              formatter={(value) => [`${value} kWh`, 'Consommation']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="consumption" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Consommation"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consommation par appareil */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Consommation par appareil
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceConsumption}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device, percentage }) => `${device} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="consumption"
              >
                {deviceConsumption.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value} kWh`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {deviceConsumption.map((item, index) => (
              <div key={item.device} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700">{item.device}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.consumption} kWh
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.cost} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Statistiques détaillées */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Statistiques du mois
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Consommation totale</span>
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalConsumption || 0} kWh
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {stats?.totalCost || 0} FCFA
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Moyenne journalière</span>
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.averageDaily || 0} kWh
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Heure de pointe</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.peakHour || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {stats?.peakConsumption || 0} kW
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Comparaison mois dernier</span>
                {stats?.comparedToLastMonth > 0 ? (
                  <TrendingUp className="w-5 h-5 text-red-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${
                stats?.comparedToLastMonth > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {stats?.comparedToLastMonth > 0 ? '+' : ''}{stats?.comparedToLastMonth || 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {stats?.comparedToLastMonth > 0 ? 'Augmentation' : 'Diminution'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommandations */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Recommandations pour économiser
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Utilisez le mode programmation
              </h3>
              <p className="text-sm text-gray-600">
                Programmez vos appareils pour qu'ils s'éteignent automatiquement pendant les heures creuses.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Activez le mode absence
              </h3>
              <p className="text-sm text-gray-600">
                Le mode absence éteint automatiquement les appareils non essentiels quand vous n'êtes pas là.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Surveillez les pics de consommation
              </h3>
              <p className="text-sm text-gray-600">
                Évitez d'utiliser plusieurs appareils énergivores en même temps.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">4</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Optimisez la climatisation
              </h3>
              <p className="text-sm text-gray-600">
                Réglez la température à 24-26°C pour un meilleur équilibre confort/économie.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Energy
