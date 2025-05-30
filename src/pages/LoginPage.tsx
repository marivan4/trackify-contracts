
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    await login(email, password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">TrackifyContracts</h1>
          <p className="mt-2 text-gray-600">
            Faça login para acessar o sistema de rastreamento
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-subtle">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff className="h-4 w-4" /> : 
                    <Eye className="h-4 w-4" />
                  }
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            
            <div className="text-sm text-center text-gray-600">
              <p>Credenciais de teste:</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="bg-gray-100 p-2 rounded">
                  <p><strong>Admin:</strong></p>
                  <p>admin@exemplo.com</p>
                  <p>admin123</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <p><strong>Cliente:</strong></p>
                  <p>cliente@exemplo.com</p>
                  <p>cliente123</p>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            Não tem uma conta?{' '}
            <a href="#" className="text-primary hover:underline">
              Entre em contato com o administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
