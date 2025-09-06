import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  BarChart3,
  Calendar,
  Target,
  AlertTriangle,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  RefreshCw
} from 'lucide-react'
import { estadisticasAPI } from '../services/estadisticas'
import type { 
  EstadisticasGenerales, 
  VentasPorMes, 
  ProductoTopVentas, 
  CategoriaTopVentas,
  ClienteTopCompras,
  ActividadReciente,
  ResumenFinanciero
} from '../services/estadisticas'
import MetricCard from '../components/MetricCard'
import Chart from '../components/Chart'


const Estadisticas: React.FC = () => {
  const [periodo, setPeriodo] = useState('30')
  const [loading, setLoading] = useState(true)
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales | null>(null)
  const [ventasMensuales, setVentasMensuales] = useState<VentasPorMes[]>([])
  const [productosTop, setProductosTop] = useState<ProductoTopVentas[]>([])
  const [categoriasTop, setCategoriasTop] = useState<CategoriaTopVentas[]>([])
  const [clientesTop, setClientesTop] = useState<ClienteTopCompras[]>([])
  const [actividadReciente, setActividadReciente] = useState<ActividadReciente[]>([])
  const [resumenFinanciero, setResumenFinanciero] = useState<ResumenFinanciero | null>(null)
  const [conexionDB, setConexionDB] = useState<'conectado' | 'desconectado' | 'verificando'>('verificando')

  // Cargar todas las estadísticas
  const cargarEstadisticas = async () => {
    setLoading(true)
    setConexionDB('verificando')
    try {
      console.log('🔄 Cargando estadísticas desde la base de datos...')
      const [
        stats,
        ventas,
        productos,
        categorias,
        clientes,
        actividad,
        financiero
      ] = await Promise.all([
        estadisticasAPI.getEstadisticasGenerales(periodo),
        estadisticasAPI.getVentasPorMes(12),
        estadisticasAPI.getProductosTopVentas(10),
        estadisticasAPI.getCategoriasTopVentas(5),
        estadisticasAPI.getClientesTopCompras(10),
        estadisticasAPI.getActividadReciente(20),
        estadisticasAPI.getResumenFinanciero(periodo)
      ])

      setEstadisticas(stats)
      setVentasMensuales(ventas)
      setProductosTop(productos)
      setCategoriasTop(categorias)
      setClientesTop(clientes)
      setActividadReciente(actividad)
      setResumenFinanciero(financiero)
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

  const datosCategorias = categoriasTop.map(item => ({
    label: item.nombre_categoria,
    value: item.ventas,
    color: 'bg-green-500'
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
                {conexionDB === 'conectado' ? 'Base de datos conectada' :
                 conexionDB === 'desconectado' ? 'Sin conexión a BD' :
                 'Verificando conexión...'}
              </span>
            </div>
          </div>
          <p className="text-gray-600">Análisis y reportes en tiempo real conectados a la base de datos</p>
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

      {/* 5 Datos Estadísticos Principales */}
      {estadisticas && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            title="💰 Ventas Totales"
            value={estadisticas.ventasTotales}
            change={estadisticas.cambioVentas}
            changeType={estadisticas.cambioVentas >= 0 ? 'positive' : 'negative'}
            icon={DollarSign}
            iconColor="text-green-500"
            trend={estadisticas.cambioVentas > 0 ? 'up' : 'down'}
            description="Ingresos del período"
          />
          <MetricCard
            title="👥 Clientes Activos"
            value={estadisticas.clientesNuevos}
            change={estadisticas.cambioClientes}
            changeType={estadisticas.cambioClientes >= 0 ? 'positive' : 'negative'}
            icon={Users}
            iconColor="text-blue-500"
            trend={estadisticas.cambioClientes > 0 ? 'up' : 'down'}
            description="Nuevos clientes"
          />
          <MetricCard
            title="📦 Productos Vendidos"
            value={estadisticas.productosVendidos}
            change={estadisticas.cambioProductos}
            changeType={estadisticas.cambioProductos >= 0 ? 'positive' : 'negative'}
            icon={Package}
            iconColor="text-purple-500"
            trend={estadisticas.cambioProductos > 0 ? 'up' : 'down'}
            description="Unidades vendidas"
          />
          <MetricCard
            title="🛒 Pedidos Completados"
            value={estadisticas.pedidosCompletados}
            change={estadisticas.cambioPedidos}
            changeType={estadisticas.cambioPedidos >= 0 ? 'positive' : 'negative'}
            icon={ShoppingCart}
            iconColor="text-orange-500"
            trend={estadisticas.cambioPedidos > 0 ? 'up' : 'down'}
            description="Órdenes finalizadas"
          />
          <MetricCard
            title="📈 Ticket Promedio"
            value={estadisticas.pedidosCompletados > 0 ? Math.round(estadisticas.ventasTotales / estadisticas.pedidosCompletados) : 0}
            icon={BarChart3}
            iconColor="text-indigo-500"
            description="Por pedido"
          />
        </div>
      )}

      {/* Resumen Financiero */}
      {resumenFinanciero && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Ingresos"
            value={resumenFinanciero.ingresos}
            icon={TrendingUp}
            iconColor="text-green-500"
            description="Ingresos totales del período"
          />
          <MetricCard
            title="Gastos"
            value={resumenFinanciero.gastos}
            icon={TrendingDown}
            iconColor="text-red-500"
            description="Gastos totales del período"
          />
          <MetricCard
            title="Ganancia Neta"
            value={resumenFinanciero.ganancia}
            icon={DollarSign}
            iconColor="text-blue-500"
            description={`Margen: ${resumenFinanciero.margen}%`}
          />
          <MetricCard
            title="Alertas Stock"
            value={resumenFinanciero.productos_bajo_stock + resumenFinanciero.productos_agotados}
            icon={AlertTriangle}
            iconColor="text-orange-500"
            description={`${resumenFinanciero.productos_agotados} agotados`}
          />
        </div>
      )}

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

        {/* Categorías Más Vendidas */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Categorías Más Vendidas</h3>
            <PieChart className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {categoriasTop.map((categoria, index) => (
              <div key={categoria.id_categoria} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{categoria.nombre_categoria}</span>
                    <div className="text-xs text-gray-500">
                      {categoria.productos} productos
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">${categoria.ventas.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">({categoria.porcentaje}%)</span>
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

      {/* Resumen Ejecutivo */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-l-4 border-green-500">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Resumen Ejecutivo - Período: {periodo} días</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Rendimiento General</h4>
            <p className="text-sm text-gray-600">
              {estadisticas?.cambioVentas && estadisticas.cambioVentas > 0 
                ? `✅ Las ventas crecieron ${estadisticas.cambioVentas}% vs período anterior`
                : `⚠️ Las ventas disminuyeron ${Math.abs(estadisticas?.cambioVentas || 0)}% vs período anterior`
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">👥 Crecimiento de Clientes</h4>
            <p className="text-sm text-gray-600">
              {estadisticas?.cambioClientes && estadisticas.cambioClientes > 0 
                ? `📈 ${estadisticas.cambioClientes}% más clientes nuevos`
                : `📉 ${Math.abs(estadisticas?.cambioClientes || 0)}% menos clientes nuevos`
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">💰 Rentabilidad</h4>
            <p className="text-sm text-gray-600">
              {resumenFinanciero?.margen && resumenFinanciero.margen > 30
                ? `💚 Excelente margen: ${resumenFinanciero.margen}%`
                : `💛 Margen actual: ${resumenFinanciero?.margen}% - Oportunidad de mejora`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Insights y Recomendaciones */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">💡 Insights para Decisiones Empresariales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="font-medium text-gray-900 mb-2">Rendimiento de Ventas</h4>
            <p className="text-sm text-gray-600">
              {estadisticas?.cambioVentas && estadisticas.cambioVentas > 0 
                ? `Las ventas están creciendo un ${estadisticas.cambioVentas}% respecto al mes anterior. Considera aumentar el inventario de productos populares.`
                : `Las ventas han disminuido un ${Math.abs(estadisticas?.cambioVentas || 0)}%. Revisa estrategias de marketing y precios.`
              }
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <h4 className="font-medium text-gray-900 mb-2">Gestión de Inventario</h4>
            <p className="text-sm text-gray-600">
              {resumenFinanciero?.productos_bajo_stock && resumenFinanciero.productos_bajo_stock > 0
                ? `Tienes ${resumenFinanciero.productos_bajo_stock} productos con stock bajo. Revisa reabastecimiento urgente.`
                : 'El inventario está bien gestionado. Continúa monitoreando niveles de stock.'
              }
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <h4 className="font-medium text-gray-900 mb-2">Clientes VIP</h4>
            <p className="text-sm text-gray-600">
              {clientesTop.length > 0 && 
                `Tu cliente top ${clientesTop[0]?.nombre} ha gastado $${clientesTop[0]?.total_compras.toLocaleString()}. Considera programas de fidelización.`
              }
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
            <h4 className="font-medium text-gray-900 mb-2">Rentabilidad</h4>
            <p className="text-sm text-gray-600">
              {resumenFinanciero?.margen && resumenFinanciero.margen > 30
                ? `Excelente margen de ${resumenFinanciero.margen}%. Puedes considerar inversiones en crecimiento.`
                : `Margen del ${resumenFinanciero?.margen}%. Revisa costos y precios para mejorar rentabilidad.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Estadisticas


