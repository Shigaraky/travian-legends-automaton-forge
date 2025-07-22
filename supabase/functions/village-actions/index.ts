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

    const { action, villageId, buildingType, troopType, quantity } = await req.json()
    
    console.log('Village action:', { action, villageId, buildingType, troopType, quantity })

    let result = {}
    let message = ''

    switch (action) {
      case 'build':
        result = {
          buildingType,
          level: Math.floor(Math.random() * 10) + 1,
          timeToComplete: Math.floor(Math.random() * 3600) + 600 // 10min - 1h
        }
        message = `Started building ${buildingType}`
        break

      case 'train':
        result = {
          troopType,
          quantity,
          timeToComplete: Math.floor(Math.random() * 1800) + 300 // 5min - 30min
        }
        message = `Started training ${quantity} ${troopType}`
        break

      case 'farm':
        const farmResults = {
          attacksSent: Math.floor(Math.random() * 5) + 1,
          resourcesGained: {
            wood: Math.floor(Math.random() * 500),
            clay: Math.floor(Math.random() * 500),
            iron: Math.floor(Math.random() * 500),
            crop: Math.floor(Math.random() * 500)
          }
        }
        result = farmResults
        message = `Farming cycle completed: ${farmResults.attacksSent} attacks sent`
        break

      case 'evacuate':
        result = {
          troopsEvacuated: Math.floor(Math.random() * 100) + 20,
          destination: 'Safe village'
        }
        message = 'Troops evacuated successfully'
        break

      default:
        throw new Error('Invalid action')
    }

    // Update village data
    await supabase
      .from('villages')
      .upsert({
        id: villageId || crypto.randomUUID(),
        user_id: crypto.randomUUID(),
        name: `Village ${villageId}`,
        coordinates_x: Math.floor(Math.random() * 200) - 100,
        coordinates_y: Math.floor(Math.random() * 200) - 100,
        population: Math.floor(Math.random() * 500) + 100,
        resources: {
          wood: Math.floor(Math.random() * 2000),
          clay: Math.floor(Math.random() * 2000),
          iron: Math.floor(Math.random() * 2000),
          crop: Math.floor(Math.random() * 2000)
        },
        buildings: {},
        troops: {},
        last_update: new Date().toISOString()
      })

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: crypto.randomUUID(),
        action: `village_${action}`,
        details: { villageId, result },
        timestamp: new Date().toISOString()
      })

    console.log('Village action completed:', { action, result })

    return new Response(
      JSON.stringify({
        success: true,
        message,
        result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Village action error:', error)
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