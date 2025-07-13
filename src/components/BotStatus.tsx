import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Zap, Shield, Target, Users, AlertTriangle } from "lucide-react";

interface BotStatusProps {
  botStatus: 'stopped' | 'running' | 'paused';
  isConnected: boolean;
}

export const BotStatus = ({ botStatus, isConnected }: BotStatusProps) => {
  const stats = {
    uptime: "2h 34m",
    actionsCompleted: 147,
    resourcesGained: 15420,
    attacksLaunched: 23,
    buildingsUpgraded: 5,
    troopsTrained: 45
  };

  const getStatusColor = () => {
    switch (botStatus) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      default: return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant={getStatusColor() as any} className="mb-2">
                {botStatus.toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground">Bot Status</p>
            </div>
            <div className="text-center">
              <Badge variant={isConnected ? "default" : "destructive"} className="mb-2">
                {isConnected ? "CONNECTED" : "DISCONNECTED"}
              </Badge>
              <p className="text-sm text-muted-foreground">Server Connection</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                {stats.uptime}
              </Badge>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>

          {botStatus === 'running' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Activity</span>
                <span className="font-semibold">Scanning for farm targets...</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Actions Completed</p>
                <p className="text-2xl font-bold">{stats.actionsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Resources Gained</p>
                <p className="text-2xl font-bold">{stats.resourcesGained.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Attacks Launched</p>
                <p className="text-2xl font-bold">{stats.attacksLaunched}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Troops Trained</p>
                <p className="text-2xl font-bold">{stats.troopsTrained}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Buildings Upgraded</p>
                <p className="text-2xl font-bold">{stats.buildingsUpgraded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-success" />
                <span className="text-sm">Farming raid to (142|88)</span>
              </div>
              <Badge variant="outline">In Progress</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-warning" />
                <span className="text-sm">Training 10 Legionnaires</span>
              </div>
              <Badge variant="outline">Queue: 15m</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm">Building Granary Level 9</span>
              </div>
              <Badge variant="outline">Queue: 42m</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>No active alerts</p>
            <p className="text-sm">System running smoothly</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};