import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sword, Shield, Users, Target, Clock, Zap, Loader2 } from "lucide-react";
import { useBotAPI } from "@/hooks/useBotAPI";

export const StrategySettings = () => {
  const [strategy, setStrategy] = useState({
    mode: "balanced", // offensive, balanced, defensive
    aggressiveness: [50],
    race: "romans", // romans, gauls, teutons
    buildingPriority: "resources", // resources, military, infrastructure
    autoTraining: true,
    troopRatio: [60], // offense vs defense ratio
    farmingRadius: [10],
    farmingFrequency: [30] // minutes
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateStrategy } = useBotAPI();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateStrategy({
        ...strategy,
        aggressiveness: strategy.aggressiveness[0],
        troopRatio: strategy.troopRatio[0],
        farmingRadius: strategy.farmingRadius[0],
        farmingFrequency: strategy.farmingFrequency[0]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case "offensive":
        return "Focus on military production, aggressive farming, and rapid expansion";
      case "defensive":
        return "Prioritize defensive structures, troop preservation, and resource protection";
      default:
        return "Balanced approach between offense and defense, steady growth";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Strategy Configuration
          </CardTitle>
          <CardDescription>
            Configure the bot's behavior and decision-making patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Strategy Mode</Label>
              <Select 
                value={strategy.mode} 
                onValueChange={(value) => setStrategy({...strategy, mode: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offensive">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4" />
                      Offensive
                    </div>
                  </SelectItem>
                  <SelectItem value="balanced">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Balanced
                    </div>
                  </SelectItem>
                  <SelectItem value="defensive">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Defensive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {getModeDescription(strategy.mode)}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Player Race</Label>
              <Select 
                value={strategy.race} 
                onValueChange={(value) => setStrategy({...strategy, race: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romans">Romans (Balanced)</SelectItem>
                  <SelectItem value="teutons">Teutons (Offensive)</SelectItem>
                  <SelectItem value="gauls">Gauls (Defensive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Aggressiveness Level: {strategy.aggressiveness[0]}%</Label>
              <Slider
                value={strategy.aggressiveness}
                onValueChange={(value) => setStrategy({...strategy, aggressiveness: value})}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Offense/Defense Ratio: {strategy.troopRatio[0]}% Offense</Label>
              <Slider
                value={strategy.troopRatio}
                onValueChange={(value) => setStrategy({...strategy, troopRatio: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Farming Radius: {strategy.farmingRadius[0]} squares</Label>
              <Slider
                value={strategy.farmingRadius}
                onValueChange={(value) => setStrategy({...strategy, farmingRadius: value})}
                max={50}
                min={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Farming Frequency: {strategy.farmingFrequency[0]} minutes</Label>
              <Slider
                value={strategy.farmingFrequency}
                onValueChange={(value) => setStrategy({...strategy, farmingFrequency: value})}
                max={180}
                min={15}
                step={15}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-training"
              checked={strategy.autoTraining}
              onCheckedChange={(checked) => setStrategy({...strategy, autoTraining: checked})}
            />
            <Label htmlFor="auto-training">Enable automatic troop training</Label>
          </div>

          <Button onClick={handleSave} className="flex items-center gap-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Apply Strategy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};