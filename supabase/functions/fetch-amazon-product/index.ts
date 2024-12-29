import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    if (!url || !url.includes('amazon')) {
      throw new Error('Invalid Amazon URL')
    }

    const response = await fetch(url)
    const html = await response.text()

    // Extract product information using regex patterns
    const titleMatch = html.match(/<span id="productTitle"[^>]*>([^<]+)<\/span>/)
    const brandMatch = html.match(/<a id="bylineInfo"[^>]*>([^<]+)<\/a>/)
    const imageMatch = html.match(/<img[^>]*id="landingImage"[^>]*src="([^"]+)"/)

    const productData = {
      name: titleMatch ? titleMatch[1].trim() : null,
      brand: brandMatch ? brandMatch[1].replace('Visit the ', '').replace(' Store', '').trim() : null,
      image_url: imageMatch ? imageMatch[1] : null,
    }

    return new Response(
      JSON.stringify(productData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})