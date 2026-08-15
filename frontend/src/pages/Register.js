import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { revendedorService } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    documento_tipo: 'BI',
    documento_numero: '',
    data_nascimento: '',
    provincia: '',
    cidade: '',
    bairro: '',
    password: '',
    password_confirm: '',
    loja_recolha: 1
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setLoading(true);
    try {
      const result = await revendedorService.registar(formData);
      toast.success('Registo realizado com sucesso! Verifique seu e-mail.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.erro || 'Erro ao registar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#c9a84c]">
            INUKA
          </h2>
          <p className="mt-1 text-center text-sm text-[#c9a84c]/60 font-light">
            ALWAYS WITH YOU
          </p>
          <h3 className="mt-6 text-center text-xl font-medium text-white">
            Criar conta
          </h3>
          <p className="mt-1 text-center text-sm text-white/40">
            Torne-se um revendedor INUKA
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60">Nome Completo</label>
              <input
                type="text"
                name="nome_completo"
                required
                value={formData.nome_completo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">E-mail</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Telefone</label>
              <input
                type="text"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
                placeholder="+258 82 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Tipo de Documento</label>
              <select
                name="documento_tipo"
                value={formData.documento_tipo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              >
                <option value="BI" className="bg-black">Bilhete de Identidade</option>
                <option value="PASSAPORTE" className="bg-black">Passaporte</option>
                <option value="DIRE" className="bg-black">DIRE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Número do Documento</label>
              <input
                type="text"
                name="documento_numero"
                required
                value={formData.documento_numero}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Data de Nascimento</label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Província</label>
              <input
                type="text"
                name="provincia"
                required
                value={formData.provincia}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Cidade</label>
              <input
                type="text"
                name="cidade"
                required
                value={formData.cidade}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Bairro</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60">Confirmar Password</label>
              <input
                type="password"
                name="password_confirm"
                required
                value={formData.password_confirm}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-[#c9a84c] focus:border-[#c9a84c] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#c9a84c] hover:bg-[#d4a017] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c9a84c] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'A processar...' : 'Registar'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm text-[#c9a84c] hover:text-[#d4a017] transition">
              Já tem conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;