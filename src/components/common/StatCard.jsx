import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from './Card'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  description,
  color = 'blue',
  onClick 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30'
    if (trend === 'down') return 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30'
    return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
  }

  return (
    <Card hover={!!onClick} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
          
          {trendValue && (
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{description}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatCard
