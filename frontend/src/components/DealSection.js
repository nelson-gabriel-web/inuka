import React from 'react';

const DealSection = () => {
  return (
    <section className="py-16 bg-black border-t border-white/5 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-block border border-[#c9a84c]/30 text-[#c9a84c] px-4 py-1 rounded-full text-sm font-medium mb-4 tracking-wide">
              OFERTA ESPECIAL
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Promoção de</span>
              <br />
              <span className="text-[#c9a84c]">96% OFF</span>
            </h2>
            <p className="text-white/40 text-lg max-w-md">
              Aproveite nossa super oferta em produtos selecionados. 
              Quantidades limitadas!
            </p>
            <button className="mt-6 bg-[#c9a84c] text-black px-8 py-3 rounded-full font-medium hover:bg-[#d4a017] transition shadow-lg shadow-[#c9a84c]/20 tracking-wide">
              Ver Ofertas
            </button>
          </div>
          <div className="border border-[#c9a84c]/30 rounded-2xl p-8 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <span className="block text-4xl font-bold text-[#c9a84c]">96%</span>
                <span className="text-sm text-white/40 tracking-wider">DESCONTO</span>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div className="text-center">
                <span className="block text-4xl font-bold text-[#c9a84c]">★ 4.9</span>
                <span className="text-sm text-white/40 tracking-wider">AVALIAÇÃO</span>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div className="text-center">
                <span className="block text-4xl font-bold text-[#c9a84c]">+10k</span>
                <span className="text-sm text-white/40 tracking-wider">VENDIDOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealSection;