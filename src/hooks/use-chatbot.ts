import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { IEveAction } from '../helpers/interfaces';

const supabaseUrl = process.env.GATSBY_SUPABASE_URL!;
const supabaseKey = process.env.GATSBY_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface IChatMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  actions?: IEveAction[];
}

interface ICachedItem {
  text: string;
  timestamp: number;
  actions?: IEveAction[];
}

interface IChatHistoryEntry {
  query: string;
  response: string;
  timestamp: string;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const WELCOME = [
  "Hi! I'm Eve, Klea's Portfolio Copilot.",
  "I use RAG and function calling to search her portfolio and surface relevant links.",
];

export function useChatbot() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);
  const isTypingRef = useRef(false);
  const [localCache, setLocalCache] = useState<Record<string, ICachedItem>>({});
  const currentResponseRef = useRef('');
  const currentActionsRef = useRef<IEveAction[]>([]);

  const clearSession = () => {
    localStorage.removeItem('chatSessionId');
    localStorage.removeItem('chatCache');
  setMessages([]);
  setLocalCache({});
  const newId = uuidv4();
  localStorage.setItem('chatSessionId', newId);
  setSessionId(newId);
  setInitialized(true);
  setShouldShowWelcome(true);
};

  const buildMessage = (
    text: string,
    role: 'assistant' | 'user',
    time: Date = new Date(),
    actions?: IEveAction[],
  ): IChatMessage => ({
    role,
    content: text,
    timestamp: time,
    actions,
  });

  const loadSessionHistory = useCallback(async (sid: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('data')
        .eq('id', sid)
        .maybeSingle();

      if (error || !data) {
        setShouldShowWelcome(true);
        setInitialized(true);
        return;
      }

      const history = data?.data?.history || [];
      const restored: IChatMessage[] = history.flatMap(
        ({ query, response, timestamp }: IChatHistoryEntry) => {
          const time = new Date(timestamp);
          return [buildMessage(query, 'user', time), buildMessage(response, 'assistant', time)];
        },
      );

      setMessages(restored);
      setShouldShowWelcome(restored.length === 0);
      setInitialized(true);
    } catch {
      setShouldShowWelcome(true);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    const storedSession = localStorage.getItem('chatSessionId');
    const newSessionId = storedSession || uuidv4();
    if (!storedSession) localStorage.setItem('chatSessionId', newSessionId);
    setSessionId(newSessionId);

    const storedCache = localStorage.getItem('chatCache');
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
      } catch {
        localStorage.removeItem('chatCache');
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId && !initialized) {
      loadSessionHistory(sessionId);
    }
  }, [sessionId, initialized, loadSessionHistory]);

  useEffect(() => {
    if (!shouldShowWelcome) return;

    setIsTyping(true);
    let timeoutId2: ReturnType<typeof setTimeout> | null = null;

    const timeoutId1 = setTimeout(() => {
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return [buildMessage(WELCOME[0], 'assistant')];
      });

      timeoutId2 = setTimeout(() => {
        setMessages((prev) => {
          if (prev.length === 0 || prev.some((m) => m.content === WELCOME[1])) return prev;
          return [...prev, buildMessage(WELCOME[1], 'assistant')];
        });
        setIsTyping(false);
        setShouldShowWelcome(false);
      }, 800);
    }, 500);

    return () => {
      clearTimeout(timeoutId1);
      if (timeoutId2) clearTimeout(timeoutId2);
      setIsTyping(false);
    };
  }, [shouldShowWelcome]);

  const attachActionsToLastAssistant = useCallback((actions: IEveAction[]) => {
    if (!actions.length) return;
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.role !== 'assistant') return prev;
      return [...prev.slice(0, -1), { ...last, actions }];
    });
  }, []);

  const processQuery = useCallback(
    async (userInput: string) => {
      if (!userInput.trim() || isLoading || isTypingRef.current) return;

      setMessages((prev) => [...prev, buildMessage(userInput, 'user')]);
      setIsLoading(true);
      setIsTyping(false);
      isTypingRef.current = false;
      currentResponseRef.current = '';
      currentActionsRef.current = [];

      try {
        const cacheKey = userInput.toLowerCase();
        const cached = localCache[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              buildMessage(cached.text, 'assistant', new Date(), cached.actions),
            ]);
            setIsLoading(false);
          }, 200);
          return;
        }

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
          } catch {
            /* ignore */
          }
          throw new Error(`API Error (${response.status}): ${errorBody}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let isFirstAssistantMessage = true;

        setIsLoading(false);
        setIsTyping(true);

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setIsTyping(false);
            if (currentActionsRef.current.length) {
              attachActionsToLastAssistant(currentActionsRef.current);
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = (buffer + chunk).split('\n');
          if (!chunk.endsWith('\n')) {
            buffer = lines.pop() || '';
          } else {
            buffer = '';
          }

          for (let line of lines) {
            line = line.trim();
            if (!line || !line.startsWith('data: ')) continue;

            try {
              const payload = JSON.parse(line.substring(6).trim());

              if (payload.isCached && payload.text) {
                currentResponseRef.current = payload.text;
                if (payload.actions) currentActionsRef.current = payload.actions;

                setMessages((prev) => [
                  ...prev,
                  buildMessage(payload.text, 'assistant', new Date(), payload.actions),
                ]);
                setIsTyping(false);

                setLocalCache((prev) => {
                  const updated = {
                    ...prev,
                    [cacheKey]: {
                      text: payload.text,
                      timestamp: Date.now(),
                      actions: payload.actions,
                    },
                  };
                  localStorage.setItem('chatCache', JSON.stringify(updated));
                  return updated;
                });

                await reader.cancel();
                break;
              }

              if (payload.actions && !payload.text) {
                currentActionsRef.current = payload.actions;
                attachActionsToLastAssistant(payload.actions);
                continue;
              }

              if (payload.text) {
                currentResponseRef.current += payload.text;

                setMessages((prev) => {
                  if (isFirstAssistantMessage) {
                    isFirstAssistantMessage = false;
                    return [...prev, buildMessage(payload.text, 'assistant')];
                  }
                  const allButLast = prev.slice(0, -1);
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    return [
                      ...allButLast,
                      { ...lastMessage, content: currentResponseRef.current },
                    ];
                  }
                  return [...prev, buildMessage(payload.text, 'assistant')];
                });
              }
            } catch {
              /* continue */
            }
          }
        }

        if (currentResponseRef.current && !localCache[cacheKey]) {
          setLocalCache((prev) => {
            const updated = {
              ...prev,
              [cacheKey]: {
                text: currentResponseRef.current,
                timestamp: Date.now(),
                actions: currentActionsRef.current,
              },
            };
            localStorage.setItem('chatCache', JSON.stringify(updated));
            return updated;
          });
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          buildMessage('Something went wrong. Please try again later.', 'assistant'),
        ]);
        setIsTyping(false);
        setIsLoading(false);
      } finally {
        setIsTyping(false);
        setIsLoading(false);
      }
    },
    [isLoading, localCache, sessionId, attachActionsToLastAssistant],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      const userInput = input.trim();
      setInput('');
      await processQuery(userInput);
    },
    [input, processQuery],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      await processQuery(text);
    },
    [processQuery],
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    isTyping,
    handleSubmit,
    sendMessage,
    clearSession,
  };
}

export default useChatbot;
