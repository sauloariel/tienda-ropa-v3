import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

interface CartItem {
  producto: {
    id_producto: number;
    descripcion: string;
    precio_venta: number;
    imagenes?: Array<{ url: string }>;
  };
  cantidad: number;
  precioUnitario: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}) => {
  if (!isOpen) return null;

  // Función para parsear el precio
  const parsePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const parsed = parseFloat(price.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const total = items.reduce((sum, item) => {
    const precio = parsePrice(item.precioUnitario);
    return sum + (precio * item.cantidad);
  }, 0);
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Carrito de Compras ({totalItems})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-500 mb-6">
                  Agrega algunos productos para comenzar tu compra
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <div className="px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.producto.id_producto} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                    {/* Imagen del producto */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.producto.imagenes && item.producto.imagenes.length > 0 ? (
                        <img
                          src={item.producto.imagenes[0].url}
                          alt={item.producto.descripcion}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.producto.descripcion}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${parsePrice(item.precioUnitario).toFixed(2)} c/u
                      </p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.producto.id_producto, item.cantidad - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.producto.id_producto, item.cantidad + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Precio total del item */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${(parsePrice(item.precioUnitario) * item.cantidad).toFixed(2)}
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.producto.id_producto)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total: ${total.toFixed(2)}
                </span>
              </div>

              {/* Botones */}
              <div className="space-y-2">
                <button
                  onClick={onCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Proceder al Pago
                </button>
                <button
                  onClick={onClearCart}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Limpiar Carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
