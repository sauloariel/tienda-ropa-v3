import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, User, Lock, AlertCircle } from 'lucide-react'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    console.log('📝 Formulario enviado con:', { usuario: username, password: '***' })

    try {
      console.log('🔐 Llamando a la función login del contexto...')
      await login({ usuario: username, password })
      console.log('✅ Login completado exitosamente')
      // El login ya maneja la navegación internamente
    } catch (err: any) {
      console.error('❌ Error en el formulario de login:', err)
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'Admin' | 'Vendedor' | 'Inventario' | 'Marketing') => {
      setIsLoading(true);
      
      const demoCredentials = {
          Admin: { usuario: 'admin', password: 'admin123' },
          Vendedor: { usuario: 'lucia', password: 'lucia123' },
          Inventario: { usuario: 'inventario', password: 'inventario123' },
          Marketing: { usuario: 'marketing', password: 'marketing123' }
      };

      try {
          await login(demoCredentials[role]);
      } catch (error) {
          console.error('Error en demo login:', error);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Panel Administrativo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inicia sesión para acceder al sistema
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

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
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          {/* Credenciales de Prueba */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Credenciales de Prueba</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {/* Admin */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Administrador</h4>
                    <p className="text-xs text-red-600">Acceso completo a todos los módulos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">Usuario: <span className="font-mono">admin</span></p>
                    <p className="text-xs text-red-600">Contraseña: <span className="font-mono">admin</span></p>
                  </div>
                </div>
              </div>

              {/* Vendedor */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Vendedor</h4>
                    <p className="text-xs text-blue-600">POS, Pedidos y Clientes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Usuario: <span className="font-mono">lucia</span></p>
                    <p className="text-xs text-blue-600">Contraseña: <span className="font-mono">lucia123</span></p>
                  </div>
                </div>
              </div>

              {/* Inventario */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Inventario</h4>
                    <p className="text-xs text-green-600">Solo módulo de Productos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Usuario: <span className="font-mono">inventario</span></p>
                    <p className="text-xs text-green-600">Contraseña: <span className="font-mono">inventario123</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Estas credenciales son solo para desarrollo. En producción, usa tu cuenta real del backend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
