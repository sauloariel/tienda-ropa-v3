import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: number
  username: string
  role: number
  name: string
  empleado?: {
    nombre: string
    apellido: string
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isVendedor: boolean
  isInventario: boolean
  canAccessModule: (module: string) => boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // Validar que los datos del usuario sean válidos
        if (userData && userData.id && userData.username && userData.role) {
          console.log('Restoring user session from localStorage:', userData)
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          console.log('Invalid user data in localStorage, clearing...')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsInitialized(true)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting to login with backend...')
      
      // Try to connect with real backend first
      const response = await authAPI.login({ usuario: username, passwd: password })
      console.log('Backend response:', response)
      
      // Check different possible response structures
      if (response.data) {
        let userData: User | null = null
        
        // Structure 1: response.data.success with user object
        if (response.data.success && response.data.user) {
          userData = {
            id: response.data.user.id_loguin || response.data.user.id,
            username: response.data.user.usuario || response.data.user.username,
            role: response.data.user.id_rol || response.data.user.role,
            name: response.data.user.empleado ? 
              `${response.data.user.empleado.nombre || ''} ${response.data.user.empleado.apellido || ''}`.trim() :
              response.data.user.nombre || username,
            empleado: response.data.user.empleado
          }
        }
        // Structure 2: direct user object in response.data
        else if (response.data.id_loguin || response.data.id) {
          userData = {
            id: response.data.id_loguin || response.data.id,
            username: response.data.usuario || response.data.username,
            role: response.data.id_rol || response.data.role,
            name: response.data.empleado ? 
              `${response.data.empleado.nombre || ''} ${response.data.empleado.apellido || ''}`.trim() :
              response.data.nombre || username,
            empleado: response.data.empleado
          }
        }
        // Structure 3: array with user object
        else if (Array.isArray(response.data) && response.data.length > 0) {
          const userObj = response.data[0]
          userData = {
            id: userObj.id_loguin || userObj.id,
            username: userObj.usuario || userObj.username,
            role: userObj.id_rol || userObj.role,
            name: userObj.empleado ? 
              `${userObj.empleado.nombre || ''} ${userObj.empleado.apellido || ''}`.trim() :
              userObj.nombre || username,
            empleado: userObj.empleado
          }
        }
        
        if (userData && userData.id && userData.username && userData.role) {
          console.log('Login successful with backend:', userData)
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem('user', JSON.stringify(userData))
          return true
        }
      }
      
      console.log('Backend login failed, trying mock login...')
      
      // Fallback to mock login for development
      if (username === 'admin' && password === 'admin') {
        const mockUser: User = {
          id: 1,
          username: username,
          role: 1, // Admin role
          name: 'Administrador'
        }
        
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(mockUser))
        console.log('Mock admin login successful')
        return true
      }
      
      // Mock login for vendedor
      if (username === 'vendedor' && password === 'vendedor') {
        const mockUser: User = {
          id: 2,
          username: username,
          role: 2, // Vendedor role
          name: 'Vendedor'
        }
        
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(mockUser))
        console.log('Mock vendedor login successful')
        return true
      }
      
      // Mock login for inventario
      if (username === 'inventario' && password === 'inventario') {
        const mockUser: User = {
          id: 3,
          username: username,
          role: 3, // Inventario role
          name: 'Inventario'
        }
        
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(mockUser))
        console.log('Mock inventario login successful')
        return true
      }
      
      console.log('All login attempts failed')
      return false
      
    } catch (error) {
      console.error('Login error:', error)
      
      // Fallback to mock login for development when backend is not available
      if (username === 'admin' && password === 'admin') {
        const mockUser: User = {
          id: 1,
          username: username,
          role: 1, // Admin role
          name: 'Administrador'
        }
        
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(mockUser))
        console.log('Mock admin login successful (backend error)')
        return true
      }
      
      if (username === 'vendedor' && password === 'vendedor') {
        const mockUser: User = {
          id: 2,
          username: username,
          role: 2, // Vendedor role
          name: 'Vendedor'
        }
        
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(mockUser))
        console.log('Mock vendedor login successful (backend error)')
        return true
      }
      
      if (username === 'inventario' && password === 'inventario') {
        const mockUser: User = {
          id: 3,
          username: username,
          role: 3, // Inventario role
          name: 'Inventario'
        }
        
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(mockUser))
        console.log('Mock inventario login successful (backend error)')
        return true
      }
      
      return false
    }
  }

  const logout = () => {
    console.log('Logging out user...')
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  const isAdmin = user?.role === 1
  const isVendedor = user?.role === 2
  const isInventario = user?.role === 3

  // Function to check if user can access a specific module
  const canAccessModule = (module: string): boolean => {
    if (!user || !isAuthenticated) {
      console.log(`Access denied to module '${module}': User not authenticated`)
      return false
    }
    
    let hasAccess = false
    switch (module) {
      case 'dashboard':
        hasAccess = true // All authenticated users can access dashboard
        break
      case 'empleados':
        hasAccess = isAdmin // Only admin can access employees
        break
      case 'productos':
        hasAccess = isAdmin || isInventario // Admin and inventory can access products
        break
      case 'clientes':
        hasAccess = isAdmin || isVendedor // Admin and sellers can access clients
        break
      case 'pedidos':
        hasAccess = isAdmin || isVendedor // Admin and sellers can access orders
        break
      case 'pos':
        hasAccess = isAdmin || isVendedor // Admin and sellers can access POS
        break
      default:
        hasAccess = false
    }
    
    console.log(`Module access check for '${module}': User role ${user.role}, hasAccess: ${hasAccess}`)
    return hasAccess
  }

  // No renderizar hasta que se haya inicializado
  if (!isInitialized) {
    return null
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isVendedor,
    isInventario,
    canAccessModule,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
