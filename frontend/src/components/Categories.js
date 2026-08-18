import React from 'react';

const categories = [
  { name: 'COSMÉTICOS', icon: '✦' },
  { name: 'MAQUILHAGEM', icon: '◆' },
  { name: 'CABELO', icon: '◈' },
  { name: 'FRAGRÂNCIAS', icon: '◉' },
];

const Categories = () => {
  return (
    <section className="py-8 sm:py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Categorias</h2>
          <p className="text-xs sm:text-sm text-white/40 mt-1 sm:mt-2">Encontre o produto perfeito para você</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-black border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center hover:scale-105 transition transform cursor-pointer shadow-lg hover:shadow-[#c9a84c]/10"
            >
              <div className="text-2xl sm:text-4xl md:text-5xl mb-1 sm:mb-4 text-[#c9a84c]">{category.icon}</div>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#c9a84c] tracking-wider">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;