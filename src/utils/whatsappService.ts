
import { toast } from 'sonner';

/**
 * Validates a phone number to ensure it matches the required format
 * @param phone The phone number to validate
 * @returns A boolean indicating if the phone number is valid
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove non-numeric characters
  const numericPhone = phone.replace(/\D/g, '');
  
  // Check if it matches the Brazilian phone format (55 followed by 10-11 digits)
  const phoneRegex = /^55\d{10,11}$/;
  return phoneRegex.test(numericPhone);
};

/**
 * Formats a phone number to ensure it has the correct format for the WhatsApp API
 * @param phone The phone number to format
 * @returns A properly formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  let formatted = phone.replace(/\D/g, '');
  
  // Add country code if needed
  if (!formatted.startsWith('55')) {
    formatted = `55${formatted}`;
  }
  
  return formatted;
};

/**
 * Sends a text message via WhatsApp API
 * @param phone The recipient's phone number
 * @param text The text message to send
 * @returns A promise that resolves to true if the message was sent successfully
 */
export const sendWhatsAppMessage = async (
  phone: string, 
  text: string
): Promise<boolean> => {
  // Validate phone number
  const formattedPhone = formatPhoneNumber(phone);
  if (!validatePhoneNumber(formattedPhone)) {
    console.error('Invalid phone number format', phone);
    toast.error('Número de telefone inválido');
    return false;
  }
  
  // Corrected URL - removed double https://
  const apiUrl = 'https://evolutionapi.gpstracker-16.com.br/message/sendText/assas';
  const apiKey = 'A80892194E8E-401D-BDC2-763C9430A09E';
  
  const payload = {
    number: formattedPhone,
    text: text
  };
  
  // Retry logic parameters
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds
  
  let attempts = 0;
  let success = false;
  
  while (attempts < maxRetries && !success) {
    attempts++;
    
    try {
      console.log(`Attempt ${attempts} to send WhatsApp message to: ${formattedPhone}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      console.log('WhatsApp API response:', data);
      
      if (response.ok) {
        console.log('WhatsApp message sent successfully');
        toast.success('Mensagem WhatsApp enviada com sucesso');
        success = true;
        return true;
      } else {
        console.error('Error sending WhatsApp message', response.status, data);
        
        if (attempts < maxRetries) {
          console.log(`Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    } catch (error) {
      console.error('Exception sending WhatsApp message', error);
      
      if (attempts < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  if (!success) {
    toast.error('Não foi possível enviar a mensagem após várias tentativas');
  }
  
  return success;
};

/**
 * Sends a contract notification via WhatsApp
 * @param phone The recipient's phone number
 * @param contractId The ID of the contract
 * @returns A promise that resolves to true if the message was sent successfully
 */
export const sendContractViaWhatsApp = async (
  phone: string, 
  contractId: string
): Promise<boolean> => {
  const message = `Seu contrato de rastreamento veicular (ID: ${contractId}) está disponível para visualização em: https://sistema-rastreamento.com.br/contratos/${contractId}`;
  
  return await sendWhatsAppMessage(phone, message);
};
