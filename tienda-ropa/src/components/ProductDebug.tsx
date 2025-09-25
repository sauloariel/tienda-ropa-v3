import React, { useState, useEffect } from 'react';
import { productosAPI, categoriasAPI } from '../services/api';
import type { Producto, Categoria } from '../types/productos.types';
import { Eye, Image, AlertTriangle, CheckCircle, X } from 'lucide-react';

const ProductDebug: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Cargando datos de productos...');
        
        const [productosData, categoriasData] = await Promise.all([
          productosAPI.getAll(),
          categoriasAPI.getAll()
        ]);
        
        console.log('✅ Datos cargados:', {
          productos: productosData.length,
          categorias: categoriasData.length
        });
        
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (err: any) {
        console.error('❌ Error cargando datos:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const testImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        accessible: response.ok,
        status: response.status,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      };
    } catch (error) {
      return {
        accessible: false,
        status: 0,
        error: error.message
      };
    }
  };

  const productosConImagenes = productos.filter(p => p.imagenes && p.imagenes.length > 0);
  const productosSinImagenes = productos.filter(p => !p.imagenes || p.imagenes.length === 0);

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Mostrar debug de productos"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Debug de Productos</h2>
              <p className="text-gray-600">Información detallada sobre la carga de productos e imágenes</p>
            </div>
          </div>
          <button
            onClick={() => setShowDebug(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resumen general */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{productos.length}</div>
                  <div className="text-sm text-blue-800">Total Productos</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{productosConImagenes.length}</div>
                  <div className="text-sm text-green-800">Con Imágenes</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{productosSinImagenes.length}</div>
                  <div className="text-sm text-orange-800">Sin Imágenes</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{categorias.length}</div>
                  <div className="text-sm text-purple-800">Categorías</div>
                </div>
              </div>

              {/* Productos con imágenes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Productos con Imágenes ({productosConImagenes.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productosConImagenes.slice(0, 6).map((producto) => (
                    <div key={producto.id_producto} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {producto.descripcion}
                        </h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {producto.imagenes?.length} img
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        ID: {producto.id_producto} | Precio: ${producto.precio_venta}
                      </div>
                      
                      <div className="space-y-1">
                        {producto.imagenes?.slice(0, 2).map((imagen, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <img
                              src={`http://localhost:4000${imagen.ruta}`}
                              alt={imagen.descripcion || 'Imagen del producto'}
                              className="w-8 h-8 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="text-gray-500 truncate">{imagen.ruta}</span>
                          </div>
                        ))}
                        {producto.imagenes && producto.imagenes.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{producto.imagenes.length - 2} más...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Productos sin imágenes */}
              {productosSinImagenes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Productos sin Imágenes ({productosSinImagenes.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productosSinImagenes.slice(0, 6).map((producto) => (
                      <div key={producto.id_producto} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {producto.descripcion}
                        </h4>
                        <div className="text-xs text-gray-600 mt-1">
                          ID: {producto.id_producto} | Precio: ${producto.precio_venta}
                        </div>
                        <div className="text-xs text-orange-600 mt-2">
                          ⚠️ Sin imágenes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorías */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categorías ({categorias.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categorias.map((categoria) => (
                    <div key={categoria.id_categoria} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900 text-sm">
                        {categoria.nombre_categoria}
                      </div>
                      <div className="text-xs text-gray-600">
                        ID: {categoria.id_categoria}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de la API */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de la API
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>URL Base:</strong> http://localhost:4000
                    </div>
                    <div>
                      <strong>Endpoint Productos:</strong> /api/productos
                    </div>
                    <div>
                      <strong>Endpoint Categorías:</strong> /api/productos/categorias
                    </div>
                    <div>
                      <strong>Endpoint Imágenes:</strong> /uploads/
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDebug;

