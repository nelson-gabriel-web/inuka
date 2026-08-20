import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, revendedor, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/5">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-[#c9a84c]">
              INUKA
            </span>
            <span className="text-[8px] sm:text-xs text-[#c9a84c] font-light hidden sm:inline tracking-widest">
              ALWAYS WITH YOU
            </span>
          </Link>

          {/* Navegação Desktop */}
          {/* Navegação Desktop */}
<nav className="hidden md:flex items-center space-x-8">
  <Link to="/" className="text-sm font-medium text-white/60 hover:text-[#c9a84c] transition">
    Home
  </Link>
  {revendedor ? (
    <>
      <Link to="/products" className="text-sm font-medium text-white/60 hover:text-[#c9a84c] transition">
        Produtos
      </Link>
      <Link to="/clientes" className="text-sm font-medium text-white/60 hover:text-[#c9a84c] transition">
        Clientes
      </Link>
      <Link to="/encomendas" className="text-sm font-medium text-white/60 hover:text-[#c9a84c] transition">
        Encomendas
      </Link>
      <Link to="/comissoes" className="text-sm font-medium text-white/60 hover:text-[#c9a84c] transition">
        Comissões
      </Link>
      <Link to="/dashboard" className="text-sm font-medium text-white/60 hover:text-[#c9a84c] transition">
        Dashboard
      </Link>
    </>
  ) : (
    <>
      <Link to="/login" className="text-sm font-medium text-white/60 hover:text-[#c9a84c] transition">
        Entrar
      </Link>
      <Link to="/register" className="text-sm font-medium text-[#c9a84c] hover:text-[#d4a017] transition">
        Registar
      </Link>
    </>
  )}
</nav>

          {/* Ações */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="relative group">
                <button className="p-2 hover:bg-white/5 rounded-full transition flex items-center gap-2 text-white/40 hover:text-white">
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm text-white/60 hidden md:inline">
                    {revendedor?.nome_completo?.split(' ')[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-xl shadow-2xl py-2 hidden group-hover:block">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-white/60 hover:text-[#c9a84c] hover:bg-white/5 transition">
                    Dashboard
                  </Link>
                  <hr className="border-white/5 my-1" />
                  <Link to="/clientes" className="block px-4 py-2 text-sm text-white/60 hover:text-[#c9a84c] hover:bg-white/5 transition">
                    Clientes
                  </Link>
                  <Link to="/encomendas" className="block px-4 py-2 text-sm text-white/60 hover:text-[#c9a84c] hover:bg-white/5 transition">
                    Encomendas
                  </Link>
                  <Link to="/comissoes" className="block px-4 py-2 text-sm text-white/60 hover:text-[#c9a84c] hover:bg-white/5 transition">
                    Comissões
                  </Link>
                  <hr className="border-white/5 my-1" />
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-white/5 rounded-full transition text-white/40 hover:text-white">
                <UserIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;