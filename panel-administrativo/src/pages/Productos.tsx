import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Image,
  Upload,
  X,
  FileText
} from 'lucide-react'
import { productosAPI, type Producto, type ProductoCreate, type ProductoUpdate, type Categoria, type Proveedor, type Color, type Talla, type TipoTalle, type ProductoVarianteCreate } from '../services/productos'
import { temporadasAPI, type Temporada } from '../services/temporadas'
import { usePDF } from '../hooks/usePDF'

// Tipos mejorados
type VarianteUI = ProductoVarianteCreate & { id_tipo_talle?: number }

// Helpers
const toNum = (v: any, d = 0): number => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

const toEstado = (s?: string): 'ACTIVO' | 'INACTIVO' => 
  (s || 'ACTIVO').toUpperCase() as 'ACTIVO' | 'INACTIVO'

const formatPrice = (price: number): string => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)


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
  const [showEditImagesModal, setShowEditImagesModal] = useState(false)
  const [pdfOptions] = useState({
    title: 'Listado de Stock',
    includeImages: false,
    includeVariants: true,
    filterByStock: false,
    minStock: 0
  })
  
  // Estados para gestión de categorías
  const [showCategorias] = useState(false)
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
  
  // Estados para filtros adicionales
  const [stockFilter, setStockFilter] = useState<'all' | 'critical' | 'low'>('all')
  const [seasonFilter, setSeasonFilter] = useState<'all' | 'verano' | 'invierno' | 'otono' | 'primavera' | 'todas-las-temporadas'>('all')
  const [showVariantsModal, setShowVariantsModal] = useState(false)
  const [selectedProductVariants, setSelectedProductVariants] = useState<Producto | null>(null)
  
  // Estados para gestión de temporadas
  const [temporadas, setTemporadas] = useState<Temporada[]>([])
  const [showTemporadaModal, setShowTemporadaModal] = useState(false)
  const [editingTemporada, setEditingTemporada] = useState<Temporada | null>(null)
  const [temporadaForm, setTemporadaForm] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo'
  })

  // Estados para variantes
  const [variantes, setVariantes] = useState<VarianteUI[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Estados para imágenes
  const [imagenes, setImagenes] = useState<File[]>([])
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([])

  // Hook para PDF
  const { generateProductsPDF } = usePDF()

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
    cargarTemporadas()
  }, [])

  // Función para cargar temporadas
  const cargarTemporadas = async () => {
    try {
      const response = await temporadasAPI.getAll()
      setTemporadas(response.data)
    } catch (error: any) {
      console.error('Error cargando temporadas:', error)
      setError('Error al cargar las temporadas')
    }
  }

  // Cleanup de URLs de imágenes al desmontar o cerrar modales
  useEffect(() => {
    return () => {
      imagenesPreview.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imagenesPreview])

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
        
        // Debug específico para variantes
        const productosConVariantes = productosData.filter(p => p.variantes && p.variantes.length > 0)
        console.log('🎨 Productos con variantes:', productosConVariantes.length)
        if (productosConVariantes.length > 0) {
          console.log('🔍 Primer producto con variantes:', productosConVariantes[0])
          console.log('🔍 Variantes del primer producto:', productosConVariantes[0].variantes)
        }
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

  // Filtrado con memo y debounce
  const filteredProductos = useMemo(() => {
    const query = debouncedSearch.toLowerCase()
    return productos.filter(producto => {
      // Filtro de búsqueda por texto
      const matchesSearch = producto.descripcion.toLowerCase().includes(query) ||
        (producto.categoria?.nombre_categoria || '').toLowerCase().includes(query) ||
        (producto.proveedor?.nombre || '').toLowerCase().includes(query)
      
      // Filtro por stock
      let matchesStock = true
      if (stockFilter === 'critical') {
        matchesStock = toNum(producto.stock) <= toNum(producto.stock_seguridad)
      } else if (stockFilter === 'low') {
        matchesStock = toNum(producto.stock) <= (toNum(producto.stock_seguridad) * 2)
      }
      
      // Filtro por temporada (usando el campo temporada del producto)
      let matchesSeason = true
      if (seasonFilter !== 'all') {
        const productoTemporada = (producto as any).temporada
        if (seasonFilter === 'todas-las-temporadas') {
          matchesSeason = productoTemporada === 'todas-las-temporadas'
        } else {
          matchesSeason = productoTemporada === seasonFilter
        }
      }
      
      return matchesSearch && matchesStock && matchesSeason
    })
  }, [productos, debouncedSearch, stockFilter, seasonFilter])

  const getStatusColor = (estado: string) => {
    const estadoNormalizado = toEstado(estado)
    return estadoNormalizado === 'ACTIVO' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (estado: string) => {
    const estadoNormalizado = toEstado(estado)
    return estadoNormalizado === 'ACTIVO' ? 'Activo' : 'Inactivo'
  }

  const getStockColor = (stock: number, stockSeguridad: number) => {
    const stockNum = toNum(stock)
    const stockSegNum = toNum(stockSeguridad)
    if (stockNum <= stockSegNum) return 'bg-red-100 text-red-800'
    if (stockNum <= stockSegNum * 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const handleAdd = () => {
    setShowAddModal(true)
    clearAddForm() // Limpiar completamente el formulario
  }

  const clearAddForm = () => {
    // Limpiar estados
    setError(null)
    setSuccess(null)
    setVariantes([])
    setImagenes([])
    setImagenesPreview([])
    
    // Limpiar el formulario HTML
    const form = document.querySelector('form[data-form-type="add-product"]') as HTMLFormElement
    if (form) {
      form.reset()
      
      // Limpiar campos específicos que podrían no resetearse correctamente
      const inputs = form.querySelectorAll('input, select, textarea')
      inputs.forEach((input: any) => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false
        } else if (input.type === 'file') {
          input.value = ''
        } else {
          input.value = ''
        }
      })
    }
    
    console.log('🧹 Formulario limpiado correctamente')
  }

  const handleCloseModals = () => {
    // Limpiar URLs de imágenes
    imagenesPreview.forEach(url => URL.revokeObjectURL(url))
    
    setShowAddModal(false)
    setShowEditModal(false)
    setShowEditImagesModal(false)
    setEditingProducto(null)
    setError(null)
    setSuccess(null)
    setVariantes([])
    setImagenes([])
    setImagenesPreview([])
    
    // Limpiar formulario de agregar producto
    clearAddForm()
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

  // const handleProveedorEdit = useCallback((proveedor: Proveedor) => {
  //   setProveedorForm({
  //     nombre: proveedor.nombre,
  //     contacto: proveedor.contacto || '',
  //     direccion: proveedor.direccion || '',
  //     telefono: proveedor.telefono || '',
  //     email: proveedor.email || '',
  //     estado: proveedor.estado || 'activo'
  //   })
  //   setEditingProveedor(proveedor)
  //   setShowProveedorModal(true)
  // }, [])

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

  const handleProveedorDelete = useCallback(async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await productosAPI.deleteProveedor(id)
        setSuccess('Proveedor eliminado correctamente')
        cargarDatos() // Recargar datos
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el proveedor')
      }
    }
  }, [])

  // Funciones para gestión de temporadas
  const handleTemporadaSave = async () => {
    try {
      if (editingTemporada) {
        // Actualizar temporada existente
        const response = await temporadasAPI.update(editingTemporada.id_temporada, temporadaForm)
        setTemporadas(temporadas.map(t => 
          t.id_temporada === editingTemporada.id_temporada ? response.data : t
        ))
        setSuccess('Temporada actualizada exitosamente')
      } else {
        // Crear nueva temporada
        const response = await temporadasAPI.create(temporadaForm)
        setTemporadas([...temporadas, response.data])
        setSuccess('Temporada creada exitosamente')
      }
      
      setTemporadaForm({
        nombre: '',
        descripcion: '',
        estado: 'activo'
      })
      setEditingTemporada(null)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      console.error('Error guardando temporada:', error)
      setError('Error al guardar la temporada')
    }
  }

  const handleTemporadaDelete = useCallback(async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta temporada?')) {
      try {
        await temporadasAPI.delete(id)
        setTemporadas(temporadas.filter(t => t.id_temporada !== id))
        setSuccess('Temporada eliminada correctamente')
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la temporada')
      }
    }
  }, [temporadas])

  const handleCreate = async (productoData: ProductoCreate) => {
    try {
      // Validar duplicados de variantes
      if (hasDupVariantes()) {
        setError('Hay variantes repetidas (misma talla y color).')
        return
      }
      
      console.log('📤 Datos del producto a crear:', productoData)
      
      // Crear producto sin imágenes primero
      const { imagenes: _, ...productoDataSinImagenes } = productoData
      const resultado = await productosAPI.createProducto(productoDataSinImagenes)
      console.log('✅ Producto creado exitosamente:', resultado)
      
      // Subir imágenes si las hay
      if (imagenes.length > 0 && resultado?.id_producto) {
        try {
          await uploadImagesToServer(resultado.id_producto, false) // false = agregar sin reemplazar
          console.log('✅ Imágenes subidas exitosamente')
          setSuccess('Producto agregado correctamente con imágenes')
        } catch (imageError) {
          console.warn('⚠️ Error al subir imágenes:', imageError)
          setSuccess('Producto agregado correctamente, pero hubo un error al subir las imágenes')
          // No fallar la creación del producto por error de imágenes
        }
      } else {
        setSuccess('Producto agregado correctamente')
      }
      
      // Limpiar el formulario para permitir agregar otro producto
      clearAddForm()
      cargarDatos() // Recargar la lista
      
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error: any) {
      console.error('❌ Error al crear producto:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Error al crear el producto'
      setError(errorMessage)
    }
  }

  const handleEdit = (producto: Producto) => {
    console.log('🔍 Editando producto:', producto)
    console.log('🔍 Variantes del producto:', producto.variantes)
    
    setEditingProducto(producto)
    setShowEditModal(true)
    setError(null)
    setSuccess(null)
    
    // Cargar variantes existentes con id_tipo_talle
    if (producto.variantes && producto.variantes.length > 0) {
      console.log('🔍 Cargando variantes existentes:', producto.variantes.length)
      const variantesConTipo: VarianteUI[] = producto.variantes.map(v => {
        console.log('🔍 Mapeando variante:', v)
        return {
          id_talle: v.id_talle, // Corregido: usar id_talle en lugar de id_talla
          id_color: v.id_color,
          stock: v.stock,
          precio_venta: v.precio_venta || producto.precio_venta, // Usar precio del producto si no hay precio en variante
          id_tipo_talle: v.talla?.id_tipo_talle
        }
      })
      console.log('🔍 Variantes mapeadas:', variantesConTipo)
      setVariantes(variantesConTipo)
    } else {
      console.log('🔍 No hay variantes para cargar')
      setVariantes([])
    }
    
    // Cargar imágenes existentes
    if (producto.imagenes) {
      setImagenesPreview(producto.imagenes.map(img => img.ruta || ''))
    } else {
      setImagenesPreview([])
    }
    setImagenes([]) // Limpiar archivos nuevos
  }

  const handleEditImages = (producto: Producto) => {
    setEditingProducto(producto)
    setShowEditImagesModal(true)
    setError(null)

    // Cargar imágenes existentes
    if (producto.imagenes) {
      setImagenesPreview(producto.imagenes.map(img => img.ruta || ''))
    } else {
      setImagenesPreview([])
    }
    setImagenes([]) // Limpiar archivos nuevos
  }

  const handleUpdate = async (productoData: ProductoUpdate) => {
    if (!editingProducto) return

    try {
      // Validar duplicados de variantes
      if (hasDupVariantes()) {
        setError('Hay variantes repetidas (misma talla y color).')
        return
      }
      
      await productosAPI.updateProducto(editingProducto.id_producto, productoData)
      setSuccess('Producto actualizado correctamente')
      
      // Cerrar modal y limpiar estado
      handleCloseModals()
      
      // Recargar la lista de productos
      await cargarDatos()
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
  const addVariante = useCallback(() => {
    const nuevaVariante: VarianteUI = {
      id_talle: 0,
      id_color: 0,
      stock: 0,
      precio_venta: 0,
      id_tipo_talle: undefined
    }
    setVariantes(prev => [...prev, nuevaVariante])
  }, [])

  const removeVariante = useCallback((index: number) => {
    setVariantes(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateVariante = useCallback((index: number, field: keyof VarianteUI, value: any) => {
    setVariantes(prev => prev.map((variante, idx) => 
      idx === index 
        ? { 
            ...variante, 
            [field]: value,
            ...(field === 'id_tipo_talle' ? { id_talle: 0 } : {})
          }
        : variante
    ))
  }, [])

  const getTallasPorVariante = useCallback((variante: VarianteUI) => {
    return variante.id_tipo_talle 
      ? tallas.filter(talla => talla.id_tipo_talle === variante.id_tipo_talle)
      : []
  }, [tallas])

  // Validaciones de variantes
  const isVarianteValida = useCallback((variante: VarianteUI): boolean => {
    return variante.id_talle > 0 && 
           variante.id_color > 0 && 
           toNum(variante.stock) > 0
  }, [])

  const getVariantesValidas = useCallback((): VarianteUI[] => {
    return variantes.filter(isVarianteValida)
  }, [variantes, isVarianteValida])

  const hasDupVariantes = useCallback((): boolean => {
    const validas = getVariantesValidas()
    
    // Filtrar variantes que tengan id_talle e id_color válidos (mayores a 0)
    const variantesValidas = validas.filter(v => v.id_talle > 0 && v.id_color > 0)
    
    const keys = variantesValidas.map(v => `${v.id_talle}-${v.id_color}`)
    const hasDuplicates = new Set(keys).size !== keys.length
    
    // Debug logging
    if (hasDuplicates) {
      console.log('🔍 Variantes válidas:', validas)
      console.log('🔍 Variantes con IDs válidos:', variantesValidas)
      console.log('🔍 Keys generadas:', keys)
      console.log('🔍 Keys únicas:', Array.from(new Set(keys)))
    }
    
    return hasDuplicates
  }, [getVariantesValidas])

  // Cálculo de stock total de variantes
  const stockTotalVariantes = useMemo(() => {
    return getVariantesValidas().reduce((sum, variante) => sum + toNum(variante.stock), 0)
  }, [getVariantesValidas])

  // Funciones para manejar imágenes
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validar límites
    const MAX_FILES = 6
    const MAX_SIZE_MB = 10
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
    
    if (imagenes.length + files.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} imágenes permitidas`)
      return
    }
    
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE_BYTES)
    if (oversizedFiles.length > 0) {
      setError(`Algunas imágenes exceden el límite de ${MAX_SIZE_MB}MB`)
      return
    }
    
    setError(null)
    
    const newImagenes = [...imagenes, ...files]
    setImagenes(newImagenes)
    
    // Crear previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagenesPreview(prev => [...prev, ...newPreviews])
  }, [imagenes])

  const removeImage = useCallback((index: number) => {
    // Revocar URL antes de remover
    URL.revokeObjectURL(imagenesPreview[index])
    
    setImagenes(prev => prev.filter((_, i) => i !== index))
    setImagenesPreview(prev => prev.filter((_, i) => i !== index))
  }, [imagenesPreview])

  const uploadImagesToServer = async (idProducto: number, replaceExisting: boolean = false): Promise<void> => {
    if (imagenes.length === 0) {
      console.log('⚠️ No hay imágenes para subir')
      return
    }

    console.log(`📤 Subiendo ${imagenes.length} imágenes para el producto ${idProducto}`)

    const formData = new FormData()
    formData.append('id_producto', idProducto.toString())
    formData.append('replace_existing', replaceExisting.toString())
    
    imagenes.forEach((imagen, index) => {
      formData.append('imagenes', imagen)
      console.log(`📎 Agregando imagen ${index + 1}: ${imagen.name}`)
    })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/imagenes/upload-multiple`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error al subir imágenes: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Imágenes subidas exitosamente:', result)
      
    } catch (error) {
      console.error('❌ Error al subir imágenes:', error)
      throw error
    }
  }

  // Funciones para PDF
  const handleQuickPDF = async () => {
    try {
      setLoading(true)
      let options = { ...pdfOptions }
      
      // Configurar para PDF completo de stock
      options.title = 'Listado de Stock'
      options.filterByStock = false
      options.includeVariants = true
      options.includeImages = false

      await generateProductsPDF(filteredProductos, options)
      setSuccess('PDF generado exitosamente')
    } catch (error: any) {
      setError('Error al generar PDF: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Valor total del inventario
  const valorTotalInventario = useMemo(() => {
    return formatPrice(
      productos.reduce((sum, p) => sum + (toNum(p.precio_venta) * toNum(p.stock)), 0)
    )
  }, [productos])

  // Función para mostrar listado completo de productos con variantes
  const handleShowCompleteList = async () => {
    try {
      setLoading(true)
      
      // Obtener todos los productos (incluyendo inactivos) para el listado completo
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/productos?incluirInactivos=true`)
      if (!response.ok) {
        throw new Error('Error al obtener productos')
      }
      
      const todosLosProductos = await response.json()
      
      // Crear un producto virtual que contenga todas las variantes de todos los productos
      const allVariants = todosLosProductos.flatMap((producto: any) => 
        producto.variantes?.map((variante: any) => ({
          ...variante,
          producto_descripcion: producto.descripcion,
          producto_id: producto.id_producto,
          categoria: producto.categoria?.nombre_categoria,
          proveedor: producto.proveedor?.nombre,
          // Asegurar que las variantes tengan precios del producto si no los tienen
          precio_venta: variante.precio_venta || producto.precio_venta || 0,
          precio_compra: variante.precio_compra || producto.precio_compra || 0
        })) || []
      )
      
      console.log('🔍 Productos totales:', todosLosProductos.length)
      console.log('🔍 Productos con variantes:', todosLosProductos.filter((p: any) => p.variantes && p.variantes.length > 0).length)
      console.log('🔍 Variantes totales encontradas:', allVariants.length)

      const virtualProduct: any = {
        id_producto: 0,
        descripcion: 'Listado Completo de Variantes',
        variantes: allVariants,
        categoria: { nombre_categoria: 'Todas las categorías' },
        proveedor: { nombre: 'Todos los proveedores' }
      }

      setSelectedProductVariants(virtualProduct)
      setShowVariantsModal(true)
    } catch (error) {
      console.error('❌ Error al cargar listado completo:', error)
      setError('Error al cargar el listado completo de variantes')
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Valor Total de Inventario</h1>
          <p className="text-gray-600">Administra el inventario de productos con variantes e imágenes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShowCompleteList}
            className="btn-secondary"
            disabled={loading}
          >
            <Package className="h-4 w-4 mr-2" />
            Ver Listado Completo
          </button>
          <button
            onClick={() => handleQuickPDF()}
            className="btn-secondary"
            disabled={loading}
          >
            <FileText className="h-4 w-4 mr-2" />
            Imprimir Stock
          </button>
          <div className="border-l border-gray-300 h-8 mx-2"></div>
          <div className="flex items-center gap-2">
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


      {/* Valor Total del Inventario */}
      <div className="card">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-12 w-12 text-purple-600" />
            </div>
            <div className="ml-6">
              <dl>
                <dt className="text-lg font-medium text-gray-500">
                  Valor Total del Inventario
                </dt>
                <dd className="text-3xl font-bold text-gray-900">
                  {valorTotalInventario}
                </dd>
              </dl>
            </div>
          </div>
        </div>
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

      {/* Filtros adicionales */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filtros:</label>
          </div>
          
          {/* Filtro por Stock */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Stock:</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | 'critical' | 'low')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="critical">Crítico (≤ stock seguridad)</option>
              <option value="low">Bajo (≤ 2x stock seguridad)</option>
            </select>
          </div>

          {/* Filtro por Temporada */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Temporada:</label>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value as 'all' | 'verano' | 'invierno' | 'otono' | 'primavera' | 'todas-las-temporadas')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="verano">Verano</option>
              <option value="invierno">Invierno</option>
              <option value="otono">Otoño</option>
              <option value="primavera">Primavera</option>
              <option value="todas-las-temporadas">Todas las temporadas</option>
            </select>
          </div>

          {/* Botón para gestionar temporadas */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTemporadaModal(true)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300"
              title="Gestionar temporadas"
            >
              ⚙️ Temporadas
            </button>
          </div>

          {/* Contador de resultados */}
          <div className="ml-auto">
            <span className="text-sm text-gray-500">
              {filteredProductos.length} de {productos.length} productos
            </span>
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
                        {formatPrice(toNum(producto.precio_venta))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Compra: {formatPrice(toNum(producto.precio_compra))}
                      </div>
                    </div>
                  </td>
                  
                  {/* Stock */}
                  <td className="px-3 py-4">
                    <div className="text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockColor(
                        toNum(producto.stock), 
                        toNum(producto.stock_seguridad)
                      )}`}>
                        {toNum(producto.stock)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Seg: {toNum(producto.stock_seguridad)}
                      </div>
                    </div>
                  </td>
                  
                  {/* Variantes e Imágenes */}
                  <td className="px-3 py-4">
                    <button
                      onClick={() => {
                        setSelectedProductVariants(producto)
                        setShowVariantsModal(true)
                      }}
                      className="text-center space-y-1 w-full hover:bg-gray-50 rounded p-2 transition-colors"
                      title="Ver detalles de variantes"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <Package className="h-3 w-3 text-blue-500" />
                        <span className="text-sm text-gray-900">
                          {producto.variantes?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Image className="h-3 w-3 text-purple-500" />
                        <span className="text-xs text-gray-500">
                          {producto.imagenes?.length || 0}
                        </span>
                        {producto.imagenes && producto.imagenes.length > 0 && (
                          <div className="flex space-x-1">
                            {producto.imagenes.slice(0, 3).map((img, index) => (
                              <img
                                key={index}
                                src={`http://localhost:4000${img.ruta}`}
                                alt={`Imagen ${index + 1}`}
                                className="w-8 h-8 object-cover rounded border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ))}
                            {producto.imagenes.length > 3 && (
                              <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center text-xs">
                                +{producto.imagenes.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
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
                        onClick={() => handleEditImages(producto)}
                        className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                        title="Editar imágenes"
                      >
                        <Image className="h-4 w-4" />
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
              
              <form data-form-type="add-product" onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                
                // Validar variantes antes de continuar
                if (variantes.length > 0 && getVariantesValidas().length === 0) {
                  setError('Debe completar al menos una variante válida o eliminar todas las variantes.')
                  return
                }
                
                // Solo incluir variantes válidas
                const variantesValidas = getVariantesValidas()
                
                const productoData: ProductoCreate = {
                  descripcion: (formData.get('descripcion') as string) || '',
                  id_proveedor: toNum(formData.get('id_proveedor')),
                  id_categoria: toNum(formData.get('id_categoria')),
                  stock: variantes.length > 0 ? stockTotalVariantes : toNum(formData.get('stock')),
                  precio_venta: toNum(formData.get('precio_venta')),
                  precio_compra: toNum(formData.get('precio_compra')),
                  stock_seguridad: toNum(formData.get('stock_seguridad')),
                  estado: toEstado(formData.get('estado') as string),
                  variantes: variantesValidas.length > 0 ? variantesValidas.map(v => ({
                    id_talle: v.id_talle,
                    id_color: v.id_color,
                    stock: v.stock,
                    precio_venta: v.precio_venta
                  })) : undefined,
                  imagenes: [] // Las imágenes se suben por separado
                }
                
                console.log('📤 Enviando producto con variantes e imágenes:', productoData)
                console.log('📊 Tipos de datos:', {
                  descripcion: typeof productoData.descripcion,
                  id_proveedor: typeof productoData.id_proveedor,
                  id_categoria: typeof productoData.id_categoria,
                  stock: typeof productoData.stock,
                  precio_venta: typeof productoData.precio_venta,
                  precio_compra: typeof productoData.precio_compra,
                  stock_seguridad: typeof productoData.stock_seguridad,
                  estado: typeof productoData.estado,
                  variantes: Array.isArray(productoData.variantes),
                  imagenes: Array.isArray(productoData.imagenes)
                })
                console.log('🔍 Variantes válidas encontradas:', variantesValidas)
                console.log('🔍 Estado de variantes:', {
                  total: variantes.length,
                  validas: variantesValidas.length,
                  variantes: variantes
                })
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
                      <label className="block text-sm font-medium text-gray-700">Temporada *</label>
                      <select
                        name="temporada"
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar temporada</option>
                        <option value="verano">Verano</option>
                        <option value="invierno">Invierno</option>
                        <option value="otono">Otoño</option>
                        <option value="primavera">Primavera</option>
                        <option value="todas-las-temporadas">Todas las temporadas</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock {variantes.length > 0 ? '(Calculado automáticamente)' : '*'}
                      </label>
                      <input
                        type="number"
                        name="stock"
                        className={`input-field ${variantes.length > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        required={variantes.length === 0}
                        disabled={variantes.length > 0}
                        min="0"
                        placeholder="50"
                        defaultValue={variantes.length > 0 ? stockTotalVariantes : ''}
                        readOnly={variantes.length > 0}
                      />
                      {variantes.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Stock total: {stockTotalVariantes} (suma de variantes)
                        </p>
                      )}
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
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">Variantes del Producto</h4>
                      <button
                        type="button"
                        onClick={addVariante}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Variante
                      </button>
                    </div>

                    {variantes.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No hay variantes configuradas</p>
                        <p className="text-gray-400 text-xs mt-1">Haz clic en "Agregar Variante" para comenzar</p>
                      </div>
                    )}

                    {/* Contenedor con scroll para variantes */}
                    <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                      {variantes.map((variante, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          {/* Header de la variante */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-700">Variante {index + 1}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariante(index)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Eliminar variante"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Campos principales en grid mejorado */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Talla</label>
                              <select
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={variante.id_tipo_talle ?? 0}
                                onChange={(e) => updateVariante(index, 'id_tipo_talle', toNum(e.target.value))}
                              >
                                <option value={0}>Seleccionar tipo de talle</option>
                                {tiposTalle.map(tipo => (
                                  <option key={tipo.id_tipo_talle} value={tipo.id_tipo_talle}>
                                    {tipo.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                              <select
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={variante.id_talle}
                                onChange={(e) => updateVariante(index, 'id_talle', toNum(e.target.value))}
                                required
                              >
                                <option value={0}>Seleccionar talla</option>
                                {getTallasPorVariante(variante).map(talla => (
                                  <option key={talla.id_talla} value={talla.id_talla}>
                                    {talla.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                              <select
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={variante.id_color}
                                onChange={(e) => updateVariante(index, 'id_color', toNum(e.target.value))}
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
                              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={variante.stock}
                                onChange={(e) => updateVariante(index, 'stock', toNum(e.target.value))}
                                min="0"
                                required
                                placeholder="0"
                              />
                            </div>
                          </div>
                          
                          {/* Precio de venta en una fila separada */}
                          <div className="border-t border-gray-100 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Venta (Opcional)</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={variante.precio_venta}
                                onChange={(e) => updateVariante(index, 'precio_venta', toNum(e.target.value))}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Si no se especifica, se usará el precio del producto</p>
                          </div>
                          
                          {/* Indicador de validación mejorado */}
                          {!isVarianteValida(variante) && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center">
                                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-sm text-red-700">Complete todos los campos requeridos</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Resumen de variantes mejorado */}
                    {variantes.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-800">
                              Resumen de Variantes
                            </span>
                          </div>
                          <div className="text-sm font-medium text-blue-700">
                            {getVariantesValidas().length} de {variantes.length} válidas
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-gray-600">Stock total: <strong className="text-gray-800">{stockTotalVariantes}</strong></span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${getVariantesValidas().length === variantes.length ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-gray-600">
                              {getVariantesValidas().length === variantes.length ? 'Todas las variantes están completas' : 'Algunas variantes necesitan completarse'}
                            </span>
                          </div>
                        </div>
                        
                        {hasDupVariantes() && (
                          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                            <div className="flex items-center text-red-700">
                              <XCircle className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Hay variantes duplicadas (misma talla y color)</span>
                            </div>
                          </div>
                        )}
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
                    onClick={handleCloseModals}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={
                      (variantes.length > 0 && getVariantesValidas().length === 0) ||
                      hasDupVariantes()
                    }
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
                
                // Validar variantes antes de continuar
                if (variantes.length > 0 && getVariantesValidas().length === 0) {
                  setError('Debe completar al menos una variante válida o eliminar todas las variantes.')
                  return
                }
                
                // Solo incluir variantes válidas
                const variantesValidas = getVariantesValidas()
                
                // Las imágenes se suben por separado, no se incluyen en la actualización del producto
                
                const productoData: ProductoUpdate = {
                  descripcion: formData.get('descripcion') as string,
                  id_proveedor: toNum(formData.get('id_proveedor')),
                  id_categoria: toNum(formData.get('id_categoria')),
                  stock: variantes.length > 0 ? stockTotalVariantes : toNum(formData.get('stock')),
                  precio_venta: toNum(formData.get('precio_venta')),
                  precio_compra: toNum(formData.get('precio_compra')),
                  stock_seguridad: toNum(formData.get('stock_seguridad')),
                  estado: toEstado(formData.get('estado') as string),
                  variantes: variantesValidas.length > 0 ? variantesValidas as ProductoVarianteCreate[] : undefined
                }
                
                console.log('📤 Actualizando producto con variantes e imágenes:', productoData)
                handleUpdate(productoData)
              }}>
                <div className="grid grid-cols-3 gap-4">
                  {/* Columna Izquierda - Datos Básicos */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción *</label>
                      <input
                        type="text"
                        name="descripcion"
                        defaultValue={editingProducto.descripcion}
                        className="input-field"
                        required
                        placeholder="Camiseta Básica"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoría *</label>
                      <select
                        name="id_categoria"
                        defaultValue={editingProducto.id_categoria}
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
                        defaultValue={editingProducto.id_proveedor}
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
                      <label className="block text-sm font-medium text-gray-700">Temporada *</label>
                      <select
                        name="temporada"
                        defaultValue={(editingProducto as any).temporada || ''}
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar temporada</option>
                        <option value="verano">Verano</option>
                        <option value="invierno">Invierno</option>
                        <option value="otono">Otoño</option>
                        <option value="primavera">Primavera</option>
                        <option value="todas-las-temporadas">Todas las temporadas</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock del Producto</label>
                      <input
                        type="number"
                        name="stock"
                        defaultValue={editingProducto.stock}
                        min="0"
                        className={`input-field ${variantes.length > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        disabled={variantes.length > 0}
                        required={variantes.length === 0}
                      />
                      {variantes.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Stock calculado automáticamente: {stockTotalVariantes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Columna Central - Precios */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Precio de Venta *</label>
                      <input
                        type="number"
                        name="precio_venta"
                        defaultValue={editingProducto.precio_venta}
                        step="0.01"
                        min="0"
                        className="input-field"
                        required
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Precio de Compra *</label>
                      <input
                        type="number"
                        name="precio_compra"
                        defaultValue={editingProducto.precio_compra}
                        step="0.01"
                        min="0"
                        className="input-field"
                        required
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock de Seguridad</label>
                      <input
                        type="number"
                        name="stock_seguridad"
                        defaultValue={editingProducto.stock_seguridad}
                        min="0"
                        className="input-field"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estado</label>
                      <select
                        name="estado"
                        defaultValue={editingProducto.estado}
                        className="input-field"
                      >
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                      </select>
                    </div>
                  </div>

                  {/* Columna Derecha - Variantes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">Variantes</h4>
                      <button
                        type="button"
                        onClick={addVariante}
                        className="btn-secondary text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </button>
                    </div>

                    {variantes.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                        No hay variantes. El producto usará el stock general.
                      </div>
                    )}

                    {/* Contenedor con scroll para variantes */}
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                      {variantes.map((variante, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-gray-700 flex items-center">
                              <Package className="h-4 w-4 mr-2 text-blue-500" />
                              Variante {index + 1}
                            </h5>
                            <button
                              type="button"
                              onClick={() => removeVariante(index)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                              title="Eliminar variante"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Grid compacto para los campos */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Tipo de Talla
                              </label>
                              <select
                                value={variante.id_tipo_talle || 0}
                                onChange={(e) => updateVariante(index, 'id_tipo_talle', +e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={0}>Seleccionar</option>
                                {tiposTalle.map(tipo => (
                                  <option key={tipo.id_tipo_talle} value={tipo.id_tipo_talle}>
                                    {tipo.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Talla
                              </label>
                              <select
                                value={variante.id_talle}
                                onChange={(e) => updateVariante(index, 'id_talle', +e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={0}>Seleccionar</option>
                                {getTallasPorVariante(variante).map(talla => (
                                  <option key={talla.id_talla} value={talla.id_talla}>
                                    {talla.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Color
                              </label>
                              <select
                                value={variante.id_color}
                                onChange={(e) => updateVariante(index, 'id_color', +e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={0}>Seleccionar</option>
                                {colores.map(color => (
                                  <option key={color.id_color} value={color.id_color}>
                                    {color.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Stock
                              </label>
                              <input
                                type="number"
                                value={variante.stock}
                                onChange={(e) => updateVariante(index, 'stock', toNum(e.target.value))}
                                min="0"
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div className="mt-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Precio de Venta
                            </label>
                            <input
                              type="number"
                              value={variante.precio_venta}
                              onChange={(e) => updateVariante(index, 'precio_venta', toNum(e.target.value))}
                              step="0.01"
                              min="0"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </div>

                          {!isVarianteValida(variante) && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded flex items-center">
                              <XCircle className="h-3 w-3 mr-1" />
                              Variante incompleta: selecciona talla, color y stock
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {variantes.length > 0 && (
                      <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                            <span><strong>Resumen:</strong> {getVariantesValidas().length} de {variantes.length} variantes válidas</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Stock total: {stockTotalVariantes}
                          </div>
                        </div>
                        {hasDupVariantes() && (
                          <div className="text-red-600 mt-2 text-xs flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            Hay variantes duplicadas (misma talla y color)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={
                      (variantes.length > 0 && getVariantesValidas().length === 0) ||
                      hasDupVariantes()
                    }
                  >
                    Actualizar Producto
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
          <div className="relative top-10 mx-auto p-5 border w-6/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <button
                  onClick={() => setShowCategoriaModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Layout de dos columnas */}
              <div className="grid grid-cols-2 gap-6">
                {/* Columna izquierda: Formulario */}
                <div className="border-r border-gray-200 pr-6">
              
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
                
                {/* Columna derecha: Lista de categorías */}
                <div className="pl-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Categorías Existentes</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {categorias.length === 0 ? (
                      <p className="text-gray-500 text-sm">No hay categorías creadas</p>
                    ) : (
                      categorias.map((categoria) => (
                        <div key={categoria.id_categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{categoria.nombre_categoria}</h5>
                            <p className="text-sm text-gray-600 mt-1">{categoria.descripcion}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                              categoria.estado === 'ACTIVO' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {categoria.estado}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingCategoria(categoria)
                                setCategoriaForm({
                                  nombre_categoria: categoria.nombre_categoria,
                                  descripcion: categoria.descripcion,
                                  estado: categoria.estado?.toLowerCase() || 'activo'
                                })
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Editar categoría"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCategoriaDelete(categoria.id_categoria)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Eliminar categoría"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Proveedor */}
      {showProveedorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-6/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h3>
                <button
                  onClick={() => setShowProveedorModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Layout de dos columnas */}
              <div className="grid grid-cols-2 gap-6">
                {/* Columna izquierda: Formulario */}
                <div className="border-r border-gray-200 pr-6">
              
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
                
                {/* Columna derecha: Lista de proveedores */}
                <div className="pl-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Proveedores Existentes</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {proveedores.length === 0 ? (
                      <p className="text-gray-500 text-sm">No hay proveedores creados</p>
                    ) : (
                      proveedores.map((proveedor) => (
                        <div key={proveedor.id_proveedor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{proveedor.nombre}</h5>
                            {proveedor.contacto && (
                              <p className="text-sm text-gray-600 mt-1">Contacto: {proveedor.contacto}</p>
                            )}
                            {proveedor.email && (
                              <p className="text-sm text-gray-600">Email: {proveedor.email}</p>
                            )}
                            {proveedor.telefono && (
                              <p className="text-sm text-gray-600">Tel: {proveedor.telefono}</p>
                            )}
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                              proveedor.estado === 'ACTIVO' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {proveedor.estado}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingProveedor(proveedor)
                                setProveedorForm({
                                  nombre: proveedor.nombre,
                                  contacto: proveedor.contacto || '',
                                  direccion: proveedor.direccion || '',
                                  telefono: proveedor.telefono || '',
                                  email: proveedor.email || '',
                                  estado: proveedor.estado?.toLowerCase() || 'activo'
                                })
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Editar proveedor"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleProveedorDelete(proveedor.id_proveedor)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Eliminar proveedor"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Imágenes */}
      {showEditImagesModal && editingProducto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Editar Imágenes - {editingProducto.descripcion}
              </h3>
              
              <div className="space-y-4">
                {/* Imágenes existentes */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Imágenes Actuales</h4>
                  {imagenesPreview.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">
                      No hay imágenes cargadas
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {imagenesPreview.map((preview, index) => (
                        <div key={index} className="relative border rounded-lg p-2">
                          <img
                            src={preview.startsWith('blob:') ? preview : `http://localhost:4000${preview}`}
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cargar nuevas imágenes */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Agregar Nuevas Imágenes</h4>
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
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (imagenes.length > 0) {
                        await uploadImagesToServer(editingProducto.id_producto, true) // true = reemplazar existentes
                        setSuccess('Imágenes actualizadas correctamente')
                        // Limpiar las imágenes después de subirlas exitosamente
                        setImagenes([])
                        setImagenesPreview([])
                        cargarDatos()
                        handleCloseModals()
                      } else {
                        setError('No hay nuevas imágenes para subir')
                      }
                    } catch (error: any) {
                      setError('Error al subir imágenes: ' + error.message)
                    }
                  }}
                  className="btn-primary"
                  disabled={imagenes.length === 0}
                >
                  Reemplazar Imágenes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Variantes de Producto */}
      {showVariantsModal && selectedProductVariants && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Variantes de {selectedProductVariants.descripcion}
                </h3>
                <button
                  onClick={() => setShowVariantsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Información del producto */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedProductVariants.id_producto === 0 ? (
                    // Listado completo
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Total de Variantes</h4>
                        <p className="text-2xl font-bold text-blue-600">{selectedProductVariants.variantes?.length || 0}</p>
                        <p className="text-sm text-gray-600">Todas las variantes del inventario</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Productos con Variantes</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {new Set(selectedProductVariants.variantes?.map((v: any) => v.producto_id) || []).size}
                        </p>
                        <p className="text-sm text-gray-600">Productos únicos</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Stock Total</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {selectedProductVariants.variantes?.reduce((sum, v: any) => sum + toNum(v.stock), 0) || 0}
                        </p>
                        <p className="text-sm text-gray-600">Suma de todos los stocks</p>
                      </div>
                    </div>
                  ) : (
                    // Producto individual
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Información del Producto</h4>
                        <p className="text-sm text-gray-600">ID: {selectedProductVariants.id_producto}</p>
                        <p className="text-sm text-gray-600">Categoría: {selectedProductVariants.categoria?.nombre_categoria || 'Sin categoría'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Stock Total</h4>
                        <p className="text-2xl font-bold text-blue-600">{toNum(selectedProductVariants.stock)}</p>
                        <p className="text-sm text-gray-600">Stock Seguridad: {toNum(selectedProductVariants.stock_seguridad)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lista de variantes */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Variantes por Talle y Color</h4>
                  {selectedProductVariants.variantes && selectedProductVariants.variantes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProductVariants.variantes.map((variante: any, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                          {selectedProductVariants.id_producto === 0 && (
                            <div className="mb-3 pb-2 border-b border-gray-100">
                              <div className="text-sm font-medium text-gray-900 truncate" title={variante.producto_descripcion}>
                                {variante.producto_descripcion}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {variante.producto_id} | {variante.categoria} | {variante.proveedor}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {variante.talla?.nombre || 'Sin talle'}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                {variante.color?.nombre || 'Sin color'}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              selectedProductVariants.id_producto === 0 
                                ? (toNum(variante.stock) <= 5 ? 'bg-red-100 text-red-800' : toNum(variante.stock) <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')
                                : (toNum(variante.stock) <= toNum(selectedProductVariants.stock_seguridad)
                                  ? 'bg-red-100 text-red-800'
                                  : toNum(variante.stock) <= (toNum(selectedProductVariants.stock_seguridad) * 2)
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800')
                            }`}>
                              {toNum(variante.stock)} unidades
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Precio Venta:</span>
                              <span className="font-medium text-green-600">
                                {formatPrice(toNum(variante.precio_venta))}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Precio Compra:</span>
                              <span className="font-medium text-blue-600">
                                {formatPrice(toNum(variante.precio_compra || 0))}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Margen:</span>
                              <span className="font-medium text-purple-600">
                                {variante.precio_compra ? ((toNum(variante.precio_venta) - toNum(variante.precio_compra)) / toNum(variante.precio_compra) * 100).toFixed(1) : '0.0'}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No hay variantes</h3>
                      <p className="mt-1 text-sm text-gray-500">Este producto no tiene variantes de talle y color configuradas.</p>
                    </div>
                  )}
                </div>

                {/* Imágenes del producto */}
                {selectedProductVariants.imagenes && selectedProductVariants.imagenes.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Imágenes del Producto</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {selectedProductVariants.imagenes.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`http://localhost:4000${img.ruta}`}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Temporadas */}
      {showTemporadaModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-6/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Gestión de Temporadas
                </h3>
                <button
                  onClick={() => setShowTemporadaModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Layout de dos columnas */}
              <div className="grid grid-cols-2 gap-6">
                {/* Columna izquierda: Formulario */}
                <div className="border-r border-gray-200 pr-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    {editingTemporada ? 'Editar Temporada' : 'Nueva Temporada'}
                  </h4>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleTemporadaSave()
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la Temporada *
                        </label>
                        <input
                          type="text"
                          value={temporadaForm.nombre}
                          onChange={(e) => setTemporadaForm({...temporadaForm, nombre: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                          placeholder="Ej: Verano 2024"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción *
                        </label>
                        <textarea
                          value={temporadaForm.descripcion}
                          onChange={(e) => setTemporadaForm({...temporadaForm, descripcion: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                          required
                          placeholder="Descripción de la temporada..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          value={temporadaForm.estado}
                          onChange={(e) => setTemporadaForm({...temporadaForm, estado: e.target.value})}
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
                        onClick={() => {
                          setShowTemporadaModal(false)
                          setEditingTemporada(null)
                          setTemporadaForm({
                            nombre: '',
                            descripcion: '',
                            estado: 'activo'
                          })
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        {editingTemporada ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Columna derecha: Lista de temporadas */}
                <div className="pl-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Temporadas Existentes</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {temporadas.length === 0 ? (
                      <p className="text-gray-500 text-sm">No hay temporadas creadas</p>
                    ) : (
                      temporadas.map((temporada) => (
                        <div key={temporada.id_temporada} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{temporada.nombre}</h5>
                            <p className="text-sm text-gray-600 mt-1">{temporada.descripcion}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                              temporada.estado === 'ACTIVO' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {temporada.estado}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingTemporada(temporada)
                                setTemporadaForm({
                                  nombre: temporada.nombre,
                                  descripcion: temporada.descripcion || '',
                                  estado: temporada.estado.toLowerCase()
                                })
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Editar temporada"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleTemporadaDelete(temporada.id_temporada)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Eliminar temporada"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Productos
