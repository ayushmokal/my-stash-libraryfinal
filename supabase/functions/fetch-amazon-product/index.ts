import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { load } from "https://deno.land/x/cheerio@1.0.7/mod.ts";

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
    const { url } = await req.json()
    console.log('Fetching Amazon product data for URL:', url)

    // Fetch the Amazon page
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch Amazon page')
    }

    const html = await response.text()
    const $ = load(html)

    // Extract product data
    const name = $('#productTitle').text().trim()
    const brand = $('.po-brand .a-span9').text().trim()
    const imageUrl = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src')

    console.log('Extracted product data:', { name, brand, imageUrl })

    return new Response(
      JSON.stringify({
        name,
        brand,
        image_url: imageUrl
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching Amazon product:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})