
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Info } from 'lucide-react';

interface DockerManualContentProps {
  manualText: string;
}

const DockerManualContent: React.FC<DockerManualContentProps> = ({ manualText }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-blue-50 border border-blue-200 p-4 mb-4">
        <div className="flex gap-2">
          <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Docker & Docker Compose</h4>
            <p className="text-sm text-blue-700">
              Esta versão do manual utiliza Docker e Docker Compose para uma instalação simplificada e portável. Configuramos Apache ao invés de Nginx para compatibilidade com aplicações PHP tradicionais.
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

export default DockerManualContent;
