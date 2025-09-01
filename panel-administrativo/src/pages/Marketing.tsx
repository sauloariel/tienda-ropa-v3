import React, { useState, useEffect } from 'react'
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Percent,
  DollarSign,
  Gift,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  X
} from 'lucide-react'
import BackToDashboard from '../components/BackToDashboard'
import { useMarketing } from '../hooks/useMarketing'
import { ModalPromocion } from '../components/marketing/ModalPromocion'
import { PromocionResponse } from '../types/marketing.types'

const Marketing: React.FC = () => {
  const {
    promociones,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedEstado,
    setSelectedEstado,
    selectedTipo,
    setSelectedTipo,
    crearPromocion,
    actualizarPromocion,
    eliminarPromocion,
    cambiarEstadoPromocion,
    promocionesPorVencer,
    promocionesExpiradas
  } = useMarketing()

  // Estados locales
  const [showModal, setShowModal] = useState(false)
  const [editingPromocion, setEditingPromocion] = useState<PromocionResponse | null>(null)
  const [loadingAction, setLoadingAction] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)

  // Manejar crear/editar promoción
  const handleSavePromocion = async (data: any) => {
    try {
      setLoadingAction(true)
      
      if (editingPromocion) {
        await actualizarPromocion(editingPromocion.id_promocion, data)
        mostrarMensaje('success', 'Promoción actualizada exitosamente')
      } else {
        await crearPromocion(data)
        mostrarMensaje('success', 'Promoción creada exitosamente')
      }
      
      setEditingPromocion(null)
      setShowModal(false)
    } catch (error: any) {
      mostrarMensaje('error', error.message)
    } finally {
      setLoadingAction(false)
    }
  }

  // Manejar editar promoción
  const handleEdit = (promocion: PromocionResponse) => {
    setEditingPromocion(promocion)
    setShowModal(true)
  }

  // Manejar eliminar promoción
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      try {
        setLoadingAction(true)
        await eliminarPromocion(id)
        mostrarMensaje('success', 'Promoción eliminada exitosamente')
      } catch (error: any) {
        mostrarMensaje('error', error.message)
      } finally {
        setLoadingAction(false)
      }
    }
  }

  // Manejar cambio de estado
  const handleToggleEstado = async (id: number, estadoActual: string) => {
    try {
      setLoadingAction(true)
      const nuevoEstado = estadoActual === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA'
      await cambiarEstadoPromocion(id, nuevoEstado as 'ACTIVA' | 'INACTIVA')
      mostrarMensaje('success', `Promoción ${nuevoEstado === 'ACTIVA' ? 'activada' : 'desactivada'} exitosamente`)
    } catch (error: any) {
      mostrarMensaje('error', error.message)
    } finally {
      setLoadingAction(false)
    }
  }

  // Mostrar mensajes
  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 5000)
  }

  // Obtener icono del tipo de promoción
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'PORCENTAJE': return <Percent className="h-4 w-4" />
      case 'MONTO_FIJO': return <DollarSign className="h-4 w-4" />
      case '2X1': return <Gift className="h-4 w-4" />
      case 'DESCUENTO_ESPECIAL': return <Target className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  // Obtener color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVA': return 'bg-green-100 text-green-800'
      case 'INACTIVA': return 'bg-gray-100 text-gray-800'
      case 'EXPIRADA': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Obtener texto del estado
  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'ACTIVA': return 'Activa'
      case 'INACTIVA': return 'Inactiva'
      case 'EXPIRADA': return 'Expirada'
      default: return estado
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calcular días restantes
  const getDiasRestantes = (fechaFin: string) => {
    const fin = new Date(fechaFin)
    const hoy = new Date()
    const diffTime = fin.getTime() - hoy.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Marketing</h1>
            <p className="text-gray-600">Administra campañas y estrategias de marketing</p>
          </div>
          <div className="flex items-center gap-3">
            <BackToDashboard />
            <button
              onClick={() => {
                setEditingPromocion(null)
                setShowModal(true)
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Promoción</span>
            </button>
          </div>
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
                <AlertTriangle className="h-5 w-5" />
              )}
              <span>{mensaje.texto}</span>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Megaphone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Promociones</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_promociones}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.promociones_activas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Por Vencer</p>
                  <p className="text-2xl font-semibold text-gray-900">{promocionesPorVencer.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Uso</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_uso}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alertas */}
        {(promocionesPorVencer.length > 0 || promocionesExpiradas.length > 0) && (
          <div className="mb-6 space-y-3">
            {promocionesPorVencer.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800">
                    {promocionesPorVencer.length} promoción(es) por vencer en los próximos 7 días
                  </span>
                </div>
              </div>
            )}
            
            {promocionesExpiradas.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800">
                    {promocionesExpiradas.length} promoción(es) han expirado
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Búsqueda */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar promociones..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-3">
                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="TODOS">Todos los estados</option>
                  <option value="ACTIVA">Activas</option>
                  <option value="INACTIVA">Inactivas</option>
                  <option value="EXPIRADA">Expiradas</option>
                </select>

                <select
                  value={selectedTipo}
                  onChange={(e) => setSelectedTipo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="TODOS">Todos los tipos</option>
                  <option value="PORCENTAJE">Porcentaje</option>
                  <option value="MONTO_FIJO">Monto fijo</option>
                  <option value="2X1">2x1</option>
                  <option value="DESCUENTO_ESPECIAL">Descuento especial</option>
                </select>
              </div>
            </div>

            {/* Botón Nueva Promoción */}
            <button
              onClick={() => {
                setEditingPromocion(null)
                setShowModal(true)
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Promoción</span>
            </button>
          </div>
        </div>

        {/* Tabla de Promociones */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promociones.map((promocion) => {
                  const diasRestantes = getDiasRestantes(promocion.fecha_fin)
                  const isExpired = diasRestantes < 0
                  const isExpiringSoon = diasRestantes <= 7 && diasRestantes >= 0

                  return (
                    <tr key={promocion.id_promocion} className="hover:bg-gray-50">
                      {/* Información de la promoción */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {promocion.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {promocion.descripcion}
                          </div>
                          {promocion.codigo_descuento && (
                            <div className="text-xs text-primary-600 font-mono bg-primary-50 px-2 py-1 rounded mt-1 inline-block">
                              {promocion.codigo_descuento}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTipoIcon(promocion.tipo)}
                          <span className="text-sm text-gray-900">
                            {promocion.tipo === 'PORCENTAJE' ? 'Porcentaje' :
                             promocion.tipo === 'MONTO_FIJO' ? 'Monto fijo' :
                             promocion.tipo === '2X1' ? '2x1' : 'Especial'}
                          </span>
                        </div>
                      </td>

                      {/* Valor */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {promocion.tipo === 'PORCENTAJE' ? `${promocion.valor}%` :
                           promocion.tipo === 'MONTO_FIJO' ? `$${promocion.valor.toFixed(2)}` :
                           promocion.tipo === '2X1' ? 'Segundo gratis' : 'Especial'}
                        </div>
                        {promocion.minimo_compra && (
                          <div className="text-xs text-gray-500">
                            Mín: ${promocion.minimo_compra.toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Fechas */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div>Inicio: {formatDate(promocion.fecha_inicio)}</div>
                          <div>Fin: {formatDate(promocion.fecha_fin)}</div>
                        </div>
                        {isExpired ? (
                          <div className="text-xs text-red-600 font-medium">Expirada</div>
                        ) : isExpiringSoon ? (
                          <div className="text-xs text-yellow-600 font-medium">
                            Vence en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}
                          </div>
                        ) : (
                          <div className="text-xs text-green-600 font-medium">
                            {diasRestantes} día{diasRestantes !== 1 ? 's' : ''} restantes
                          </div>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(promocion.estado)}`}>
                          {getEstadoText(promocion.estado)}
                        </span>
                      </td>

                      {/* Uso */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {promocion.uso_actual}
                          {promocion.uso_maximo && ` / ${promocion.uso_maximo}`}
                        </div>
                        {promocion.uso_maximo && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(promocion.uso_actual / promocion.uso_maximo) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(promocion)}
                            className="text-primary-600 hover:text-primary-900 hover:bg-primary-50 p-1 rounded transition-colors"
                            title="Editar promoción"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleToggleEstado(promocion.id_promocion, promocion.estado)}
                            className={`p-1 rounded transition-colors ${
                              promocion.estado === 'ACTIVA' 
                                ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' 
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                            }`}
                            title={promocion.estado === 'ACTIVA' ? 'Desactivar' : 'Activar'}
                            disabled={loadingAction}
                          >
                            {promocion.estado === 'ACTIVA' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => handleDelete(promocion.id_promocion)}
                            className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors"
                            title="Eliminar promoción"
                            disabled={loadingAction}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mensaje cuando no hay promociones */}
          {promociones.length === 0 && !loading && (
            <div className="text-center py-12">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay promociones</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedEstado !== 'TODOS' || selectedTipo !== 'TODOS'
                  ? 'No se encontraron promociones que coincidan con los filtros.'
                  : 'Comienza creando tu primera promoción.'}
              </p>
              {!searchTerm && selectedEstado === 'TODOS' && selectedTipo === 'TODOS' && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setEditingPromocion(null)
                      setShowModal(true)
                    }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Crear Promoción
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Cargando promociones...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Modal de promoción */}
        <ModalPromocion
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setEditingPromocion(null)
          }}
          onSave={handleSavePromocion}
          promocion={editingPromocion}
          loading={loadingAction}
        />
      </div>
    </div>
  )
}

export default Marketing


