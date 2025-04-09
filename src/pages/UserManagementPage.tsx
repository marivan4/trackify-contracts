
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import { UserPlus, Users, Shield, MessageSquare } from 'lucide-react';
import UserManagement from '@/components/UserManagement';
import RolePrivilegesManager from '@/components/RolePrivilegesManager';
import { useAuth } from '@/contexts/AuthContext';

const UserManagementPage: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 pt-32">
        <div className="flex flex-col mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie usuários, permissões e acesso ao sistema
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Painel de Administração</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="users">
                  <Users className="mr-2 h-4 w-4" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="roles">
                  <Shield className="mr-2 h-4 w-4" />
                  Permissões
                </TabsTrigger>
                <TabsTrigger value="whatsapp">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="invite">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Convidar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="space-y-4">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="roles" className="space-y-4">
                {isAdmin() ? (
                  <RolePrivilegesManager />
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Você não tem permissão para gerenciar privilégios.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações do WhatsApp</h3>
                  {isAdmin() ? (
                    <div className="border rounded-md p-4">
                      <p className="mb-4">
                        Configure as credenciais da API de WhatsApp para uso no sistema.
                        Acesse a página de <a href="/whatsapp" className="text-blue-600 hover:underline">Conexão WhatsApp</a> para configurar.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">
                        Você não tem permissão para configurar a integração com WhatsApp.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="invite" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Convidar Usuários</h3>
                  <div className="border rounded-md p-4">
                    <p>Formulário para convidar novos usuários será exibido aqui</p>
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

export default UserManagementPage;
