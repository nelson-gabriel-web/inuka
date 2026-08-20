import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    password: '',
    password_confirm: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.password_confirm) {
    toast.error('As passwords não coincidem');
    return;
  }

  if (formData.password.length < 6) {
    toast.error('A password deve ter pelo menos 6 caracteres');
    return;
  }

  setLoading(true);
  try {
    const response = await revendedorService.registar({
      nome_completo: formData.nome_completo,
      email: formData.email,
      password: formData.password
    });
    toast.success('Registo realizado com sucesso!');
    navigate('/login');
  } catch (error) {
    console.error('Erro no registo:', error);
    toast.error(error.response?.data?.erro || 'Erro ao registar');
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-black py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#c9a84c] text-center mb-2">INUKA</h2>
        <p className="text-white/40 text-center text-sm mb-6">Criar conta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Nome Completo *</label>
            <input
              type="text"
              name="nome_completo"
              required
              value={formData.nome_completo}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1">Password *</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1">Confirmar Password *</label>
            <input
              type="password"
              name="password_confirm"
              required
              value={formData.password_confirm}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a84c] text-black py-2 rounded-full font-medium hover:bg-[#d4a017] transition disabled:opacity-50"
          >
            {loading ? 'A processar...' : 'Registar'}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-[#c9a84c] hover:text-[#d4a017] transition">
              Já tem conta? Entrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;