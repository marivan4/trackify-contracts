
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Search, Plus, Eye } from 'lucide-react';

interface ChecklistItem {
  id: number;
  contractId: number;
  vehiclePlate: string;
  vehicleModel: string;
  clientName: string;
  status: 'pending' | 'completed';
  date: string;
}

// Mock data for checklists
const mockChecklists: ChecklistItem[] = [
  {
    id: 1,
    contractId: 1001,
    vehiclePlate: 'ABC1234',
    vehicleModel: 'Toyota Corolla',
    clientName: 'João Silva',
    status: 'completed',
    date: '2023-10-15'
  },
  {
    id: 2,
    contractId: 1002,
    vehiclePlate: 'DEF5678',
    vehicleModel: 'Honda Civic',
    clientName: 'Maria Oliveira',
    status: 'pending',
    date: '2023-10-20'
  },
  {
    id: 3,
    contractId: 1003,
    vehiclePlate: 'GHI9012',
    vehicleModel: 'Ford Focus',
    clientName: 'Pedro Santos',
    status: 'completed',
    date: '2023-10-25'
  },
];

const VehicleChecklistsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredChecklists = mockChecklists.filter(checklist => {
    const matchesSearch = 
      checklist.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.contractId.toString().includes(searchTerm);
      
    const matchesStatus = 
      statusFilter === 'all' || 
      checklist.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 pt-32">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Checklists de Veículos</h1>
            <p className="text-muted-foreground mt-1">
              Gerenciar checklists de inspeção de veículos
            </p>
          </div>
          
          <Link to="/contracts/new-checklist">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Checklist
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por placa, modelo ou cliente..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead className="hidden md:table-cell">Modelo</TableHead>
                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChecklists.length > 0 ? (
                filteredChecklists.map(checklist => (
                  <TableRow key={checklist.id}>
                    <TableCell>#{checklist.contractId}</TableCell>
                    <TableCell>{checklist.vehiclePlate}</TableCell>
                    <TableCell className="hidden md:table-cell">{checklist.vehicleModel}</TableCell>
                    <TableCell className="hidden md:table-cell">{checklist.clientName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={checklist.status === 'completed' ? 'default' : 'outline'}
                        className={checklist.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'text-orange-800 border-orange-300 bg-orange-100 hover:bg-orange-100'}
                      >
                        {checklist.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(checklist.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/contracts/${checklist.contractId}/checklist`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Visualizar</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ClipboardCheck className="h-10 w-10 text-muted-foreground/60" />
                      <p>Nenhum checklist encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VehicleChecklistsPage;
