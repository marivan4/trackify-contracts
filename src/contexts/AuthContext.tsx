
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
}

interface WhatsAppConfig {
  baseUrl: string;
  apiKey: string;
  instance: string;
  isConnected: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  whatsAppConfig: WhatsAppConfig | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  updateWhatsAppConfig: (config: Partial<WhatsAppConfig>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const storedConfig = localStorage.getItem('whatsapp_config');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedConfig) {
      setWhatsAppConfig(JSON.parse(storedConfig));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demonstration, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (email === 'admin@exemplo.com' && password === 'admin123') {
        const adminUser = {
          id: 1,
          name: 'Administrador',
          email: 'admin@exemplo.com',
          role: 'admin' as const
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        // Set default WhatsApp config for admin
        const defaultConfig = {
          baseUrl: 'https://evolutionapi.gpstracker-16.com.br',
          apiKey: 'd9919cda7e370839d33b8946584dac93',
          instance: 'assas',
          isConnected: false
        };
        setWhatsAppConfig(defaultConfig);
        localStorage.setItem('whatsapp_config', JSON.stringify(defaultConfig));
        
        toast.success('Login bem-sucedido como Administrador');
        navigate('/contracts');
      } else if (email === 'cliente@exemplo.com' && password === 'cliente123') {
        const clientUser = {
          id: 2,
          name: 'Cliente Teste',
          email: 'cliente@exemplo.com',
          role: 'client' as const
        };
        setUser(clientUser);
        localStorage.setItem('user', JSON.stringify(clientUser));
        toast.success('Login bem-sucedido como Cliente');
        navigate('/contracts');
      } else {
        toast.error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setWhatsAppConfig(null);
    localStorage.removeItem('user');
    localStorage.removeItem('whatsapp_config');
    toast.info('Logout realizado com sucesso');
    navigate('/login');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const updateWhatsAppConfig = (config: Partial<WhatsAppConfig>) => {
    if (whatsAppConfig) {
      const updatedConfig = { ...whatsAppConfig, ...config };
      setWhatsAppConfig(updatedConfig);
      localStorage.setItem('whatsapp_config', JSON.stringify(updatedConfig));
    } else {
      // Create new config if it doesn't exist
      const newConfig = {
        baseUrl: config.baseUrl || 'https://evolutionapi.gpstracker-16.com.br',
        apiKey: config.apiKey || '',
        instance: config.instance || 'assas',
        isConnected: config.isConnected || false
      };
      setWhatsAppConfig(newConfig);
      localStorage.setItem('whatsapp_config', JSON.stringify(newConfig));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      whatsAppConfig,
      login, 
      logout, 
      isAdmin,
      updateWhatsAppConfig
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
