
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Info } from 'lucide-react';

interface UbuntuManualContentProps {
  manualText: string;
}

const UbuntuManualContent: React.FC<UbuntuManualContentProps> = ({ manualText }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-amber-50 border border-amber-200 p-4 mb-4">
        <div className="flex gap-2">
          <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Dica de Instalação</h4>
            <p className="text-sm text-amber-700">
              Este manual é para instalação completa em servidor Ubuntu 22.04 LTS com Apache e PHP 8.1. O manual inclui todos os passos necessários para configurar o ambiente de produção, incluindo banco de dados, servidor web e configurações de segurança.
            </p>
          </div>
        </div>
      </div>
      
      <Textarea 
        className="font-mono text-sm h-[500px] p-4 resize-none" 
        value={manualText} 
        readOnly 
      />
    </div>
  );
};

export default UbuntuManualContent;
