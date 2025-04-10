
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
}

// API functions for users
const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/api/users', {
      headers: {
        'X-API-Key': 'TrackifySecretKey2025' // In a real app, this would be stored more securely
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar usuários');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const createUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<User> => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'TrackifySecretKey2025'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar usuário');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const updateUser = async (id: number, userData: Partial<User> & { password?: string }): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'TrackifySecretKey2025'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar usuário');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const deleteUser = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': 'TrackifySecretKey2025'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir usuário');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'admin' | 'user',
  });
  
  // Fetch users data
  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: 1
  });
  
  // Mutations
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Usuário adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar usuário: ${error.message}`);
    }
  });
  
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> & { password?: string } }) => 
      updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);
      setSelectedUserId(null);
      resetForm();
      toast.success('Usuário atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
      toast.success('Usuário excluído com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    }
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as 'admin' | 'user' }));
  };
  
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor, insira um email válido');
      return false;
    }
    
    // Phone validation
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Por favor, insira um telefone válido no formato (99) 99999-9999');
      return false;
    }
    
    // Password validation for new users
    if (!isEditDialogOpen) {
      if (!formData.password) {
        toast.error('Por favor, digite uma senha');
        return false;
      }
      
      if (formData.password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return false;
      }
    }
    
    return true;
  };
  
  const handleAddUser = () => {
    if (!validateForm()) return;
    
    // Check if email already exists
    if (users.some(user => user.email === formData.email)) {
      toast.error('Este email já está em uso');
      return;
    }
    
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      password: formData.password
    };
    
    createUserMutation.mutate(userData);
  };
  
  const handleEditClick = (userId: number) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        password: '',
        confirmPassword: '',
        role: userToEdit.role,
      });
      setSelectedUserId(userId);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleEditUser = () => {
    if (!validateForm() || selectedUserId === null) return;
    
    // Check if email already exists (excluding the current user)
    if (users.some(user => user.email === formData.email && user.id !== selectedUserId)) {
      toast.error('Este email já está em uso');
      return;
    }
    
    const userData: Partial<User> & { password?: string } = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };
    
    // Only include password if it was provided
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
      userData.password = formData.password;
    }
    
    updateUserMutation.mutate({ id: selectedUserId, userData });
  };
  
  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteUser = () => {
    if (selectedUserId === null) return;
    
    // Check if this is the last admin
    const userToDelete = users.find(user => user.id === selectedUserId);
    const remainingAdmins = users.filter(user => user.role === 'admin' && user.id !== selectedUserId);
    
    if (userToDelete?.role === 'admin' && remainingAdmins.length === 0) {
      toast.error('Não é possível excluir o último administrador');
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
      return;
    }
    
    deleteUserMutation.mutate(selectedUserId);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Carregando usuários...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <h3 className="font-medium">Erro ao carregar usuários</h3>
        <p className="text-muted-foreground mt-1">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Gestão de Usuários</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Novo Usuário</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para criar um novo usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do usuário"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(99) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="******"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="******"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Perfil</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={createUserMutation.isPending}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser} disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Processando...
                  </>
                ) : 'Adicionar Usuário'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(user.id)}
                        title="Editar usuário"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(user.id)}
                        title="Excluir usuário"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Perfil</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nova Senha (deixe em branco para manter a senha atual)</Label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="******"
                />
              </div>
              {formData.password && (
                <div className="space-y-2">
                  <Label htmlFor="edit-confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="edit-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="******"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={updateUserMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteUserMutation.isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={deleteUserMutation.isPending}>
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
