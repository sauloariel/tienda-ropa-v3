import React from 'react';
import type { Producto } from '../types/productos.types';

interface ProductGridProps {
  productos: Producto[];
  onAddToCart: (producto: Producto) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ productos, onAddToCart }) => {
  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No se encontraron productos
        </h3>
        <p className="text-gray-600">
          Intenta cambiar los filtros o la búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {productos.map((producto) => (
          <ProductCard
            key={producto.id_producto}
            producto={producto}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

interface ProductCardProps {
  producto: Producto;
  onAddToCart: (producto: Producto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(producto);
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { text: 'Sin Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { text: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Disponible', color: 'bg-green-100 text-green-800' };
  };

  const stockStatus = getStockStatus(producto.stock);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
      {/* Imagen del producto */}
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {producto.imagenes && producto.imagenes.length > 0 ? (
          <img
            src={producto.imagenes[0].url}
            alt={producto.descripcion}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling!.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="hidden text-gray-400 text-4xl items-center justify-center">
          📦
        </div>
      </div>

      {/* Información del producto */}
      <div className="space-y-2">
        {/* Nombre del producto */}
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
          {producto.descripcion}
        </h3>

        {/* Categoría */}
        {producto.categoria && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
            {producto.categoria.nombre_categoria}
          </div>
        )}

        {/* Precio */}
        <div className="text-lg font-bold text-blue-600">
          ${producto.precio_venta.toFixed(2)}
        </div>

        {/* Stock */}
        <div className={`text-xs px-2 py-1 rounded-full inline-block ${stockStatus.color}`}>
          {stockStatus.text}: {producto.stock}
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={producto.stock <= 0}
          className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            producto.stock > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {producto.stock > 0 ? '➕ Agregar' : 'Sin Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;

