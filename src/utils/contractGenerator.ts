import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { sendContractViaWhatsApp as sendWhatsApp } from './whatsappService';

export interface ContractData {
  // Client data
  document: string; // CPF or CNPJ
  name: string;
  email: string;
  phone: string;
  
  // Address
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Vehicle information
  vehicleModel: string;
  licensePlate: string;
  trackerModel: string;
  imei: string;
  
  // Additional information
  registrationDate: string;
  installationLocation: string;
  
  // Signature info
  ipAddress?: string;
  signatureDate?: string;
  geolocation?: string;
}

export const generateContractPdf = async (data: ContractData): Promise<Blob> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFont('helvetica');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE RASTREAMENTO VEICULAR', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data de Emissão: ${data.registrationDate || new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });
    
    doc.setDrawColor(210, 210, 210);
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados do Cliente:', 20, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: ${data.name}`, 20, 55);
    doc.text(`CPF/CNPJ: ${data.document}`, 20, 62);
    doc.text(`Telefone: ${data.phone}`, 20, 69);
    doc.text(`Email: ${data.email}`, 20, 76);
    doc.text(`Endereço: ${data.street}, ${data.number}, ${data.neighborhood}, ${data.city} - ${data.state}, ${data.zipCode}`, 20, 83);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados do Veículo:', 20, 98);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Modelo: ${data.vehicleModel}`, 20, 108);
    doc.text(`Placa: ${data.licensePlate}`, 20, 115);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados do Rastreador:', 20, 130);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Modelo: ${data.trackerModel}`, 20, 140);
    doc.text(`IMEI: ${data.imei}`, 20, 147);
    doc.text(`Local de Instalação: ${data.installationLocation}`, 20, 154);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Termos e Condições:', 20, 169);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const terms = [
      "1. O presente contrato tem por objeto a prestação de serviços de rastreamento veicular.",
      "2. O serviço será prestado através do rastreador instalado no veículo descrito acima.",
      "3. O CONTRATANTE compromete-se a manter seus dados cadastrais atualizados.",
      "4. O prazo de vigência do presente contrato é de 12 (doze) meses, renovável por igual período.",
      "5. O valor do serviço será cobrado mensalmente, conforme plano contratado."
    ];
    
    let yPos = 179;
    for (const line of terms) {
      doc.text(line, 20, yPos);
      yPos += 7;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Assinatura:', 20, 220);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${data.signatureDate || new Date().toLocaleDateString('pt-BR')}`, 20, 230);
    
    if (data.ipAddress) {
      doc.text(`IP do Assinante: ${data.ipAddress}`, 20, 237);
    }
    
    if (data.geolocation) {
      doc.text(`Localização: ${data.geolocation}`, 20, 244);
    }
    
    doc.line(20, 260, 100, 260);
    doc.text(`${data.name}`, 60, 270, { align: 'center' });
    
    const pdfBlob = doc.output('blob');
    return pdfBlob;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Erro ao gerar o PDF do contrato');
    throw error;
  }
};

export const savePdf = async (pdfBlob: Blob, fileName: string): Promise<void> => {
  try {
    const url = URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
  } catch (error) {
    console.error('Error saving PDF:', error);
    toast.error('Erro ao salvar o PDF');
    throw error;
  }
};

export const printPdf = async (pdfBlob: Blob): Promise<void> => {
  try {
    const url = URL.createObjectURL(pdfBlob);
    
    const printWindow = window.open(url);
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      toast.error('Bloqueador de pop-ups ativo. Por favor, permita pop-ups para imprimir.');
    }
    
  } catch (error) {
    console.error('Error printing PDF:', error);
    toast.error('Erro ao imprimir o PDF');
    throw error;
  }
};

export const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'IP não disponível';
  }
};

export const getGeolocation = async (ip: string): Promise<string> => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    if (data.city && data.region) {
      return `${data.city}, ${data.region}, ${data.country_name}`;
    }
    
    return 'Localização não disponível';
  } catch (error) {
    console.error('Error getting geolocation:', error);
    return 'Localização não disponível';
  }
};

export const sendContractViaWhatsApp = async (
  phone: string, 
  contractId: string
): Promise<boolean> => {
  return await sendWhatsApp(phone, contractId);
};
