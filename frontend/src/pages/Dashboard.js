import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transacaoService, pedidoService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { revendedor, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const saldoData = await transacaoService.getSaldo(revendedor.id);
      setSaldo(saldoData.saldo);

      const pedidosData = await pedidoService.listarPorRevendedor(revendedor.id);
      setPedidos(pedidosData.pedidos || []);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
    setLoading(false);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'aguardando_separacao': 'Aguardando',
      'em_separacao': 'Em Separação',
      'embalado': 'Embalado',
      'em_transporte': 'Em Trânsito',
      'chegou_loja': 'Chegou à Loja',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'aguardando_separacao': 'text-[#c9a84c]',
      'em_separacao': 'text-[#c9a84c]',
      'embalado': 'text-[#c9a84c]',
      'em_transporte': 'text-[#c9a84c]',
      'chegou_loja': 'text-[#c9a84c]',
      'entregue': 'text-green-400',
      'cancelado': 'text-red-400'
    };
    return colors[status] || 'text-white/40';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a84c] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-white/30 text-sm">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div>
            <h1 className="text-lg font-medium text-white">
              Olá, <span className="text-[#c9a84c]">{revendedor?.nome_completo?.split(' ')[0]}</span>
            </h1>
            <p className="text-xs text-white/30">Dashboard do Revendedor</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Código Único</p>
            <p className="text-xs font-mono text-[#c9a84c]">{revendedor?.codigo_unico}</p>
          </div>
        </div>

        {/* Saldo - Layout compacto */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-wider">ZAR</p>
            <p className="text-lg font-bold text-white">R{saldo?.ZAR?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-wider">MZN</p>
            <p className="text-lg font-bold text-white">{saldo?.MZN?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-wider">USD</p>
            <p className="text-lg font-bold text-white">$ {saldo?.USD?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Informações do Revendedor */}
        <div className="bg-white/5 border border-white/5 rounded-lg p-3 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Nome</p>
              <p className="text-white/80">{revendedor?.nome_completo}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Email</p>
              <p className="text-white/80 text-xs truncate">{revendedor?.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Telefone</p>
              <p className="text-white/80">{revendedor?.telefone}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Loja de Recolha</p>
              <p className="text-white/80 text-xs">{revendedor?.loja_recolha || 'Não definida'}</p>
            </div>
          </div>
        </div>

        {/* Últimos Pedidos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white/60">Últimos Pedidos</h2>
            <button 
              onClick={() => navigate('/products')}
              className="text-[10px] text-[#c9a84c] hover:text-[#d4a017] transition uppercase tracking-wider"
            >
              + Comprar
            </button>
          </div>

          {pedidos.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-lg p-6 text-center">
              <p className="text-xs text-white/30">Nenhum pedido realizado ainda</p>
              <button 
                onClick={() => navigate('/products')}
                className="mt-3 bg-[#c9a84c] text-black text-xs px-4 py-1.5 rounded-full hover:bg-[#d4a017] transition font-medium"
              >
                Fazer Primeiro Pedido
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {pedidos.slice(0, 5).map((pedido) => (
                <div key={pedido.numero_pedido} className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{pedido.numero_pedido}</p>
                    <p className="text-[10px] text-white/30">
                      {new Date(pedido.data_pedido).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{pedido.valor_total} {pedido.moeda}</p>
                    <p className={`text-[10px] ${getStatusColor(pedido.status)}`}>
                      {getStatusLabel(pedido.status)}
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