import React from 'react'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  description?: string
  trend?: 'up' | 'down' | 'stable'
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-blue-500',
  description,
  trend
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600'
    if (changeType === 'negative') return 'text-red-600'
    return 'text-gray-600'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return '↗️'
    if (trend === 'down') return '↘️'
    return '→'
  }

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
      if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
      return `$${val.toLocaleString()}`
    }
    return val
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatValue(value)}
              </dd>
              {description && (
                <dd className="text-sm text-gray-600 mt-1">
                  {description}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
      
      {(change !== undefined || trend) && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            {change !== undefined && (
              <span className={`font-medium ${getChangeColor()}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            {trend && (
              <span className="ml-2 text-gray-500">
                {getTrendIcon()} {trend === 'up' ? 'Subiendo' : trend === 'down' ? 'Bajando' : 'Estable'}
              </span>
            )}
            <span className="text-gray-500 ml-2">desde el mes pasado</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MetricCard
