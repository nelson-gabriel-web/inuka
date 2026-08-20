import React from 'react';

const HeroSection = () => {
  return (
    <section className="pt-16 sm:pt-20 bg-black min-h-[40vh] sm:min-h-[50vh] flex items-center">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="space-y-3 sm:space-y-6 text-center md:text-left">
            <div className="inline-block border border-[#c9a84c]/30 text-[#c9a84c] px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-sm font-medium">
              INUKA — ALWAYS WITH YOU
            </div>
            <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-white">Organize seu</span>
              <br />
              <span className="text-[#c9a84c]">negócio</span>
            </h1>
            <p className="text-xs sm:text-base text-white/40 max-w-md mx-auto md:mx-0">
              Gerencie clientes, encomendas e comissões de forma simples e eficiente com a plataforma INUKA.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button className="bg-[#c9a84c] text-black text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium hover:bg-[#d4a017] transition">
                Começar Agora
              </button>
            </div>
          </div>
          <div className="relative order-1 md:order-2 flex justify-center">
            <div className="border border-[#c9a84c]/30 rounded-full w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex items-center justify-center bg-black">
              <div className="text-center">
                <span className="text-3xl sm:text-4xl md:text-5xl text-[#c9a84c]">✦</span>
                <p className="text-xs sm:text-sm md:text-base font-medium text-white mt-1 sm:mt-2">INUKA</p>
                <p className="text-[8px] sm:text-[10px] text-[#c9a84c]">ALWAYS WITH YOU</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;