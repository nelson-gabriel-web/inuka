import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection />

      {/* Call to action para visitantes não autenticados */}
      {!isAuthenticated() && (
        <section className="py-8 bg-black border-t border-white/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3">
              Gerencie seu negócio com INUKA
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto mb-5">
              Organize clientes, encomendas e comissões numa só plataforma.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
  onClick={() => window.location.href = '/register'}
  className="bg-[#c9a84c] text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-[#d4a017] transition"
>
  Registar-se
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