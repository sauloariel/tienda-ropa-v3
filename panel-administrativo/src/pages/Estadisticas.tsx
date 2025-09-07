import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar,
  Target,
  Activity,
  PieChart,
  RefreshCw
} from 'lucide-react'
import { estadisticasAPI } from '../services/estadisticas'
import type { 
  VentasPorMes, 
  ProductoTopVentas, 
  CategoriaTopVentas,
  ClienteTopCompras,
  ActividadReciente
} from '../services/estadisticas'
import Chart from '../components/Chart'


const Estadisticas: React.FC = () => {
  const [periodo, setPeriodo] = useState('30')
  const [loading, setLoading] = useState(true)
  const [ventasMensuales, setVentasMensuales] = useState<VentasPorMes[]>([])
  const [productosTop, setProductosTop] = useState<ProductoTopVentas[]>([])
  const [categoriasTop, setCategoriasTop] = useState<CategoriaTopVentas[]>([])
  const [clientesTop, setClientesTop] = useState<ClienteTopCompras[]>([])
  const [actividadReciente, setActividadReciente] = useState<ActividadReciente[]>([])
  const [conexionDB, setConexionDB] = useState<'conectado' | 'desconectado' | 'verificando'>('verificando')

  // Cargar todas las estadísticas
  const cargarEstadisticas = async () => {
    setLoading(true)
    setConexionDB('verificando')
    try {
      console.log('🔄 Cargando estadísticas desde la base de datos...')
      const [
        ventas,
        productos,
        categorias,
        clientes,
        actividad
      ] = await Promise.all([
        estadisticasAPI.getVentasPorMes(12),
        estadisticasAPI.getProductosTopVentas(10),
        estadisticasAPI.getCategoriasTopVentas(5),
        estadisticasAPI.getClientesTopCompras(10),
        estadisticasAPI.getActividadReciente(20)
      ])

      setVentasMensuales(ventas)
      setProductosTop(productos)
      setCategoriasTop(categorias)
      setClientesTop(clientes)
      setActividadReciente(actividad)
      setConexionDB('conectado')
      console.log('✅ Estadísticas cargadas exitosamente desde la base de datos')
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error)
      setConexionDB('desconectado')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEstadisticas()
  }, [periodo])

  // Preparar datos para gráficos
  const datosVentasMensuales = ventasMensuales.map(item => ({
    label: item.mes,
    value: item.ventas,
    color: 'bg-blue-500'
  }))

  // Mejorar datos de categorías con colores únicos y mejor formato
  const coloresCategorias = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500', 'bg-cyan-500'
  ]

  const datosCategorias = categoriasTop.map((item, index) => ({
    label: item.nombre_categoria,
    value: item.ventas,
    color: coloresCategorias[index % coloresCategorias.length],
    porcentaje: item.porcentaje,
    productos: item.productos
  }))

  const datosProductos = productosTop.map(item => ({
    label: item.descripcion,
    value: item.ventas,
    color: 'bg-purple-500'
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">📊 Estadísticas del Negocio</h1>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              conexionDB === 'conectado' ? 'bg-green-100 text-green-800' :
              conexionDB === 'desconectado' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                conexionDB === 'conectado' ? 'bg-green-500' :
                conexionDB === 'desconectado' ? 'bg-red-500' :
                'bg-yellow-500 animate-pulse'
              }`} />
              <span>
                {conexionDB === 'conectado' ? 'Base de Datos Conectada' :
                 conexionDB === 'desconectado' ? 'Base de Datos Desconectada' :
                 'Verificando Conexión...'}
              </span>
            </div>
          </div>
          
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Último año</option>
            </select>
          </div>
          <button
            onClick={cargarEstadisticas}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      

      

      {/* 3 Gráficos Principales Conectados a la Base de Datos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico 1: Evolución de Ventas Mensuales */}
        <div className="lg:col-span-2">
          <Chart
            data={datosVentasMensuales}
            title="📈 Evolución de Ventas Mensuales"
            type="line"
            height={350}
          />
        </div>

        {/* Gráfico 2: Distribución por Categorías */}
        <div>
          <Chart
            data={datosCategorias}
            title="🥧 Ventas por Categoría"
            type="doughnut"
            height={350}
          />
        </div>
      </div>

      {/* Gráfico 3: Productos Más Vendidos */}
      <div className="grid grid-cols-1 gap-6">
        <Chart
          data={datosProductos}
          title="🏆 Top 10 Productos Más Vendidos"
          type="bar"
          height={400}
        />
      </div>

      {/* Productos y Categorías Top */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Productos Más Vendidos */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Productos Más Vendidos</h3>
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {productosTop.map((producto, index) => (
              <div key={producto.id_producto} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{producto.descripcion}</span>
                    <div className="text-xs text-gray-500">
                      Stock: {producto.stock} | ${producto.precio_venta}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{producto.ventas} ventas</span>
                  <span className="text-sm text-gray-400">({producto.porcentaje}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categorías Más Vendidas - Mejorado */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Categorías Más Vendidas</h3>
            <PieChart className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {categoriasTop.map((categoria, index) => (
              <div key={categoria.id_categoria} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${coloresCategorias[index % coloresCategorias.length]} rounded-full flex items-center justify-center`}>
                      <span className="text-xs font-medium text-white">{index + 1}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{categoria.nombre_categoria}</span>
                      <div className="text-xs text-gray-500">
                        {categoria.productos} productos en esta categoría
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">${categoria.ventas.toLocaleString()}</span>
                    <div className="text-xs text-gray-500">{categoria.porcentaje}% del total</div>
                  </div>
                </div>
                {/* Barra de progreso visual */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${coloresCategorias[index % coloresCategorias.length]}`}
                    style={{ width: `${categoria.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clientes Top y Actividad Reciente */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Clientes con Más Compras */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Clientes con Más Compras</h3>
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            {clientesTop.map((cliente, index) => (
              <div key={cliente.id_cliente} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-600">{index + 1}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{cliente.nombre}</span>
                    <div className="text-xs text-gray-500">{cliente.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${cliente.total_compras.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Última: {new Date(cliente.ultima_compra).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            <Activity className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {actividadReciente.map((actividad) => (
              <div key={actividad.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    actividad.tipo === 'order' ? 'bg-blue-500' :
                    actividad.tipo === 'customer' ? 'bg-green-500' :
                    actividad.tipo === 'product' ? 'bg-yellow-500' : 
                    actividad.tipo === 'sale' ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <div>
                    <span className="text-sm text-gray-900">{actividad.accion}</span>
                    <div className="text-xs text-gray-500">{actividad.detalles}</div>
                  </div>
                </div>
                <div className="text-right">
                  {actividad.monto && (
                    <div className="text-sm font-medium text-gray-900">
                      ${actividad.monto.toLocaleString()}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">{actividad.tiempo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      
    </div>
  )
}

export default Estadisticas


