import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Filter, Download, Trash2, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export const ActivityLog = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [logs] = useState([
    {
      id: 1,
      timestamp: "2024-01-15 14:32:15",
      type: "success",
      category: "farming",
      message: "Successfully raided village (142|88) - Gained 450 wood, 320 clay, 180 iron",
      details: "Attack completed with 15 Legionnaires, no losses"
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:45",
      type: "info",
      category: "building",
      message: "Started construction: Granary Level 9",
      details: "Construction time: 42 minutes, Cost: 1200 wood, 800 clay"
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:12",
      type: "warning",
      category: "troop",
      message: "Troop training paused - Insufficient crop",
      details: "Need 200 more crop to continue Legionnaire training"
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:20:33",
      type: "success",
      category: "farming",
      message: "New farm target discovered at (135|92)",
      details: "Distance: 18 squares, Estimated resources: Medium"
    },
    {
      id: 5,
      timestamp: "2024-01-15 14:15:08",
      type: "error",
      category: "system",
      message: "Connection timeout to server",
      details: "Automatically reconnected after 15 seconds"
    },
    {
      id: 6,
      timestamp: "2024-01-15 14:10:22",
      type: "info",
      category: "troop",
      message: "Training completed: 10 Legionnaires",
      details: "Total training time: 25 minutes"
    },
    {
      id: 7,
      timestamp: "2024-01-15 14:05:55",
      type: "success",
      category: "building",
      message: "Building completed: Warehouse Level 8",
      details: "Storage capacity increased to 80,000"
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "error": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "default";
      case "warning": return "secondary";
      case "error": return "destructive";
      default: return "outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "farming": return "default";
      case "building": return "secondary";
      case "troop": return "outline";
      case "system": return "destructive";
      default: return "outline";
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === "all" || log.type === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Activity Log
          </CardTitle>
          <CardDescription>
            Real-time bot activities and system events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>

          {/* Log Entries */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getTypeIcon(log.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">
                            {log.timestamp}
                          </span>
                          <Badge variant={getTypeColor(log.type) as any} className="text-xs">
                            {log.type}
                          </Badge>
                          <Badge variant={getCategoryColor(log.category) as any} className="text-xs">
                            {log.category}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{log.message}</p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p>No logs match your current filter</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Success</p>
                <p className="text-xl font-bold">{logs.filter(l => l.type === 'success').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-xl font-bold">{logs.filter(l => l.type === 'warning').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-xl font-bold">{logs.filter(l => l.type === 'error').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-xl font-bold">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};