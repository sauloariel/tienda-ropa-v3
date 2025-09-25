import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import type { Producto } from '../types/productos.types';

interface ProductCardProps {
  producto: Producto;
  onAddToCart?: (producto: Producto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(producto);
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = () => {
    // TODO: Implementar vista rápida del producto
    console.log('Vista rápida:', producto.descripcion);
  };

  // Obtener las imágenes del producto
  const imagenesProducto = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes 
    : [];
  const imagenPrincipal = imagenesProducto.length > 0 ? imagenesProducto[0] : null;

  // Construir la URL completa de la imagen
  const getImageUrl = (ruta: string) => {
    if (ruta.startsWith('http')) {
      return ruta; // URL completa ya
    }
    if (ruta.startsWith('/uploads/')) {
      return `http://localhost:4000${ruta}`; // Agregar el dominio del backend
    }
    if (ruta.startsWith('/images/')) {
      return ruta; // Imágenes locales del frontend
    }
    return ruta; // Fallback
  };

  // Obtener el nombre de la categoría
  const nombreCategoria = producto.categoria?.nombre_categoria || 'Sin categoría';

  // Obtener talles y colores de las variantes
  const talles = producto.variantes?.map(v => v.talle?.nombre_talle).filter(Boolean) || [];
  const colores = producto.variantes?.map(v => v.color?.nombre).filter(Boolean) || [];

  return (
    <div 
      className="card group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {imagenPrincipal ? (
          <img
            src={getImageUrl(imagenPrincipal.ruta || imagenPrincipal.url || '')}
            alt={producto.descripcion}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('Error cargando imagen:', imagenPrincipal.ruta);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Sin imagen</span>
          </div>
        )}
        
        {/* Indicador de múltiples imágenes */}
        {imagenesProducto.length > 1 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            +{imagenesProducto.length - 1} más
          </div>
        )}
        
        {/* Badge de stock */}
        {producto.stock <= 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Agotado
          </div>
        )}
        
        {producto.stock > 0 && producto.stock <= 5 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Últimas unidades
          </div>
        )}

        {/* Botones de acción */}
        <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          <button
            onClick={handleQuickView}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Vista rápida"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isWishlisted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white hover:bg-gray-50'
            }`}
            title={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`h-4 w-4 ${
              isWishlisted ? 'text-white' : 'text-gray-600'
            }`} />
          </button>
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={producto.stock <= 0}
          className={`absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-3 px-4 transform transition-all duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          } ${producto.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          <div className="flex items-center justify-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="font-medium">
              {producto.stock <= 0 ? 'Agotado' : 'Agregar al carrito'}
            </span>
          </div>
        </button>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Categoría */}
        <div className="text-xs text-blue-600 font-medium mb-1">
          {nombreCategoria}
        </div>

        {/* Nombre del producto */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {producto.descripcion}
        </h3>

        {/* Precio y calificación */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${Number(producto.precio_venta).toLocaleString()}
            </span>
            {Number(producto.precio_venta) > 100 && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Envío gratis
              </span>
            )}
          </div>

          {/* Calificación */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>

        {/* Stock */}
        <div className="mt-3 text-xs text-gray-500">
          {producto.stock > 0 ? (
            <span className="text-green-600">
              {producto.stock} unidad{producto.stock !== 1 ? 'es' : ''} disponible{producto.stock !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-red-600">Producto agotado</span>
          )}
        </div>

        {/* Talles disponibles */}
        {talles.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-2">Talles disponibles:</div>
            <div className="flex flex-wrap gap-1">
              {talles.map((talle, index) => (
                <span
                  key={`talle-${index}-${talle}`}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  {talle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Colores disponibles */}
        {colores.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-2">Colores disponibles:</div>
            <div className="flex flex-wrap gap-2">
              {colores.map((color, index) => {
                // Mapear nombres de colores a códigos de color
                const getColorCode = (colorName: string) => {
                  const colorMap: { [key: string]: string } = {
                    'rojo': '#ef4444',
                    'azul': '#3b82f6',
                    'verde': '#10b981',
                    'amarillo': '#f59e0b',
                    'negro': '#1f2937',
                    'blanco': '#f9fafb',
                    'gris': '#6b7280',
                    'rosa': '#ec4899',
                    'morado': '#8b5cf6',
                    'naranja': '#f97316',
                    'celeste': '#06b6d4',
                    'marrón': '#a3a3a3'
                  };
                  return colorMap[colorName.toLowerCase()] || '#6b7280';
                };

                return (
                  <div
                    key={`color-${index}-${color}`}
                    className="flex items-center gap-1"
                    title={color}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: getColorCode(color) }}
                    />
                    <span className="text-xs text-gray-600 hidden sm:block">
                      {color}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
