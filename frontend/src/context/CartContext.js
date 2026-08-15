import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    calcularTotais();
  }, [cart]);

  const calcularTotais = () => {
    let items = 0;
    let valor = 0;
    cart.forEach(item => {
      items += item.quantidade;
      valor += item.preco * item.quantidade;
    });
    setTotalItems(items);
    setTotal(valor);
  };

  const adicionar = (produto, quantidade = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === produto.id);
      
      if (existingItem) {
        // Verificar stock disponível
        if (existingItem.quantidade + quantidade > produto.stock_atual) {
          toast.error(`Stock insuficiente para ${produto.nome}`);
          return prevCart;
        }
        
        return prevCart.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        // Verificar stock disponível
        if (quantidade > produto.stock_atual) {
          toast.error(`Stock insuficiente para ${produto.nome}`);
          return prevCart;
        }
        
        return [...prevCart, {
          id: produto.id,
          nome: produto.nome,
          preco: parseFloat(produto.preco_usd || produto.preco),
          quantidade: quantidade,
          imagem: produto.imagem_url || produto.emoji || '🧴',
          stock: produto.stock_atual
        }];
      }
    });
    
    toast.success(`${produto.nome} adicionado ao carrinho!`);
  };

  const remover = (produtoId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === produtoId);
      if (item) {
        toast.info(`${item.nome} removido do carrinho`);
      }
      return prevCart.filter(item => item.id !== produtoId);
    });
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      remover(produtoId);
      return;
    }

    setCart(prevCart => {
      const item = prevCart.find(i => i.id === produtoId);
      if (item && novaQuantidade > item.stock) {
        toast.error(`Stock insuficiente. Disponível: ${item.stock}`);
        return prevCart;
      }
      
      return prevCart.map(item =>
        item.id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      );
    });
  };

  const limpar = () => {
    setCart([]);
    toast.info('Carrinho esvaziado');
  };

  const getTotal = () => total;
  const getTotalItems = () => totalItems;

  return (
    <CartContext.Provider value={{
      cart,
      total,
      totalItems,
      adicionar,
      remover,
      atualizarQuantidade,
      limpar,
      getTotal,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};