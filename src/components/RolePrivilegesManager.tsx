
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Privilege {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  privileges: string[];
}

const RolePrivilegesManager: React.FC = () => {
  // In a real app, this data would come from API/database
  const [privileges] = useState<Privilege[]>([
    { id: 'view_clients', name: 'Visualizar Clientes', description: 'Permite visualizar dados de clientes' },
    { id: 'edit_clients', name: 'Editar Clientes', description: 'Permite editar dados de clientes' },
    { id: 'create_clients', name: 'Criar Clientes', description: 'Permite criar novos clientes' },
    { id: 'delete_clients', name: 'Excluir Clientes', description: 'Permite excluir clientes' },
    { id: 'view_contracts', name: 'Visualizar Contratos', description: 'Permite visualizar contratos' },
    { id: 'edit_contracts', name: 'Editar Contratos', description: 'Permite editar contratos' },
    { id: 'create_contracts', name: 'Criar Contratos', description: 'Permite criar novos contratos' },
    { id: 'delete_contracts', name: 'Excluir Contratos', description: 'Permite excluir contratos' },
    { id: 'use_whatsapp', name: 'Usar WhatsApp', description: 'Permite usar a integração com WhatsApp' },
    { id: 'configure_whatsapp', name: 'Configurar WhatsApp', description: 'Permite configurar a API do WhatsApp' },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { 
      id: 'admin', 
      name: 'Administrador', 
      privileges: privileges.map(p => p.id) 
    },
    { 
      id: 'manager', 
      name: 'Gerente', 
      privileges: ['view_clients', 'edit_clients', 'create_clients', 'view_contracts', 'edit_contracts', 'use_whatsapp'] 
    },
    { 
      id: 'user', 
      name: 'Usuário', 
      privileges: ['view_clients', 'view_contracts'] 
    },
  ]);

  const handlePrivilegeToggle = (roleId: string, privilegeId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPrivilege = role.privileges.includes(privilegeId);
        
        if (hasPrivilege) {
          return {
            ...role,
            privileges: role.privileges.filter(id => id !== privilegeId)
          };
        } else {
          return {
            ...role,
            privileges: [...role.privileges, privilegeId]
          };
        }
      }
      return role;
    }));
  };

  const saveChanges = () => {
    // In a real app, this would save to database
    toast.success("Privilégios atualizados com sucesso");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Privilégios por Perfil</h2>
        <Button onClick={saveChanges}>Salvar Alterações</Button>
      </div>

      <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Privilégio</TableHead>
              <TableHead>Descrição</TableHead>
              {roles.map(role => (
                <TableHead key={role.id} className="text-center">{role.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {privileges.map(privilege => (
              <TableRow key={privilege.id}>
                <TableCell className="font-medium">{privilege.name}</TableCell>
                <TableCell>{privilege.description}</TableCell>
                {roles.map(role => (
                  <TableCell key={`${role.id}-${privilege.id}`} className="text-center">
                    <Checkbox
                      checked={role.privileges.includes(privilege.id)}
                      onCheckedChange={() => handlePrivilegeToggle(role.id, privilege.id)}
                      // Admin role always has all privileges - can't be unchecked
                      disabled={role.id === 'admin'}
                      className="mx-auto"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RolePrivilegesManager;
