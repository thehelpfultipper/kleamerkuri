import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface IChatMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface ICachedItem {
  text: string;
  timestamp: number;
}

const WELCOME = [
  "Hi! I'm Eve 👋.",
  "I can answer questions about Klea's experience, projects, and skills.",
];

export function useChatbot() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTypingRef = useRef(false);
  const welcomeMessagesShownRef = useRef(false);
  const [localCache, setLocalCache] = useState<Record<string, ICachedItem>>({});
  const currentResponseRef = useRef<string>(''); // Track the current response being built

  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  const clearSession = () => {
    localStorage.removeItem('chatSessionId');
    localStorage.removeItem('chatCache');
    setMessages([]);
    setLocalCache({});
    const newId = uuidv4();
    localStorage.setItem('chatSessionId', newId);
    setSessionId(newId);
    // console.log('Session cleared and new session ID created:', newId);
  };

  const buildMessage = (
    text: string,
    role: 'assistant' | 'user',
    time: Date = new Date(),
  ): IChatMessage => ({
    role,
    content: text,
    timestamp: time,
  });

  const loadSessionHistory = async (sid: string) => {
    // console.log('Loading session history for ID:', sid);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('data')
        .eq('id', sid)
        .single();

      if (error) {
        // Handle "no rows" error gracefully
        if (error.code === 'PGRST116') {
          // console.log('No history found for this session ID, starting fresh');
          setInitialized(true);
          return;
        }
        throw error;
      }

      const history = data?.data?.history || [];
      // console.log(history);
      const restored: IChatMessage[] = history.flatMap(({ query, response, timestamp }: any) => {
        const time = new Date(timestamp);
        return [buildMessage(query, 'user', time), buildMessage(response, 'assistant', time)];
      });

      setMessages(restored);
      setInitialized(true);

      // console.log('Session history restored:', restored);
    } catch (error) {
      setInitialized(true);
      // console.error('Failed to load session history', error);
    }
  };

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  // Check cache
  useEffect(() => {
    const storedSession = localStorage.getItem('chatSessionId');
    // console.log('Stored session:', storedSession);
    const newSessionId = storedSession || uuidv4();
    if (!storedSession) localStorage.setItem('chatSessionId', newSessionId);
    setSessionId(newSessionId);

    const storedCache = localStorage.getItem('chatCache');
    // console.log('Stored cache:', storedCache);
    if (storedCache) {
      try {
        const parsed = JSON.parse(storedCache);
        const now = Date.now();
        const freshCache: Record<string, ICachedItem> = {};
        Object.entries(parsed).forEach(([key, value]: [string, unknown]) => {
          const cachedItem = value as ICachedItem;
          if (now - cachedItem.timestamp < CACHE_TTL_MS) {
            freshCache[key] = cachedItem;
          }
        });
        setLocalCache(freshCache);
        localStorage.setItem('chatCache', JSON.stringify(freshCache));
        // console.log('Fresh cache set:', freshCache);
      } catch {
        localStorage.removeItem('chatCache');
        // console.log('Failed to parse stored cache, removed.');
      }
    }
  }, []);

  // Prevent repeated "message playback" by restoring full history only once
  // and display welcome messages once per instance
  useEffect(() => {
    let timeoutId1: NodeJS.Timeout | null = null;
    let timeoutId2: NodeJS.Timeout | null = null;

    if (sessionId && !initialized) {
      loadSessionHistory(sessionId);
      // console.log('loadSessionHistory');
    }

    if (initialized && messages.length === 0 && !welcomeMessagesShownRef.current) {
      welcomeMessagesShownRef.current = true;
      // console.log('No history found, showing welcome messages.');

      // Start streaming
      setIsTyping(true);

      // Schedule the first message
      timeoutId1 = setTimeout(() => {
        // Add first message immediately
        const firstWelcomeMsg = buildMessage(WELCOME[0], 'assistant');
        setMessages([firstWelcomeMsg]);

        // Schedule the second message
        timeoutId2 = setTimeout(() => {
          const secondWelcomeMsg = buildMessage(WELCOME[1], 'assistant');
          setMessages((prev) => [...prev, secondWelcomeMsg]);
          // End welcome stream
          setIsTyping(false);
        }, 800);
      }, 500);

      return () => {
        if (timeoutId1) {
          clearTimeout(timeoutId1);
        }
        if (timeoutId2) {
          clearTimeout(timeoutId2);
        }
      };
    }
  }, [sessionId, initialized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // console.log('Messages updated, scrolled to bottom.');
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading || isTypingRef.current) return;

      const userInput = input.trim();
      setMessages((prev) => [...prev, buildMessage(userInput, 'user')]);
      setInput('');
      setIsLoading(true);
      setIsTyping(false);
      isTypingRef.current = false;
      currentResponseRef.current = ''; // Reset current response
      // console.log('User input submitted:', userInput);

      try {
        const cacheKey = userInput.toLowerCase();
        const cached = localCache[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          // Add small delay to make cached response less jarring
          setTimeout(() => {
            setMessages((prev) => [...prev, buildMessage(cached.text, 'assistant')]);
            setIsLoading(false);
          }, 200);
          // console.log('Response served from cache:', cached.text);
          return;
        }

        // API Call and Streaming Logic
        const apiUrl = `${supabaseUrl}/functions/v1/chats`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseKey}`,
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({ query: userInput, sessionId }),
        });

        if (!response.ok || !response.body) {
          let errorBody = 'Failed to get response';
          try {
            const errorJson = await response.json();
            errorBody = errorJson.message || JSON.stringify(errorJson);
          } catch (_) {
            /* ignore parsing error */
          }
          throw new Error(`API Error (${response.status}): ${errorBody}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = ''; // Buffer for incomplete JSON
        let isFirstAssistantMessage = true; // Flag to track first assistant message

        setIsLoading(false);
        setIsTyping(true);

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // console.log('Stream finished');
            setIsTyping(false);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          // Process potentially multiple SSE messages within a single chunk
          const lines = (buffer + chunk).split('\n');
          if (!chunk.endsWith('\n')) {
            buffer = lines.pop() || ''; // Keep last potentially incomplete line
          } else {
            buffer = ''; // Clear buffer if chunk ends cleanly
          }

          for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6).trim();
                const payload = JSON.parse(jsonStr);

                if (payload.sessionId && payload.sessionId !== sessionId) {
                  setSessionId(payload.sessionId);
                  localStorage.setItem('chatSessionId', payload.sessionId);
                  // console.log('Session ID updated from response:', payload.sessionId);
                }

                if (payload.isCached && payload.text) {
                  // Handle cached response
                  currentResponseRef.current = payload.text;

                  setMessages((prev) => {
                    // Add new message only if it's not already there
                    const lastMsg = prev[prev.length - 1];
                    if (
                      lastMsg &&
                      lastMsg.role === 'assistant' &&
                      lastMsg.content === payload.text
                    ) {
                      return prev; // Avoid duplicate
                    }
                    return [...prev, buildMessage(payload.text, 'assistant')];
                  });

                  setIsTyping(false);

                  // Update cache
                  setLocalCache((prev) => {
                    const updated = {
                      ...prev,
                      [cacheKey]: { text: payload.text, timestamp: Date.now() },
                    };
                    localStorage.setItem('chatCache', JSON.stringify(updated));
                    return updated;
                  });

                  // console.log('Response cached:', payload.text);
                  await reader.cancel();
                  break;
                } else if (payload.text) {
                  const textPart = payload.text;

                  // Update current response with new text part
                  currentResponseRef.current += textPart;

                  // Handle streaming updates
                  setMessages((prev) => {
                    if (isFirstAssistantMessage) {
                      // First part of the assistant's response
                      isFirstAssistantMessage = false;
                      return [...prev, buildMessage(textPart, 'assistant')];
                    } else {
                      // Update the existing assistant message with the accumulated response
                      const allButLast = prev.slice(0, -1);
                      const lastMessage = prev[prev.length - 1];

                      if (lastMessage && lastMessage.role === 'assistant') {
                        return [
                          ...allButLast,
                          { ...lastMessage, content: currentResponseRef.current },
                        ];
                      }

                      // Fallback if something went wrong with message tracking
                      return [...prev, buildMessage(textPart, 'assistant')];
                    }
                  });
                }
              } catch (error) {
                // console.error('Error parsing payload:', error, line);
                // Continue processing other lines even if one fails
              }
            }
          }
        }

        // Finalize and add to cache if needed
        if (currentResponseRef.current && !localCache[cacheKey]) {
          setLocalCache((prev) => {
            const updated = {
              ...prev,
              [cacheKey]: { text: currentResponseRef.current, timestamp: Date.now() },
            };
            localStorage.setItem('chatCache', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (error) {
        // console.error(`Chat error:`, error);
        setMessages((prev) => [
          ...prev,
          buildMessage('Something went wrong. Please try again later.', 'assistant'),
        ]);
        setIsTyping(false);
        setIsLoading(false);
      } finally {
        setIsTyping(false);
        setIsLoading(false);
        // console.log('Chat process completed');
      }
    },
    [input, localCache, sessionId, isLoading, isTyping],
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    isTyping,
    handleSubmit,
    messagesEndRef,
    inputRef,
    clearSession,
  };
}

export default useChatbot;
