import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Sword, Users, Home, Settings, Play, Pause, RotateCcw } from "lucide-react";
import { LoginConfig } from "./LoginConfig";
import { StrategySettings } from "./StrategySettings";
import { VillageManager } from "./VillageManager";
import { FarmingConfig } from "./FarmingConfig";
import { BotStatus } from "./BotStatus";
import { ActivityLog } from "./ActivityLog";
import { useBotAPI } from "@/hooks/useBotAPI";
import { Toaster } from "@/components/ui/toaster";

const TravianBotDashboard = () => {
  const [botStatus, setBotStatus] = useState<'stopped' | 'running' | 'paused'>('stopped');
  const [isConnected, setIsConnected] = useState(false);
  const { controlBot } = useBotAPI();
  
  const handleStartBot = async () => {
    try {
      await controlBot('start');
      setBotStatus('running');
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to start bot:', error);
    }
  };

  const handlePauseBot = async () => {
    try {
      await controlBot('pause');
      setBotStatus(botStatus === 'paused' ? 'running' : 'paused');
    } catch (error) {
      console.error('Failed to pause bot:', error);
    }
  };

  const handleStopBot = async () => {
    try {
      await controlBot('stop');
      setBotStatus('stopped');
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to stop bot:', error);
    }
  };

  const getStatusColor = () => {
    switch (botStatus) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      default: return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="text-primary" />
              Travian Legends Automaton Forge
            </h1>
            <p className="text-muted-foreground">Advanced automation for strategic dominance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={getStatusColor() as any} className="px-3 py-1">
              {botStatus.toUpperCase()}
            </Badge>
            {isConnected && (
              <Badge variant="outline" className="px-3 py-1">
                Connected to Server
              </Badge>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Bot Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={handleStartBot} disabled={botStatus === 'running'} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Bot
              </Button>
              <Button 
                onClick={handlePauseBot} 
                disabled={botStatus === 'stopped'}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                {botStatus === 'paused' ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                onClick={handleStopBot} 
                disabled={botStatus === 'stopped'}
                variant="destructive" 
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Stop Bot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="villages" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Villages
            </TabsTrigger>
            <TabsTrigger value="farming" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Farming
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Status
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginConfig />
          </TabsContent>

          <TabsContent value="strategy">
            <StrategySettings />
          </TabsContent>

          <TabsContent value="villages">
            <VillageManager />
          </TabsContent>

          <TabsContent value="farming">
            <FarmingConfig />
          </TabsContent>

          <TabsContent value="status">
            <BotStatus botStatus={botStatus} isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="logs">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
};

export default TravianBotDashboard;