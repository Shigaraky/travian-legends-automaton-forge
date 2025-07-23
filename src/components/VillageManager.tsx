import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Hammer, Users, Wheat, TreePine, Mountain, Factory } from "lucide-react";
import { useBotAPI } from "@/hooks/useBotAPI";

export const VillageManager = () => {
  const [villages, setVillages] = useState([]);
  const [currentVillage, setCurrentVillage] = useState(0);
  const { villageAction } = useBotAPI();

  // Mock data for demo - in real app, fetch from Supabase
  useEffect(() => {
    setVillages([
      {
        id: 1,
        name: "Capital Village",
        coordinates: "(125|89)",
        population: 247,
        isCapital: true,
        resources: {
          wood: 1450,
          clay: 1200,
          iron: 890,
          crop: 2100
        },
        buildings: [
          { name: "Main Building", level: 12 },
          { name: "Granary", level: 8 },
          { name: "Warehouse", level: 7 },
          { name: "Marketplace", level: 5 }
        ],
        troops: {
          legionnaire: 25,
          praetorian: 15,
          imperian: 8
        }
      }
    ]);
  }, []);

  const handleVillageAction = async (action: string, params = {}) => {
    try {
      await villageAction({
        action: action as any,
        villageId: villages[currentVillage]?.id.toString(),
        ...params
      });
    } catch (error) {
      console.error('Village action failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Village Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {villages.map((village, index) => (
          <Card 
            key={village.id} 
            className={`cursor-pointer transition-all ${currentVillage === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setCurrentVillage(index)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="w-5 h-5" />
                {village.name}
                {village.isCapital && <Badge variant="outline">Capital</Badge>}
              </CardTitle>
              <CardDescription>{village.coordinates}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Population</span>
                  <span className="font-semibold">{village.population}</span>
                </div>
                <Progress value={(village.population / 500) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Village View */}
      {villages[currentVillage] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              {villages[currentVillage].name} - Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="resources" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="buildings">Buildings</TabsTrigger>
                <TabsTrigger value="troops">Troops</TabsTrigger>
                <TabsTrigger value="queue">Queue</TabsTrigger>
              </TabsList>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TreePine className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Wood</p>
                          <p className="text-lg font-semibold">{villages[currentVillage].resources.wood}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Mountain className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Clay</p>
                          <p className="text-lg font-semibold">{villages[currentVillage].resources.clay}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Factory className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Iron</p>
                          <p className="text-lg font-semibold">{villages[currentVillage].resources.iron}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Wheat className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Crop</p>
                          <p className="text-lg font-semibold">{villages[currentVillage].resources.crop}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="buildings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {villages[currentVillage].buildings.map((building, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hammer className="w-4 h-4" />
                          <span>{building.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Level {building.level}</Badge>
                          <Button 
                            size="sm" 
                            onClick={() => handleVillageAction('build', { buildingType: building.name })}
                          >
                            Upgrade
                          </Button>
                        </div>
                      </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="troops" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(villages[currentVillage].troops).map(([troopType, count]) => (
                    <Card key={troopType}>
                      <CardContent className="p-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <div>
                            <p className="text-sm text-muted-foreground capitalize">{troopType}</p>
                            <p className="text-lg font-semibold">{count as number}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleVillageAction('train', { troopType, quantity: 5 })}
                        >
                          Train +5
                        </Button>
                      </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="queue" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      <Hammer className="w-8 h-8 mx-auto mb-2" />
                      <p>No active construction queue</p>
                      <p className="text-sm">Bot will automatically manage building priorities</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};