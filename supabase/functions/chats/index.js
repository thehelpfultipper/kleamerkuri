import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { GoogleGenAI } from 'https://esm.sh/@google/genai';
import { generateContext, generateHash, generatePrompt } from './helpers.js';
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const GEMINI_KEY = Deno.env.get("GEMINI_KEY");
if (!GEMINI_KEY || GEMINI_KEY.length < 10) {
    throw new Error('Missing or invalid GEMINI_KEY. Please check your environment variable.');
}

const MATCH_THRESHOLD = 0.4;
// Init AI
const genAI = new GoogleGenAI({
    apiKey: GEMINI_KEY,
});

// Initialize Supabase client (using environment variables)
const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: {
        headers: {
            Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        }
    }
});

async function getGenAiEmbeddingModel(text) {
    try {
        const response = await genAI.models.embedContent({
            model: 'models/text-embedding-004',
            contents: text
        });

        // Extract embedding values from the response
        const result = response.embeddings[0].values;

        if (!result || !Array.isArray(result) || result.length === 0) {
            throw new Error(`Invalid embedding format from Gemini ${JSON.stringify(response)}`);
        }

        // Ensure we're returning a flat array of numbers
        if (Array.isArray(result) && result.length > 0) {
            // Return the embedding as a flat array of numbers
            if (Array.isArray(result[0]) && result[0].length > 0) {
                return result[0];
            }
            return result;
        }

    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}
async function getGenerateModel(prompt) {
    try {
        // Generate the response
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}

async function updateSession(sessionId, query, response) {
    // Get existing session
    const { data: sessionData } = await supabaseClient.from('chat_sessions').select('data').eq('id', sessionId).maybeSingle();
    const history = sessionData?.data?.history || [];
    history.push({
        query,
        response,
        timestamp: new Date().toISOString()
    });
    // Update session with new history
    try {
        const { error: sessionError } = await supabaseClient.from('chat_sessions').upsert({
            id: sessionId,
            data: {
                history
            }
        }, {
            onConflict: 'id'
        });
        if (sessionError) {
            console.error('Error updating session:', sessionError);
        }
    } catch (err) {
        console.error('Exception occurred during session update:', err);
    }
}

// Smart query handling that adjusts search parameters based on query type
async function smartSearch(query, embedding) {
    // Default parameters
    let threshold = MATCH_THRESHOLD;
    let matchCount = 10;

    const q = query.toLowerCase().trim();

    // Project-specific queries should get more project results with lower threshold
    if (
        q.includes('project') ||
        q.includes('portfolio') ||
        q.includes('work') ||
        q.includes('built')
    ) {
        console.log('Detected project-related query, adjusting search parameters');
        threshold = 0.2;          // Lower threshold for better recall
        matchCount = 20;          // Get more matches to ensure we have enough project info
    }

    // If asking for specific number of projects
    if (
        q.includes('top') ||
        q.match(/\d+\s+project/) ||
        q.includes('best project')
    ) {
        console.log('Detected "top projects" type query, optimizing search');
        threshold = 0.15;         // Very low threshold to ensure we get projects
        matchCount = 30;          // Get even more to ensure complete project info
    }

    // Call RPC with adjusted parameters
    const { data: relevantContent, error: searchError } = await supabaseClient.rpc('match_portfolio_content', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: matchCount
    });

    if (searchError) {
        console.error('Error searching for content:', searchError);
        throw new Error('Error searching for content', searchError);
    }

    return relevantContent;
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders
        });
    }
    try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return new Response(JSON.stringify({
                error: "Content-Type must be application/json"
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const { query, sessionId } = await req.json();
        if (!query || typeof query !== 'string') {
            return new Response(JSON.stringify({
                error: 'Query is required'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }
        // Check if we have a cached response
        const queryHash = await generateHash(query.toLowerCase().trim());
        const { data: cachedResponse } = await supabaseClient.from('chat_cache').select('response').eq('query_hash', queryHash).maybeSingle();
        // Initialize encoder
        const encoder = new TextEncoder();
        if (cachedResponse) {
            console.log('Using cached response');
            // Update session if we have a sessionId
            if (sessionId) {
                await updateSession(sessionId, query, cachedResponse.response);
            }

            // Return cached response stream
            const stream = new ReadableStream({
                start(controller) {
                    const payload = {
                        text: cachedResponse.response,
                        isCached: true,
                        sessionId,
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
                    controller.close();
                }
            });

            return new Response(stream, {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    Connection: 'keep-alive',
                    'X-Accel-Buffering': 'no'
                }
            });
        }
        // Create embedding for the query
        const embedding = await getGenAiEmbeddingModel(query);
        if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
            console.log('No embedding generated – check API token or input text');
            throw new Error('No embedding generated – check API token or input text');
        }
        // Search for relevant content
        const relevantContent = await smartSearch(query, embedding);
        // Extract relevant content for context
        let context = '';
        if (relevantContent && relevantContent.length > 0) {
            context = generateContext(relevantContent);
        }
        // Generate response using the model
        const promptTemplate = generatePrompt(context, query);
        const result = await getGenerateModel(promptTemplate);
        // Clean up the response
        const response = result.trim();
        // Cache the response
        try {
            const { error: cacheError } = await supabaseClient.from('chat_cache').insert({
                query_hash: queryHash,
                query: query,
                response: response
            });
            if (cacheError) {
                console.error('Error caching response:', cacheError);
            }
        } catch (err) {
            console.error('Exception occurred during caching:', err);
        }
        // Update session if we have a sessionId
        if (sessionId) {
            await updateSession(sessionId, query, response);
        }
        // Send the response stream
        const stream = new ReadableStream({
            async start(controller) {
                // More natural chunking - split by sentences or phrases rather than words
                const tokens = response.match(/[^.!?]+[.!?]+|\S+/g) || [];
                for (const token of tokens) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: token })}\n\n`));
                    await new Promise((r) => setTimeout(r, 50));
                }
                controller.close();
            }
        });
        return new Response(stream, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            error: 'Internal server error'
        }), {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
});

