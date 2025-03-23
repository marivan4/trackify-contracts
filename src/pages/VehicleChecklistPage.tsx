
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Car, Clipboard, Camera, Save } from 'lucide-react';

const VehicleChecklistPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [activeTab, setActiveTab] = useState('exterior');
  const [loading, setLoading] = useState(false);
  
  const [checklist, setChecklist] = useState({
    exterior: {
      bodyDamage: false,
      paintScratches: false,
      windshield: false,
      lights: false,
      tires: false,
      notes: ''
    },
    interior: {
      seats: false,
      dashboard: false,
      steeringWheel: false,
      airConditioner: false,
      radioSystem: false,
      notes: ''
    },
    mechanical: {
      engine: false,
      oilLevel: false,
      brakes: false,
      transmission: false,
      batteryCondition: false,
      notes: ''
    },
    accessories: {
      spareTire: false,
      jackTool: false,
      manuals: false,
      firstAidKit: false,
      fireExtinguisher: false,
      notes: ''
    }
  });

  const handleCheckboxChange = (category: keyof typeof checklist, item: string, checked: boolean) => {
    setChecklist({
      ...checklist,
      [category]: {
        ...checklist[category],
        [item]: checked
      }
    });
  };

  const handleNotesChange = (category: keyof typeof checklist, value: string) => {
    setChecklist({
      ...checklist,
      [category]: {
        ...checklist[category],
        notes: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to save the checklist
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Checklist salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar checklist:', error);
      toast.error('Erro ao salvar checklist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 pt-32">
        <div className="flex flex-col mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Checklist do Veículo</h1>
            <p className="text-muted-foreground mt-1">
              Contrato #{contractId} - Verificação de condições do veículo
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                <span>Formulário de Inspeção</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="exterior">Exterior</TabsTrigger>
                  <TabsTrigger value="interior">Interior</TabsTrigger>
                  <TabsTrigger value="mechanical">Mecânica</TabsTrigger>
                  <TabsTrigger value="accessories">Acessórios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="exterior" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bodyDamage" 
                        checked={checklist.exterior.bodyDamage}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('exterior', 'bodyDamage', checked as boolean)
                        }
                      />
                      <Label htmlFor="bodyDamage">Danos na carroceria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paintScratches" 
                        checked={checklist.exterior.paintScratches}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('exterior', 'paintScratches', checked as boolean)
                        }
                      />
                      <Label htmlFor="paintScratches">Arranhões na pintura</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="windshield" 
                        checked={checklist.exterior.windshield}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('exterior', 'windshield', checked as boolean)
                        }
                      />
                      <Label htmlFor="windshield">Para-brisa em boas condições</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lights" 
                        checked={checklist.exterior.lights}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('exterior', 'lights', checked as boolean)
                        }
                      />
                      <Label htmlFor="lights">Luzes funcionando corretamente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tires" 
                        checked={checklist.exterior.tires}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('exterior', 'tires', checked as boolean)
                        }
                      />
                      <Label htmlFor="tires">Pneus em boas condições</Label>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="exteriorNotes">Observações</Label>
                      <Textarea 
                        id="exteriorNotes" 
                        placeholder="Detalhes adicionais sobre o exterior do veículo"
                        value={checklist.exterior.notes}
                        onChange={(e) => handleNotesChange('exterior', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="interior" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="seats" 
                        checked={checklist.interior.seats}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('interior', 'seats', checked as boolean)
                        }
                      />
                      <Label htmlFor="seats">Bancos em boas condições</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dashboard" 
                        checked={checklist.interior.dashboard}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('interior', 'dashboard', checked as boolean)
                        }
                      />
                      <Label htmlFor="dashboard">Painel em boas condições</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="steeringWheel" 
                        checked={checklist.interior.steeringWheel}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('interior', 'steeringWheel', checked as boolean)
                        }
                      />
                      <Label htmlFor="steeringWheel">Volante em boas condições</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="airConditioner" 
                        checked={checklist.interior.airConditioner}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('interior', 'airConditioner', checked as boolean)
                        }
                      />
                      <Label htmlFor="airConditioner">Ar condicionado funcionando</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="radioSystem" 
                        checked={checklist.interior.radioSystem}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('interior', 'radioSystem', checked as boolean)
                        }
                      />
                      <Label htmlFor="radioSystem">Sistema de som funcionando</Label>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="interiorNotes">Observações</Label>
                      <Textarea 
                        id="interiorNotes" 
                        placeholder="Detalhes adicionais sobre o interior do veículo"
                        value={checklist.interior.notes}
                        onChange={(e) => handleNotesChange('interior', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="mechanical" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="engine" 
                        checked={checklist.mechanical.engine}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('mechanical', 'engine', checked as boolean)
                        }
                      />
                      <Label htmlFor="engine">Motor em boas condições</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="oilLevel" 
                        checked={checklist.mechanical.oilLevel}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('mechanical', 'oilLevel', checked as boolean)
                        }
                      />
                      <Label htmlFor="oilLevel">Nível de óleo adequado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="brakes" 
                        checked={checklist.mechanical.brakes}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('mechanical', 'brakes', checked as boolean)
                        }
                      />
                      <Label htmlFor="brakes">Freios funcionando corretamente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="transmission" 
                        checked={checklist.mechanical.transmission}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('mechanical', 'transmission', checked as boolean)
                        }
                      />
                      <Label htmlFor="transmission">Transmissão funcionando corretamente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="batteryCondition" 
                        checked={checklist.mechanical.batteryCondition}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('mechanical', 'batteryCondition', checked as boolean)
                        }
                      />
                      <Label htmlFor="batteryCondition">Bateria em boas condições</Label>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="mechanicalNotes">Observações</Label>
                      <Textarea 
                        id="mechanicalNotes" 
                        placeholder="Detalhes adicionais sobre a mecânica do veículo"
                        value={checklist.mechanical.notes}
                        onChange={(e) => handleNotesChange('mechanical', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="accessories" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spareTire" 
                        checked={checklist.accessories.spareTire}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('accessories', 'spareTire', checked as boolean)
                        }
                      />
                      <Label htmlFor="spareTire">Pneu sobressalente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="jackTool" 
                        checked={checklist.accessories.jackTool}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('accessories', 'jackTool', checked as boolean)
                        }
                      />
                      <Label htmlFor="jackTool">Macaco e ferramentas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="manuals" 
                        checked={checklist.accessories.manuals}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('accessories', 'manuals', checked as boolean)
                        }
                      />
                      <Label htmlFor="manuals">Manuais do veículo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="firstAidKit" 
                        checked={checklist.accessories.firstAidKit}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('accessories', 'firstAidKit', checked as boolean)
                        }
                      />
                      <Label htmlFor="firstAidKit">Kit de primeiros socorros</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="fireExtinguisher" 
                        checked={checklist.accessories.fireExtinguisher}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('accessories', 'fireExtinguisher', checked as boolean)
                        }
                      />
                      <Label htmlFor="fireExtinguisher">Extintor de incêndio</Label>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="accessoriesNotes">Observações</Label>
                      <Textarea 
                        id="accessoriesNotes" 
                        placeholder="Detalhes adicionais sobre os acessórios do veículo"
                        value={checklist.accessories.notes}
                        onChange={(e) => handleNotesChange('accessories', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 space-y-4">
                <div className="space-y-2">
                  <Label>Anexar Fotos</Label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste e solte as fotos aqui ou clique para selecionar
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      multiple
                    />
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Selecionar Fotos
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button">
                <Clipboard className="mr-2 h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Salvando...' : 'Finalizar Checklist'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default VehicleChecklistPage;
