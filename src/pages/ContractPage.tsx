
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ContractForm from '@/components/ContractForm';
import VehicleForm from '@/components/VehicleForm';
import SignatureCapture from '@/components/SignatureCapture';
import ContractPreview from '@/components/ContractPreview';
import { ContractData, sendContractViaWhatsApp } from '@/utils/contractGenerator';
import { validateForm } from '@/utils/validations';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';

const ContractPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('client');
  const [contractId, setContractId] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [contractData, setContractData] = useState<ContractData>({
    // Client data
    document: '',
    name: '',
    email: '',
    phone: '',
    
    // Address
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Vehicle information
    vehicleModel: '',
    licensePlate: '',
    trackerModel: '',
    imei: '',
    
    // Additional information
    registrationDate: new Date().toLocaleDateString('pt-BR'),
    installationLocation: '',
  });
  
  useEffect(() => {
    // Generate a unique contract ID
    const uniqueId = `C${Date.now().toString().slice(-6)}`;
    setContractId(uniqueId);
  }, []);
  
  const validateClientTab = () => {
    const requiredFields = ['document', 'name', 'email', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'zipCode'];
    return validateForm(contractData, requiredFields);
  };
  
  const validateVehicleTab = () => {
    const requiredFields = ['vehicleModel', 'licensePlate', 'trackerModel', 'imei', 'installationLocation'];
    return validateForm(contractData, requiredFields);
  };
  
  const handleNext = () => {
    if (currentTab === 'client') {
      if (!validateClientTab()) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      setCurrentTab('vehicle');
    } else if (currentTab === 'vehicle') {
      if (!validateVehicleTab()) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      setCurrentTab('signature');
    }
  };
  
  const handleBack = () => {
    if (currentTab === 'vehicle') {
      setCurrentTab('client');
    } else if (currentTab === 'signature') {
      setCurrentTab('vehicle');
    } else if (currentTab === 'preview') {
      setCurrentTab('signature');
    }
  };
  
  const handleSignatureCapture = (signatureInfo: {
    ipAddress: string;
    signatureDate: string;
    geolocation: string;
  }) => {
    // Update contract data with signature info
    setContractData(prev => ({
      ...prev,
      ipAddress: signatureInfo.ipAddress,
      signatureDate: signatureInfo.signatureDate,
      geolocation: signatureInfo.geolocation
    }));
    
    // Show success message
    toast.success('Assinatura capturada com sucesso', {
      description: 'Você pode visualizar a prévia do contrato agora'
    });
    
    // Move to preview tab
    setCurrentTab('preview');
  };
  
  const handleSendWhatsApp = async () => {
    if (!contractData.phone) {
      toast.error('Número de telefone não encontrado');
      return;
    }
    
    // Format phone number for WhatsApp (remove non-numeric characters and add country code if needed)
    let phoneNumber = contractData.phone.replace(/\D/g, '');
    if (!phoneNumber.startsWith('55')) {
      phoneNumber = `55${phoneNumber}`;
    }
    
    // Send contract via WhatsApp
    const success = await sendContractViaWhatsApp(phoneNumber, contractId);
    
    if (success) {
      toast.success('Contrato enviado por WhatsApp', {
        description: 'O cliente receberá o link para visualização'
      });
    }
  };
  
  const handleFinish = () => {
    toast.success('Contrato finalizado com sucesso', {
      description: 'Você será redirecionado para a página inicial'
    });
    
    // Simulate saving data to database
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-background pb-16">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 pt-32">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="flex items-center gap-1 -ml-3"
              >
                <Link to="/">
                  <ArrowLeft size={16} />
                  <span>Voltar</span>
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-2">
              Novo Contrato
            </h1>
            <p className="text-muted-foreground mt-1">
              Preencha os dados para gerar o contrato
            </p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Contrato ID:</span>
            <span className="ml-2 font-mono bg-secondary px-2 py-1 rounded">
              {contractId}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <div className="px-2 sm:px-6 py-4 bg-muted/30 border-b">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="client" disabled={currentTab === 'preview'}>
                  Cliente
                </TabsTrigger>
                <TabsTrigger value="vehicle" disabled={currentTab === 'preview'}>
                  Veículo
                </TabsTrigger>
                <TabsTrigger value="signature" disabled={currentTab === 'preview'}>
                  Assinatura
                </TabsTrigger>
                <TabsTrigger value="preview">
                  Prévia
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="client" className="mt-0">
                <ContractForm 
                  formData={contractData}
                  setFormData={setContractData}
                  errors={formErrors}
                  setErrors={setFormErrors}
                />
                
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    <span>Próximo</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="vehicle" className="mt-0">
                <VehicleForm 
                  formData={contractData}
                  setFormData={setContractData}
                  errors={formErrors}
                  setErrors={setFormErrors}
                />
                
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                  
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    <span>Próximo</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signature" className="mt-0">
                <SignatureCapture onCapture={handleSignatureCapture} />
                
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <ContractPreview 
                  contractData={contractData}
                  onSendWhatsApp={handleSendWhatsApp}
                />
                
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                  
                  <Button 
                    onClick={handleFinish} 
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} />
                    <span>Finalizar Contrato</span>
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
