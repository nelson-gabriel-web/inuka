import React from 'react';

const DealSection = () => {
  return (
    <section className="py-8 sm:py-16 bg-black border-t border-white/5 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6 sm:gap-8">
          <div>
            <span className="inline-block border border-[#c9a84c]/30 text-[#c9a84c] text-[10px] sm:text-sm px-3 sm:px-4 py-1 rounded-full font-medium mb-3 sm:mb-4 tracking-wide">
              OFERTA ESPECIAL
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-white">Promoção de</span>
              <br />
              <span className="text-[#c9a84c]">96% OFF</span>
            </h2>
            <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto md:mx-0 mt-2 sm:mt-4">
              Aproveite nossa super oferta em produtos selecionados. 
              Quantidades limitadas!
            </p>
            <button className="mt-4 sm:mt-6 bg-[#c9a84c] text-black text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium hover:bg-[#d4a017] transition shadow-lg shadow-[#c9a84c]/20">
              Ver Ofertas
            </button>
          </div>
          <div className="border border-[#c9a84c]/30 rounded-2xl p-4 sm:p-8 bg-black/50 backdrop-blur-sm w-full md:w-auto">
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <span className="block text-2xl sm:text-4xl font-bold text-[#c9a84c]">96%</span>
                <span className="text-[8px] sm:text-sm text-white/40 tracking-wider">DESCONTO</span>
              </div>
              <div className="h-8 sm:h-12 w-px bg-white/10"></div>
              <div className="text-center">
                <span className="block text-2xl sm:text-4xl font-bold text-[#c9a84c]">★ 4.9</span>
                <span className="text-[8px] sm:text-sm text-white/40 tracking-wider">AVALIAÇÃO</span>
              </div>
              <div className="h-8 sm:h-12 w-px bg-white/10"></div>
              <div className="text-center">
                <span className="block text-2xl sm:text-4xl font-bold text-[#c9a84c]">+10k</span>
                <span className="text-[8px] sm:text-sm text-white/40 tracking-wider">VENDIDOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealSection;