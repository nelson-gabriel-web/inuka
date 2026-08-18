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
  const [showDeposito, setShowDeposito] = useState(false);
  const [showConversao, setShowConversao] = useState(false);
  
  const [depositoData, setDepositoData] = useState({
    metodo: 'MPESA',
    valor: '',
    moeda: 'ZAR'
  });
  
  const [conversaoData, setConversaoData] = useState({
    moeda_origem: 'ZAR',
    moeda_destino: 'USD',
    valor_origem: ''
  });

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

  const handleDeposito = async (e) => {
    e.preventDefault();
    try {
      await transacaoService.depositar({
        revendedor_id: revendedor.id,
        ...depositoData
      });
      toast.success('Depósito registado! Aguarde confirmação.');
      setShowDeposito(false);
      carregarDados();
    } catch (error) {
      toast.error('Erro ao fazer depósito');
    }
  };

  const handleConversao = async (e) => {
    e.preventDefault();
    try {
      await transacaoService.converter({
        revendedor_id: revendedor.id,
        ...conversaoData
      });
      toast.success('Conversão realizada com sucesso!');
      setShowConversao(false);
      carregarDados();
    } catch (error) {
      toast.error('Erro ao converter moeda');
    }
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 sm:pb-4 mb-4 sm:mb-6 gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-medium text-white">
              Olá, <span className="text-[#c9a84c]">{revendedor?.nome_completo?.split(' ')[0]}</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-white/30">Dashboard do Revendedor</p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">Código Único</p>
            <p className="text-[10px] sm:text-xs font-mono text-[#c9a84c] break-all">{revendedor?.codigo_unico}</p>
          </div>
        </div>

        {/* Saldo */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">USD</p>
            <p className="text-sm sm:text-lg font-bold text-white">${saldo?.USD?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">MZN</p>
            <p className="text-sm sm:text-lg font-bold text-white">{saldo?.MZN?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">ZAR</p>
            <p className="text-sm sm:text-lg font-bold text-white">R {saldo?.ZAR?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button 
            onClick={() => setShowDeposito(!showDeposito)}
            className="w-full sm:w-auto bg-[#c9a84c] text-black text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-[#d4a017] transition shadow-lg shadow-[#c9a84c]/20"
          >
            💰 Depositar
          </button>
          <button 
            onClick={() => setShowConversao(!showConversao)}
            className="w-full sm:w-auto border border-[#c9a84c]/50 text-[#c9a84c] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-[#c9a84c]/10 transition"
          >
            🔄 Converter
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white/70 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium hover:border-[#c9a84c]/50 transition"
          >
            🛒 Comprar
          </button>
        </div>

        {/* Depósito */}
        {showDeposito && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-white">💰 Depositar</h3>
              <button onClick={() => setShowDeposito(false)} className="text-white/30 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleDeposito} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-[10px] sm:text-xs text-white/40 block mb-1">Método</label>
                <select 
                  value={depositoData.metodo}
                  onChange={(e) => setDepositoData({...depositoData, metodo: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="MPESA">M-Pesa</option>
                  <option value="EMOLA">E-Mola</option>
                  <option value="MKASH">mKash</option>
                  <option value="VISA">Visa</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-white/40 block mb-1">Moeda</label>
                <select 
                  value={depositoData.moeda}
                  onChange={(e) => setDepositoData({...depositoData, moeda: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="ZAR">ZAR</option>
                  <option value="USD">USD</option>
                  <option value="MZN">MZN</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] sm:text-xs text-white/40 block mb-1">Valor</label>
                <input 
                  type="number" step="0.01"
                  value={depositoData.valor}
                  onChange={(e) => setDepositoData({...depositoData, valor: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                  placeholder="0.00" required
                />
              </div>
              <button type="submit" className="sm:col-span-2 bg-[#c9a84c] text-black text-xs sm:text-sm py-2 rounded-full font-medium hover:bg-[#d4a017] transition">
                Confirmar Depósito
              </button>
            </form>
          </div>
        )}

        {/* Conversão */}
        {showConversao && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-white">🔄 Converter</h3>
              <button onClick={() => setShowConversao(false)} className="text-white/30 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleConversao} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-[10px] sm:text-xs text-white/40 block mb-1">De</label>
                <select 
                  value={conversaoData.moeda_origem}
                  onChange={(e) => setConversaoData({...conversaoData, moeda_origem: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="ZAR">ZAR</option>
                  <option value="USD">USD</option>
                  <option value="MZN">MZN</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-white/40 block mb-1">Para</label>
                <select 
                  value={conversaoData.moeda_destino}
                  onChange={(e) => setConversaoData({...conversaoData, moeda_destino: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="USD">USD</option>
                  <option value="ZAR">ZAR</option>
                  <option value="MZN">MZN</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] sm:text-xs text-white/40 block mb-1">Valor</label>
                <input 
                  type="number" step="0.01"
                  value={conversaoData.valor_origem}
                  onChange={(e) => setConversaoData({...conversaoData, valor_origem: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                  placeholder="0.00" required
                />
              </div>
              <button type="submit" className="sm:col-span-2 bg-[#c9a84c] text-black text-xs sm:text-sm py-2 rounded-full font-medium hover:bg-[#d4a017] transition">
                Confirmar Conversão
              </button>
            </form>
          </div>
        )}

        {/* Informações do Revendedor */}
        <div className="bg-white/5 border border-white/5 rounded-lg p-3 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-[10px] sm:text-xs">
            <div>
              <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">Nome</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium truncate">
                {revendedor?.nome_completo || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">Email</p>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                {revendedor?.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">Telefone</p>
              <p className="text-white/80 text-xs sm:text-sm">
                {revendedor?.telefone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">Província</p>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                {revendedor?.provincia || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">Cidade</p>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                {revendedor?.cidade || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider">Loja de Recolha</p>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                {revendedor?.loja_recolha || 'Não definida'}
              </p>
            </div>
          </div>
        </div>

        {/* Últimos Pedidos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-medium text-white/60">Últimos Pedidos</h2>
            <button onClick={() => navigate('/products')} className="text-[8px] sm:text-[10px] text-[#c9a84c] hover:text-[#d4a017] transition uppercase tracking-wider">
              + Comprar
            </button>
          </div>
          {pedidos.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-lg p-4 sm:p-6 text-center">
              <p className="text-[10px] sm:text-xs text-white/30">Nenhum pedido realizado ainda</p>
              <button onClick={() => navigate('/products')} className="mt-3 bg-[#c9a84c] text-black text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full hover:bg-[#d4a017] transition">
                Fazer Primeiro Pedido
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {pedidos.slice(0, 5).map((pedido) => (
                <div key={pedido.numero_pedido} className="bg-white/5 border border-white/5 rounded-lg p-2.5 sm:p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">{pedido.numero_pedido}</p>
                    <p className="text-[8px] sm:text-[10px] text-white/30">{new Date(pedido.data_pedido).toLocaleDateString('pt-PT')}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs sm:text-sm font-bold text-white">{pedido.valor_total} {pedido.moeda}</p>
                    <p className="text-[8px] sm:text-[10px] text-[#c9a84c]">{getStatusLabel(pedido.status)}</p>
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