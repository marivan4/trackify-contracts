
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShieldAlert } from 'lucide-react';

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold">Acesso Negado</h1>
        
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página. 
          Este recurso está disponível apenas para usuários com privilégios adequados.
        </p>
        
        <div className="flex flex-col space-y-3 pt-4">
          <Button onClick={() => navigate('/')}>
            Voltar para a página inicial
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar para a página anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
