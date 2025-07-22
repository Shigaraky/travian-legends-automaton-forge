import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const strategyData = await req.json()
    
    console.log('Strategy update:', strategyData)

    // Update strategy settings
    const { data } = await supabase
      .from('strategy_settings')
      .upsert({
        user_id: crypto.randomUUID(), // In real app, use authenticated user
        strategy_mode: strategyData.mode,
        aggressiveness: strategyData.aggressiveness,
        player_race: strategyData.race,
        building_priority: strategyData.buildingPriority,
        auto_training: strategyData.autoTraining,
        troop_ratio: strategyData.troopRatio,
        farming_radius: strategyData.farmingRadius,
        farming_frequency: strategyData.farmingFrequency,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: crypto.randomUUID(),
        action: 'strategy_update',
        details: strategyData,
        timestamp: new Date().toISOString()
      })

    console.log('Strategy updated successfully:', data)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Strategy updated successfully',
        data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Strategy update error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})