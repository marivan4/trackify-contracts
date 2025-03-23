
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import { Clipboard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const InstallationGuidePage = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Comando copiado para a área de transferência');
  };

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 pt-32">
        <div className="flex flex-col mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manual de Instalação</h1>
            <p className="text-muted-foreground mt-1">
              Guia passo a passo para instalação e configuração do sistema de rastreamento
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Instalação no Ubuntu 22.04</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="system">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="system">Requisitos do Sistema</TabsTrigger>
                <TabsTrigger value="installation">Instalação</TabsTrigger>
                <TabsTrigger value="configuration">Configuração</TabsTrigger>
              </TabsList>
              
              <TabsContent value="system" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Requisitos Mínimos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Hardware</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Processador: 2 núcleos (mínimo)</li>
                        <li>• Memória RAM: 4GB (mínimo)</li>
                        <li>• Espaço em disco: 20GB (mínimo)</li>
                        <li>• Conexão de internet estável</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Software</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Ubuntu 22.04 LTS</li>
                        <li>• PHP 8.0 ou superior</li>
                        <li>• MySQL 8.0 ou superior</li>
                        <li>• Node.js 18 ou superior</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="installation" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">1. Atualizar o Sistema</h3>
                  <div className="bg-gray-100 p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      sudo apt update && sudo apt upgrade -y
                    </pre>
                    <button 
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200"
                      onClick={() => copyToClipboard('sudo apt update && sudo apt upgrade -y')}
                      title="Copiar comando"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold">2. Instalar PHP 8.1</h3>
                  <div className="bg-gray-100 p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      sudo apt install software-properties-common -y{"\n"}
                      sudo add-apt-repository ppa:ondrej/php -y{"\n"}
                      sudo apt update{"\n"}
                      sudo apt install php8.1 php8.1-cli php8.1-common php8.1-mysql php8.1-zip php8.1-gd php8.1-mbstring php8.1-curl php8.1-xml php8.1-bcmath -y
                    </pre>
                    <button 
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200"
                      onClick={() => copyToClipboard('sudo apt install software-properties-common -y\nsudo add-apt-repository ppa:ondrej/php -y\nsudo apt update\nsudo apt install php8.1 php8.1-cli php8.1-common php8.1-mysql php8.1-zip php8.1-gd php8.1-mbstring php8.1-curl php8.1-xml php8.1-bcmath -y')}
                      title="Copiar comando"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold">3. Instalar MySQL</h3>
                  <div className="bg-gray-100 p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      sudo apt install mysql-server -y{"\n"}
                      sudo mysql_secure_installation
                    </pre>
                    <button 
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200"
                      onClick={() => copyToClipboard('sudo apt install mysql-server -y\nsudo mysql_secure_installation')}
                      title="Copiar comando"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold">4. Instalar Node.js</h3>
                  <div className="bg-gray-100 p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -{"\n"}
                      sudo apt install nodejs -y{"\n"}
                      node --version
                    </pre>
                    <button 
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200"
                      onClick={() => copyToClipboard('curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -\nsudo apt install nodejs -y\nnode --version')}
                      title="Copiar comando"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="configuration" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">1. Criar Banco de Dados</h3>
                  <div className="bg-gray-100 p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      sudo mysql{"\n"}
                      CREATE DATABASE tracking_system;{"\n"}
                      CREATE USER 'tracking_user'@'localhost' IDENTIFIED BY 'senha_segura';{"\n"}
                      GRANT ALL PRIVILEGES ON tracking_system.* TO 'tracking_user'@'localhost';{"\n"}
                      FLUSH PRIVILEGES;{"\n"}
                      EXIT;
                    </pre>
                    <button 
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200"
                      onClick={() => copyToClipboard('sudo mysql\nCREATE DATABASE tracking_system;\nCREATE USER \'tracking_user\'@\'localhost\' IDENTIFIED BY \'senha_segura\';\nGRANT ALL PRIVILEGES ON tracking_system.* TO \'tracking_user\'@\'localhost\';\nFLUSH PRIVILEGES;\nEXIT;')}
                      title="Copiar comando"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold">2. Importar Estrutura do Banco</h3>
                  <div className="bg-gray-100 p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      mysql -u tracking_user -p tracking_system < estrutura.sql
                    </pre>
                    <button 
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200"
                      onClick={() => copyToClipboard('mysql -u tracking_user -p tracking_system < estrutura.sql')}
                      title="Copiar comando"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold">3. Configurar Servidor Web</h3>
                  <div className="bg-gray-100 p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      sudo apt install nginx -y{"\n"}
                      sudo systemctl start nginx{"\n"}
                      sudo systemctl enable nginx
                    </pre>
                    <button 
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200"
                      onClick={() => copyToClipboard('sudo apt install nginx -y\nsudo systemctl start nginx\nsudo systemctl enable nginx')}
                      title="Copiar comando"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold">4. Verificação da Instalação</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Verificar se PHP está funcionando: <code>php -v</code></span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Verificar se MySQL está funcionando: <code>sudo systemctl status mysql</code></span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Verificar se Nginx está funcionando: <code>sudo systemctl status nginx</code></span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstallationGuidePage;
