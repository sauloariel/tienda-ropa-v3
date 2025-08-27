import React, { useState } from 'react'
import { ItemCarrito } from '../../types/ventas.types'
import { Trash2, Edit, Check, X } from 'lucide-react'

interface CarritoVentaProps {
  items: ItemCarrito[]
  total: number
  onActualizarCantidad: (index: number, cantidad: number) => void
  onRemoverItem: (index: number) => void
  onLimpiarCarrito: () => void
  onConfirmarVenta: () => void
}

export const CarritoVenta: React.FC<CarritoVentaProps> = ({
  items,
  total,
  onActualizarCantidad,
  onRemoverItem,
  onLimpiarCarrito,
  onConfirmarVenta
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editCantidad, setEditCantidad] = useState<number>(1)

  const handleEditCantidad = (index: number) => {
    setEditingIndex(index)
    setEditCantidad(items[index].cantidad)
  }

  const handleSaveCantidad = (index: number) => {
    try {
      onActualizarCantidad(index, editCantidad)
      setEditingIndex(null)
    } catch (error: any) {
      // El error se maneja en el hook del carrito
      console.error('Error actualizando cantidad:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Carrito de Venta</h3>
        <div className="text-center py-8 text-gray-500">
          <p>El carrito está vacío</p>
          <p className="text-sm">Selecciona productos para comenzar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Carrito de Venta</h3>
        <button
          onClick={onLimpiarCarrito}
          className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Lista de Items */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {item.descripcion}
                </h4>
                <div className="text-xs text-gray-500 space-x-2">
                  <span>Color: {item.color}</span>
                  <span>•</span>
                  <span>Talla: {item.talla}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ${item.precio_unitario.toFixed(2)} x {item.cantidad} = ${item.subtotal.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {/* Cantidad */}
                {editingIndex === index ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={item.stock_disponible}
                      value={editCantidad}
                      onChange={(e) => setEditCantidad(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleSaveCantidad(index)}
                      className="text-green-600 hover:text-green-800 hover:bg-green-50 p-1 rounded transition-colors"
                      title="Guardar"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 p-1 rounded transition-colors"
                      title="Cancelar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      Cant: {item.cantidad}
                    </span>
                    <button
                      onClick={() => handleEditCantidad(index)}
                      className="text-primary-600 hover:text-primary-800 hover:bg-primary-50 p-1 rounded transition-colors"
                      title="Editar cantidad"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Remover */}
                <button
                  onClick={() => onRemoverItem(index)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                  title="Remover del carrito"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stock disponible */}
            <div className="mt-2 text-xs text-gray-500">
              Stock disponible: {item.stock_disponible}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen y Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-primary-600">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          {items.length} producto(s) • {items.reduce((sum, item) => sum + item.cantidad, 0)} item(s) total
        </div>

        {/* Botón Confirmar Venta */}
        <button
          onClick={onConfirmarVenta}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-lg"
        >
          Confirmar Venta
        </button>
      </div>
    </div>
  )
}
