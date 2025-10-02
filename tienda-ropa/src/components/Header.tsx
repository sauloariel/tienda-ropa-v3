import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, User, ShoppingCart, LogOut } from 'lucide-react';

interface HeaderProps {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onViewChange?: (view: 'tienda' | 'pos' | 'seguimiento') => void;
  currentView?: 'tienda' | 'pos' | 'seguimiento';
  isAuthenticated?: boolean;
  userInfo?: {
    nombre: string;
    apellido: string;
  };
  onSearch?: (query: string) => void;
  categorias?: Array<{
    id_categoria: number;
    nombre_categoria: string;
  }>;
  onCategoryChange?: (categoryId: number | null) => void;
  selectedCategory?: number | null;
  cartItems?: Array<{
    producto: any;
    cantidad: number;
    precioUnitario: number;
  }>;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onLoginClick, 
  onLogoutClick,
  onViewChange, 
  currentView = 'tienda', 
  isAuthenticated = false, 
  userInfo,
  onSearch,
  categorias = [],
  onCategoryChange,
  selectedCategory,
  cartItems = [],
  onCartClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleCategoryClick = (categoryId: number | null) => {
    onCategoryChange?.(categoryId);
    setShowCategories(false);
  };

  // Calcular cantidad total de items en el carrito
  const cartItemsCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

  return (
    <>
      {/* Header Principal */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onViewChange?.('tienda')}
              title="Ir a la página principal (también presiona Escape)"
            >
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MaruchiModa</span>
            </div>

            {/* Barra de búsqueda - Centro */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Iconos de usuario - Derecha */}
            <div className="flex items-center space-x-2">
              {/* Usuario */}
              {isAuthenticated ? (
                <div className="relative" ref={userDropdownRef}>
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
                    title="Mi cuenta"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {userInfo ? `${userInfo.nombre} ${userInfo.apellido}` : 'Usuario'}
                    </span>
                  </button>
                  
                  {/* Dropdown del usuario */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <div className="font-medium">
                            {userInfo ? `${userInfo.nombre} ${userInfo.apellido}` : 'Usuario'}
                          </div>
                          <div className="text-xs text-gray-500">Mi cuenta</div>
                        </div>
                        
                        <button
                          onClick={() => {
                            onLogoutClick?.();
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 mt-1"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => onViewChange?.('pos')}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Iniciar Sesión"
                >
                  <User className="h-5 w-5" />
                </button>
              )}
              
              {/* Carrito */}
              <button 
                onClick={onCartClick}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                title="Ver carrito"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Botón de menú móvil */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4">
              {/* Búsqueda móvil */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
              
              {/* Categorías móviles */}
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    !selectedCategory ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Todas las categorías
                </button>
                {categorias.map(categoria => (
                  <button
                    key={categoria.id_categoria}
                    onClick={() => handleCategoryClick(categoria.id_categoria)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      selectedCategory === categoria.id_categoria ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {categoria.nombre_categoria}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Barra de navegación de categorías */}
      <nav className="bg-gray-50 border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 h-12 overflow-x-auto">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`flex-shrink-0 px-3 py-1 text-sm font-medium transition-colors ${
                !selectedCategory 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Todas las categorías
            </button>
            {categorias.map(categoria => (
              <button
                key={categoria.id_categoria}
                onClick={() => handleCategoryClick(categoria.id_categoria)}
                className={`flex-shrink-0 px-3 py-1 text-sm font-medium transition-colors ${
                  selectedCategory === categoria.id_categoria
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {categoria.nombre_categoria}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
