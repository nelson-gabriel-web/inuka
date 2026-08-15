import React from 'react';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import DealSection from '../components/DealSection';
import ProductCard from '../components/ProductCard';

const produtos = [
  { id: 1, name: 'Shampoo Hidratante', price: 240.00, category: 'Cabelo', icon: '✦', rating: 4.8 },
  { id: 2, name: 'Batom Matte', price: 168.00, category: 'Maquilhagem', icon: '◆', rating: 4.6, discount: 20 },
  { id: 3, name: 'Perfume Floral', price: 350.00, category: 'Fragrâncias', icon: '◉', rating: 4.9 },
  { id: 4, name: 'Protetor Solar', price: 353.28, category: 'Facial', icon: '◈', rating: 4.7 },
  { id: 5, name: 'Condicionador', price: 192.00, category: 'Cabelo', icon: '✦', rating: 4.5 },
  { id: 6, name: 'Perfume Oud', price: 650.00, category: 'Fragrâncias', icon: '◉', rating: 4.8, discount: 10 },
];

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Categories />
      
      {/* Produtos em Destaque - VERSÃO PRETO E DOURADO */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#c9a84c]">Produtos em Destaque</h2>
              <p className="text-white/40 mt-1">Os mais amados pelos nossos clientes</p>
            </div>
            <button className="text-[#c9a84c] font-medium hover:text-[#d4a017] transition border border-[#c9a84c]/30 px-4 py-2 rounded-full hover:bg-[#c9a84c]/10">
              Ver Todos →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} product={produto} />
            ))}
          </div>
        </div>
      </section>

      <DealSection />
    </div>
  );
};

export default Home;