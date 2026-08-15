import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  return (
    <section className="pt-20 bg-black min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block border border-[#c9a84c]/30 text-[#c9a84c] px-4 py-1 rounded-full text-sm font-medium tracking-wide">
            INUKA — ALWAYS WITH YOU
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-white">Beleza que</span>
              <br />
              <span className="text-[#c9a84c]">Transforma</span>
            </h1>
            <p className="text-lg text-white/40 max-w-md">
              Descubra os melhores cosméticos INUKA para realçar sua beleza natural.
              Produtos de alta qualidade para todos os tipos de pele.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#c9a84c] text-black px-8 py-3 rounded-full font-medium hover:bg-[#d4a017] transition flex items-center gap-2 shadow-lg shadow-[#c9a84c]/20">
                Comprar Agora
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              <button className="border border-[#c9a84c] text-[#c9a84c] px-8 py-3 rounded-full font-medium hover:bg-[#c9a84c]/10 transition">
                Ver Coleção
              </button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <span className="block text-2xl font-bold text-white">10k+</span>
                <span className="text-sm text-white/30">Clientes</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">200+</span>
                <span className="text-sm text-white/30">Produtos</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-[#c9a84c]">4.9★</span>
                <span className="text-sm text-white/30">Avaliações</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="border border-[#c9a84c]/30 rounded-full w-96 h-96 mx-auto flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="text-6xl font-light text-[#c9a84c] mb-2">✦</div>
<p className="text-lg font-medium text-white mt-4">INUKA Cosméticos</p>
                <p className="text-sm text-[#c9a84c]">ALWAYS WITH YOU</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-[#c9a84c] text-black rounded-full p-4 shadow-lg shadow-[#c9a84c]/30 border border-white/10">
  <span className="text-2xl font-bold">96%</span>
  <span className="block text-xs tracking-wider">OFF</span>
</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;