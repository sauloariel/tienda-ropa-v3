import React, { useState, useEffect } from 'react';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { User, Lock, Mail, UserPlus, ShoppingCart } from 'lucide-react';
import ForgotPassword from './ForgotPassword';

const ClientLogin: React.FC = () => {
  const { login, register, isLoading, error } = useClientAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    mail: '',
    password: '',
    dni: '',
    cuit_cuil: '',
    nombre: '',
    apellido: '',
    domicilio: '',
    telefono: ''
  });
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoginMode) {
      await login(formData.mail, formData.password);
    } else {
      // Excluir dni y cuit_cuil del registro ya que el backend los genera automáticamente
      const { dni, cuit_cuil, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success && result.needsVerification) {
        setShowVerificationMessage(true);
      }
    }
  };


  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // Manejar tecla Escape para ir a la página principal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('🔙 Tecla Escape presionada en login - yendo a página principal');
        // Aquí podrías agregar lógica para ir a la página principal
        // Por ahora solo mostramos un mensaje
        console.log('ℹ️ Para ir a la página principal, haz clic en "MaruchiModa" en el header');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      mail: '',
      password: '',
      dni: '',
      cuit_cuil: '',
      nombre: '',
      apellido: '',
      domicilio: '',
      telefono: ''
    });
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLoginMode ? 'Inicia Sesión' : 'Regístrate'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLoginMode 
              ? 'Accede a tu cuenta para continuar' 
              : 'Crea tu cuenta para comenzar a comprar'
            }
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Presiona <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Escape</kbd> o haz clic en <strong>MaruchiModa</strong> para volver a la tienda
          </p>
        </div>

        {/* Mensaje de verificación de email */}
        {showVerificationMessage && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  ¡Registro exitoso!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Te hemos enviado un email de verificación a <strong>{formData.mail}</strong>. 
                    Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      onClick={() => setShowVerificationMessage(false)}
                      className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="mail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="mail"
                  name="mail"
                  type="email"
                  required
                  value={formData.mail}
                  onChange={handleInputChange}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Tu contraseña"
                />
              </div>
              {/* Forgot Password Link - Solo en modo login */}
              {isLoginMode && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>

            {/* Campos adicionales para registro */}
            {!isLoginMode && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Nombre"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                      Apellido
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        required
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Apellido"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono (opcional)
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="11-1234-5678"
                  />
                </div>

                <div>
                  <label htmlFor="domicilio" className="block text-sm font-medium text-gray-700">
                    Domicilio (opcional)
                  </label>
                  <input
                    id="domicilio"
                    name="domicilio"
                    type="text"
                    value={formData.domicilio}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Calle 123, Ciudad"
                  />
                </div>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>
              ) : (
                <>
                  {isLoginMode ? (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Registrarse
                    </>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                {isLoginMode ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientLogin;