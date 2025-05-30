
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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
  DialogTitle, 
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Download, Eye, FileEdit, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ContractData, generateContractPdf, savePdf } from '@/utils/contractGenerator';

// Mock data for contracts - in a real app, this would come from your backend
const mockContracts: ContractData[] = [
  {
    document: '123.456.789-00',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Jardim Primavera',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    vehicleModel: 'Toyota Corolla 2023',
    licensePlate: 'ABC-1234',
    trackerModel: 'GPS Tracker Pro',
    imei: '123456789012345',
    registrationDate: '23/03/2025',
    installationLocation: 'Concessionária Central',
    signatureDate: '23/03/2025',
    ipAddress: '189.29.116.21',
    geolocation: 'São Paulo, SP, Brazil'
  },
  {
    document: '987.654.321-00',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    phone: '(21) 98765-1234',
    street: 'Avenida Brasil',
    number: '456',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20000-000',
    vehicleModel: 'Honda Civic 2024',
    licensePlate: 'DEF-5678',
    trackerModel: 'GPS Tracker Plus',
    imei: '987654321098765',
    registrationDate: '20/03/2025',
    installationLocation: 'Oficina Autorizada',
    signatureDate: '20/03/2025',
    ipAddress: '200.123.456.78',
    geolocation: 'Rio de Janeiro, RJ, Brazil'
  }
];

const ContractsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const filteredContracts = mockContracts.filter(contract => 
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.document.includes(searchTerm) ||
    contract.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewContract = (contract: ContractData, index: number) => {
    // Navigate to the contract view page instead of opening a dialog
    navigate(`/contracts/${index + 1}`);
  };
  
  const handleEditContract = (contract: ContractData) => {
    // In a real app, you would navigate to the edit page with the contract ID
    // For now, we'll just show a toast
    toast.info('Funcionalidade de edição em desenvolvimento');
  };
  
  const handleDownloadPdf = async (contract: ContractData) => {
    try {
      const pdfBlob = await generateContractPdf(contract);
      const fileName = `contrato_${contract.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
      await savePdf(pdfBlob, fileName);
      
      toast.success('Contrato baixado com sucesso');
    } catch (error) {
      console.error('Erro ao baixar contrato:', error);
      toast.error('Erro ao baixar contrato');
    }
  };
  
  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie os contratos de rastreamento veicular
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar por nome, documento ou placa..."
                className="pl-10 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="hidden md:table-cell">Veículo</TableHead>
                <TableHead className="hidden md:table-cell">Placa</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{contract.name}</TableCell>
                    <TableCell>{contract.document}</TableCell>
                    <TableCell className="hidden md:table-cell">{contract.vehicleModel}</TableCell>
                    <TableCell className="hidden md:table-cell">{contract.licensePlate}</TableCell>
                    <TableCell className="hidden md:table-cell">{contract.registrationDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewContract(contract, index)}
                          title="Visualizar contrato"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditContract(contract)}
                          title="Editar contrato"
                        >
                          <FileEdit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadPdf(contract)}
                          title="Baixar PDF"
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum contrato encontrado.
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

export default ContractsPage;
