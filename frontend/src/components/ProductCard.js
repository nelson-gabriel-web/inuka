import React, { useState } from 'react';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group bg-white/5 border border-white/5 rounded-lg overflow-hidden hover:border-[#c9a84c]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/5">
      {/* Imagem */}
      <div className="relative overflow-hidden bg-black/50 h-40">
        {product.imagem_url ? (
          <img 
            src={product.imagem_url} 
            alt={product.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-[#c9a84c]/20 font-light">
            ✦
          </div>
        )}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 p-1 bg-black/80 border border-white/10 rounded-full hover:border-[#c9a84c]/50 transition"
        >
          {isLiked ? (
            <HeartSolidIcon className="h-3.5 w-3.5 text-[#c9a84c]" />
          ) : (
            <HeartIcon className="h-3.5 w-3.5 text-white/40" />
          )}
        </button>
        {product.discount && (
          <span className="absolute bottom-2 left-2 bg-[#c9a84c] text-black px-2 py-0.5 rounded-full text-[9px] font-bold">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Informações */}
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[9px] text-white/30 uppercase tracking-wider">
            {product.categoria || product.category}
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-[9px] text-[#c9a84c]">★</span>
            <span className="text-[9px] text-white/50">{product.rating || 4.5}</span>
          </div>
        </div>
        <h3 className="text-xs font-medium text-white mb-0.5 truncate">{product.nome}</h3>
        <p className="text-[9px] text-white/20 line-clamp-1 mb-1.5">
          {product.descricao || 'Produto INUKA'}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-[#c9a84c]">R{product.preco_zar}</span>
            {product.preco_usd && (
              <span className="text-[9px] text-white/20 line-through ml-1">
                ${product.preco_usd}
              </span>
            )}
          </div>
          <button className="bg-[#c9a84c] text-black p-1.5 rounded-full hover:bg-[#d4a017] transition shadow-lg shadow-[#c9a84c]/20">
            <ShoppingBagIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;