import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Globe, User, Lock, Server, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBotAPI } from "@/hooks/useBotAPI";

export const LoginConfig = () => {
  const [credentials, setCredentials] = useState({
    email: "saintg3nl@gmail.com",
    password: "Artlab2022!!",
    serverUrl: "https://ts30.x3.europe.travian.com/dorf1.php",
    autoLogin: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [playerData, setPlayerData] = useState<any>(null);
  const { loginToTravian } = useBotAPI();

  const handleSave = async () => {
    if (!credentials.email || !credentials.password || !credentials.serverUrl) {
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await loginToTravian(credentials);
      setIsConnected(true);
      setPlayerData(data);
    } catch (error) {
      setIsConnected(false);
      setPlayerData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    if (!credentials.serverUrl) return;
    
    setIsLoading(true);
    try {
      await loginToTravian({ ...credentials, email: "test", password: "test" });
    } catch (error) {
      // Expected to fail for test credentials
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Configuration
          </CardTitle>
          <CardDescription>
            Configure your Travian Legends account credentials and server details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="server">Server URL</Label>
            <Input
              id="server"
              value={credentials.serverUrl}
              onChange={(e) => setCredentials({...credentials, serverUrl: e.target.value})}
              placeholder="https://ts30.x3.europe.travian.com/dorf1.php"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-login"
              checked={credentials.autoLogin}
              onCheckedChange={(checked) => setCredentials({...credentials, autoLogin: checked})}
            />
            <Label htmlFor="auto-login">Auto-login on bot start</Label>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your credentials are stored locally and encrypted. The bot uses browser automation to simulate real login.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              className="flex items-center gap-2"
              disabled={isLoading || !credentials.email || !credentials.password || !credentials.serverUrl}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {isConnected ? "Connected" : "Save & Connect"}
            </Button>
            <Button 
              onClick={testConnection} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isLoading || !credentials.serverUrl}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Server Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected && playerData ? (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Server Speed</Label>
                <p className="font-semibold">3x Speed</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Player Race</Label>
                <p className="font-semibold">{playerData.race}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Villages</Label>
                <p className="font-semibold">{playerData.villages?.length || 0}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Connect to server to view information</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};