
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from 'sonner';
import { FileEdit, Download, ArrowLeft } from 'lucide-react';
import { ContractData, generateContractPdf, savePdf } from '@/utils/contractGenerator';
import Map from '@/components/Map';

// Mock data for the contract - in a real app, this would come from your backend
const mockContract: ContractData = {
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
};

const ContractViewPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch the contract data using the contractId
    // For now, we'll use the mock data with a setTimeout to simulate a network request
    const fetchContract = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setContract(mockContract);
      } catch (error) {
        console.error('Error fetching contract:', error);
        toast.error('Erro ao carregar dados do contrato');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContract();
  }, [contractId]);

  const handleEditContract = () => {
    toast.info('Funcionalidade de edição em desenvolvimento');
    // In a real app, navigate to edit page: navigate(`/edit-contract/${contractId}`);
  };
  
  const handleDownloadPdf = async () => {
    if (!contract) return;
    
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
      
      <div className="container mx-auto max-w-5xl px-4 pt-32">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/contracts')} 
            className="flex items-center gap-1 -ml-3"
          >
            <ArrowLeft size={16} />
            <span>Voltar para Contratos</span>
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            Visualizar Contrato
          </h1>
          <p className="text-muted-foreground mt-1">
            Contrato #{contractId || 'N/A'}
          </p>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-subtle p-8 text-center">
            <p className="text-muted-foreground">Carregando detalhes do contrato...</p>
          </div>
        ) : contract ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Dados do Contrato</h2>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEditContract} 
                      className="flex items-center gap-2"
                    >
                      <FileEdit size={16} />
                      <span>Editar</span>
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleDownloadPdf} 
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      <span>Baixar PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Informações do Cliente</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">CPF/CNPJ</TableCell>
                            <TableCell>{contract.document}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Nome</TableCell>
                            <TableCell>{contract.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">E-mail</TableCell>
                            <TableCell>{contract.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Telefone</TableCell>
                            <TableCell>{contract.phone}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Endereço</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Logradouro</TableCell>
                            <TableCell>{contract.street}, {contract.number}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Bairro</TableCell>
                            <TableCell>{contract.neighborhood}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Cidade/Estado</TableCell>
                            <TableCell>{contract.city} - {contract.state}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">CEP</TableCell>
                            <TableCell>{contract.zipCode}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Informações do Veículo</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Modelo</TableCell>
                            <TableCell>{contract.vehicleModel}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Placa</TableCell>
                            <TableCell>{contract.licensePlate}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Informações do Rastreador</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Modelo</TableCell>
                            <TableCell>{contract.trackerModel}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">IMEI</TableCell>
                            <TableCell>{contract.imei}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Local de Instalação</TableCell>
                            <TableCell>{contract.installationLocation}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Data de Registro</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Data</TableCell>
                            <TableCell>{contract.registrationDate}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Localização Atual</h2>
              </div>
              <div className="p-6">
                <div className="h-[400px]">
                  <Map />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-subtle p-8 text-center">
            <p className="text-muted-foreground">Contrato não encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractViewPage;
