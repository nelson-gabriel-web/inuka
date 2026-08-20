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
        <section className="py-8 bg-black border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <button
                onClick={() => navigate('/clientes')}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:border-[#c9a84c]/50 transition"
              >
                <div className="text-xl mb-1 text-[#c9a84c]">👤</div>
                <span className="text-xs text-white/70">Clientes</span>
              </button>
              <button
                onClick={() => navigate('/encomendas')}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:border-[#c9a84c]/50 transition"
              >
                <div className="text-xl mb-1 text-[#c9a84c]">📋</div>
                <span className="text-xs text-white/70">Encomendas</span>
              </button>
              <button
                onClick={() => navigate('/comissoes')}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:border-[#c9a84c]/50 transition"
              >
                <div className="text-xl mb-1 text-[#c9a84c]">💰</div>
                <span className="text-xs text-white/70">Comissões</span>
              </button>
              <button
                onClick={() => navigate('/products')}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:border-[#c9a84c]/50 transition"
              >
                <div className="text-xl mb-1 text-[#c9a84c]">📦</div>
                <span className="text-xs text-white/70">Produtos</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Call to action para visitantes não autenticados */}
      {!isAuthenticated() && (
        <section className="py-12 bg-black border-t border-white/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl font-medium text-white mb-4">Gerencie seu negócio com INUKA</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
              Organize clientes, encomendas e comissões numa só plataforma.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="bg-[#c9a84c] text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-[#d4a017] transition"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/register')}
                className="border border-white/20 text-white/70 px-6 py-2 rounded-full text-sm font-medium hover:border-[#c9a84c]/50 transition"
              >
                Registar-se
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;