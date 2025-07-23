-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  server_url TEXT,
  player_race TEXT,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create villages table
CREATE TABLE public.villages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  coordinates_x INTEGER NOT NULL,
  coordinates_y INTEGER NOT NULL,
  population INTEGER DEFAULT 0,
  is_capital BOOLEAN DEFAULT false,
  resources JSONB DEFAULT '{"wood": 0, "clay": 0, "iron": 0, "crop": 0}',
  buildings JSONB DEFAULT '{}',
  troops JSONB DEFAULT '{}',
  last_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bot_configurations table
CREATE TABLE public.bot_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'stopped' CHECK (status IN ('running', 'stopped', 'paused')),
  strategy TEXT DEFAULT 'balanced' CHECK (strategy IN ('offensive', 'defensive', 'balanced')),
  farming_enabled BOOLEAN DEFAULT true,
  farming_settings JSONB DEFAULT '{}',
  auto_login BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farm_targets table
CREATE TABLE public.farm_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coordinates_x INTEGER NOT NULL,
  coordinates_y INTEGER NOT NULL,
  distance INTEGER,
  last_attack TIMESTAMP WITH TIME ZONE,
  success_rate INTEGER DEFAULT 0,
  resources JSONB DEFAULT '{"wood": 0, "clay": 0, "iron": 0, "crop": 0}',
  danger_level TEXT DEFAULT 'low' CHECK (danger_level IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'disabled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('success', 'warning', 'error', 'info')),
  category TEXT DEFAULT 'system' CHECK (category IN ('farming', 'building', 'troop', 'system')),
  message TEXT NOT NULL,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for villages
CREATE POLICY "Users can view their own villages" 
ON public.villages 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own villages" 
ON public.villages 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- Create RLS policies for bot_configurations
CREATE POLICY "Users can view their own bot config" 
ON public.bot_configurations 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own bot config" 
ON public.bot_configurations 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- Create RLS policies for farm_targets
CREATE POLICY "Users can view their own farm targets" 
ON public.farm_targets 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own farm targets" 
ON public.farm_targets 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- Create RLS policies for activity_logs
CREATE POLICY "Users can view their own activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_configurations_updated_at
  BEFORE UPDATE ON public.bot_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();