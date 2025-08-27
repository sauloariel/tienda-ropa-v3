import React from 'react'

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  title: string
  type?: 'bar' | 'line' | 'doughnut'
  height?: number
}

const Chart: React.FC<ChartProps> = ({ data, title, type = 'bar', height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.value))
  
  const getBarChart = () => (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className={`h-full ${item.color || 'bg-blue-500'} transition-all duration-500`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-sm font-medium text-gray-900 text-right">
            {item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )

  const getLineChart = () => (
    <div className="relative h-full">
      <svg className="w-full h-full" viewBox={`0 0 300 ${height}`}>
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={data.map((item, index) => 
            `${(index / (data.length - 1)) * 280 + 10},${height - (item.value / maxValue) * (height - 20) + 10}`
          ).join(' ')}
        />
        {data.map((item, index) => (
          <circle
            key={index}
            cx={(index / (data.length - 1)) * 280 + 10}
            cy={height - (item.value / maxValue) * (height - 20) + 10}
            r="4"
            fill="#3B82F6"
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
        {data.map((item, index) => (
          <span key={index} className="transform -rotate-45 origin-left">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )

  const getDoughnutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (percentage / 100) * 360
            const x1 = 50 + 35 * Math.cos((currentAngle * Math.PI) / 180)
            const y1 = 50 + 35 * Math.sin((currentAngle * Math.PI) / 180)
            const x2 = 50 + 35 * Math.cos(((currentAngle + angle) * Math.PI) / 180)
            const y2 = 50 + 35 * Math.sin(((currentAngle + angle) * Math.PI) / 180)
            
            const largeArcFlag = angle > 180 ? 1 : 0
            
            const pathData = [
              `M ${x1} ${y1}`,
              `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'L 50 50'
            ].join(' ')
            
            currentAngle += angle
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || `hsl(${(index * 137.5) % 360}, 70%, 60%)`}
                stroke="white"
                strokeWidth="2"
              />
            )
          })}
        </svg>
        <div className="absolute text-center">
          <div className="text-lg font-bold text-gray-900">{total.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return getLineChart()
      case 'doughnut':
        return getDoughnutChart()
      default:
        return getBarChart()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  )
}

export default Chart
