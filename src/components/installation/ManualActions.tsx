
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ManualActionsProps {
  onCopy: () => void;
  onDownload: () => void;
}

const ManualActions: React.FC<ManualActionsProps> = ({ onCopy, onDownload }) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCopy}
        className="flex items-center gap-2"
      >
        <Copy size={16} />
        <span>Copiar</span>
      </Button>
      <Button 
        size="sm" 
        onClick={onDownload}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        <span>Baixar</span>
      </Button>
    </div>
  );
};

export default ManualActions;
