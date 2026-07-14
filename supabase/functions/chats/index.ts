import { createClient } from 'npm:@supabase/supabase-js';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ContentMetadata {
  type?: string;
  title?: string;
  date?: string;
  demo?: string;
  blog?: string;
  external?: string;
}

interface RetrievedChunk {
  content: string;
  metadata?: ContentMetadata;
  slug_id?: string;
}

interface EveAction {
  label: string;
  url: string;
  type: 'demo' | 'blog' | 'resume' | 'contact' | 'external';
}

async function generateHash(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const GEMINI_KEY = Deno.env.get('GEMINI_KEY');
if (!GEMINI_KEY) {
  console.error('Missing GEMINI_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(GEMINI_KEY ?? '');
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);
const CACHE_VERSION = 'rag-with-actions-v4';

const getSystemInstruction = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    You are EVE, Klea Merkuri's Portfolio Copilot.
    Klea is a Software Engineer.
    Today is ${today}. Use this to reference "recent" or "current" work.

    RULES:
    1. ONLY answer questions about Klea's portfolio, projects, or experience using the [CONTEXT], [AVAILABLE_LINKS], and [HISTORY] provided.
    2. Use the [HISTORY] to understand what "these", "it", or "those" refers to.
    3. If a question is unrelated, respond: "I'm here to help with questions about Klea's portfolio. Please try asking something else."
    4. Always refer to Klea in the third person (she/her).
    5. NEVER share Klea's phone number. Suggest email (kleamdev@gmail.com) if they need to reach her.
    6. Be professional, friendly, and concise.
    7. When referencing a project, product, write-up, demo, or blog post, paste the EXACT markdown link from [AVAILABLE_LINKS] inline (e.g. [Local AI Agent Ecosystem Write-up](https://...)). Never write the title as plain text when a matching link exists.
    8. NEVER use vague link labels like "here", "this", "this link", "click here", or "read more". The visible link text must be the resource name from [AVAILABLE_LINKS].
    9. Do not add a separate "Related links" section — the UI also adds link buttons for items you mention.
    10. For gap analysis requests, structure the response with: **Strengths**, **Gaps**, and **Relevant projects** (with links).
    11. Use the retrieved portfolio context and available links to answer with specific evidence.
    12. For questions about the most recent, latest, or newest project or work, use the "Completion date" field on portfolio project entries. Compare ISO dates (YYYY-MM-DD) to determine order. Do not treat marketing phrases like "latest update" in descriptions as the project completion date.
  `;
};

function isValidUrl(url: string | undefined | null): url is string {
  return !!url && url !== 'N/A' && url !== '' && url.startsWith('http');
}

async function embedText(text: string): Promise<number[]> {
  const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const embedRequest = {
    content: { role: 'user', parts: [{ text }] },
    outputDimensionality: 768,
  } as unknown as Parameters<typeof embedModel.embedContent>[0];
  const embedResponse = await embedModel.embedContent(embedRequest);
  return embedResponse.embedding.values;
}

async function smartSearch(query: string, embedding: number[], isFollowUp = false) {
  let threshold = isFollowUp ? 0.2 : 0.4;
  let matchCount = isFollowUp ? 40 : 15;

  const q = query.toLowerCase();
  if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('link')) {
    threshold = 0.15;
    matchCount = 50;
  }

  const { data, error } = await supabaseClient.rpc('match_portfolio_content', {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: matchCount,
  });

  if (error) throw error;
  return ((data || []) as RetrievedChunk[]).map((row) => ({
    content: row.content,
    metadata: row.metadata,
    slug_id: row.slug_id,
  }));
}

function isTemporalQuery(query: string): boolean {
  return /\b(most recent|latest|newest|last project|recent project|recent work|new project|what.*recent|what.*latest|what.*newest)\b/i.test(
    query,
  );
}

async function fetchProjectsByDate(): Promise<RetrievedChunk[]> {
  const { data, error } = await supabaseClient
    .from('portfolio_content')
    .select('content, metadata, slug_id')
    .eq('content_type', 'project');

  if (error) throw error;

  return ((data || []) as RetrievedChunk[])
    .map((row) => ({
      content: row.content,
      metadata: row.metadata as ContentMetadata,
      slug_id: row.slug_id,
    }))
    .sort((a, b) => (b.metadata?.date || '').localeCompare(a.metadata?.date || ''));
}

function chunkKey(chunk: RetrievedChunk): string {
  return chunk.slug_id || chunk.metadata?.title || chunk.content.slice(0, 80);
}

function mergeChunks(primary: RetrievedChunk[], secondary: RetrievedChunk[]): RetrievedChunk[] {
  const seen = new Set<string>();
  const merged: RetrievedChunk[] = [];

  for (const chunk of [...primary, ...secondary]) {
    const key = chunkKey(chunk);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(chunk);
  }

  return merged;
}

function buildAvailableLinks(chunks: RetrievedChunk[]): string {
  const links = collectAvailableLinks(chunks);
  return links.length
    ? links.map((l) => `- ${l.markdown}`).join('\n')
    : 'No verified links in current context.';
}

function titleMatchesResponse(title: string, responseText: string): boolean {
  const lowerResponse = responseText.toLowerCase();
  const lowerTitle = title.toLowerCase();
  if (lowerResponse.includes(lowerTitle)) return true;

  const shortTitle = lowerTitle.split('–')[0].trim();
  if (shortTitle.length >= 4 && lowerResponse.includes(shortTitle)) return true;

  const firstWord = lowerTitle.split(/[\s–-]/)[0];
  return firstWord.length >= 4 && lowerResponse.includes(firstWord);
}

function isUrlInResponse(url: string, responseText: string): boolean {
  return responseText.includes(url);
}

interface AvailableLink {
  label: string;
  url: string;
  markdown: string;
}

function collectAvailableLinks(chunks: RetrievedChunk[]): AvailableLink[] {
  const links: AvailableLink[] = [];
  const seen = new Set<string>();

  for (const chunk of chunks) {
    const m = chunk.metadata;
    if (!m?.title) continue;

    const shortTitle = m.title.split('–')[0].trim();

    if (isValidUrl(m.demo) && !seen.has(m.demo)) {
      seen.add(m.demo);
      const label = `${shortTitle} Demo`;
      links.push({ label, url: m.demo, markdown: `[${label}](${m.demo})` });
    }
    if (isValidUrl(m.blog) && !seen.has(m.blog)) {
      seen.add(m.blog);
      const label = `${shortTitle} Write-up`;
      links.push({ label, url: m.blog, markdown: `[${label}](${m.blog})` });
    }
    if (isValidUrl(m.external) && !seen.has(m.external)) {
      seen.add(m.external);
      links.push({ label: shortTitle, url: m.external, markdown: `[${shortTitle}](${m.external})` });
    }
  }

  // Longest labels first so "Local AI Agent Ecosystem Write-up" wins over shorter substrings
  return links.sort((a, b) => b.label.length - a.label.length);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Fix vague [here](url) labels and plain-text title mentions that should be markdown links. */
function normalizeInlineLinks(responseText: string, chunks: RetrievedChunk[]): string {
  const links = collectAvailableLinks(chunks);
  if (!links.length) return responseText;

  let result = responseText;
  const byUrl = new Map(links.map((l) => [l.url, l]));

  result = result.replace(
    /\[(here|this|this link|click here|read more|this write-?up|this post|this article)\]\((https?:\/\/[^)\s]+)\)/gi,
    (match, _label: string, url: string) => byUrl.get(url)?.markdown ?? match,
  );

  for (const link of links) {
    if (result.includes(link.markdown)) continue;

    // Already linked with this URL under another label — leave it
    if (isUrlInResponse(link.url, result)) continue;

    const pattern = new RegExp(`(?<!\\[)\\b${escapeRegExp(link.label)}\\b(?!\\]\\()`, 'gi');
    result = result.replace(pattern, link.markdown);
  }

  return result;
}

function buildActions(responseText: string, chunks: RetrievedChunk[]): EveAction[] {
  const actions: EveAction[] = [];
  const seen = new Set<string>();

  for (const chunk of chunks) {
    const m = chunk.metadata;
    if (!m?.title) continue;
    if (!titleMatchesResponse(m.title, responseText)) continue;

    const shortTitle = m.title.split('–')[0].trim();

    if (isValidUrl(m.demo) && !seen.has(m.demo) && !isUrlInResponse(m.demo, responseText)) {
      seen.add(m.demo);
      actions.push({ label: `View ${shortTitle} demo`, url: m.demo, type: 'demo' });
    }
    if (isValidUrl(m.blog) && !seen.has(m.blog) && !isUrlInResponse(m.blog, responseText)) {
      seen.add(m.blog);
      actions.push({ label: `Read ${shortTitle} write-up`, url: m.blog, type: 'blog' });
    }
    if (isValidUrl(m.external) && !seen.has(m.external) && !isUrlInResponse(m.external, responseText)) {
      seen.add(m.external);
      actions.push({ label: shortTitle, url: m.external, type: 'external' });
    }
  }

  return actions;
}

const GENERATION_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

type StreamChunkHandler = (text: string) => void;

async function streamGenerateWithRetry(fullPrompt: string, onChunk: StreamChunkHandler): Promise<string> {
  let lastError: unknown = null;

  for (const modelName of GENERATION_MODELS) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 0; attempt < 3; attempt++) {
      let emittedChunks = false;

      try {
        const result = await model.generateContentStream({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        });

        if (modelName !== GENERATION_MODELS[0]) {
          console.log(`Streaming with fallback model: ${modelName}`);
        }

        let fullText = '';
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (!text) continue;
          emittedChunks = true;
          fullText += text;
          onChunk(text);
        }

        return fullText;
      } catch (error) {
        lastError = error;
        const status = (error as { status?: number }).status;
        const isRetryable = status === 503 || status === 429;

        // Never retry after tokens were already sent — client would concatenate two replies
        if (emittedChunks || !isRetryable) throw error;

        if (attempt < 2) {
          const delayMs = 1000 * (attempt + 1);
          console.log(`${modelName} returned ${status}, retrying in ${delayMs}ms`);
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }

        console.log(`${modelName} unavailable after retries`);
        break;
      }
    }
  }

  throw lastError;
}

const streamHeaders = {
  ...corsHeaders,
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const query = body.query || body.prompt;
    const sessionId = body.sessionId;

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing 'query' or 'prompt' in request body" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isGapAnalysis = /gap analysis|role fit|job description|job fit/i.test(query);
    const queryHash = await generateHash(`${CACHE_VERSION}:${query.toLowerCase().trim()}`);

    if (!isGapAnalysis) {
      const { data: cached } = await supabaseClient
        .from('chat_cache')
        .select('response')
        .eq('query_hash', queryHash)
        .maybeSingle();

      if (cached) {
        console.log('Serving from cache...');
        const cachedActions: EveAction[] = [];
        return new Response(
          `data: ${JSON.stringify({ text: cached.response, isCached: true, actions: cachedActions })}\n\n`,
          { headers: streamHeaders },
        );
      }
    }

    let historyText = '';
    let lastAiResponse = '';
    if (sessionId) {
      const { data: sessionData } = await supabaseClient
        .from('chat_sessions')
        .select('data')
        .eq('id', sessionId)
        .maybeSingle();
      const rawHistory = sessionData?.data?.history || [];
      historyText = rawHistory
        .slice(-3)
        .map((h: { query: string; response: string }) => `User: ${h.query}\nAI: ${h.response}`)
        .join('\n');
      lastAiResponse = rawHistory.length > 0 ? rawHistory[rawHistory.length - 1].response : '';
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        };

        try {
          const isFollowUp = /these|those|it|link|demo|url/i.test(query);
          const augmentedQuery =
            isFollowUp && lastAiResponse ? `${query} ${lastAiResponse}`.trim() : query;

          const embedding = await embedText(augmentedQuery);
          const semanticResults = await smartSearch(query, embedding, isFollowUp);

          const relevantContent = isTemporalQuery(query)
            ? mergeChunks(await fetchProjectsByDate(), semanticResults)
            : semanticResults;

          const availableLinks = buildAvailableLinks(relevantContent);
          const context =
            relevantContent
              ?.map((item) => `[Source: ${item.metadata?.type || 'General'}] ${item.content}`)
              .join('\n\n') || 'No background information found.';

          const fullPrompt = `${getSystemInstruction()}\n\n[HISTORY]\n${historyText || 'No previous history.'}\n\n[CONTEXT]\n${context}\n\n[AVAILABLE_LINKS]\n${availableLinks}\n\n[USER QUERY]\n${query}`;

          // Stream tokens as Gemini produces them — do not wait for the full reply first
          const rawText = await streamGenerateWithRetry(fullPrompt, (text) => {
            send({ text });
          });

          const responseText = normalizeInlineLinks(rawText, relevantContent);
          if (responseText !== rawText) {
            send({ text: responseText, replace: true });
          }

          const actions = buildActions(responseText, relevantContent);
          if (actions.length) {
            send({ actions });
          }

          if (!isGapAnalysis) {
            await supabaseClient.from('chat_cache').insert({
              query_hash: queryHash,
              query,
              response: responseText,
            });
          }

          if (sessionId) {
            const { data: currentSession } = await supabaseClient
              .from('chat_sessions')
              .select('data')
              .eq('id', sessionId)
              .maybeSingle();
            const history = currentSession?.data?.history || [];
            history.push({ query, response: responseText, timestamp: new Date().toISOString() });

            await supabaseClient.from('chat_sessions').upsert({
              id: sessionId,
              data: { history: history.slice(-10) },
            });
          }
        } catch (streamError) {
          console.error('Stream generation error:', streamError);
          send({
            text: 'Something went wrong generating a response. Please try again.',
            replace: true,
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: streamHeaders });
  } catch (error) {
    console.error('Critical Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
