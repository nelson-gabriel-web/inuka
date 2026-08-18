import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Clientes = () => {
  const { revendedor, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    carregarClientes();
  }, [revendedor]);

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://inuka-6576.onrender.com/api/clientes/revendedor/${revendedor.id}/`
      );
      setClientes(response.data.clientes || []);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
    }
    setLoading(false);
  };

  const handleCriarCliente = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://inuka-6576.onrender.com/api/clientes/criar/', {
        revendedor_id: revendedor.id,
        ...novoCliente
      });
      toast.success('Cliente criado com sucesso!');
      setShowModal(false);
      setNovoCliente({ nome: '', telefone: '', email: '', endereco: '' });
      carregarClientes();
    } catch (error) {
      toast.error('Erro ao criar cliente');
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
            <h1 className="text-base sm:text-lg font-medium text-white">Clientes</h1>
            <p className="text-[10px] sm:text-xs text-white/30">Gerencie seus clientes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#c9a84c] text-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium hover:bg-[#d4a017] transition"
          >
            + Adicionar
          </button>
        </div>

        {/* Lista de Clientes */}
        {clientes.length === 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-lg p-8 sm:p-12 text-center">
            <p className="text-sm text-white/30">Nenhum cliente cadastrado</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-[#c9a84c] text-black text-sm px-4 py-2 rounded-full hover:bg-[#d4a017] transition"
            >
              Adicionar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{cliente.nome}</p>
                  <p className="text-xs text-white/30">{cliente.telefone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Saldo</p>
                  <p className="text-sm font-bold text-[#c9a84c]">R$ {parseFloat(cliente.saldo_devedor).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Criar Cliente */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Novo Cliente</h2>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white">
                  ✕
                </button>
              </div>
              <form onSubmit={handleCriarCliente} className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">Nome *</label>
                  <input
                    type="text"
                    required
                    value={novoCliente.nome}
                    onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Telefone *</label>
                  <input
                    type="text"
                    required
                    value={novoCliente.telefone}
                    onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                    placeholder="+258 82 123 4567"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Email</label>
                  <input
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                    placeholder="cliente@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Endereço</label>
                  <input
                    type="text"
                    value={novoCliente.endereco}
                    onChange={(e) => setNovoCliente({...novoCliente, endereco: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
                    placeholder="Endereço do cliente"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#c9a84c] text-black py-2 rounded-full font-medium hover:bg-[#d4a017] transition"
                >
                  Salvar Cliente
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;