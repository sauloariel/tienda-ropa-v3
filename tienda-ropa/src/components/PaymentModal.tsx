import React, { useState } from 'react';
import type { Producto } from '../types/productos.types';
import { posService, type Venta, type VentaItem } from '../services/posService';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

interface PaymentModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onComplete: (paymentMethod: string) => void;
  processing?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  cart,
  total,
  onClose,
  onComplete,
  processing = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('efectivo');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalWithTax = total * 1.21;
  const change = parseFloat(amountReceived) - totalWithTax;

  const handlePayment = async () => {
    if (paymentMethod === 'efectivo' && parseFloat(amountReceived) < totalWithTax) {
      setError('El monto recibido debe ser mayor o igual al total');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Completar venta directamente (la factura se maneja en el componente padre)
      onComplete(paymentMethod);
    } catch (error: any) {
      console.error('❌ Error en el proceso de pago:', error);
      setError('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'efectivo') {
      return parseFloat(amountReceived) >= totalWithTax;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold">💳 Finalizar Venta</h2>
          <p className="text-green-100">Total: ${totalWithTax.toFixed(2)}</p>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-4">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="text-red-500 mr-2">⚠️</div>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Resumen de la venta */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2">Resumen de la Venta</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (21%):</span>
                <span>${(total * 0.21).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-1">
                <span>Total:</span>
                <span className="text-green-600">${totalWithTax.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'efectivo', label: '💵 Efectivo', icon: '💵' },
                { id: 'cbu', label: '🏦 CBU', icon: '🏦' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-xs font-medium">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Campo de monto recibido (solo para efectivo) */}
          {paymentMethod === 'efectivo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto Recibido
              </label>
              <input
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {amountReceived && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">Cambio: </span>
                  <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${change.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Lista de productos */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Productos Vendidos</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {cart.map((item) => (
                <div key={item.producto.id_producto} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.cantidad}x {item.producto.descripcion}
                  </span>
                  <span className="font-medium">
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 p-4 rounded-b-lg flex space-x-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Cancelar
          </button>
          
          <button
            onClick={handlePayment}
            disabled={!isPaymentValid() || isProcessing || processing}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isProcessing || processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              'Completar Venta'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
