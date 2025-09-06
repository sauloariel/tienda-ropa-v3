import React from 'react';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, User } from 'lucide-react';
import type { Producto } from '../types/productos.types';
import type { Cliente } from '../types/cliente.types';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

interface ClientCartProps {
  items: CartItem[];
  total: number;
  onUpdateQuantity: (productoId: number, cantidad: number) => void;
  onRemoveItem: (productoId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const ClientCart: React.FC<ClientCartProps> = ({
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}) => {
  const { cliente, logout } = useClientAuth();
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-4">
      {/* Header del carrito */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Mi Carrito
          </h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {itemCount}
          </span>
        </div>
        
        {/* Información del cliente */}
        {cliente && (
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <User className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">{cliente.nombre} {cliente.apellido}</p>
              <p className="text-xs">{cliente.mail}</p>
            </div>
            <button
              onClick={logout}
              className="ml-auto text-red-500 hover:text-red-700 text-xs"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        )}
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
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>

          {/* IVA */}
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
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Finalizar Compra</span>
            </button>
            
            <button
              onClick={onClearCart}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 active:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpiar Carrito</span>
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
  
  // Validar que el producto tenga las propiedades necesarias
  if (!producto || !producto.id_producto || !producto.descripcion) {
    console.error('Producto inválido en CartItemCard:', producto);
    return null;
  }

  // Asegurar que precioUnitario sea un número válido
  const precioValido = typeof precioUnitario === 'number' && !isNaN(precioUnitario) ? precioUnitario : 0;
  const cantidadValida = typeof cantidad === 'number' && !isNaN(cantidad) ? cantidad : 0;
  const subtotal = precioValido * cantidadValida;

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      {/* Header del item */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight flex-1">
          {producto.descripcion || 'Producto sin nombre'}
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
        ${precioValido.toFixed(2)} c/u
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(producto.id_producto, Math.max(0, cantidadValida - 1))}
            className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
            disabled={cantidadValida <= 1}
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="text-sm font-medium min-w-[2rem] text-center">
            {cantidadValida}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(producto.id_producto, cantidadValida + 1)}
            className="w-6 h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors duration-200"
          >
            <Plus className="w-3 h-3" />
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

export default ClientCart;
