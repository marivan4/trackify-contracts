
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { getClientIP, getGeolocation } from '@/utils/contractGenerator';

interface SignatureCaptureProps {
  onCapture: (signatureInfo: {
    ipAddress: string;
    signatureDate: string;
    geolocation: string;
  }) => void;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({ onCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [ipAddress, setIpAddress] = useState<string>('');
  const [geolocation, setGeolocation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get client IP and geolocation when component mounts
    const fetchClientInfo = async () => {
      try {
        const ip = await getClientIP();
        setIpAddress(ip);
        
        if (ip && ip !== 'IP não disponível') {
          const geo = await getGeolocation(ip);
          setGeolocation(geo);
        }
      } catch (error) {
        console.error('Error fetching client information:', error);
      }
    };
    
    fetchClientInfo();
    
    // Initialize canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000';
        
        // Clear canvas initially
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        
        let x, y;
        
        if ('touches' in e) {
          // Touch event
          const rect = canvas.getBoundingClientRect();
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          // Mouse event
          x = e.nativeEvent.offsetX;
          y = e.nativeEvent.offsetY;
        }
        
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling when drawing
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  };

  const handleCapture = () => {
    setLoading(true);
    
    setTimeout(() => {
      const currentDate = new Date().toLocaleString('pt-BR', { 
        timeZone: 'America/Sao_Paulo' 
      });
      
      onCapture({
        ipAddress,
        signatureDate: currentDate,
        geolocation
      });
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-muted-foreground">
        Assine abaixo para confirmar a aceitação dos termos do contrato
      </p>
      
      <div className="border rounded-md p-1 bg-background">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full h-[200px] border rounded-md cursor-crosshair bg-[#f9f9f9]"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={handleMouseMove}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={handleTouchMove}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={clearSignature}>
          Limpar Assinatura
        </Button>
        
        <Button 
          type="button" 
          onClick={handleCapture} 
          disabled={!hasSignature || loading}
          className="ml-auto"
        >
          {loading ? 'Processando...' : 'Confirmar Assinatura'}
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p>IP do Assinante: {ipAddress || 'Carregando...'}</p>
        <p>Data: {new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
        <p>Localização: {geolocation || 'Carregando...'}</p>
      </div>
    </div>
  );
};

export default SignatureCapture;
