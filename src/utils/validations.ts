
// Form validation utilities

// Validate CPF/CNPJ
export const validateCPFCNPJ = (value: string): boolean => {
  // Remove non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Check if it's a CPF (11 digits) or CNPJ (14 digits)
  if (numbers.length !== 11 && numbers.length !== 14) {
    return false;
  }
  
  // Simple validation - in a real scenario, implement the actual validation algorithm
  return true;
};

// Validate Email
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate Brazilian Phone Number
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Brazilian phone numbers (with area code) have 10 or 11 digits
  // 11 digits if it includes the 9th digit (mobile)
  return numbers.length >= 10 && numbers.length <= 11;
};

// Validate CEP (Brazilian Postal Code)
export const validateCEP = (cep: string): boolean => {
  const regex = /^\d{5}-?\d{3}$/;
  return regex.test(cep);
};

// Validate License Plate (Brazilian Format)
export const validateLicensePlate = (plate: string): boolean => {
  // Support both the old format (ABC-1234) and the Mercosul format (ABC1D23)
  const oldFormat = /^[A-Z]{3}-?\d{4}$/;
  const mercosulFormat = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  
  return oldFormat.test(plate) || mercosulFormat.test(plate);
};

// Validate IMEI (15 digits)
export const validateIMEI = (imei: string): boolean => {
  const numbers = imei.replace(/\D/g, '');
  return numbers.length === 15;
};

// Format CPF/CNPJ for display
export const formatCPFCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    // Format as CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // Format as CNPJ: 00.000.000/0001-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return value;
};

// Format Brazilian phone number for display
export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    // Format as mobile: (00) 00000-0000
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Format as landline: (00) 0000-0000
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return value;
};

// Format CEP for display
export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 8) {
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return value;
};

// Validate if all form fields are filled
export const validateForm = (formData: Record<string, any>, requiredFields: string[]): boolean => {
  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === '') {
      return false;
    }
  }
  return true;
};
