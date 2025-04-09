
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from '@/components/Navbar';
import { Badge } from "@/components/ui/badge";
import { RefreshCw, QrCode, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const WhatsAppConnectionPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("disconnected");
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    baseUrl: "https://evolutionapi.gpstracker-16.com.br",
    apiKey: "d9919cda7e370839d33b8946584dac93",
    instance: "assas"
  });

  const MessageFormSchema = z.object({
    phoneNumber: z.string().min(10, "Número de telefone inválido"),
    message: z.string().min(1, "Mensagem não pode estar vazia")
  });

  const form = useForm<z.infer<typeof MessageFormSchema>>({
    resolver: zodResolver(MessageFormSchema),
    defaultValues: {
      phoneNumber: "",
      message: ""
    }
  });

  const fetchQRCode = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would make an actual API request
      // Simulating API call for QR code generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would be the actual URL to the QR code in a real app
      setQrCodeUrl(`${apiConfig.baseUrl}/instance/qr/${apiConfig.instance}`);
      toast.success("QR Code gerado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar QR code:", error);
      toast.error("Erro ao gerar QR code");
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectionState = async () => {
    setIsLoading(true);
    try {
      // Simulating API call to check connection state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll toggle between connected/disconnected
      const newStatus = connectionStatus === "connected" ? "disconnected" : "connected";
      setConnectionStatus(newStatus);
      
      toast.info(`Status da conexão: ${newStatus === "connected" ? "Conectado" : "Desconectado"}`);
    } catch (error) {
      console.error("Erro ao verificar status da conexão:", error);
      toast.error("Erro ao verificar status da conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const restartInstance = async () => {
    setIsLoading(true);
    try {
      // Simulating API call to restart instance
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Instância reiniciada com sucesso");
      setConnectionStatus("disconnected");
      setQrCodeUrl(null);
    } catch (error) {
      console.error("Erro ao reiniciar instância:", error);
      toast.error("Erro ao reiniciar instância");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (values: z.infer<typeof MessageFormSchema>) => {
    if (connectionStatus !== "connected") {
      toast.error("WhatsApp não está conectado");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would make an actual API request to send a message
      console.log("Enviando mensagem:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Mensagem enviada para ${values.phoneNumber}`);
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setIsLoading(false);
    }
  };

  // Save API configuration
  const saveApiConfig = () => {
    // In a real app, this would save to database
    toast.success("Configurações da API salvas com sucesso");
    
    // Reset states to reflect new configuration
    setQrCodeUrl(null);
    setConnectionStatus("disconnected");
  };

  useEffect(() => {
    // Optionally load saved configuration on component mount
    // In a real app, this would fetch from database
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 pt-32">
        <div className="flex flex-col mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conexão WhatsApp</h1>
            <p className="text-muted-foreground mt-1">
              Configure e gerencie a integração com WhatsApp
            </p>
          </div>

          <Badge 
            className={`w-fit ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento do WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="qrcode">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="qrcode">
                  <QrCode className="mr-2 h-4 w-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <Send className="mr-2 h-4 w-4" />
                  Mensagens
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="qrcode" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configuração da API</h3>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="baseUrl">URL Base</Label>
                        <Input 
                          id="baseUrl" 
                          value={apiConfig.baseUrl}
                          onChange={(e) => setApiConfig({...apiConfig, baseUrl: e.target.value})}
                          disabled={!isAdmin()}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="apiKey">Chave API</Label>
                        <Input 
                          id="apiKey" 
                          value={apiConfig.apiKey}
                          onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                          disabled={!isAdmin()}
                          type="password"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="instance">Instância</Label>
                        <Input 
                          id="instance" 
                          value={apiConfig.instance}
                          onChange={(e) => setApiConfig({...apiConfig, instance: e.target.value})}
                          disabled={!isAdmin()}
                        />
                      </div>
                    </div>
                    
                    {isAdmin() && (
                      <Button onClick={saveApiConfig}>
                        Salvar Configurações
                      </Button>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Conectar WhatsApp</h3>
                    
                    <div className="flex flex-wrap gap-4">
                      <Button onClick={fetchQRCode} disabled={isLoading}>
                        Gerar QR Code
                      </Button>
                      <Button onClick={checkConnectionState} variant="outline" disabled={isLoading}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Verificar Conexão
                      </Button>
                      <Button onClick={restartInstance} variant="outline" disabled={isLoading}>
                        Reiniciar API
                      </Button>
                    </div>
                    
                    {qrCodeUrl && (
                      <div className="mt-6 border p-4 rounded-md flex justify-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="WhatsApp QR Code" 
                          className="max-w-[300px]"
                          // In a real app, this would be an actual QR code image
                          // We're using a placeholder here
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm">
                        <strong>Instruções:</strong> Escaneie o QR Code com seu WhatsApp para conectar a instância ao sistema.
                        O QR Code expira após alguns minutos. Se necessário, gere um novo QR Code.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="messages" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Enviar Mensagens</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(sendMessage)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Telefone</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="5511999999999" 
                                {...field} 
                                disabled={connectionStatus !== "connected" || isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Digite sua mensagem..." 
                                className="min-h-[120px]" 
                                {...field} 
                                disabled={connectionStatus !== "connected" || isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={connectionStatus !== "connected" || isLoading}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </Button>
                    </form>
                  </Form>
                  
                  {connectionStatus !== "connected" && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-yellow-700">
                        Você precisa conectar o WhatsApp antes de enviar mensagens.
                        Acesse a aba QR Code para estabelecer a conexão.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppConnectionPage;
