
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { FileText, Terminal, Database, Shield } from 'lucide-react';

import { ubuntuManualText, dockerManualText } from './installation/manualContent';
import UbuntuManualContent from './installation/UbuntuManualContent';
import DockerManualContent from './installation/DockerManualContent';
import ManualFeatureCard from './installation/ManualFeatureCard';
import ManualActions from './installation/ManualActions';

const InstallationManual = () => {
  const [activeTab, setActiveTab] = useState('ubuntu');
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Manual copiado para a área de transferência');
  };
  
  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Manual baixado com sucesso');
  };
  
  const getActiveManualText = () => {
    switch(activeTab) {
      case 'ubuntu': return ubuntuManualText;
      case 'docker': return dockerManualText;
      default: return ubuntuManualText;
    }
  };
  
  const getDownloadFilename = () => {
    switch(activeTab) {
      case 'ubuntu': return 'manual_instalacao_ubuntu_22_04.md';
      case 'docker': return 'manual_instalacao_docker.md';
      default: return 'manual_instalacao.md';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-semibold tracking-tight">Manual de Instalação</h2>
        </div>
        <ManualActions 
          onCopy={() => handleCopy(getActiveManualText())}
          onDownload={() => handleDownload(getActiveManualText(), getDownloadFilename())}
        />
      </div>
      
      <Card className="bg-white">
        <CardContent className="p-4">
          <Tabs defaultValue="ubuntu" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="ubuntu" className="flex items-center gap-2">
                <Terminal size={16} />
                <span>Ubuntu 22.04 com Apache</span>
              </TabsTrigger>
              <TabsTrigger value="docker" className="flex items-center gap-2">
                <Terminal size={16} />
                <span>Docker</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ubuntu">
              <UbuntuManualContent manualText={ubuntuManualText} />
            </TabsContent>
            
            <TabsContent value="docker">
              <DockerManualContent manualText={dockerManualText} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ManualFeatureCard 
          icon={Terminal}
          title="Comandos Completos"
          description="Todos os comandos necessários para instalação e configuração do sistema."
        />
        
        <ManualFeatureCard 
          icon={Database}
          title="Configuração do Banco"
          description="Instruções detalhadas para configuração do MySQL e importação do esquema."
        />
        
        <ManualFeatureCard 
          icon={Shield}
          title="Segurança e Backups"
          description="Procedimentos para configurar firewall, SSL e rotinas de backup automático."
        />
      </div>
      
      <p className="text-sm text-muted-foreground">
        Este manual contém as instruções completas para instalar o sistema de rastreamento veicular em produção.
        Para qualquer dúvida adicional, entre em contato com o suporte técnico.
      </p>
    </div>
  );
};

export default InstallationManual;
