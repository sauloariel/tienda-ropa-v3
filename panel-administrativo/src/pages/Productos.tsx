import React, { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Package,
  DollarSign,
  TrendingUp
} from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive'
  createdAt: string
}

const Productos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Camiseta Básica', price: 25.99, stock: 50, category: 'Ropa', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Pantalón Jeans', price: 45.99, stock: 30, category: 'Ropa', status: 'active', createdAt: '2024-01-02' },
    { id: 3, name: 'Zapatillas Deportivas', price: 79.99, stock: 25, category: 'Calzado', status: 'active', createdAt: '2024-01-03' },
    { id: 4, name: 'Bolso de Cuero', price: 89.99, stock: 15, category: 'Accesorios', status: 'inactive', createdAt: '2024-01-04' },
    { id: 5, name: 'Reloj Elegante', price: 199.99, stock: 10, category: 'Accesorios', status: 'active', createdAt: '2024-01-05' },
  ])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Activo' : 'Inactivo'
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id))
    }
  }

  const stats = [
    { name: 'Total Productos', value: products.length, icon: Package, color: 'text-blue-600' },
    { name: 'Productos Activos', value: products.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-green-600' },
    { name: 'Valor Total', value: `$${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}`, icon: DollarSign, color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el inventario de productos</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' :
                      product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Producto</h3>
              <p className="text-sm text-gray-500">Funcionalidad en desarrollo</p>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-primary mt-4"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Productos

