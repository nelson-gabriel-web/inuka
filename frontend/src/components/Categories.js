import React from 'react';

const categories = [
  { name: 'COSMÉTICOS', icon: '✦', color: 'border-[#c9a84c]/30 hover:border-[#c9a84c]' },
  { name: 'MAQUILHAGEM', icon: '◆', color: 'border-[#c9a84c]/30 hover:border-[#c9a84c]' },
  { name: 'CABELO', icon: '◈', color: 'border-[#c9a84c]/30 hover:border-[#c9a84c]' },
  { name: 'FRAGRÂNCIAS', icon: '◉', color: 'border-[#c9a84c]/30 hover:border-[#c9a84c]' },
  { name: 'SPA', icon: '◇', color: 'border-[#c9a84c]/30 hover:border-[#c9a84c]' },
];

const Categories = () => {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Categorias</h2>
          <p className="text-white/40 mt-2">Encontre o produto perfeito para você</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`bg-black border ${category.color} rounded-2xl p-8 text-center hover:scale-105 transition transform cursor-pointer shadow-lg hover:shadow-[#c9a84c]/10`}
            >
              <div className="text-4xl text-[#c9a84c] mb-4">{category.icon}</div>
              <h3 className="font-semibold text-[#c9a84c] text-sm tracking-wider">
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