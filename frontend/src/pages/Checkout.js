import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { transacaoService, pedidoService } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Checkout = () => {
  const { cart, total, totalItems, limpar } = useCart();
  const { revendedor, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [moeda, setMoeda] = useState('ZAR');
  const [saldo, setSaldo] = useState(null);
  const [taxas, setTaxas] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const saldoData = await transacaoService.getSaldo(revendedor.id);
      setSaldo(saldoData.saldo);

      const taxasData = await transacaoService.getTaxas();
      setTaxas(taxasData.taxas || []);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
  };

  const handleConfirmar = async () => {
    setLoading(true);
    
    try {
      const itens = cart.map(item => ({
        produto_id: item.id,
        quantidade: item.quantidade
      }));

      const dadosPedido = {
        revendedor_id: revendedor.id,
        itens: JSON.stringify(itens),
        moeda: moeda
      };

      const result = await pedidoService.criar(dadosPedido);
      
      if (result.sucesso) {
        toast.success('Pedido realizado com sucesso!');
        limpar();
        navigate('/dashboard');
      } else {
        toast.error(result.erro || 'Erro ao criar pedido');
      }
    } catch (error) {
      const erroMsg = error.response?.data?.erro || 'Erro ao processar pedido';
      toast.error(erroMsg);
      
      if (error.response?.data?.saldo_disponivel) {
        toast.error(`Saldo disponível: $${error.response.data.saldo_disponivel}`);
      }
    }
    
    setLoading(false);
  };

  const getTaxaMoeda = (moedaDestino) => {
    const taxa = taxas.find(t => t.moeda_origem === 'USD' && t.moeda_destino === moedaDestino);
    return taxa ? taxa.taxa_venda : null;
  };

  if (!saldo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const saldoDisponivel = saldo[moeda] || 0;
  const saldoInsuficiente = total > saldoDisponivel;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Voltar ao carrinho
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.imagem || '🧴'}</span>
                    <div>
                      <p className="font-medium text-gray-800">{item.nome}</p>
                      <p className="text-sm text-gray-500">x{item.quantidade}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${(item.preco * item.quantidade).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Moeda de Pagamento</h3>
            <div className="flex gap-4">
              {['ZAR', 'USD', 'MZN'].map((m) => {
                const taxa = getTaxaMoeda(m);
                const valorConvertido = taxa ? total * taxa : null;
                
                return (
                  <button
                    key={m}
                    onClick={() => setMoeda(m)}
                    className={`flex-1 p-4 rounded-xl border-2 transition ${
                      moeda === m
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-bold">{m}</p>
                      {valorConvertido && (
                        <p className="text-xs text-gray-500">
                          ≈ {valorConvertido.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Saldo Disponíve l</h3>
            
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-gray-800">
                {saldoDisponivel.toFixed(2)} {moeda}
              </span>
            </div>

            {saldoInsuficiente ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ Saldo insuficiente
                </p>
                <p className="text-red-500 text-sm">
                  Faltam ${(total - saldoDisponivel).toFixed(2)}
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-green-600 text-sm font-medium">
                  ✅ Saldo suficiente
                </p>
                <p className="text-green-500 text-sm">
                  Sobrará ${(saldoDisponivel - total).toFixed(2)}
                </p>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Total do pedido</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de serviço</span>
                <span>Grátis</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
                <span>Total a pagar</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmar}
              disabled={loading || saldoInsuficiente}
              className={`w-full py-3 rounded-full font-medium transition ${
                loading || saldoInsuficiente
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-200'
              }`}
            >
              {loading ? 'A processar...' : 'Confirmar Compra'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Produtos serão recolhidos na sua loja de preferência
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;