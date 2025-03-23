
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

// Define the contract data interface
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

// Function to generate a contract PDF
export const generateContractPdf = async (data: ContractData): Promise<Blob> => {
  try {
    // Create a new PDF document (A4 format)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set font and size
    doc.setFont('helvetica');
    
    // Add header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE RASTREAMENTO VEICULAR', 105, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data de Emissão: ${data.registrationDate || new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });
    
    // Line separator
    doc.setDrawColor(210, 210, 210);
    doc.line(20, 35, 190, 35);
    
    // Client data section
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
    
    // Vehicle data section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados do Veículo:', 20, 98);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Modelo: ${data.vehicleModel}`, 20, 108);
    doc.text(`Placa: ${data.licensePlate}`, 20, 115);
    
    // Tracker data section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados do Rastreador:', 20, 130);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Modelo: ${data.trackerModel}`, 20, 140);
    doc.text(`IMEI: ${data.imei}`, 20, 147);
    doc.text(`Local de Instalação: ${data.installationLocation}`, 20, 154);
    
    // Terms and conditions section
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
    
    // Signature section
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
    
    // Digital signature line
    doc.line(20, 260, 100, 260);
    doc.text(`${data.name}`, 60, 270, { align: 'center' });
    
    // Convert the PDF to a blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Erro ao gerar o PDF do contrato');
    throw error;
  }
};

// Function to save PDF to disk
export const savePdf = async (pdfBlob: Blob, fileName: string): Promise<void> => {
  try {
    // Create a URL for the blob
    const url = URL.createObjectURL(pdfBlob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up by revoking the object URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
  } catch (error) {
    console.error('Error saving PDF:', error);
    toast.error('Erro ao salvar o PDF');
    throw error;
  }
};

// Function to print PDF
export const printPdf = async (pdfBlob: Blob): Promise<void> => {
  try {
    // Create a URL for the blob
    const url = URL.createObjectURL(pdfBlob);
    
    // Open in a new window and print
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

// Function to get client IP (simplified - would require backend in real app)
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

// Function to get approximate geolocation based on IP
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

// Function to send contract via WhatsApp with retry functionality
export const sendContractViaWhatsApp = async (phone: string, contractId: string): Promise<boolean> => {
  // Maximum number of retry attempts
  const MAX_RETRIES = 3;
  // Delay between retries in milliseconds (5 seconds)
  const RETRY_DELAY = 5000;
  
  // Validate and format Brazilian phone number
  const validatePhoneNumber = (number: string): string => {
    // Remove all non-numeric characters
    const cleanPhone = number.replace(/\D/g, '');
    
    // Check if it starts with country code (55)
    if (!cleanPhone.startsWith('55')) {
      return `55${cleanPhone}`;
    }
    
    return cleanPhone;
  };
  
  // Perform the actual API call
  const performApiCall = async (phoneNumber: string): Promise<Response> => {
    const apiUrl = 'https://evolutionapi.gpstracker-16.com.br/message/sendText/assas';
    const apiKey = 'A80892194E8E-401D-BDC2-763C9430A09E';
    
    const message = `📋 Novo Contrato Disponível\nClique para assinar: https://example.com/contracts/${contractId}\nVálido até: 24h`;
    
    // Log the request details for debugging
    console.log('WhatsApp API Request:', {
      url: apiUrl,
      phone: phoneNumber,
      message
    });
    
    // Make the API call
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number: phoneNumber,
        text: message
      })
    });
  };
  
  try {
    // Validate Brazilian phone number with regex
    const phoneRegex = /^55\d{10,11}$/;
    const formattedPhone = validatePhoneNumber(phone);
    
    if (!phoneRegex.test(formattedPhone)) {
      throw new Error('Número de telefone inválido. Formato esperado: 5511987654321');
    }
    
    // Implement retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Tentativa ${attempt} de envio para WhatsApp: ${formattedPhone}`);
        
        const response = await performApiCall(formattedPhone);
        const responseData = await response.json();
        
        // Log the API response for debugging
        console.log('WhatsApp API Response:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        // Success, exit retry loop
        toast.success('Contrato enviado por WhatsApp com sucesso');
        return true;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Erro na tentativa ${attempt}:`, lastError);
        
        // If this isn't the last attempt, wait before retrying
        if (attempt < MAX_RETRIES) {
          console.log(`Aguardando ${RETRY_DELAY/1000} segundos antes de tentar novamente...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    
    // If we get here, all retries failed
    throw lastError || new Error('Falha ao enviar mensagem após várias tentativas');
    
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    toast.error(`Erro ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return false;
  }
};
