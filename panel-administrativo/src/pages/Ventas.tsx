import React, { useState } from 'react'
import { ShoppingCart, Package, TrendingUp, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'
import { useCarrito } from '../hooks/useCarrito'
import { useProductosVenta } from '../hooks/useProductosVenta'
import { ventasAPI } from '../services/ventas'
import { SelectorProducto } from '../components/ventas/SelectorProducto'
import { CarritoVenta } from '../components/ventas/CarritoVenta'
import { ModalConfirmarVenta } from '../components/ventas/ModalConfirmarVenta'
import { VentaData } from '../types/ventas.types'

const Ventas: React.FC = () => {
  // Hooks personalizados
  const {
    productos,
    categorias,
    loading: productosLoading,
    error: productosError,
    searchTerm,
    setSearchTerm,
    selectedCategoria,
    setSelectedCategoria
  } = useProductosVenta()

  const {
    items,
    total,
    cantidadTotal,
    carritoVacio,
    agregarItem,
    actualizarCantidad,
    removerItem,
    limpiarCarrito
  } = useCarrito()

  // Estados locales
  const [showModalConfirmar, setShowModalConfirmar] = useState(false)
  const [loadingVenta, setLoadingVenta] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)

  // Manejar agregar item al carrito
  const handleAgregarAlCarrito = (item: any) => {
    try {
      agregarItem(item)
      mostrarMensaje('success', 'Producto agregado al carrito')
    } catch (error: any) {
      mostrarMensaje('error', error.message)
    }
  }

  // Manejar confirmar venta
  const handleConfirmarVenta = async (ventaData: VentaData) => {
    try {
      setLoadingVenta(true)
      
      // Completar los items de la venta
      const ventaCompleta = {
        ...ventaData,
        items: items.map(item => ({
          id_producto: item.id_producto,
          id_variante: item.id_variante,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal
        }))
      }

      // Enviar al backend
      const response = await ventasAPI.crearVenta(ventaCompleta)
      
      // Mostrar mensaje de éxito
      mostrarMensaje('success', `Venta #${response.id_venta} procesada exitosamente`)
      
      // Limpiar carrito
      limpiarCarrito()
      
      // Cerrar modal
      setShowModalConfirmar(false)
      
    } catch (error: any) {
      mostrarMensaje('error', error.message)
    } finally {
      setLoadingVenta(false)
    }
  }

  // Mostrar mensajes
  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 5000)
  }

  // Estadísticas
  const stats = [
    {
      name: 'Total Productos',
      value: productos.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Items en Carrito',
      value: cantidadTotal,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total Venta',
      value: `$${total.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Ventas</h1>
          <p className="text-gray-600">Gestiona las ventas y el inventario en tiempo real</p>
        </div>

        {/* Mensajes de alerta */}
        {mensaje && (
          <div className={`mb-6 p-4 rounded-lg border ${
            mensaje.tipo === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {mensaje.tipo === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{mensaje.texto}</span>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className={`${stat.bgColor} rounded-lg p-6`}>
              <div className="flex items-center">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selector de Productos */}
          <div className="lg:col-span-1">
            <SelectorProducto
              productos={productos}
              onAgregarAlCarrito={handleAgregarAlCarrito}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategoria={selectedCategoria}
              onCategoriaChange={setSelectedCategoria}
              categorias={categorias}
            />
          </div>

          {/* Carrito de Venta */}
          <div className="lg:col-span-1">
            <CarritoVenta
              items={items}
              total={total}
              onActualizarCantidad={actualizarCantidad}
              onRemoverItem={removerItem}
              onLimpiarCarrito={limpiarCarrito}
              onConfirmarVenta={() => setShowModalConfirmar(true)}
            />
          </div>
        </div>

        {/* Estado de carga */}
        {productosLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Cargando productos...</span>
            </div>
          </div>
        )}

        {/* Error de productos */}
        {productosError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{productosError}</span>
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        <ModalConfirmarVenta
          isOpen={showModalConfirmar}
          onClose={() => setShowModalConfirmar(false)}
          onConfirm={handleConfirmarVenta}
          total={total}
          itemsCount={items.length}
          loading={loadingVenta}
        />
      </div>
    </div>
  )
}

export default Ventas
