import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Clock, MapPin, Zap, AlertTriangle } from "lucide-react";

export const FarmingConfig = () => {
  const [farmingSettings, setFarmingSettings] = useState({
    enabled: true,
    radius: [15],
    minTroops: 10,
    maxDistance: [25],
    attackInterval: [45], // minutes
    autoReturnHome: true,
    avoidStrongPlayers: true,
    resourceThreshold: [500]
  });

  const [farmTargets] = useState([
    {
      id: 1,
      coordinates: "(130|95)",
      distance: 12,
      lastAttack: "2 hours ago",
      success: 85,
      resources: { wood: 450, clay: 320, iron: 180, crop: 200 },
      danger: "low",
      status: "active"
    },
    {
      id: 2,
      coordinates: "(118|102)",
      distance: 18,
      lastAttack: "45 minutes ago",
      success: 92,
      resources: { wood: 680, clay: 520, iron: 340, crop: 410 },
      danger: "low",
      status: "active"
    },
    {
      id: 3,
      coordinates: "(142|88)",
      distance: 22,
      lastAttack: "3 hours ago",
      success: 67,
      resources: { wood: 280, clay: 150, iron: 120, crop: 90 },
      danger: "medium",
      status: "paused"
    }
  ]);

  const getDangerColor = (danger: string) => {
    switch (danger) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "paused": return "warning";
      case "disabled": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Farming Configuration
          </CardTitle>
          <CardDescription>
            Configure automated farming and raiding parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="farming-enabled"
              checked={farmingSettings.enabled}
              onCheckedChange={(checked) => setFarmingSettings({...farmingSettings, enabled: checked})}
            />
            <Label htmlFor="farming-enabled">Enable automatic farming</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Search Radius: {farmingSettings.radius[0]} squares</Label>
              <Slider
                value={farmingSettings.radius}
                onValueChange={(value) => setFarmingSettings({...farmingSettings, radius: value})}
                max={50}
                min={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Max Distance: {farmingSettings.maxDistance[0]} squares</Label>
              <Slider
                value={farmingSettings.maxDistance}
                onValueChange={(value) => setFarmingSettings({...farmingSettings, maxDistance: value})}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-troops">Minimum Troops Required</Label>
              <Input
                id="min-troops"
                type="number"
                value={farmingSettings.minTroops}
                onChange={(e) => setFarmingSettings({...farmingSettings, minTroops: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Attack Interval: {farmingSettings.attackInterval[0]} minutes</Label>
              <Slider
                value={farmingSettings.attackInterval}
                onValueChange={(value) => setFarmingSettings({...farmingSettings, attackInterval: value})}
                max={180}
                min={15}
                step={15}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-return"
                checked={farmingSettings.autoReturnHome}
                onCheckedChange={(checked) => setFarmingSettings({...farmingSettings, autoReturnHome: checked})}
              />
              <Label htmlFor="auto-return">Auto-return troops to village</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="avoid-strong"
                checked={farmingSettings.avoidStrongPlayers}
                onCheckedChange={(checked) => setFarmingSettings({...farmingSettings, avoidStrongPlayers: checked})}
              />
              <Label htmlFor="avoid-strong">Avoid strong/active players</Label>
            </div>
          </div>

          <Button className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Save Farming Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Active Farm Targets
          </CardTitle>
          <CardDescription>
            Current farming targets and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {farmTargets.map((target) => (
              <Card key={target.id} className="border-l-4 border-l-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold">{target.coordinates}</p>
                        <p className="text-sm text-muted-foreground">
                          Distance: {target.distance} squares • Last attack: {target.lastAttack}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getDangerColor(target.danger) as any}>
                          {target.danger} risk
                        </Badge>
                        <Badge variant={getStatusColor(target.status) as any}>
                          {target.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Success: {target.success}%</span>
                      </div>
                      <Progress value={target.success} className="w-24 h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                    <div className="text-center">
                      <p className="text-muted-foreground">Wood</p>
                      <p className="font-semibold">{target.resources.wood}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Clay</p>
                      <p className="font-semibold">{target.resources.clay}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Iron</p>
                      <p className="font-semibold">{target.resources.iron}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Crop</p>
                      <p className="font-semibold">{target.resources.crop}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Scan for New Targets
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};