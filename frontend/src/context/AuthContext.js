import React, { createContext, useState, useContext, useEffect } from 'react';
import { revendedorService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [revendedor, setRevendedor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há revendedor no localStorage
    const stored = localStorage.getItem('revendedor');
    if (stored) {
      setRevendedor(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
  try {
    const response = await revendedorService.login({
      email,
      password,
    });
    
    if (response.sucesso) {
      setRevendedor(response.revendedor);
      return { sucesso: true };
    }
    return { sucesso: false, erro: response.erro };
  } catch (error) {
    return { 
      sucesso: false, 
      erro: error.response?.data?.erro || 'Erro ao fazer login' 
    };
  }
};

  const logout = () => {
  localStorage.removeItem('revendedor');
  localStorage.removeItem('token');
  setRevendedor(null);
};

  const isAuthenticated = () => {
    return revendedor !== null;
  };

  return (
    <AuthContext.Provider value={{
      revendedor,
      loading,
      login,
      logout,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};