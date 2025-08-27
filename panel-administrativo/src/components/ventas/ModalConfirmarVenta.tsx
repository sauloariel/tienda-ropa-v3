import React, { useState } from 'react'
import { VentaData } from '../../types/ventas.types'
import { X, CreditCard, DollarSign, Building2 } from 'lucide-react'

interface ModalConfirmarVentaProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (ventaData: VentaData) => void
  total: number
  itemsCount: number
  loading?: boolean
}

export const ModalConfirmarVenta: React.FC<ModalConfirmarVentaProps> = ({
  isOpen,
  onClose,
  onConfirm,
  total,
  itemsCount,
  loading = false
}) => {
  const [metodoPago, setMetodoPago] = useState<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'>('EFECTIVO')
  const [idCliente, setIdCliente] = useState<string>('')

  const handleConfirm = () => {
    const ventaData: VentaData = {
      id_cliente: idCliente ? parseInt(idCliente) : undefined,
      items: [], // Se llenará en el componente padre
      total,
      fecha_venta: new Date().toISOString(),
      estado: 'COMPLETADA',
      metodo_pago: metodoPago
    }

    onConfirm(ventaData)
  }

  if (!isOpen) return null

  const metodosPago = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: DollarSign, color: 'bg-green-100 text-green-800' },
    { id: 'TARJETA', label: 'Tarjeta', icon: CreditCard, color: 'bg-blue-100 text-blue-800' },
    { id: 'TRANSFERENCIA', label: 'Transferencia', icon: Building2, color: 'bg-purple-100 text-purple-800' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Confirmar Venta</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resumen de la venta */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Resumen de la Venta</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de items:</span>
                <span className="font-medium">{itemsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="font-bold text-lg text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Cliente (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID del Cliente (opcional)
            </label>
            <input
              type="number"
              placeholder="Dejar vacío para venta sin cliente"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-3">
              {metodosPago.map((metodo) => (
                <button
                  key={metodo.id}
                  onClick={() => setMetodoPago(metodo.id as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    metodoPago === metodo.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <metodo.icon className={`h-6 w-6 ${metodo.color}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {metodo.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Confirmación */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">!</span>
                </div>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Confirmar Venta</p>
                <p className="mt-1">
                  Al confirmar, se procesará la venta y se actualizará el inventario.
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <span>Confirmar Venta</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
