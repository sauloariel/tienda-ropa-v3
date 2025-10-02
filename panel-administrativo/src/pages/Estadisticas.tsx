import React, { useState, useEffect, useMemo } from 'react'
import { 
  Calendar,
  RefreshCw,
  DollarSign
} from 'lucide-react'
import { estadisticasAPI } from '../services/estadisticas'
import type { 
  VentasPorMes, 
  ProductoTopVentas, 
  CategoriaTopVentas
} from '../services/estadisticas'
import { productosAPI, Producto } from '../services/productos'
import Chart from '../components/Chart'


const Estadisticas: React.FC = () => {
  const [periodo, setPeriodo] = useState('30')
  const [loading, setLoading] = useState(true)
  const [ventasMensuales, setVentasMensuales] = useState<VentasPorMes[]>([])
  const [productosTop, setProductosTop] = useState<ProductoTopVentas[]>([])
  const [categoriasTop, setCategoriasTop] = useState<CategoriaTopVentas[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [conexionDB, setConexionDB] = useState<'conectado' | 'desconectado' | 'verificando'>('verificando')

  // Cargar estadísticas para los 3 gráficos de barras
  const cargarEstadisticas = async () => {
    setLoading(true)
    setConexionDB('verificando')
    try {
      console.log('🔄 Cargando estadísticas para gráficos de barras...')
      const [
        ventas,
        productosTopVentas,
        categorias,
        productosData
      ] = await Promise.all([
        estadisticasAPI.getVentasPorMes(12),
        estadisticasAPI.getProductosTopVentas(10),
        estadisticasAPI.getCategoriasTopVentas(5),
        productosAPI.getProductos()
      ])

      setVentasMensuales(ventas)
      setProductosTop(productosTopVentas)
      setCategoriasTop(categorias)
      setProductos(productosData)
      setConexionDB('conectado')
      console.log('✅ Estadísticas cargadas exitosamente')
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

  // Cálculo del valor total del inventario
  const toNum = (v: any, d = 0): number => {
    const n = Number(v)
    return Number.isFinite(n) ? n : d
  }

  const formatPrice = (price: number): string => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  const valorTotalInventario = useMemo(() => {
    const total = productos.reduce((sum, p) => sum + (toNum(p.precio_venta) * toNum(p.stock)), 0)
    return { valor: total, texto: formatPrice(total) }
  }, [productos])

  // Preparar datos para el gráfico de torta del inventario por categoría
  const datosInventarioPorCategoria = useMemo(() => {
    const inventarioPorCategoria: { [key: string]: number } = {}
    
    productos.forEach(producto => {
      const categoria = producto.categoria?.nombre_categoria || 'Sin categoría'
      const valorProducto = toNum(producto.precio_venta) * toNum(producto.stock)
      
      if (inventarioPorCategoria[categoria]) {
        inventarioPorCategoria[categoria] += valorProducto
      } else {
        inventarioPorCategoria[categoria] = valorProducto
      }
    })

    const colores = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500', 'bg-cyan-500'
    ]

    return Object.entries(inventarioPorCategoria)
      .map(([categoria, valor], index) => ({
        label: categoria,
        value: valor,
        color: colores[index % colores.length],
        porcentaje: valorTotalInventario.valor > 0 ? (valor / valorTotalInventario.valor) * 100 : 0,
        valorTexto: formatPrice(valor)
      }))
      .sort((a, b) => b.value - a.value)
  }, [productos, valorTotalInventario.valor])

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

      {/* Valor Total del Inventario - Card Grande */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-16 w-16 text-purple-600" />
            </div>
            <div className="ml-8">
              <dl>
                <dt className="text-2xl font-medium text-gray-500">
                  Valor Total del Inventario
                </dt>
                <dd className="text-5xl font-bold text-gray-900 mt-2">
                  {valorTotalInventario.texto}
                </dd>
                <dd className="text-sm text-gray-500 mt-2">
                  Calculado en base a {productos.length} productos
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Torta del Inventario por Categoría */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Chart
          data={datosInventarioPorCategoria}
          title="📦 Distribución del Inventario por Categoría"
          type="pie"
          height={400}
        />
      </div>

      {/* 3 Gráficos de Barras Principales */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico 1: Ventas Mensuales */}
        <div>
          <Chart
            data={datosVentasMensuales}
            title="📈 Ventas Mensuales"
            type="bar"
            height={350}
          />
        </div>

        {/* Gráfico 2: Ventas por Categorías */}
        <div>
          <Chart
            data={datosCategorias}
            title="🏷️ Ventas por Categoría"
            type="bar"
            height={350}
          />
        </div>

        {/* Gráfico 3: Productos Más Vendidos */}
        <div>
          <Chart
            data={datosProductos}
            title="🏆 Productos Más Vendidos"
            type="bar"
            height={350}
          />
        </div>
      </div>


      
      
    </div>
  )
}

export default Estadisticas


