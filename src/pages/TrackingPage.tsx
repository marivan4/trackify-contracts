
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { Search, MapPin, Clock, RotateCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Map from '@/components/Map';

// Mock data for tracking history - in a real app, this would come from your backend
const mockTrackingHistory = [
  { id: 1, timestamp: '23/03/2025 10:30:45', latitude: '-23.5505', longitude: '-46.6333', address: 'Av. Paulista, 1000, São Paulo - SP', speed: '0 km/h', status: 'Estacionado' },
  { id: 2, timestamp: '23/03/2025 10:15:22', latitude: '-23.5490', longitude: '-46.6350', address: 'Rua Augusta, 500, São Paulo - SP', speed: '30 km/h', status: 'Em movimento' },
  { id: 3, timestamp: '23/03/2025 10:00:10', latitude: '-23.5480', longitude: '-46.6370', address: 'Rua da Consolação, 200, São Paulo - SP', speed: '25 km/h', status: 'Em movimento' },
  { id: 4, timestamp: '23/03/2025 09:45:05', latitude: '-23.5470', longitude: '-46.6390', address: 'Rua Bela Cintra, 300, São Paulo - SP', speed: '0 km/h', status: 'Estacionado' },
];

// Mock data for vehicles - in a real app, this would come from your backend
const mockVehicles = [
  { id: 1, plate: 'ABC-1234', model: 'Toyota Corolla 2023' },
  { id: 2, plate: 'DEF-5678', model: 'Honda Civic 2024' },
  { id: 3, plate: 'GHI-9012', model: 'Volkswagen Golf 2022' },
];

const TrackingPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [trackingHistory, setTrackingHistory] = useState(mockTrackingHistory);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: '-23.5505',
    longitude: '-46.6333',
    address: 'Av. Paulista, 1000, São Paulo - SP',
    speed: '0 km/h',
    status: 'Estacionado',
    lastUpdate: '23/03/2025 10:30:45'
  });
  
  useEffect(() => {
    // In a real app, you would set up a WebSocket or polling mechanism 
    // to get real-time updates from the tracking system
    const interval = setInterval(() => {
      // Simulate random movement by slightly changing the latitude and longitude
      const randomLat = parseFloat(currentPosition.latitude) + (Math.random() - 0.5) * 0.005;
      const randomLng = parseFloat(currentPosition.longitude) + (Math.random() - 0.5) * 0.005;
      
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      
      const currentTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      
      // Randomly determine if the vehicle is moving or parked
      const isMoving = Math.random() > 0.5;
      const speed = isMoving ? `${Math.floor(Math.random() * 60)} km/h` : '0 km/h';
      const status = isMoving ? 'Em movimento' : 'Estacionado';
      
      setCurrentPosition({
        latitude: randomLat.toFixed(4),
        longitude: randomLng.toFixed(4),
        address: currentPosition.address, // In a real app, you would reverse geocode these coordinates
        speed,
        status,
        lastUpdate: currentTime
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentPosition]);
  
  const handleVehicleChange = (value: string) => {
    setSelectedVehicle(value);
    setLoading(true);
    
    // Simulate API call to fetch tracking data for the selected vehicle
    setTimeout(() => {
      setLoading(false);
      toast.success(`Dados de rastreamento carregados para o veículo ${value}`);
    }, 1000);
  };
  
  const handleSearch = () => {
    if (!searchTerm) {
      toast.error('Por favor, insira uma placa ou chassi para buscar');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to search for a vehicle
    setTimeout(() => {
      const vehicle = mockVehicles.find(v => 
        v.plate.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (vehicle) {
        setSelectedVehicle(vehicle.plate);
        toast.success(`Veículo ${vehicle.plate} encontrado`);
      } else {
        toast.error('Veículo não encontrado');
      }
      
      setLoading(false);
    }, 1000);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate refreshing the tracking data
    setTimeout(() => {
      // Add a new random entry to the tracking history
      const randomLat = parseFloat(currentPosition.latitude) + (Math.random() - 0.5) * 0.005;
      const randomLng = parseFloat(currentPosition.longitude) + (Math.random() - 0.5) * 0.005;
      
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      
      const currentTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      
      const isMoving = Math.random() > 0.5;
      const speed = isMoving ? `${Math.floor(Math.random() * 60)} km/h` : '0 km/h';
      const status = isMoving ? 'Em movimento' : 'Estacionado';
      
      const newEntry = {
        id: trackingHistory.length + 1,
        timestamp: currentTime,
        latitude: randomLat.toFixed(4),
        longitude: randomLng.toFixed(4),
        address: 'Rua Atualizada, 123, São Paulo - SP', // Would be a real address from reverse geocoding
        speed,
        status
      };
      
      setTrackingHistory([newEntry, ...trackingHistory.slice(0, 9)]); // Keep only the last 10 entries
      setRefreshing(false);
      toast.success('Dados de rastreamento atualizados');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-7xl px-4 pt-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Rastreamento em Tempo Real
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe a localização e o histórico de movimentação dos veículos
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-subtle p-6">
              <h2 className="text-xl font-semibold mb-4">Selecionar Veículo</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehicle-select">Veículo</Label>
                  <Select value={selectedVehicle} onValueChange={handleVehicleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.plate}>
                          {vehicle.plate} - {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="search">Buscar por Placa ou Chassi</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      placeholder="Ex: ABC-1234"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={loading}
                      className="flex-shrink-0"
                    >
                      <Search size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-subtle p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Posição Atual</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                >
                  <RotateCw size={16} className={refreshing ? 'animate-spin' : ''} />
                </Button>
              </div>
              
              {selectedVehicle ? (
                <>
                  <div className="space-y-4 mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Veículo:</span>
                      <p className="font-medium">{selectedVehicle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Latitude:</span>
                        <p className="font-medium">{currentPosition.latitude}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Longitude:</span>
                        <p className="font-medium">{currentPosition.longitude}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Endereço:</span>
                      <p className="font-medium">{currentPosition.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Velocidade:</span>
                        <p className="font-medium">{currentPosition.speed}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <p className="font-medium">{currentPosition.status}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Última Atualização:</span>
                      <p className="font-medium">{currentPosition.lastUpdate}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p>Selecione um veículo para ver a posição atual</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Mapa em Tempo Real</h2>
              </div>
              {selectedVehicle ? (
                <div className="aspect-[16/9]">
                  <Map />
                </div>
              ) : (
                <div className="flex items-center justify-center p-12 text-center text-muted-foreground">
                  <div>
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p>Selecione um veículo para visualizar no mapa</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Histórico (últimas 24h)</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span className="text-sm">Atualizado a cada 5 segundos</span>
                </div>
              </div>
              
              {selectedVehicle ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Velocidade</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trackingHistory.map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.timestamp}</TableCell>
                          <TableCell>{entry.address}</TableCell>
                          <TableCell>{entry.speed}</TableCell>
                          <TableCell>{entry.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p>Selecione um veículo para ver o histórico de movimentação</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
