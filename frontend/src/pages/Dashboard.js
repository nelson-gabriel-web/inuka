import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { revendedor, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalEncomendas: 0,
    comissoesPendentes: 0,
    encomendasPendentes: 0,
  });
  const [ultimasEncomendas, setUltimasEncomendas] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    carregarDados();
  }, [revendedor]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://inuka-6576.onrender.com/api/encomendas/revendedor/${revendedor.id}/`
      );
      
      const encomendas = response.data.encomendas || [];
      setUltimasEncomendas(encomendas.slice(0, 5));
      
      const total = encomendas.length;
      const pendentes = encomendas.filter(e => e.status === 'pendente').length;
      const comissoes = encomendas.reduce((acc, e) => acc + parseFloat(e.comissao_total_mzn || e.comissao_total || 0), 0);
      
      const clientesResponse = await axios.get(
        `https://inuka-6576.onrender.com/api/clientes/revendedor/${revendedor.id}/`
      );
      
      setStats({
        totalClientes: clientesResponse.data.clientes?.length || 0,
        totalEncomendas: total,
        comissoesPendentes: comissoes,
        encomendasPendentes: pendentes,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    }
    setLoading(false);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pendente': 'Pendente',
      'paga': 'Paga',
      'entregue': 'Entregue',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'text-yellow-400',
      'paga': 'text-green-400',
      'entregue': 'text-blue-400',
      'cancelada': 'text-red-400'
    };
    return colors[status] || 'text-white/40';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a84c] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header com nome do revendedor */}
        <div className="border-b border-white/5 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h1 className="text-base sm:text-lg font-medium text-white">
            Olá, <span className="text-[#c9a84c]">{revendedor?.nome_completo?.split(' ')[0]}</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-white/30">Dashboard</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-wider">Clientes</p>
            <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalClientes}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-wider">Encomendas</p>
            <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalEncomendas}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-wider">Pendentes</p>
            <p className="text-lg sm:text-2xl font-bold text-yellow-400">{stats.encomendasPendentes}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-wider">Comissões</p>
            <p className="text-lg sm:text-2xl font-bold text-[#c9a84c]">MT {stats.comissoesPendentes.toFixed(2)}</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button 
            onClick={() => navigate('/clientes')}
            className="bg-[#c9a84c] text-black text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-[#d4a017] transition shadow-lg shadow-[#c9a84c]/20"
          >
            Clientes
          </button>
          <button 
            onClick={() => navigate('/encomendas')}
            className="border border-[#c9a84c]/50 text-[#c9a84c] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-[#c9a84c]/10 transition"
          >
            Encomendas
          </button>
          <button 
            onClick={() => navigate('/produtos')}
            className="bg-white/5 border border-white/10 text-white/70 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium hover:border-[#c9a84c]/50 transition"
          >
            Produtos
          </button>
          <button 
            onClick={() => navigate('/comissoes')}
            className="bg-white/5 border border-white/10 text-white/70 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium hover:border-[#c9a84c]/50 transition"
          >
            Comissões
          </button>
        </div>

        {/* Últimas Encomendas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-medium text-white/60">Últimas Encomendas</h2>
            <button 
              onClick={() => navigate('/encomendas')}
              className="text-[8px] sm:text-[10px] text-[#c9a84c] hover:text-[#d4a017] transition uppercase tracking-wider"
            >
              Ver Todas
            </button>
          </div>

          {ultimasEncomendas.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-lg p-4 sm:p-6 text-center">
              <p className="text-[10px] sm:text-xs text-white/30">Nenhuma encomenda criada ainda</p>
              <button 
                onClick={() => navigate('/encomendas')}
                className="mt-3 bg-[#c9a84c] text-black text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full hover:bg-[#d4a017] transition"
              >
                Criar Encomenda
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {ultimasEncomendas.map((encomenda) => (
                <div key={encomenda.id} className="bg-white/5 border border-white/5 rounded-lg p-2.5 sm:p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">
                      #{encomenda.id} - {encomenda.cliente}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-white/30">
                      {new Date(encomenda.data_criacao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs sm:text-sm font-bold text-white">MT {parseFloat(encomenda.valor_total_mzn || encomenda.valor_total || 0).toFixed(2)}</p>
                    <p className={`text-[8px] sm:text-[10px] ${getStatusColor(encomenda.status)}`}>
                      {getStatusLabel(encomenda.status)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;