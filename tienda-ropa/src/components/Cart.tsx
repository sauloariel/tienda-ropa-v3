import React from 'react';
import type { Producto } from '../types/productos.types';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

interface CartProps {
  items: CartItem[];
  total: number;
  onUpdateQuantity: (productoId: number, cantidad: number) => void;
  onRemoveItem: (productoId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}) => {
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-fit sticky top-4">
      {/* Header del carrito */}
      <div className="border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900">🛒 Carrito de Venta</h2>
        <p className="text-sm text-gray-600">
          {itemCount} producto{itemCount !== 1 ? 's' : ''} en el carrito
        </p>
      </div>

      {/* Lista de items */}
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🛒</div>
            <p className="text-gray-500 text-sm">Carrito vacío</p>
            <p className="text-gray-400 text-xs">Agrega productos para comenzar</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItemCard
              key={item.producto.id_producto}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Total y acciones */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>

          {/* IVA (ejemplo) */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA (21%):</span>
            <span className="font-medium">${(total * 0.21).toFixed(2)}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span className="text-blue-600">${(total * 1.21).toFixed(2)}</span>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2">
            <button
              onClick={onCheckout}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors duration-200"
            >
              💳 Finalizar Venta
            </button>
            
            <button
              onClick={onClearCart}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 active:bg-gray-700 transition-colors duration-200"
            >
              🗑️ Limpiar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productoId: number, cantidad: number) => void;
  onRemoveItem: (productoId: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const { producto, cantidad, precioUnitario } = item;
  const subtotal = precioUnitario * cantidad;

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      {/* Header del item */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight flex-1">
          {producto.descripcion}
        </h4>
        <button
          onClick={() => onRemoveItem(producto.id_producto)}
          className="text-red-500 hover:text-red-700 ml-2 p-1"
          title="Eliminar"
        >
          ✕
        </button>
      </div>

      {/* Precio unitario */}
      <div className="text-xs text-gray-600 mb-2">
        ${precioUnitario.toFixed(2)} c/u
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(producto.id_producto, cantidad - 1)}
            className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
          >
            -
          </button>
          
          <span className="text-sm font-medium min-w-[2rem] text-center">
            {cantidad}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(producto.id_producto, cantidad + 1)}
            className="w-6 h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors duration-200"
          >
            +
          </button>
        </div>

        {/* Subtotal del item */}
        <div className="text-sm font-bold text-blue-600">
          ${subtotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default Cart;

