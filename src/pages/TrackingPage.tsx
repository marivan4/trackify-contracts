
import React, { useState } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, Clock, Route, Car, Search } from 'lucide-react';
import Map from '@/components/Map';

// Mock data for vehicles
const mockVehicles = [
  { id: 1, licensePlate: 'ABC-1234', model: 'Toyota Corolla 2023', lastPosition: { lat: -23.5505, lng: -46.6333 } },
  { id: 2, licensePlate: 'DEF-5678', model: 'Honda Civic 2024', lastPosition: { lat: -22.9068, lng: -43.1729 } },
  { id: 3, licensePlate: 'GHI-9012', model: 'Volkswagen Golf 2022', lastPosition: { lat: -25.4284, lng: -49.2733 } },
];

// Mock data for tracking history
const mockHistory = [
  { timestamp: '23/03/2025 08:15', location: 'Av. Paulista, 1000, São Paulo', speed: 45, status: 'Em movimento' },
  { timestamp: '23/03/2025 09:30', location: 'Rua Augusta, 500, São Paulo', speed: 0, status: 'Parado' },
  { timestamp: '23/03/2025 10:45', location: 'Av. Rebouças, 750, São Paulo', speed: 35, status: 'Em movimento' },
  { timestamp: '23/03/2025 12:00', location: 'Av. Brigadeiro Faria Lima, 1500, São Paulo', speed: 0, status: 'Parado' },
  { timestamp: '23/03/2025 13:15', location: 'Av. Paulista, 2000, São Paulo', speed: 40, status: 'Em movimento' },
];

const TrackingPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('realtime');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const handleVehicleSelect = (value: string) => {
    setSelectedVehicle(value);
    toast.success(`Veículo ${value} selecionado`);
  };
  
  const filteredVehicles = mockVehicles.filter(vehicle => 
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-7xl px-4 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rastreamento</h1>
            <p className="text-muted-foreground mt-1">
              Monitore seus veículos em tempo real
            </p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar por placa ou modelo..."
                className="pl-10 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select 
              value={selectedVehicle} 
              onValueChange={handleVehicleSelect}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Selecionar veículo" />
              </SelectTrigger>
              <SelectContent>
                {filteredVehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.licensePlate}>
                    {vehicle.licensePlate} - {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Mapa de Rastreamento
                </CardTitle>
                {selectedVehicle && (
                  <CardDescription>
                    Veículo selecionado: <span className="font-medium">{selectedVehicle}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="h-[400px] lg:h-[500px] relative">
                <Map />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle>Informações do Veículo</CardTitle>
                <CardDescription>
                  {selectedVehicle ? 
                    `Detalhes do veículo ${selectedVehicle}` : 
                    'Selecione um veículo para ver detalhes'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {selectedVehicle ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
                      <TabsTrigger value="history">Histórico</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="realtime" className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Car className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Veículo</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedVehicle} - {mockVehicles.find(v => v.licensePlate === selectedVehicle)?.model}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Localização Atual</p>
                            <p className="text-sm text-muted-foreground">
                              Av. Paulista, 1000, São Paulo - SP
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Última Atualização</p>
                            <p className="text-sm text-muted-foreground">
                              23/03/2025 às 14:30
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Route className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Status</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <p className="text-sm">Em movimento - 45 km/h</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="history" className="pt-4">
                      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
                        {mockHistory.map((entry, index) => (
                          <div 
                            key={index} 
                            className="border-l-2 border-primary/20 pl-4 py-2 relative"
                          >
                            <div className="absolute w-3 h-3 rounded-full bg-primary top-3 -left-[6.5px]" />
                            <p className="font-medium text-sm">{entry.timestamp}</p>
                            <p className="text-xs text-muted-foreground">{entry.location}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${entry.speed > 0 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                              <p className="text-xs">{entry.status} {entry.speed > 0 ? `- ${entry.speed} km/h` : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Car className="h-12 w-12 mb-4 opacity-20" />
                    <p>Selecione um veículo para visualizar informações de rastreamento</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-end">
                {selectedVehicle && (
                  <Button variant="outline" size="sm">
                    Ver relatório completo
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
