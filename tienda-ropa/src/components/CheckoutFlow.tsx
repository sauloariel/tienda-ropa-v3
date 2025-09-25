import React, { useState } from 'react';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { compraIntegradaService } from '../services/compraIntegradaService';
import { X, User, Lock, Mail, UserPlus, ShoppingCart, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';

interface CartItem {
  producto: any;
  cantidad: number;
  precioUnitario: number;
}

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onSuccess: (numeroPedido: string) => void;
}

type CheckoutStep = 'login' | 'shipping' | 'payment' | 'confirmation';

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onSuccess
}) => {
  const { isAuthenticated, login, register, cliente, logout } = useClientAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('login');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados del formulario de login/registro
  const [authForm, setAuthForm] = useState({
    mail: '',
    password: '',
    nombre: '',
    apellido: '',
    dni: '',
    cuit_cuil: '',
    domicilio: '',
    telefono: ''
  });

  // Estados del formulario de envío
  const [shippingForm, setShippingForm] = useState({
    direccion: '',
    horarioRecepcion: '',
    telefono: '',
    notas: ''
  });

  // Estados del formulario de pago
  const [paymentForm, setPaymentForm] = useState({
    metodo: 'efectivo',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: '',
    nombreTitular: ''
  });

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      let success = false;
      if (isLoginMode) {
        success = await login(authForm.mail, authForm.password);
      } else {
        success = await register(authForm);
      }
      
      if (success) {
        setCurrentStep('shipping');
        // Pre-llenar datos de envío con datos del cliente
        if (cliente) {
          setShippingForm(prev => ({
            ...prev,
            direccion: cliente.domicilio || '',
            telefono: cliente.telefono || ''
          }));
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      if (!cliente) {
        throw new Error('Cliente no autenticado');
      }

      // Preparar datos de la compra
      const compraData = {
        cliente_id: cliente.id_cliente,
        cliente_nombre: `${cliente.nombre} ${cliente.apellido}`.trim(),
        cliente_telefono: shippingForm.telefono || cliente.telefono,
        cliente_email: cliente.mail || undefined,
        direccion_entrega: shippingForm.direccion || undefined,
        horario_recepcion: shippingForm.horarioRecepcion || undefined,
        observaciones: shippingForm.notas || undefined,
        metodo_pago: paymentForm.metodo,
        items: items.map(item => ({
          id_producto: item.producto.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          subtotal: item.precioUnitario * item.cantidad,
          color: item.producto.variantes?.[0]?.color,
          talla: item.producto.variantes?.[0]?.talla
        }))
      };

      // Procesar la compra real
      const resultado = await compraIntegradaService.procesarCompra(compraData);
      
      setCurrentStep('confirmation');
      
      // Mostrar éxito después de 2 segundos
      setTimeout(() => {
        onSuccess(resultado.data.resumen.payment_id || `PED-${Date.now()}`);
        onClose();
        // Resetear formularios
        setCurrentStep('login');
        setAuthForm({
          mail: '',
          password: '',
          nombre: '',
          apellido: '',
          dni: '',
          cuit_cuil: '',
          domicilio: '',
          telefono: ''
        });
        setShippingForm({
          direccion: '',
          horarioRecepcion: '',
          telefono: '',
          notas: ''
        });
        setPaymentForm({
          metodo: 'efectivo',
          numeroTarjeta: '',
          vencimiento: '',
          cvv: '',
          nombreTitular: ''
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Error al procesar la compra. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setAuthForm({
      mail: '',
      password: '',
      nombre: '',
      apellido: '',
      dni: '',
      cuit_cuil: '',
      domicilio: '',
      telefono: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Finalizar Compra</h2>
              <p className="text-gray-600">
                {currentStep === 'login' && 'Inicia sesión o regístrate para continuar'}
                {currentStep === 'shipping' && 'Información de envío'}
                {currentStep === 'payment' && 'Método de pago'}
                {currentStep === 'confirmation' && 'Confirmación del pedido'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {[
              { key: 'login', label: 'Autenticación', icon: User },
              { key: 'shipping', label: 'Envío', icon: MapPin },
              { key: 'payment', label: 'Pago', icon: CreditCard },
              { key: 'confirmation', label: 'Confirmación', icon: CheckCircle }
            ].map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted = ['login', 'shipping', 'payment', 'confirmation'].indexOf(currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Login/Register */}
          {currentStep === 'login' && (
            <div>
              {isAuthenticated ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    ¡Bienvenido, {cliente?.nombre}!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ya estás autenticado. Puedes continuar con tu compra.
                  </p>
                  <div className="space-x-4">
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continuar Compra
                    </button>
                    <button
                      onClick={logout}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cambiar Usuario
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  {/* Campos de registro */}
                  {!isLoginMode && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            value={authForm.nombre}
                            onChange={handleAuthInputChange}
                            required={!isLoginMode}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apellido
                          </label>
                          <input
                            type="text"
                            name="apellido"
                            value={authForm.apellido}
                            onChange={handleAuthInputChange}
                            required={!isLoginMode}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tu apellido"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            DNI
                          </label>
                          <input
                            type="text"
                            name="dni"
                            value={authForm.dni}
                            onChange={handleAuthInputChange}
                            required={!isLoginMode}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="12345678"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            name="telefono"
                            value={authForm.telefono}
                            onChange={handleAuthInputChange}
                            required={!isLoginMode}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+54 9 11 1234-5678"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domicilio
                        </label>
                        <input
                          type="text"
                          name="domicilio"
                          value={authForm.domicilio}
                          onChange={handleAuthInputChange}
                          required={!isLoginMode}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tu dirección"
                        />
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="mail"
                        value={authForm.mail}
                        onChange={handleAuthInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        name="password"
                        value={authForm.password}
                        onChange={handleAuthInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu contraseña"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {isLoginMode ? <User className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        <span>{isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                      </>
                    )}
                  </button>

                  {/* Toggle Mode */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                      <button
                        type="button"
                        onClick={toggleAuthMode}
                        className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {isLoginMode ? 'Regístrate' : 'Inicia sesión'}
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Shipping */}
          {currentStep === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Información de Envío
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Envío
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={shippingForm.direccion}
                  onChange={handleShippingInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Calle, número, piso, departamento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario de Recepción *
                  </label>
                  <select
                    name="horarioRecepcion"
                    value={shippingForm.horarioRecepcion}
                    onChange={handleShippingInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar horario</option>
                    <option value="9:00-12:00">9:00 - 12:00</option>
                    <option value="12:00-15:00">12:00 - 15:00</option>
                    <option value="15:00-18:00">15:00 - 18:00</option>
                    <option value="18:00-21:00">18:00 - 21:00</option>
                    <option value="Cualquier horario">Cualquier horario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={shippingForm.telefono}
                    onChange={handleShippingInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales (Opcional)
                </label>
                <textarea
                  name="notas"
                  value={shippingForm.notas}
                  onChange={handleShippingInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instrucciones especiales para la entrega..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('login')}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continuar al Pago
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payment */}
          {currentStep === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Método de Pago
              </h3>
              
              <div className="space-y-4">
                {[
                  { value: 'efectivo', label: 'Efectivo', icon: '💵' },
                  { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito', icon: '💳' },
                  { value: 'transferencia', label: 'Transferencia Bancaria', icon: '🏦' },
                  { value: 'mercadopago', label: 'MercadoPago', icon: '🛒' }
                ].map((method) => (
                  <label key={method.value} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="metodo"
                      value={method.value}
                      checked={paymentForm.metodo === method.value}
                      onChange={handlePaymentInputChange}
                      className="mr-4"
                    />
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Campos adicionales para tarjeta */}
              {paymentForm.metodo === 'tarjeta' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      name="numeroTarjeta"
                      value={paymentForm.numeroTarjeta}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        name="vencimiento"
                        value={paymentForm.vencimiento}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentForm.cvv}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      name="nombreTitular"
                      value={paymentForm.nombreTitular}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Como aparece en la tarjeta"
                    />
                  </div>
                </div>
              )}

              {/* Resumen del pedido */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Resumen del Pedido</h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.producto.descripcion} x {item.cantidad}
                      </span>
                      <span className="font-medium">
                        ${(item.precioUnitario * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('shipping')}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirmar Pedido</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 'confirmation' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Procesando tu pedido...
              </h3>
              <p className="text-gray-600">
                Por favor espera mientras confirmamos tu compra
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;

