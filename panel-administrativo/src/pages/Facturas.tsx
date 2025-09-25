import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Edit, 
  Trash2, 
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  Filter
} from 'lucide-react'
import { facturasAPI, type Factura, type FacturaCreate, type FacturaUpdate } from '../services/facturas'

const Facturas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar facturas al montar el componente
  useEffect(() => {
    cargarFacturas()
  }, [])

  const cargarFacturas = async () => {
    try {
      setLoading(true)
      const data = await facturasAPI.getFacturas()
      setFacturas(data)
    } catch (error) {
      setError('Error al cargar las facturas')
      console.error('Error cargando facturas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = 
      factura.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (factura.cliente?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || factura.estado === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800'
      case 'anulada':
        return 'bg-red-100 text-red-800'
      case 'pagada':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'Activa'
      case 'anulada':
        return 'Anulada'
      case 'pagada':
        return 'Pagada'
      default:
        return estado
    }
  }

  const handleAdd = () => {
    setShowAddModal(true)
    setError(null)
  }

  const handleEdit = (factura: Factura) => {
    setEditingFactura(factura)
    setShowEditModal(true)
    setError(null)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
      try {
        await facturasAPI.deleteFactura(id)
        setSuccess('Factura eliminada correctamente')
        cargarFacturas()
      } catch (error) {
        setError('Error al eliminar la factura')
        console.error('Error eliminando factura:', error)
      }
    }
  }

  const handleDownload = async (id: number) => {
    try {
      await facturasAPI.downloadFactura(id)
      setSuccess('Descargando factura...')
    } catch (error) {
      setError('Error al descargar la factura')
      console.error('Error descargando factura:', error)
    }
  }

  const handleSubmit = async (facturaData: FacturaCreate | FacturaUpdate) => {
    try {
      if (editingFactura) {
        await facturasAPI.updateFactura(editingFactura.id, facturaData as FacturaUpdate)
        setSuccess('Factura actualizada correctamente')
      } else {
        await facturasAPI.createFactura(facturaData as FacturaCreate)
        setSuccess('Factura creada correctamente')
      }
      setShowAddModal(false)
      setShowEditModal(false)
      setEditingFactura(null)
      cargarFacturas()
    } catch (error) {
      setError('Error al guardar la factura')
      console.error('Error guardando factura:', error)
    }
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingFactura(null)
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Gestión de Facturas
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nueva Factura
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar facturas por número, cliente o método de pago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="pagada">Pagada</option>
            <option value="anulada">Anulada</option>
          </select>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      {/* Tabla de facturas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFacturas.map((factura) => (
                <tr key={factura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {factura.numeroFactura}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(factura.fecha).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {factura.cliente?.nombre || 'Sin cliente'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      ${factura.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {factura.metodo_pago}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(factura.estado)}`}>
                      {getStatusText(factura.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(factura.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(factura)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(factura.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFacturas.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay facturas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron facturas con esos criterios.' 
                : 'Comienza creando una nueva factura.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar factura */}
      {(showAddModal || showEditModal) && (
        <FacturaModal
          factura={editingFactura}
          onSubmit={handleSubmit}
          onClose={closeModals}
          isEdit={!!editingFactura}
        />
      )}
    </div>
  )
}

// Modal para agregar/editar factura
interface FacturaModalProps {
  factura: Factura | null
  onSubmit: (data: FacturaCreate | FacturaUpdate) => void
  onClose: () => void
  isEdit: boolean
}

const FacturaModal: React.FC<FacturaModalProps> = ({ factura, onSubmit, onClose, isEdit }) => {
  const [formData, setFormData] = useState({
    numeroFactura: factura?.numeroFactura || '',
    fecha: factura?.fecha ? new Date(factura.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    total: factura?.total || 0,
    cliente_id: factura?.cliente_id || '',
    metodo_pago: factura?.metodo_pago || 'efectivo',
    estado: factura?.estado || 'activa'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      total: parseFloat(formData.total.toString()),
      cliente_id: formData.cliente_id ? parseInt(formData.cliente_id.toString()) : null
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Editar Factura' : 'Nueva Factura'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Factura
            </label>
            <input
              type="text"
              name="numeroFactura"
              value={formData.numeroFactura}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total
            </label>
            <input
              type="number"
              step="0.01"
              name="total"
              value={formData.total}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Cliente (opcional)
            </label>
            <input
              type="number"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              name="metodo_pago"
              value={formData.metodo_pago}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="activa">Activa</option>
              <option value="pagada">Pagada</option>
              <option value="anulada">Anulada</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Facturas








