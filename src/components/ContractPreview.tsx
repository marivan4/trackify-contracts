
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ContractData, generateContractPdf, savePdf, printPdf } from '@/utils/contractGenerator';
import { Download, Printer, Send } from 'lucide-react';

interface ContractPreviewProps {
  contractData: ContractData;
  onSendWhatsApp: () => void;
}

const ContractPreview: React.FC<ContractPreviewProps> = ({ contractData, onSendWhatsApp }) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const generatePreview = async () => {
      try {
        setLoading(true);
        const blob = await generateContractPdf(contractData);
        setPdfBlob(blob);
        
        // Create object URL for preview
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // Clean up object URL when component unmounts
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error generating preview:', error);
      } finally {
        setLoading(false);
      }
    };
    
    generatePreview();
  }, [contractData]);

  const handleDownload = async () => {
    if (pdfBlob) {
      const fileName = `contrato_${contractData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
      await savePdf(pdfBlob, fileName);
    }
  };

  const handlePrint = async () => {
    if (pdfBlob) {
      await printPdf(pdfBlob);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">Prévia do Contrato</h3>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            disabled={loading || !pdfBlob}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Baixar PDF</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            disabled={loading || !pdfBlob}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSendWhatsApp}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Send size={16} />
            <span>Enviar por WhatsApp</span>
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-pulse text-center">
            <p>Gerando prévia do contrato...</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white shadow-subtle">
          <iframe 
            src={previewUrl} 
            className="w-full h-[600px] border-none" 
            title="Contract Preview" 
          />
        </div>
      )}
    </div>
  );
};

export default ContractPreview;
