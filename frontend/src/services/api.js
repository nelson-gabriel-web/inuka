import axios from 'axios';

const API_URL = 'https://inuka-6576.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Serviços para Revendedores
export const revendedorService = {
  // Registar revendedor
  registar: async (dados) => {
    const response = await api.post('/revendedores/registar/', dados);
    return response.data;
  },

  // Login
  login: async (dados) => {
  const response = await api.post('/revendedores/login/', dados);
  if (response.data.sucesso) {
    localStorage.setItem('revendedor', JSON.stringify(response.data.revendedor));
  }
  return response.data;
},

  // Buscar perfil
  getPerfil: async (id) => {
    const response = await api.get(`/revendedores/perfil/${id}/`);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('revendedor');
    localStorage.removeItem('token');
  },

  // Verificar se está logado
  isAuthenticated: () => {
    const revendedor = localStorage.getItem('revendedor');
    return revendedor !== null;
  },

  // Obter revendedor atual
  getRevendedor: () => {
    const revendedor = localStorage.getItem('revendedor');
    return revendedor ? JSON.parse(revendedor) : null;
  }
};

// Serviços para Produtos
export const produtoService = {
  // Listar produtos
  listar: async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    const response = await api.get(`/produtos/?${params}`);
    return response.data;
  },

  // Buscar produto por ID
  getById: async (id) => {
    const response = await api.get(`/produtos/${id}/`);
    return response.data;
  },

  // Buscar categorias
  getCategorias: async () => {
    const response = await api.get('/produtos/categorias/');
    return response.data;
  }
};

// Serviços para Transações
export const transacaoService = {
  // Ver saldo
  getSaldo: async (revendedorId) => {
    const response = await api.get(`/transacoes/saldo/${revendedorId}/`);
    return response.data;
  },

  // Fazer depósito
  depositar: async (dados) => {
    const response = await api.post('/transacoes/depositar/', dados);
    return response.data;
  },

  // Converter moeda
  converter: async (dados) => {
    const response = await api.post('/transacoes/converter/', dados);
    return response.data;
  },

  // Listar taxas de câmbio
  getTaxas: async () => {
    const response = await api.get('/transacoes/taxas/');
    return response.data;
  }
};

// Serviços para Pedidos
export const pedidoService = {
  // Criar pedido
  criar: async (dados) => {
    const response = await api.post('/pedidos/criar/', dados);
    return response.data;
  },

  // Rastrear pedido
  rastrear: async (id) => {
    const response = await api.get(`/pedidos/${id}/`);
    return response.data;
  },

  // Listar pedidos do revendedor
  listarPorRevendedor: async (revendedorId) => {
    const response = await api.get(`/pedidos/revendedor/${revendedorId}/`);
    return response.data;
  }
};

export default api;