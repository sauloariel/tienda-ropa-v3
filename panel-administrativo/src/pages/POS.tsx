import React, { useState } from 'react'
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Receipt,
  Calculator,
  CheckCircle,
  DollarSign,
  Banknote,
  QrCode
} from 'lucide-react'
import { crearFactura } from '../services/factura'
import { FacturaRequest, Factura } from '../types/factura.types'
import FacturaModal from '../components/FacturaModal'


interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: string
}

interface CartItem {
  product: Product
  quantity: number
}

const POS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo')
  const [showFacturaModal, setShowFacturaModal] = useState(false)
  const [facturaGenerada, setFacturaGenerada] = useState<Factura | null>(null)
  const [processingFactura, setProcessingFactura] = useState(false)

  // Mock products data
  const products: Product[] = [
    { id: 1, name: 'Camiseta Básica', price: 25.99, stock: 50, category: 'Ropa' },
    { id: 2, name: 'Pantalón Jeans', price: 45.99, stock: 30, category: 'Ropa' },
    { id: 3, name: 'Zapatillas Deportivas', price: 79.99, stock: 25, category: 'Calzado' },
    { id: 4, name: 'Bolso de Cuero', price: 89.99, stock: 15, category: 'Accesorios' },
    { id: 5, name: 'Reloj Elegante', price: 199.99, stock: 10, category: 'Accesorios' },
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getIVA = () => {
    return getTotal() * 0.21
  }

  const getTotalConIVA = () => {
    return getTotal() + getIVA()
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    
    try {
      setProcessingFactura(true)
      
      // Preparar datos para la factura
      const facturaData: FacturaRequest = {
        productos: cart.map(item => ({
          id_producto: item.product.id,
          cantidad: Number(item.quantity),
          precio_unitario: Number(item.product.price),
          subtotal: Number(item.product.price * item.quantity)
        })),
        total: Number(getTotalConIVA()),
        metodo_pago: selectedPaymentMethod,
        cliente_id: undefined
      }

      // Crear factura en el backend
      const response = await crearFactura(facturaData)
      
      if (response.success) {
        setFacturaGenerada(response.factura)
        setShowFacturaModal(true)
        setCart([])
      }
    } catch (error) {
      console.error('Error al crear factura:', error)
      alert('Error al generar la factura. Por favor, intente nuevamente.')
    } finally {
      setProcessingFactura(false)
    }
  }

  const handleFacturaClose = () => {
    setShowFacturaModal(false)
    setFacturaGenerada(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Punto de Venta (POS)</h1>
          <p className="text-gray-600">Gestiona las ventas y transacciones con facturación integrada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="mb-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <span className="text-lg font-bold text-primary-600">
                      ${product.price}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {product.category} • Stock: {product.stock}
                  </div>
                  <button
                    className="btn-primary w-full text-sm py-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(product)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1 inline" />
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                <Receipt className="h-5 w-5 inline mr-2" />
                Carrito
              </h3>
              <span className="text-sm text-gray-500">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>El carrito está vacío</p>
                <p className="text-sm">Agrega productos para comenzar</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ${item.product.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  {/* Resumen de totales */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (21%):</span>
                      <span className="font-medium">${getIVA().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-primary-600">${getTotalConIVA().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="input-field"
                    >
                      <option value="efectivo">💵 Efectivo</option>
                      <option value="tarjeta">💳 Tarjeta</option>
                      <option value="transferencia">🏦 Transferencia</option>
                      <option value="qr">📱 QR/Pago Móvil</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full py-3 text-lg flex items-center justify-center"
                    disabled={cart.length === 0 || processingFactura}
                  >
                    {processingFactura ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Finalizar Venta y Facturar
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Factura */}
      {showFacturaModal && facturaGenerada && (
        <FacturaModal
          isOpen={showFacturaModal}
          onClose={handleFacturaClose}
          factura={facturaGenerada}
        />
      )}
    </div>
  )
}

export default POS

