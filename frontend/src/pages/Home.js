import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const { isAuthenticated, revendedor } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection />

      {/* Acesso rápido para revendedores autenticados */}
      {isAuthenticated() && (
        <section className="py-4 bg-black border-t border-white/5">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-4 gap-2 max-w-xl mx-auto">
      <button
        onClick={() => navigate('/clientes')}
        className="bg-white/5 border border-white/10 rounded-lg p-2 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-lg text-[#c9a84c]">👤</div>
        <span className="text-[10px] text-white/70">Clientes</span>
      </button>
      <button
        onClick={() => navigate('/encomendas')}
        className="bg-white/5 border border-white/10 rounded-lg p-2 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-lg text-[#c9a84c]">📋</div>
        <span className="text-[10px] text-white/70">Encomendas</span>
      </button>
      <button
        onClick={() => navigate('/comissoes')}
        className="bg-white/5 border border-white/10 rounded-lg p-2 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-lg text-[#c9a84c]">💰</div>
        <span className="text-[10px] text-white/70">Comissões</span>
      </button>
      <button
        onClick={() => navigate('/products')}
        className="bg-white/5 border border-white/10 rounded-lg p-2 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-lg text-[#c9a84c]">📦</div>
        <span className="text-[10px] text-white/70">Produtos</span>
      </button>
    </div>
  </div>
</section>
      )}

      {/* Call to action para visitantes não autenticados */}
      {!isAuthenticated() && (
        <section className="py-2 bg-black border-t border-white/5">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-4 gap-1.5 max-w-sm mx-auto">
      <button
        onClick={() => navigate('/clientes')}
        className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-sm text-[#c9a84c]">👤</div>
        <span className="text-[8px] text-white/70">Clientes</span>
      </button>
      <button
        onClick={() => navigate('/encomendas')}
        className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-sm text-[#c9a84c]">📋</div>
        <span className="text-[8px] text-white/70">Encomendas</span>
      </button>
      <button
        onClick={() => navigate('/comissoes')}
        className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-sm text-[#c9a84c]">💰</div>
        <span className="text-[8px] text-white/70">Comissões</span>
      </button>
      <button
        onClick={() => navigate('/products')}
        className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-center hover:border-[#c9a84c]/50 transition"
      >
        <div className="text-sm text-[#c9a84c]">📦</div>
        <span className="text-[8px] text-white/70">Produtos</span>
      </button>
    </div>
  </div>
</section>
      )}
    </div>
  );
};

export default Home;