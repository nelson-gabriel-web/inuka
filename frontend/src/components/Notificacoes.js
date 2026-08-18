import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BellIcon } from '@heroicons/react/24/outline';

const Notificacoes = () => {
  const { revendedor } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [naoLidas, setNaoLidas] = useState(0);

  useEffect(() => {
    if (revendedor) {
      carregarNotificacoes();
    }
  }, [revendedor]);

  const carregarNotificacoes = async () => {
    try {
      const response = await axios.get(
        `https://inuka-6576.onrender.com/api/notificacoes/revendedor/${revendedor.id}/`
      );
      setNotificacoes(response.data.notificacoes || []);
      setNaoLidas(response.data.notificacoes?.filter(n => !n.lida).length || 0);
    } catch (error) {
      console.error('Erro ao carregar notificações');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 hover:bg-white/5 rounded-full transition relative"
      >
        <BellIcon className="h-5 w-5 text-white/40" />
        {naoLidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#c9a84c] text-black text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
            {naoLidas}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-black border border-white/10 rounded-xl shadow-2xl py-2 max-h-80 overflow-y-auto">
          {notificacoes.length === 0 ? (
            <div className="px-4 py-3 text-sm text-white/30 text-center">
              Nenhuma notificação
            </div>
          ) : (
            notificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition ${
                  !notificacao.lida ? 'bg-white/5' : ''
                }`}
              >
                <p className="text-sm font-medium text-white">{notificacao.titulo}</p>
                <p className="text-xs text-white/30">{notificacao.mensagem}</p>
                <p className="text-[10px] text-white/20 mt-1">
                  {new Date(notificacao.data_criacao).toLocaleDateString('pt-PT')}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notificacoes;