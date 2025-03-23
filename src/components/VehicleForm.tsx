
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateLicensePlate, validateIMEI } from '@/utils/validations';

interface VehicleFormProps {
  formData: {
    vehicleModel: string;
    licensePlate: string;
    trackerModel: string;
    imei: string;
    installationLocation: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate fields on blur
    if (name === 'licensePlate' && value && !validateLicensePlate(value)) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: 'Placa inválida. Use o formato ABC-1234 ou ABC1D23.' 
      }));
    }
    
    if (name === 'imei' && value && !validateIMEI(value)) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: 'IMEI inválido. Deve conter 15 dígitos numéricos.' 
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="vehicleModel">Modelo do Veículo</Label>
        <Input
          id="vehicleModel"
          name="vehicleModel"
          placeholder="Ex: Toyota Corolla 2023"
          value={formData.vehicleModel}
          onChange={handleChange}
          className={errors.vehicleModel ? 'border-red-300' : ''}
        />
        {errors.vehicleModel && (
          <p className="text-sm text-red-500">{errors.vehicleModel}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="licensePlate">Placa do Veículo</Label>
        <Input
          id="licensePlate"
          name="licensePlate"
          placeholder="Ex: ABC-1234"
          value={formData.licensePlate}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.licensePlate ? 'border-red-300' : ''}
        />
        {errors.licensePlate && (
          <p className="text-sm text-red-500">{errors.licensePlate}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="trackerModel">Modelo do Rastreador</Label>
        <Input
          id="trackerModel"
          name="trackerModel"
          placeholder="Ex: GPS Tracker Pro"
          value={formData.trackerModel}
          onChange={handleChange}
          className={errors.trackerModel ? 'border-red-300' : ''}
        />
        {errors.trackerModel && (
          <p className="text-sm text-red-500">{errors.trackerModel}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imei">IMEI do Rastreador</Label>
        <Input
          id="imei"
          name="imei"
          placeholder="15 dígitos numéricos"
          value={formData.imei}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={15}
          className={errors.imei ? 'border-red-300' : ''}
        />
        {errors.imei && (
          <p className="text-sm text-red-500">{errors.imei}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="installationLocation">Local de Instalação</Label>
        <Input
          id="installationLocation"
          name="installationLocation"
          placeholder="Ex: Concessionária Autorizada"
          value={formData.installationLocation}
          onChange={handleChange}
          className={errors.installationLocation ? 'border-red-300' : ''}
        />
        {errors.installationLocation && (
          <p className="text-sm text-red-500">{errors.installationLocation}</p>
        )}
      </div>
    </div>
  );
};

export default VehicleForm;
