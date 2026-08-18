import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Comissoes = () => {
  const { revendedor, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalComissoes, setTotalComissoes] = useState(0);
  const [totalPendentes, setTotalPendentes] = useState(0);
  const [periodo, setPeriodo] = useState('todos');

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
      const dados = response.data.encomendas || [];
      
      // Filtrar por período
      const dadosFiltrados = filtrarPorPeriodo(dados);
      setEncomendas(dadosFiltrados);
      
      // Calcular totais
      let total = 0;
      let pendentes = 0;
      dadosFiltrados.forEach(e => {
        const comissao = parseFloat(e.comissao_total || 0);
        total += comissao;
        if (e.status === 'pendente') {
          pendentes += comissao;
        }
      });
      setTotalComissoes(total);
      setTotalPendentes(pendentes);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
    setLoading(false);
  };

  const filtrarPorPeriodo = (encomendas) => {
    if (periodo === 'todos') return encomendas;
    
    const agora = new Date();
    const inicio = new Date();
    
    if (periodo === 'mes') {
      inicio.setMonth(agora.getMonth() - 1);
    } else if (periodo === 'semana') {
      inicio.setDate(agora.getDate() - 7);
    }
    
    return encomendas.filter(e => new Date(e.data_criacao) >= inicio);
  };

  // Atualizar quando o período mudar
  useEffect(() => {
    if (encomendas.length > 0) {
      carregarDados();
    }
  }, [periodo]);

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
        {/* Header */}
        <div className="border-b border-white/5 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h1 className="text-base sm:text-lg font-medium text-white">Comissões</h1>
          <p className="text-[10px] sm:text-xs text-white/30">Resumo das suas comissões</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPeriodo('todos')}
            className={`text-xs px-3 py-1 rounded-full transition ${
              periodo === 'todos' ? 'bg-[#c9a84c] text-black' : 'bg-white/5 text-white/30'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setPeriodo('mes')}
            className={`text-xs px-3 py-1 rounded-full transition ${
              periodo === 'mes' ? 'bg-[#c9a84c] text-black' : 'bg-white/5 text-white/30'
            }`}
          >
            Último Mês
          </button>
          <button
            onClick={() => setPeriodo('semana')}
            className={`text-xs px-3 py-1 rounded-full transition ${
              periodo === 'semana' ? 'bg-[#c9a84c] text-black' : 'bg-white/5 text-white/30'
            }`}
          >
            Última Semana
          </button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
            <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-wider">Total de Comissões</p>
            <p className="text-xl sm:text-3xl font-bold text-[#c9a84c]">R$ {totalComissoes.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
            <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-wider">A Receber</p>
            <p className="text-xl sm:text-3xl font-bold text-yellow-400">R$ {totalPendentes.toFixed(2)}</p>
          </div>
        </div>

        {/* Lista de Comissões */}
        <div>
          <h2 className="text-xs sm:text-sm font-medium text-white/60 mb-3">Detalhamento por Encomenda</h2>
          {encomendas.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-lg p-6 text-center">
              <p className="text-sm text-white/30">Nenhuma comissão registrada ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {encomendas.map((encomenda) => (
                <div key={encomenda.id} className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">#{encomenda.id} - {encomenda.cliente}</p>
                    <p className="text-xs text-white/30">
                      {new Date(encomenda.data_criacao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#c9a84c]">R$ {parseFloat(encomenda.comissao_total || 0).toFixed(2)}</p>
                    <p className={`text-xs ${encomenda.status === 'pendente' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {encomenda.status === 'pendente' ? 'A Receber' : 'Recebido'}
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

export default Comissoes;