import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  UserCheck, 
  CreditCard,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isAdmin, isVendedor, isInventario, canAccessModule } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Build navigation based on user permissions
  const getNavigation = () => {
    const baseNav = [
      { name: 'Dashboard', href: '/', icon: Home, module: 'dashboard' }
    ]

    // Add modules based on permissions
    if (canAccessModule('productos')) {
      baseNav.push({ name: 'Productos', href: '/productos', icon: Package, module: 'productos' })
    }
    
    if (canAccessModule('clientes')) {
      baseNav.push({ name: 'Clientes', href: '/clientes', icon: Users, module: 'clientes' })
    }
    
    if (canAccessModule('pedidos')) {
      baseNav.push({ name: 'Pedidos', href: '/pedidos', icon: ShoppingCart, module: 'pedidos' })
    }
    
    if (canAccessModule('empleados')) {
      baseNav.push({ name: 'Empleados', href: '/empleados', icon: UserCheck, module: 'empleados' })
    }
    
    if (canAccessModule('pos')) {
      baseNav.push({ name: 'POS', href: '/pos', icon: CreditCard, module: 'pos' })
    }

    return baseNav
  }

  const navigation = getNavigation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get role display name
  const getRoleDisplayName = () => {
    if (isAdmin) return 'Admin'
    if (isVendedor) return 'Vendedor'
    if (isInventario) return 'Inventario'
    return 'Usuario'
  }

  // Get role color
  const getRoleColor = () => {
    if (isAdmin) return 'bg-red-100 text-red-700'
    if (isVendedor) return 'bg-blue-100 text-blue-700'
    if (isInventario) return 'bg-green-100 text-green-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">Panel Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </a>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Panel Administrativo</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </a>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="text-sm text-gray-700">
                Bienvenido, {user?.name}
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRoleColor()}`}>
                  {getRoleDisplayName()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
