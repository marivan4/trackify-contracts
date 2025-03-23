
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import { UserPlus, Users, Shield } from 'lucide-react';

const UserManagementPage: React.FC = () => {
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
            {/* Wrap the TabsContent components inside a Tabs component */}
            <Tabs defaultValue="users">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="users">
                  <Users className="mr-2 h-4 w-4" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="roles">
                  <Shield className="mr-2 h-4 w-4" />
                  Permissões
                </TabsTrigger>
                <TabsTrigger value="invite">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Convidar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Lista de Usuários</h3>
                  {/* User list content */}
                  <div className="border rounded-md p-4">
                    <p>Conteúdo da lista de usuários será exibido aqui</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="roles" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Gerenciar Permissões</h3>
                  {/* Roles content */}
                  <div className="border rounded-md p-4">
                    <p>Conteúdo de permissões será exibido aqui</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="invite" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Convidar Usuários</h3>
                  {/* Invite content */}
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
