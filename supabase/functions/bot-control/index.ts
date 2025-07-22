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

    const { action, botId } = await req.json()
    
    console.log('Bot control action:', { action, botId })

    // Simulate bot control actions
    let status = 'stopped'
    let message = ''

    switch (action) {
      case 'start':
        status = 'running'
        message = 'Bot started successfully'
        break
      case 'pause':
        status = 'paused'
        message = 'Bot paused'
        break
      case 'stop':
        status = 'stopped'
        message = 'Bot stopped'
        break
      default:
        throw new Error('Invalid action')
    }

    // Update bot configuration
    const { data } = await supabase
      .from('bot_configurations')
      .upsert({
        id: botId || crypto.randomUUID(),
        user_id: crypto.randomUUID(), // In real app, use authenticated user
        status,
        last_action: new Date().toISOString()
      })
      .select()
      .single()

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: crypto.randomUUID(),
        action: `bot_${action}`,
        details: { botId, status },
        timestamp: new Date().toISOString()
      })

    console.log('Bot control completed:', { status, message })

    return new Response(
      JSON.stringify({
        success: true,
        status,
        message,
        data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Bot control error:', error)
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