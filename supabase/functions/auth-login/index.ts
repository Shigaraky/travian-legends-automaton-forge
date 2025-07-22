import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { email, password, serverUrl } = await req.json()

    console.log('Login attempt:', { email, serverUrl })

    // Simulate Travian login process
    const loginSuccess = Math.random() > 0.2 // 80% success rate for demo

    if (!loginSuccess) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Login failed: Invalid credentials or server unreachable' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      )
    }

    // Simulate extracting player data
    const playerData = {
      race: ['Romans', 'Teutons', 'Gauls'][Math.floor(Math.random() * 3)],
      villages: [
        {
          id: 1,
          name: 'Capital',
          coordinates: { x: 0, y: 0 },
          population: 523,
          resources: {
            wood: 1250,
            clay: 980,
            iron: 1100,
            crop: 850
          }
        }
      ],
      sessionCookies: 'mock_session_12345'
    }

    // Store login data
    const { data: profile } = await supabase
      .from('profiles')
      .upsert({
        user_id: crypto.randomUUID(), // In real app, use authenticated user
        email,
        server_url: serverUrl,
        player_race: playerData.race,
        last_login: new Date().toISOString()
      })
      .select()
      .single()

    console.log('Login successful:', { race: playerData.race, villages: playerData.villages.length })

    return new Response(
      JSON.stringify({
        success: true,
        data: playerData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})