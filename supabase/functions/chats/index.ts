import { createClient } from 'npm:@supabase/supabase-js';
import { GoogleGenAI } from 'npm:@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// 1. HELPER: Generate Query Hash for Cache
async function generateHash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 2. CONFIG: Initialize Clients
const GEMINI_KEY = Deno.env.get("GEMINI_KEY");
if (!GEMINI_KEY) {
  console.error("Missing GEMINI_KEY environment variable");
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_KEY });
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const systemInstruction = `
    You are EVE, Klea Merkuri's AI Assistant.
    Klea is a Software Engineer.

    RULES:
    1. ONLY answer questions about Klea's portfolio, projects, or experience using the [CONTEXT] provided.
    2. If a question is unrelated, respond: "I'm here to help with questions about Klea's portfolio. Please try asking something else."
    3. Always refer to Klea in the third person (she/her).
    4. NEVER share Klea's phone number. Suggest email (kleamdev@gmail.com) if they need to reach her.
    5. Be professional, friendly, and concise.
`;

// 3. SMART SEARCH: Adjusts parameters based on user intent
async function smartSearch(query, embedding) {
  let threshold = 0.4;
  let matchCount = 10;
  const q = query.toLowerCase();

  // If user is looking for a list or "work", expand the search net
  if (q.includes('project') || q.includes('portfolio') || q.includes('work') || q.includes('built')) {
    threshold = 0.25;
    matchCount = 25;
  }

  const { data, error } = await supabaseClient.rpc('match_portfolio_content', {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: matchCount
  });

  if (error) throw error;
  return data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const query = body.query || body.prompt;
    const sessionId = body.sessionId;

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing 'query' or 'prompt' in request body" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const queryHash = await generateHash(query.toLowerCase().trim());

    // 4. CACHE CHECK
    const { data: cached } = await supabaseClient
      .from('chat_cache')
      .select('response')
      .eq('query_hash', queryHash)
      .maybeSingle();

    if (cached) {
      console.log("Serving from cache...");
      return new Response(JSON.stringify({ text: cached.response, isCached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 5. VECTOR GENERATION (768 Dimensions)
    const embedResponse = await genAI.models.embedContent({
      model: 'text-embedding-004',
      contents: [query]
    });
    const embedding = embedResponse.embeddings[0].values;

    // 6. CONTEXT RETRIEVAL
    const relevantContent = await smartSearch(query, embedding);

    // Simplified Context: We now just join the "Breadcrumb" strings
    const context = relevantContent
      ?.map(item => `[Source: ${item.metadata?.type || 'General'}] ${item.content}`)
      .join('\n\n') || "No background information found.";

    // 7. AI GENERATION
    const fullPrompt = `${systemInstruction}\n\n[CONTEXT]\n${context}\n\n[USER QUERY]\n${query}`;

    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: fullPrompt }]}]
    });
    const responseText = result.text || "";

    // 8. LOGGING & CACHING
    await supabaseClient.from('chat_cache').insert({
      query_hash: queryHash,
      query: query,
      response: responseText
    });

    if (sessionId) {
        await supabaseClient.from('chat_sessions').upsert({
            id: sessionId,
            data: { last_query: query, last_response: responseText },
        });
    }

    // 9. STREAMING RESPONSE (Optional: Remove if you prefer static JSON)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Splitting by sentences/phrases for a "natural" typing effect
        const tokens = responseText.match(/[^.!?]+[.!?]+|\S+/g) || [];
        for (const token of tokens) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: token })}\n\n`));
          await new Promise(r => setTimeout(r, 40)); // Visual delay
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error("Critical Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
