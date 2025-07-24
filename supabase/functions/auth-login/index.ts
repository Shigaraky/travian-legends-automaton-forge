import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

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

    // Real Travian login process
    const loginResult = await loginToTravian(email, password, serverUrl)
    
    if (!loginResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: loginResult.error
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      )
    }

    const playerData = loginResult.data

    // Store login data and villages
    const userId = crypto.randomUUID();
    
    const { data: profile } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        email,
        server_url: serverUrl,
        player_race: playerData.race,
        last_login: new Date().toISOString()
      })
      .select()
      .single()

    // Store village data
    for (const village of playerData.villages) {
      await supabase
        .from('villages')
        .upsert({
          user_id: userId,
          name: village.name,
          coordinates_x: village.coordinates.x,
          coordinates_y: village.coordinates.y,
          population: village.population,
          is_capital: village.name === 'Capital',
          resources: village.resources,
          buildings: {},
          troops: {}
        })
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: 'login',
        type: 'success',
        category: 'system',
        message: `Successfully logged in to ${serverUrl}`,
        details: { race: playerData.race, villages: playerData.villages.length }
      })

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

// Real Travian login implementation
async function loginToTravian(email: string, password: string, serverUrl: string) {
  try {
    console.log(`Attempting real login to ${serverUrl}`)
    
    // Create cookie jar for session management
    const cookies = new Map<string, string>()
    
    // Step 1: Get login page to extract forms and tokens
    const loginPageResponse = await fetch(`${serverUrl}/dorf1.php`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!loginPageResponse.ok) {
      return { success: false, error: 'Server unreachable or invalid URL' }
    }
    
    // Extract cookies from login page
    const setCookies = loginPageResponse.headers.get('set-cookie')
    if (setCookies) {
      parseCookies(setCookies, cookies)
    }
    
    const loginPageHtml = await loginPageResponse.text()
    const doc = new DOMParser().parseFromString(loginPageHtml, 'text/html')
    
    // Check if we're already on a login form or need to navigate
    let loginFormAction = ''
    const loginForm = doc?.querySelector('form[name="login"]') || doc?.querySelector('form[action*="login"]')
    
    if (loginForm) {
      loginFormAction = loginForm.getAttribute('action') || '/login.php'
    } else {
      // Navigate to login page
      const loginUrl = `${serverUrl}/login.php`
      const loginResponse = await fetch(loginUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Cookie': Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ')
        }
      })
      
      if (!loginResponse.ok) {
        return { success: false, error: 'Login page unreachable' }
      }
      
      const newSetCookies = loginResponse.headers.get('set-cookie')
      if (newSetCookies) {
        parseCookies(newSetCookies, cookies)
      }
      
      const newLoginHtml = await loginResponse.text()
      const newDoc = new DOMParser().parseFromString(newLoginHtml, 'text/html')
      const newLoginForm = newDoc?.querySelector('form[name="login"]') || newDoc?.querySelector('form[action*="login"]')
      
      if (newLoginForm) {
        loginFormAction = newLoginForm.getAttribute('action') || '/login.php'
      }
    }
    
    // Prepare login data
    const loginData = new URLSearchParams()
    loginData.append('name', email)
    loginData.append('password', password)
    loginData.append('login', '1')
    
    // Step 2: Perform login
    const fullLoginUrl = loginFormAction.startsWith('http') ? loginFormAction : `${serverUrl}${loginFormAction}`
    const loginAttempt = await fetch(fullLoginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cookie': Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; '),
        'Referer': `${serverUrl}/login.php`
      },
      body: loginData.toString()
    })
    
    // Update cookies after login attempt
    const loginSetCookies = loginAttempt.headers.get('set-cookie')
    if (loginSetCookies) {
      parseCookies(loginSetCookies, cookies)
    }
    
    // Step 3: Check if login was successful by accessing main game page
    const gamePageResponse = await fetch(`${serverUrl}/dorf1.php`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cookie': Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ')
      }
    })
    
    if (!gamePageResponse.ok) {
      return { success: false, error: 'Login failed - could not access game page' }
    }
    
    const gamePageHtml = await gamePageResponse.text()
    
    // Check for login failure indicators
    if (gamePageHtml.includes('login') && gamePageHtml.includes('password')) {
      return { success: false, error: 'Invalid credentials' }
    }
    
    // Parse game data
    const gameDoc = new DOMParser().parseFromString(gamePageHtml, 'text/html')
    
    // Extract player race
    const raceElement = gameDoc?.querySelector('.nationBig') || gameDoc?.querySelector('[class*="race"]')
    let race = 'Unknown'
    if (raceElement) {
      const raceClass = raceElement.className
      if (raceClass.includes('romans')) race = 'Romans'
      else if (raceClass.includes('teutons')) race = 'Teutons'  
      else if (raceClass.includes('gauls')) race = 'Gauls'
    }
    
    // Extract village data
    const villages = []
    
    // Get current village name
    const villageNameElement = gameDoc?.querySelector('#villageNameField') || gameDoc?.querySelector('.villageName')
    const villageName = villageNameElement?.textContent?.trim() || 'Village'
    
    // Extract coordinates from page
    let coordinates = { x: 0, y: 0 }
    const coordElement = gameDoc?.querySelector('.coordinatesContainer') || gameDoc?.querySelector('[class*="coordinates"]')
    if (coordElement) {
      const coordText = coordElement.textContent || ''
      const coordMatch = coordText.match(/\((-?\d+)\|(-?\d+)\)/)
      if (coordMatch) {
        coordinates = { x: parseInt(coordMatch[1]), y: parseInt(coordMatch[2]) }
      }
    }
    
    // Extract population
    let population = 0
    const popElement = gameDoc?.querySelector('.population') || gameDoc?.querySelector('[class*="inhab"]')
    if (popElement) {
      const popText = popElement.textContent || ''
      const popMatch = popText.match(/(\d+)/)
      if (popMatch) {
        population = parseInt(popMatch[1])
      }
    }
    
    // Extract resources
    const resources = { wood: 0, clay: 0, iron: 0, crop: 0 }
    const resourceElements = gameDoc?.querySelectorAll('#l1, #l2, #l3, #l4') || []
    
    resourceElements.forEach((element, index) => {
      const resourceText = element?.textContent?.replace(/\D/g, '') || '0'
      const resourceValue = parseInt(resourceText) || 0
      
      switch(index) {
        case 0: resources.wood = resourceValue; break
        case 1: resources.clay = resourceValue; break
        case 2: resources.iron = resourceValue; break
        case 3: resources.crop = resourceValue; break
      }
    })
    
    villages.push({
      id: 1,
      name: villageName,
      coordinates,
      population,
      resources
    })
    
    // Store session cookies for future requests
    const sessionCookies = Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ')
    
    console.log('Login successful:', { race, villages: villages.length, coordinates })
    
    return {
      success: true,
      data: {
        race,
        villages,
        sessionCookies,
        serverUrl
      }
    }
    
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: `Connection failed: ${error.message}` }
  }
}

function parseCookies(setCookieHeader: string, cookies: Map<string, string>) {
  const cookieStrings = setCookieHeader.split(',')
  
  for (const cookieString of cookieStrings) {
    const parts = cookieString.split(';')[0].trim()
    const [name, value] = parts.split('=')
    if (name && value) {
      cookies.set(name.trim(), value.trim())
    }
  }
}