import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, total, totalItems, remover, atualizarQuantidade, limpar } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.error('Faça login para finalizar a compra');
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }
    
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black py-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-5xl text-[#c9a84c]/20 mb-4">✦</div>
          <h2 className="text-lg font-medium text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-sm text-white/30 mb-6">Explore nossa coleção e adicione produtos</p>
          <Link 
            to="/products" 
            className="inline-block bg-[#c9a84c] text-black text-sm px-6 py-2 rounded-full hover:bg-[#d4a017] transition font-medium"
          >
            Ver Produtos
          </Link>
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
            <h1 className="text-lg font-medium text-white">Carrinho</h1>
            <p className="text-xs text-white/30">{totalItems} itens</p>
          </div>
          <button
            onClick={limpar}
            className="text-[10px] text-white/30 hover:text-red-400 transition uppercase tracking-wider"
          >
            Esvaziar
          </button>
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center gap-4 hover:border-[#c9a84c]/30 transition"
              >
                {/* Ícone */}
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-2xl text-[#c9a84c]/30 flex-shrink-0">
                  {item.imagem || '✦'}
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.nome}</h3>
                  <p className="text-xs text-[#c9a84c] font-medium">R{item.preco.toFixed(2)}</p>
                  <p className="text-[10px] text-white/20">Stock: {item.stock}</p>
                </div>

                {/* Quantidade */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                    className="p-1 rounded-full hover:bg-white/5 transition text-white/40 hover:text-white"
                  >
                    <MinusIcon className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs text-white">{item.quantidade}</span>
                  <button
                    onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                    className="p-1 rounded-full hover:bg-white/5 transition text-white/40 hover:text-white"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                </div>

                {/* Subtotal e Remover */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-white">
                    R{(item.preco * item.quantidade).toFixed(2)}
                  </p>
                  <button
                    onClick={() => remover(item.id)}
                    className="text-[10px] text-white/20 hover:text-red-400 transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/5 rounded-lg p-4 sticky top-24">
              <h2 className="text-sm font-medium text-white mb-4">Resumo</h2>
              
              <div className="space-y-2 border-b border-white/5 pb-3 mb-3">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Subtotal ({totalItems} itens)</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Entrega</span>
                  <span className="text-[#c9a84c]">Grátis</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-medium text-white mb-4">
                <span>Total</span>
                <span className="text-[#c9a84c]">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#c9a84c] text-black text-sm py-2 rounded-full font-medium hover:bg-[#d4a017] transition shadow-lg shadow-[#c9a84c]/20"
              >
                Finalizar Compra
              </button>

              <Link 
                to="/products" 
                className="block text-center mt-3 text-[10px] text-white/30 hover:text-[#c9a84c] transition"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;