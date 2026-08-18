import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  return (
    <section className="pt-16 sm:pt-20 bg-black min-h-[70vh] sm:min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1">
            <div className="inline-block border border-[#c9a84c]/30 text-[#c9a84c] px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-sm font-medium">
              INUKA — ALWAYS WITH YOU
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Beleza que</span>
              <br />
              <span className="text-[#c9a84c]">Transforma</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/40 max-w-md mx-auto md:mx-0">
              Descubra os melhores cosméticos INUKA para realçar sua beleza natural.
              Produtos de alta qualidade para todos os tipos de pele.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
              <button className="bg-[#c9a84c] text-black text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:bg-[#d4a017] transition flex items-center gap-2 shadow-lg shadow-[#c9a84c]/20">
                Comprar Agora
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="border border-[#c9a84c] text-[#c9a84c] text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:bg-[#c9a84c]/10 transition">
                Ver Coleção
              </button>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8 pt-2 sm:pt-4">
              <div className="text-center">
                <span className="block text-lg sm:text-2xl font-bold text-white">10k+</span>
                <span className="text-[10px] sm:text-sm text-white/30">Clientes</span>
              </div>
              <div className="text-center">
                <span className="block text-lg sm:text-2xl font-bold text-white">200+</span>
                <span className="text-[10px] sm:text-sm text-white/30">Produtos</span>
              </div>
              <div className="text-center">
                <span className="block text-lg sm:text-2xl font-bold text-[#c9a84c]">4.9★</span>
                <span className="text-[10px] sm:text-sm text-white/30">Avaliações</span>
              </div>
            </div>
          </div>
          <div className="relative order-1 md:order-2 flex justify-center">
            <div className="border border-[#c9a84c]/30 rounded-full w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center bg-black">
              <div className="text-center">
                <span className="text-5xl sm:text-7xl md:text-8xl">💄</span>
                <p className="text-sm sm:text-base md:text-lg font-medium text-white mt-2 sm:mt-4">INUKA Cosméticos</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-[#c9a84c]">ALWAYS WITH YOU</p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-[#c9a84c] text-black rounded-full p-2 sm:p-4 shadow-lg shadow-[#c9a84c]/30 border border-white/10">
              <span className="text-lg sm:text-2xl font-bold">96%</span>
              <span className="block text-[8px] sm:text-xs">OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;