import React, { useState, useEffect } from 'react'
import { X, Save, Calendar, Percent, DollarSign, Gift, Target } from 'lucide-react'
import { PromocionCreate, PromocionUpdate, PromocionResponse } from '../../types/marketing.types'

interface ModalPromocionProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PromocionCreate | PromocionUpdate) => Promise<void>
  promocion?: PromocionResponse | null
  loading?: boolean
}

export const ModalPromocion: React.FC<ModalPromocionProps> = ({
  isOpen,
  onClose,
  onSave,
  promocion,
  loading = false
}) => {
  const [formData, setFormData] = useState<PromocionCreate>({
    nombre: '',
    descripcion: '',
    tipo: 'PORCENTAJE',
    valor: 0,
    fecha_inicio: '',
    fecha_fin: '',
    aplica_a: 'TODOS',
    id_categoria: undefined,
    id_producto: undefined,
    codigo_descuento: '',
    uso_maximo: undefined,
    minimo_compra: undefined,
    maximo_descuento: undefined
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && promocion) {
      setFormData({
        nombre: promocion.nombre,
        descripcion: promocion.descripcion,
        tipo: promocion.tipo as any,
        valor: promocion.valor,
        fecha_inicio: promocion.fecha_inicio.split('T')[0],
        fecha_fin: promocion.fecha_fin.split('T')[0],
        aplica_a: promocion.aplica_a as any,
        id_categoria: promocion.id_categoria,
        id_producto: promocion.id_producto,
        codigo_descuento: promocion.codigo_descuento || '',
        uso_maximo: promocion.uso_maximo,
        minimo_compra: promocion.minimo_compra,
        maximo_descuento: promocion.maximo_descuento
      })
    } else if (isOpen) {
      // Resetear formulario para nueva promoción
      const hoy = new Date().toISOString().split('T')[0]
      const unaSemana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      setFormData({
        nombre: '',
        descripcion: '',
        tipo: 'PORCENTAJE',
        valor: 0,
        fecha_inicio: hoy,
        fecha_fin: unaSemana,
        aplica_a: 'TODOS',
        id_categoria: undefined,
        id_producto: undefined,
        codigo_descuento: '',
        uso_maximo: undefined,
        minimo_compra: undefined,
        maximo_descuento: undefined
      })
    }
    setErrors({})
  }, [isOpen, promocion])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida'
    }

    if (formData.valor <= 0) {
      newErrors.valor = 'El valor debe ser mayor a 0'
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida'
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida'
    }

    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio >= formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }

    if (formData.aplica_a === 'CATEGORIA' && !formData.id_categoria) {
      newErrors.id_categoria = 'Debe seleccionar una categoría'
    }

    if (formData.aplica_a === 'PRODUCTO_ESPECIFICO' && !formData.id_producto) {
      newErrors.id_producto = 'Debe seleccionar un producto'
    }

    if (formData.tipo === 'PORCENTAJE' && formData.valor > 100) {
      newErrors.valor = 'El porcentaje no puede ser mayor a 100%'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSave(formData)
      onClose()
    } catch (error: any) {
      console.error('Error guardando promoción:', error)
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'PORCENTAJE': return 'Porcentaje de descuento'
      case 'MONTO_FIJO': return 'Monto fijo de descuento'
      case '2X1': return '2x1 (Segundo producto gratis)'
      case 'DESCUENTO_ESPECIAL': return 'Descuento especial'
      default: return tipo
    }
  }

  const getAplicaALabel = (aplica: string) => {
    switch (aplica) {
      case 'TODOS': return 'Todos los productos'
      case 'CATEGORIA': return 'Categoría específica'
      case 'PRODUCTO_ESPECIFICO': return 'Producto específico'
      default: return aplica
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {promocion ? 'Editar Promoción' : 'Nueva Promoción'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Promoción *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Descuento de Verano"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Promoción *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="PORCENTAJE">Porcentaje de descuento</option>
                <option value="MONTO_FIJO">Monto fijo de descuento</option>
                <option value="2X1">2x1 (Segundo producto gratis)</option>
                <option value="DESCUENTO_ESPECIAL">Descuento especial</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe los detalles de la promoción..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>

          {/* Valor y configuración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.tipo === 'PORCENTAJE' ? 100 : undefined}
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.valor ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={formData.tipo === 'PORCENTAJE' ? '15' : '10.00'}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {formData.tipo === 'PORCENTAJE' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                </div>
              </div>
              {errors.valor && (
                <p className="mt-1 text-sm text-red-600">{errors.valor}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.tipo === 'PORCENTAJE' ? 'Porcentaje de descuento (0-100)' : 'Monto del descuento'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Descuento
              </label>
              <input
                type="text"
                value={formData.codigo_descuento}
                onChange={(e) => handleInputChange('codigo_descuento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: VERANO2024"
              />
              <p className="mt-1 text-xs text-gray-500">
                Dejar vacío para promociones automáticas
              </p>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.fecha_inicio ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {errors.fecha_inicio && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_inicio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => handleInputChange('fecha_fin', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.fecha_fin ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {errors.fecha_fin && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_fin}</p>
              )}
            </div>
          </div>

          {/* Aplicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aplicar a *
            </label>
            <select
              value={formData.aplica_a}
              onChange={(e) => handleInputChange('aplica_a', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="TODOS">Todos los productos</option>
              <option value="CATEGORIA">Categoría específica</option>
              <option value="PRODUCTO_ESPECIFICO">Producto específico</option>
            </select>
          </div>

          {/* Configuración adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uso Máximo
              </label>
              <input
                type="number"
                min="1"
                value={formData.uso_maximo || ''}
                onChange={(e) => handleInputChange('uso_maximo', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sin límite"
              />
              <p className="mt-1 text-xs text-gray-500">
                Número máximo de veces que se puede usar
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mínimo de Compra
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.minimo_compra || ''}
                onChange={(e) => handleInputChange('minimo_compra', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sin mínimo"
              />
              <p className="mt-1 text-xs text-gray-500">
                Monto mínimo de compra para aplicar
              </p>
            </div>
          </div>

          {/* Máximo descuento para porcentajes */}
          {formData.tipo === 'PORCENTAJE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo Descuento
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.maximo_descuento || ''}
                onChange={(e) => handleInputChange('maximo_descuento', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sin límite"
              />
              <p className="mt-1 text-xs text-gray-500">
                Monto máximo de descuento (para evitar descuentos excesivos)
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{promocion ? 'Actualizar' : 'Crear'} Promoción</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
