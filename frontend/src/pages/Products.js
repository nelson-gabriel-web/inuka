import React, { useState, useEffect } from 'react';
import { produtoService } from '../services/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const Products = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, []);

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const data = await produtoService.listar({ categoria: filtro });
      setProdutos(data.produtos || []);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    }
    setLoading(false);
  };

  const carregarCategorias = async () => {
    try {
      const data = await produtoService.getCategorias();
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error('Erro ao carregar categorias');
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, [filtro]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a84c] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-white/30 text-sm">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div>
            <h1 className="text-lg font-medium text-white">Produtos</h1>
            <p className="text-xs text-white/30">Explore nossa coleção INUKA</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30 hidden sm:inline">
              {produtos.length} produtos
            </span>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:border-[#c9a84c]/50 transition"
            >
              <option value="" className="bg-black">Todas Categorias</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat} className="bg-black">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Produtos */}
        {produtos.length === 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-lg p-12 text-center">
            <p className="text-sm text-white/30">Nenhum produto encontrado</p>
            <p className="text-xs text-white/20 mt-1">Tente ajustar o filtro</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} product={produto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;