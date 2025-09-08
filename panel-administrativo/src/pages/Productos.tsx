import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Image,
  Upload,
  X
} from 'lucide-react'
import { productosAPI, type Producto, type ProductoCreate, type ProductoUpdate, type Categoria, type Proveedor, type Color, type Talla, type TipoTalle, type ProductoVarianteCreate } from '../services/productos'


const Productos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [colores, setColores] = useState<Color[]>([])
  const [tiposTalle, setTiposTalle] = useState<TipoTalle[]>([])
  const [tallas, setTallas] = useState<Talla[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Estados para gestión de categorías
  const [showCategorias, setShowCategorias] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [showCategoriaModal, setShowCategoriaModal] = useState(false)
  const [categoriaForm, setCategoriaForm] = useState({
    nombre_categoria: '',
    descripcion: '',
    estado: 'activo'
  })

  // Estados para gestión de proveedores
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [showProveedorModal, setShowProveedorModal] = useState(false)
  const [proveedorForm, setProveedorForm] = useState({
    nombre: '',
    contacto: '',
    direccion: '',
    telefono: '',
    email: '',
    estado: 'activo'
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Estados para variantes
  const [variantes, setVariantes] = useState<ProductoVarianteCreate[]>([])
  const [selectedTipoTalle, setSelectedTipoTalle] = useState<number>(0)

  // Estados para imágenes
  const [imagenes, setImagenes] = useState<File[]>([])
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([])

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [
        productosData, 
        categoriasData, 
        proveedoresData, 
        coloresData, 
        tiposTalleData, 
        tallasData
      ] = await Promise.all([
        productosAPI.getProductos(),
        productosAPI.getCategorias(),
        productosAPI.getProveedores(),
        productosAPI.getColores(),
        productosAPI.getTiposTalle(),
        productosAPI.getTallas()
      ])
      
      // Debug: Log de los datos recibidos
      console.log('📊 Productos recibidos:', productosData)
      if (productosData && productosData.length > 0) {
        console.log('🔍 Primer producto:', productosData[0])
        console.log('💰 Tipos de precio_venta:', typeof productosData[0].precio_venta)
        console.log('💰 Tipos de precio_compra:', typeof productosData[0].precio_compra)
        console.log('📦 Tipos de stock:', typeof productosData[0].stock)
      }
      
      setProductos(productosData)
      setCategorias(categoriasData)
      setProveedores(proveedoresData)
      setColores(coloresData)
      setTiposTalle(tiposTalleData)
      setTallas(tallasData)
    } catch (error) {
      setError('Error al cargar los datos')
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProductos = productos.filter(producto =>
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (producto.categoria?.nombre_categoria || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (producto.proveedor?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (estado: string) => {
    return estado === 'ACTIVO' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (estado: string) => {
    return estado === 'ACTIVO' ? 'Activo' : 'Inactivo'
  }

  const getStockColor = (stock: number, stockSeguridad: number) => {
    if (stock <= stockSeguridad) return 'bg-red-100 text-red-800'
    if (stock <= stockSeguridad * 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const handleAdd = () => {
    setShowAddModal(true)
    setError(null)
    setSuccess(null)
    setVariantes([])
    setSelectedTipoTalle(0)
    setImagenes([])
    setImagenesPreview([])
  }

  // ==================== FUNCIONES DE CATEGORÍAS ====================

  const handleCategoriaAdd = () => {
    setCategoriaForm({
      nombre_categoria: '',
      descripcion: '',
      estado: 'activo'
    })
    setEditingCategoria(null)
    setShowCategoriaModal(true)
  }

  const handleCategoriaEdit = (categoria: Categoria) => {
    setCategoriaForm({
      nombre_categoria: categoria.nombre_categoria,
      descripcion: categoria.descripcion || '',
      estado: categoria.estado || 'activo'
    })
    setEditingCategoria(categoria)
    setShowCategoriaModal(true)
  }

  const handleCategoriaSave = async () => {
    try {
      setError(null)
      
      if (editingCategoria) {
        await productosAPI.updateCategoria(editingCategoria.id_categoria, categoriaForm)
        setSuccess('Categoría actualizada correctamente')
      } else {
        await productosAPI.createCategoria(categoriaForm)
        setSuccess('Categoría creada correctamente')
      }
      
      setShowCategoriaModal(false)
      cargarDatos() // Recargar datos
    } catch (err: any) {
      setError(err.message || 'Error al guardar la categoría')
    }
  }

  const handleCategoriaDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await productosAPI.deleteCategoria(id)
        setSuccess('Categoría eliminada correctamente')
        cargarDatos() // Recargar datos
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la categoría')
      }
    }
  }

  // ==================== FUNCIONES DE PROVEEDORES ====================

  const handleProveedorAdd = () => {
    setProveedorForm({
      nombre: '',
      contacto: '',
      direccion: '',
      telefono: '',
      email: '',
      estado: 'activo'
    })
    setEditingProveedor(null)
    setShowProveedorModal(true)
  }

  const handleProveedorEdit = (proveedor: Proveedor) => {
    setProveedorForm({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto || '',
      direccion: proveedor.direccion || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      estado: proveedor.estado || 'activo'
    })
    setEditingProveedor(proveedor)
    setShowProveedorModal(true)
  }

  const handleProveedorSave = async () => {
    try {
      setError(null)
      
      if (editingProveedor) {
        await productosAPI.updateProveedor(editingProveedor.id_proveedor, proveedorForm)
        setSuccess('Proveedor actualizado correctamente')
      } else {
        await productosAPI.createProveedor(proveedorForm)
        setSuccess('Proveedor creado correctamente')
      }
      
      setShowProveedorModal(false)
      cargarDatos() // Recargar datos
    } catch (err: any) {
      setError(err.message || 'Error al guardar el proveedor')
    }
  }

  const handleProveedorDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await productosAPI.deleteProveedor(id)
        setSuccess('Proveedor eliminado correctamente')
        cargarDatos() // Recargar datos
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el proveedor')
      }
    }
  }

  const handleCreate = async (productoData: ProductoCreate) => {
    try {
      await productosAPI.createProducto(productoData)
      setSuccess('Producto creado correctamente')
      setShowAddModal(false)
      cargarDatos() // Recargar la lista
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al crear el producto')
    }
  }

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto)
    setShowEditModal(true)
    setError(null)
    setSuccess(null)
    // Cargar variantes existentes si las hay
    if (producto.variantes) {
      setVariantes(producto.variantes.map(v => ({
        id_talle: v.id_talle,
        id_color: v.id_color,
        stock: v.stock,
        precio_venta: v.precio_venta
      })))
    } else {
      setVariantes([])
    }
    // Cargar imágenes existentes
    if (producto.imagenes) {
      setImagenesPreview(producto.imagenes.map(img => img.ruta || ''))
    } else {
      setImagenesPreview([])
    }
  }

  const handleUpdate = async (productoData: ProductoUpdate) => {
    if (!editingProducto) return

    try {
      await productosAPI.updateProducto(editingProducto.id_producto, productoData)
      setSuccess('Producto actualizado correctamente')
      setShowEditModal(false)
      setEditingProducto(null)
      cargarDatos() // Recargar la lista
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al actualizar el producto')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productosAPI.deleteProducto(id)
        setSuccess('Producto eliminado correctamente')
        cargarDatos() // Recargar la lista
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al eliminar el producto')
      }
    }
  }

  // Funciones para manejar variantes
  const addVariante = () => {
    const nuevaVariante: ProductoVarianteCreate = {
      id_talle: 0,
      id_color: 0,
      stock: 0,
      precio_venta: 0
    }
    setVariantes([...variantes, nuevaVariante])
  }

  const removeVariante = (index: number) => {
    setVariantes(variantes.filter((_, i) => i !== index))
  }

  const updateVariante = (index: number, field: keyof ProductoVarianteCreate, value: any) => {
    const nuevasVariantes = [...variantes]
    nuevasVariantes[index] = { ...nuevasVariantes[index], [field]: value }
    setVariantes(nuevasVariantes)
  }

  const getTallasPorTipo = (idTipoTalle: number) => {
    return tallas.filter(talla => talla.id_tipo_talle === idTipoTalle)
  }

  // Función para validar que una variante tenga todos los campos requeridos
  const isVarianteValida = (variante: ProductoVarianteCreate): boolean => {
    return variante.id_talle > 0 && 
           variante.id_color > 0 && 
           variante.stock > 0
  }

  // Función para filtrar solo variantes válidas
  const getVariantesValidas = (): ProductoVarianteCreate[] => {
    return variantes.filter(isVarianteValida)
  }

  // Funciones para manejar imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newImagenes = [...imagenes, ...files]
    setImagenes(newImagenes)
    
    // Crear previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagenesPreview([...imagenesPreview, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImagenes = imagenes.filter((_, i) => i !== index)
    setImagenes(newImagenes)
    
    // Limpiar preview y revocar URL
    URL.revokeObjectURL(imagenesPreview[index])
    const newPreviews = imagenesPreview.filter((_, i) => i !== index)
    setImagenesPreview(newPreviews)
  }

  const convertImagesToBase64 = async (): Promise<string[]> => {
    const base64Images: string[] = []
    
    for (const imagen of imagenes) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(imagen)
      })
      base64Images.push(base64)
    }
    
    return base64Images
  }

  // Función helper para formatear precios de manera segura
  const formatPrice = (price: any): string => {
    if (typeof price === 'number') {
      return price.toFixed(2)
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price)
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
    }
    return '0.00'
  }

  // Función helper para obtener valores numéricos seguros
  const getSafeNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'string') {
      const numValue = parseFloat(value)
      return isNaN(numValue) ? defaultValue : numValue
    }
    return defaultValue
  }

  const stats = [
    { name: 'Total Productos', value: productos.length, icon: Package, color: 'text-blue-600' },
    { name: 'Productos Activos', value: productos.filter(p => p.estado === 'ACTIVO').length, icon: TrendingUp, color: 'text-green-600' },
    { name: 'Valor Total Inventario', value: `$${productos.reduce((sum, p) => sum + (getSafeNumber(p.precio_venta) * getSafeNumber(p.stock)), 0).toFixed(2)}`, icon: DollarSign, color: 'text-purple-600' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el inventario de productos con variantes e imágenes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCategoriaAdd}
            className="btn-secondary"
          >
            <Package className="h-4 w-4 mr-2" />
            Nueva Categoría
          </button>
          <button
            onClick={handleProveedorAdd}
            className="btn-secondary"
          >
            <Package className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </button>
          <button
            onClick={handleAdd}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccess(null)}
                className="text-green-400 hover:text-green-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sección de Gestión de Categorías */}
      {showCategorias && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Gestión de Categorías</h2>
            <button
              onClick={handleCategoriaAdd}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorias.map((categoria) => (
                  <tr key={categoria.id_categoria}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {categoria.nombre_categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoria.descripcion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(categoria.estado || 'ACTIVO')}`}>
                        {getStatusText(categoria.estado || 'ACTIVO')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCategoriaEdit(categoria)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCategoriaDelete(categoria.id_categoria)}
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
      )}


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

      {/* Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar productos por descripción, categoría o proveedor..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>



      {/* Productos Table - MEJORADA */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Producto
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Categoría
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Proveedor
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Precios
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Stock
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Variantes
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Estado
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProductos.map((producto) => (
                <tr key={producto.id_producto} className="hover:bg-gray-50">
                  {/* Producto */}
                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate" title={producto.descripcion}>
                        {producto.descripcion}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {producto.id_producto}
                      </div>
                    </div>
                  </td>
                  
                  {/* Categoría */}
                  <td className="px-3 py-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate" title={producto.categoria?.nombre_categoria || 'Sin categoría'}>
                        {producto.categoria?.nombre_categoria || 'Sin categoría'}
                      </div>
                      {producto.categoria?.descripcion && (
                        <div className="text-xs text-gray-500 truncate" title={producto.categoria.descripcion}>
                          {producto.categoria.descripcion}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Proveedor */}
                  <td className="px-3 py-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate" title={producto.proveedor?.nombre || 'Sin proveedor'}>
                        {producto.proveedor?.nombre || 'Sin proveedor'}
                      </div>
                      {producto.proveedor?.contacto && (
                        <div className="text-xs text-gray-500 truncate" title={producto.proveedor.contacto}>
                          {producto.proveedor.contacto}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Precios */}
                  <td className="px-3 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-green-600">
                        ${formatPrice(producto.precio_venta)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Compra: ${formatPrice(producto.precio_compra)}
                      </div>
                    </div>
                  </td>
                  
                  {/* Stock */}
                  <td className="px-3 py-4">
                    <div className="text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockColor(
                        getSafeNumber(producto.stock), 
                        getSafeNumber(producto.stock_seguridad)
                      )}`}>
                        {getSafeNumber(producto.stock)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Seg: {getSafeNumber(producto.stock_seguridad)}
                      </div>
                    </div>
                  </td>
                  
                  {/* Variantes e Imágenes */}
                  <td className="px-3 py-4">
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <Package className="h-3 w-3 text-blue-500" />
                        <span className="text-sm text-gray-900">
                          {producto.variantes?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Image className="h-3 w-3 text-purple-500" />
                        <span className="text-xs text-gray-500">
                          {producto.imagenes?.length || 0}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Estado */}
                  <td className="px-3 py-4">
                    <div className="text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(producto.estado)}`}>
                        {getStatusText(producto.estado)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Acciones */}
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(producto)}
                        className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded transition-colors"
                        title="Editar producto"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id_producto)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Mensaje cuando no hay productos */}
          {filteredProductos.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No se encontraron productos que coincidan con tu búsqueda.' : 'Comienza creando tu primer producto.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={handleAdd}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Producto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[900px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Producto</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                
                // Solo incluir variantes válidas
                const variantesValidas = getVariantesValidas()
                
                // Convertir imágenes a base64
                const imagenesBase64 = await convertImagesToBase64()
                const imagenesData = imagenesBase64.map((base64, index) => ({
                  nombre_archivo: imagenes[index]?.name || `imagen_${index + 1}`,
                  ruta: base64,
                  descripcion: `Imagen del producto`,
                  imagen_bin: null
                }))
                
                const productoData: ProductoCreate = {
                  descripcion: formData.get('descripcion') as string,
                  id_proveedor: parseInt(formData.get('id_proveedor') as string),
                  id_categoria: parseInt(formData.get('id_categoria') as string),
                  stock: parseInt(formData.get('stock') as string),
                  precio_venta: parseFloat(formData.get('precio_venta') as string),
                  precio_compra: parseFloat(formData.get('precio_compra') as string),
                  stock_seguridad: parseInt(formData.get('stock_seguridad') as string),
                  estado: formData.get('estado') as string || 'ACTIVO',
                  variantes: variantesValidas.length > 0 ? variantesValidas : undefined,
                  imagenes: imagenesData.length > 0 ? imagenesData : undefined
                }
                
                console.log('📤 Enviando producto con variantes e imágenes:', productoData)
                handleCreate(productoData)
              }}>
                <div className="grid grid-cols-3 gap-4">
                  {/* Columna Izquierda - Datos Básicos */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción *</label>
                      <input
                        type="text"
                        name="descripcion"
                        className="input-field"
                        required
                        placeholder="Camiseta Básica"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoría *</label>
                      <select
                        name="id_categoria"
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(categoria => (
                          <option key={categoria.id_categoria} value={categoria.id_categoria}>
                            {categoria.nombre_categoria}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Proveedor *</label>
                      <select
                        name="id_proveedor"
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar proveedor</option>
                        {proveedores.map(proveedor => (
                          <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                            {proveedor.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        className="input-field"
                        required
                        min="0"
                        placeholder="50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock de Seguridad *</label>
                      <input
                        type="number"
                        name="stock_seguridad"
                        className="input-field"
                        required
                        min="0"
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Precio de Venta *</label>
                      <input
                        type="number"
                        name="precio_venta"
                        className="input-field"
                        required
                        min="0"
                        step="0.01"
                        placeholder="25.99"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Precio de Compra *</label>
                      <input
                        type="number"
                        name="precio_compra"
                        className="input-field"
                        required
                        min="0"
                        step="0.01"
                        placeholder="15.99"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estado</label>
                      <select
                        name="estado"
                        defaultValue="ACTIVO"
                        className="input-field"
                      >
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                      </select>
                    </div>
                  </div>

                  {/* Columna Central - Variantes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">Variantes del Producto</h4>
                      <button
                        type="button"
                        onClick={addVariante}
                        className="btn-secondary text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Variante
                      </button>
                    </div>

                    {variantes.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No hay variantes configuradas
                      </div>
                    )}

                    {variantes.map((variante, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Variante {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeVariante(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600">Tipo de Talla</label>
                            <select
                              className="input-field text-sm"
                              value={selectedTipoTalle}
                              onChange={(e) => setSelectedTipoTalle(parseInt(e.target.value))}
                            >
                              <option value={0}>Seleccionar tipo</option>
                              {tiposTalle.map(tipo => (
                                <option key={tipo.id_tipo_talle} value={tipo.id_tipo_talle}>
                                  {tipo.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600">Talla</label>
                            <select
                              className="input-field text-sm"
                              value={variante.id_talle}
                              onChange={(e) => updateVariante(index, 'id_talle', parseInt(e.target.value))}
                              required
                            >
                              <option value={0}>Seleccionar talla</option>
                              {selectedTipoTalle > 0 && getTallasPorTipo(selectedTipoTalle).map(talla => (
                                <option key={talla.id_talla} value={talla.id_talla}>
                                  {talla.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600">Color</label>
                            <select
                              className="input-field text-sm"
                              value={variante.id_color}
                              onChange={(e) => updateVariante(index, 'id_color', parseInt(e.target.value))}
                              required
                            >
                              <option value={0}>Seleccionar color</option>
                              {colores.map(color => (
                                <option key={color.id_color} value={color.id_color}>
                                  {color.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600">Stock</label>
                            <input
                              type="number"
                              className="input-field text-sm"
                              value={variante.stock}
                              onChange={(e) => updateVariante(index, 'stock', parseInt(e.target.value))}
                              min="0"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Indicador de validación */}
                        {!isVarianteValida(variante) && (
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            ⚠️ Esta variante no es válida. Complete todos los campos requeridos.
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Resumen de variantes válidas */}
                    {variantes.length > 0 && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Resumen:</strong> {getVariantesValidas().length} de {variantes.length} variantes son válidas
                      </div>
                    )}
                  </div>

                  {/* Columna Derecha - Imágenes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">Imágenes del Producto</h4>
                      <label className="btn-secondary text-sm cursor-pointer">
                        <Upload className="h-4 w-4 mr-1" />
                        Cargar Imágenes
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {imagenesPreview.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No hay imágenes cargadas
                      </div>
                    )}

                    <div className="space-y-3">
                      {imagenesPreview.map((preview, index) => (
                        <div key={index} className="relative border rounded-lg p-2">
                          <img
                            src={preview}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="text-xs text-gray-500 mt-1">
                            {imagenes[index]?.name || `Imagen ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Resumen de imágenes */}
                    {imagenesPreview.length > 0 && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Resumen:</strong> {imagenesPreview.length} imagen(es) cargada(s)
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={variantes.length > 0 && getVariantesValidas().length === 0}
                  >
                    Crear Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Similar al Add Modal pero con datos precargados */}
      {showEditModal && editingProducto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[900px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Producto</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                
                // Solo incluir variantes válidas
                const variantesValidas = getVariantesValidas()
                
                // Convertir imágenes a base64
                const imagenesBase64 = await convertImagesToBase64()
                const imagenesData = imagenesBase64.map((base64, index) => ({
                  nombre_archivo: imagenes[index]?.name || `imagen_${index + 1}`,
                  ruta: base64,
                  descripcion: `Imagen del producto`,
                  imagen_bin: null
                }))
                
                const productoData: ProductoUpdate = {
                  descripcion: formData.get('descripcion') as string,
                  id_proveedor: parseInt(formData.get('id_proveedor') as string),
                  id_categoria: parseInt(formData.get('id_categoria') as string),
                  stock: parseInt(formData.get('stock') as string),
                  precio_venta: parseFloat(formData.get('precio_venta') as string),
                  precio_compra: parseFloat(formData.get('precio_compra') as string),
                  stock_seguridad: parseInt(formData.get('stock_seguridad') as string),
                  estado: formData.get('estado') as string,
                  variantes: variantesValidas.length > 0 ? variantesValidas : undefined,
                  imagenes: imagenesData.length > 0 ? imagenesData : undefined
                }
                
                console.log('📤 Actualizando producto con variantes e imágenes:', productoData)
                handleUpdate(productoData)
              }}>
                {/* Similar al Add Modal pero con defaultValue */}
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Modal de edición en desarrollo</p>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn-primary mt-4"
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Categoría */}
      {showCategoriaModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                handleCategoriaSave()
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      value={categoriaForm.nombre_categoria}
                      onChange={(e) => setCategoriaForm({...categoriaForm, nombre_categoria: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      value={categoriaForm.descripcion}
                      onChange={(e) => setCategoriaForm({...categoriaForm, descripcion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={categoriaForm.estado}
                      onChange={(e) => setCategoriaForm({...categoriaForm, estado: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCategoriaModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {editingCategoria ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Proveedor */}
      {showProveedorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                handleProveedorSave()
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Proveedor *
                    </label>
                    <input
                      type="text"
                      value={proveedorForm.nombre}
                      onChange={(e) => setProveedorForm({...proveedorForm, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contacto
                    </label>
                    <input
                      type="text"
                      value={proveedorForm.contacto}
                      onChange={(e) => setProveedorForm({...proveedorForm, contacto: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <textarea
                      value={proveedorForm.direccion}
                      onChange={(e) => setProveedorForm({...proveedorForm, direccion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={proveedorForm.telefono}
                      onChange={(e) => setProveedorForm({...proveedorForm, telefono: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={proveedorForm.email}
                      onChange={(e) => setProveedorForm({...proveedorForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={proveedorForm.estado}
                      onChange={(e) => setProveedorForm({...proveedorForm, estado: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowProveedorModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {editingProveedor ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Productos

