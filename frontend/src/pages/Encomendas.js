import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Encomendas = () => {
  const { revendedor, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [novaEncomenda, setNovaEncomenda] = useState({
    cliente_id: '',
    itens: [{ produto_id: '', quantidade: 1 }],
    observacao: ''
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
      // Buscar encomendas
      const encResponse = await axios.get(
        `https://inuka-6576.onrender.com/api/encomendas/revendedor/${revendedor.id}/`
      );
      setEncomendas(encResponse.data.encomendas || []);

      // Buscar clientes
      const cliResponse = await axios.get(
        `https://inuka-6576.onrender.com/api/clientes/revendedor/${revendedor.id}/`
      );
      setClientes(cliResponse.data.clientes || []);

      // Buscar produtos
      const prodResponse = await axios.get(
        `https://inuka-6576.onrender.com/api/produtos/`
      );
      setProdutos(prodResponse.data.produtos || []);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
    setLoading(false);
  };

  const handleCriarEncomenda = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://inuka-6576.onrender.com/api/encomendas/criar/', {
        revendedor_id: revendedor.id,
        cliente_id: novaEncomenda.cliente_id,
        itens: novaEncomenda.itens.filter(item => item.produto_id && item.quantidade > 0),
        observacao: novaEncomenda.observacao
      });
      toast.success('Encomenda criada com sucesso!');
      setShowModal(false);
      setNovaEncomenda({ cliente_id: '', itens: [{ produto_id: '', quantidade: 1 }], observacao: '' });
      carregarDados();
    } catch (error) {
      toast.error('Erro ao criar encomenda');
    }
  };

  const adicionarItem = () => {
    setNovaEncomenda({
      ...novaEncomenda,
      itens: [...novaEncomenda.itens, { produto_id: '', quantidade: 1 }]
    });
  };

  const removerItem = (index) => {
    const itens = novaEncomenda.itens.filter((_, i) => i !== index);
    setNovaEncomenda({ ...novaEncomenda, itens });
  };

  const atualizarItem = (index, campo, valor) => {
    const itens = [...novaEncomenda.itens];
    itens[index][campo] = valor;
    setNovaEncomenda({ ...novaEncomenda, itens });
    const atualizarItem = (index, campo, valor) => {
  const itens = [...novaEncomenda.itens];
  itens[index][campo] = valor;
  
  // Se for produto, atualizar preço automaticamente
  if (campo === 'produto_id' && valor) {
    const produto = produtos.find(p => p.id === parseInt(valor));
    if (produto) {
      itens[index].preco_unitario = produto.preco_zar;
      itens[index].comissao_item = (produto.preco_zar * produto.comissao_percentual) / 100;
    }
  }
  
  setNovaEncomenda({ ...novaEncomenda, itens });
};
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

  const mudarStatus = async (encomendaId, novoStatus) => {
    try {
      await axios.put(`https://inuka-6576.onrender.com/api/encomendas/${encomendaId}/status/`, {
        status: novoStatus
      });
      toast.success('Status atualizado!');
      carregarDados();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
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
        <div className="flex items-center justify-between border-b border-white/5 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-base sm:text-lg font-medium text-white">Encomendas</h1>
            <p className="text-[10px] sm:text-xs text-white/30">Gerencie suas encomendas</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#c9a84c] text-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium hover:bg-[#d4a017] transition"
          >
            + Nova Encomenda
          </button>
        </div>

        {/* Lista de Encomendas */}
        {encomendas.length === 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-lg p-8 sm:p-12 text-center">
            <p className="text-sm text-white/30">Nenhuma encomenda criada</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-[#c9a84c] text-black text-sm px-4 py-2 rounded-full hover:bg-[#d4a017] transition"
            >
              Criar Primeira Encomenda
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {encomendas.map((encomenda) => (
              <div key={encomenda.id} className="bg-white/5 border border-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">#{encomenda.id} - {encomenda.cliente}</p>
                    <p className="text-xs text-white/30">
                      {new Date(encomenda.data_criacao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">R$ {parseFloat(encomenda.valor_total).toFixed(2)}</p>
                    <p className={`text-xs ${getStatusColor(encomenda.status)}`}>
                      {getStatusLabel(encomenda.status)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['pendente', 'paga', 'entregue', 'cancelada'].map((status) => (
                    <button
                      key={status}
                      onClick={() => mudarStatus(encomenda.id, status)}
                      className={`text-[10px] px-2 py-0.5 rounded-full transition ${
                        encomenda.status === status
                          ? 'bg-[#c9a84c] text-black'
                          : 'bg-white/5 text-white/30 hover:text-white'
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Nova Encomenda */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Nova Encomenda</h2>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white">
                  ✕
                </button>
              </div>
              <form onSubmit={handleCriarEncomenda} className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">Cliente *</label>
                  <select
                    required
                    value={novaEncomenda.cliente_id}
                    onChange={(e) => setNovaEncomenda({...novaEncomenda, cliente_id: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/40 block mb-1">Produtos</label>
                  {novaEncomenda.itens.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <select
                        value={item.produto_id}
                        onChange={(e) => atualizarItem(index, 'produto_id', e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                      >
                        <option value="">Selecione</option>
                        {produtos.map((p) => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value))}
                        className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                      />
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        className="text-white/30 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={adicionarItem}
                    className="text-xs text-[#c9a84c] hover:text-[#d4a017] transition"
                  >
                    + Adicionar Produto
                  </button>
                </div>

                <div>
                  <label className="text-xs text-white/40 block mb-1">Observação</label>
                  <input
                    type="text"
                    value={novaEncomenda.observacao}
                    onChange={(e) => setNovaEncomenda({...novaEncomenda, observacao: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                    placeholder="Observação (opcional)"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#c9a84c] text-black py-2 rounded-full font-medium hover:bg-[#d4a017] transition"
                >
                  Criar Encomenda
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encomendas;