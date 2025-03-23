
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  validateCPFCNPJ, 
  validateEmail, 
  validatePhoneNumber, 
  validateCEP, 
  formatCPFCNPJ, 
  formatPhoneNumber,
  formatCEP
} from '@/utils/validations';

interface ContractFormProps {
  formData: {
    document: string;
    name: string;
    email: string;
    phone: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const ContractForm: React.FC<ContractFormProps> = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format while typing for certain fields
    if (name === 'document') {
      setFormData(prev => ({ ...prev, [name]: formatCPFCNPJ(value) }));
    } else if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else if (name === 'zipCode') {
      setFormData(prev => ({ ...prev, [name]: formatCEP(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate fields on blur
    if (name === 'document' && value && !validateCPFCNPJ(value)) {
      setErrors(prev => ({ ...prev, [name]: 'CPF/CNPJ inválido' }));
    }
    
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, [name]: 'Email inválido' }));
    }
    
    if (name === 'phone' && value && !validatePhoneNumber(value)) {
      setErrors(prev => ({ ...prev, [name]: 'Telefone inválido' }));
    }
    
    if (name === 'zipCode' && value && !validateCEP(value)) {
      setErrors(prev => ({ ...prev, [name]: 'CEP inválido' }));
    }
    
    // Fetch address data from CEP API when zipCode is filled
    if (name === 'zipCode' && value && validateCEP(value)) {
      fetchAddressFromCEP(value.replace(/\D/g, ''));
    }
  };

  const fetchAddressFromCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
      }
    } catch (error) {
      console.error('Error fetching CEP data:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="document">CPF/CNPJ</Label>
        <Input
          id="document"
          name="document"
          placeholder="000.000.000-00 ou 00.000.000/0001-00"
          value={formData.document}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.document ? 'border-red-300' : ''}
        />
        {errors.document && (
          <p className="text-sm text-red-500">{errors.document}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Nome completo"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-red-300' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@exemplo.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email ? 'border-red-300' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.phone ? 'border-red-300' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">CEP</Label>
        <Input
          id="zipCode"
          name="zipCode"
          placeholder="00000-000"
          value={formData.zipCode}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.zipCode ? 'border-red-300' : ''}
        />
        {errors.zipCode && (
          <p className="text-sm text-red-500">{errors.zipCode}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            name="street"
            placeholder="Nome da rua"
            value={formData.street}
            onChange={handleChange}
            className={errors.street ? 'border-red-300' : ''}
          />
          {errors.street && (
            <p className="text-sm text-red-500">{errors.street}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            name="number"
            placeholder="123"
            value={formData.number}
            onChange={handleChange}
            className={errors.number ? 'border-red-300' : ''}
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input
          id="neighborhood"
          name="neighborhood"
          placeholder="Nome do bairro"
          value={formData.neighborhood}
          onChange={handleChange}
          className={errors.neighborhood ? 'border-red-300' : ''}
        />
        {errors.neighborhood && (
          <p className="text-sm text-red-500">{errors.neighborhood}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            placeholder="Nome da cidade"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? 'border-red-300' : ''}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            placeholder="UF"
            maxLength={2}
            value={formData.state}
            onChange={handleChange}
            className={errors.state ? 'border-red-300' : ''}
          />
          {errors.state && (
            <p className="text-sm text-red-500">{errors.state}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
