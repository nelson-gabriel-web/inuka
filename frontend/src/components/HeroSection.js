import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  return (
    <section className="pt-16 sm:pt-20 bg-black min-h-[50vh] flex items-center">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 text-center md:text-left">
            <div className="inline-block border border-[#c9a84c]/30 text-[#c9a84c] px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-sm font-medium">
              INUKA — ALWAYS WITH YOU
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-white">Organize seu</span>
              <br />
              <span className="text-[#c9a84c]">negócio</span>
            </h1>
            <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto md:mx-0">
              Gerencie clientes, encomendas e comissões de forma simples e eficiente com a plataforma INUKA.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
              <button className="bg-[#c9a84c] text-black text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:bg-[#d4a017] transition">
                Começar Agora
              </button>
            </div>
          </div>
          <div className="relative order-1 md:order-2 flex justify-center">
            <div className="border border-[#c9a84c]/30 rounded-full w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center bg-black">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl md:text-6xl text-[#c9a84c]">✦</span>
                <p className="text-sm sm:text-base font-medium text-white mt-2">INUKA</p>
                <p className="text-[10px] sm:text-xs text-[#c9a84c]">ALWAYS WITH YOU</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;