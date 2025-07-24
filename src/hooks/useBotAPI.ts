import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBotAPI = () => {
  const { toast } = useToast();

  const loginToTravian = async (credentials: {
    email: string;
    password: string;
    serverUrl: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-login', {
        body: credentials
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Login Successful",
          description: `Connected to ${credentials.serverUrl} as ${data.data.race}`,
        });
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const controlBot = async (action: 'start' | 'pause' | 'stop', botId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('bot-control', {
        body: { action, botId }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Bot Control",
          description: data.message,
        });
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Bot Control Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const villageAction = async (actionData: {
    action: 'build' | 'train' | 'farm' | 'evacuate';
    villageId?: string;
    buildingType?: string;
    troopType?: string;
    quantity?: number;
    sessionCookies?: string;
    serverUrl?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('village-actions', {
        body: actionData
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Village Action",
          description: data.message,
        });
        return data.result;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Village Action Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStrategy = async (strategyData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('strategy-update', {
        body: strategyData
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Strategy Updated",
          description: data.message,
        });
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Strategy Update Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    loginToTravian,
    controlBot,
    villageAction,
    updateStrategy
  };
};