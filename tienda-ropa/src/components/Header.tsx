import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User, Heart, ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TiendaRopa</span>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Inicio
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Mujeres
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Hombres
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Niños
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Ofertas
            </a>
          </nav>

          {/* Acciones Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Botón de menú móvil */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Inicio
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Mujeres
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Hombres
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Niños
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Ofertas
              </a>
            </nav>
            
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
