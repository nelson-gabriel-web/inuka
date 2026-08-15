import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.sucesso) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error(result.erro || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#c9a84c]">
            INUKA
          </h2>
          <p className="mt-1 text-center text-sm text-[#c9a84c]/60 font-light">
            ALWAYS WITH YOU
          </p>
          <h3 className="mt-6 text-center text-xl font-medium text-white">
            Bem-vindo de volta
          </h3>
          <p className="mt-1 text-center text-sm text-white/40">
            Faça login na sua conta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/60">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/60">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-md p-3">
              <p className="text-xs text-white/30 text-center">
                🔒 O seu <span className="text-[#c9a84c]">código único</span> será solicitado apenas para 
                <span className="text-white/60"> compras, pagamentos e levantamentos</span>.
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#c9a84c] hover:bg-[#d4a017] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c9a84c] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'A processar...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-sm text-[#c9a84c] hover:text-[#d4a017] transition">
              Não tem conta? Registre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;