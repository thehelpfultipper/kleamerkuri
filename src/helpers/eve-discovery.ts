import { EVE_QUICK_PROMPTS, GAP_ANALYSIS_PREFIX } from './eve-prompts';
import { IEveAction } from './interfaces';
import { IChatMessage } from '../hooks/use-chatbot';

export interface IEveProjectMatch {
  title: string;
  impact?: string | null;
  image?: string | null;
  description?: string | null;
  meta: {
    category: string[];
    date?: string | null;
    stack?: string[] | null;
  };
  links: {
    demo?: string | null;
    blog?: string | null;
  };
}

export const PATH_HINTS: Record<string, string> = {
  recent: "What's shipping now",
  frontend: 'React and shipped web work',
  'design-systems': 'Systems, tokens, and UI craft',
  rag: 'RAG, local AI, and developer tools',
  gap: 'Paste a job description',
  contact: 'How to reach her',
};

export interface IEveExchange {
  question: string;
  answer: string;
  actions: IEveAction[];
}

export interface IEveWorkItem {
  key: string;
  title: string;
  impact?: string;
  image?: string;
  description?: string;
  category?: string;
  date?: string;
  stack?: string[];
  matched: boolean;
  actions: IEveAction[];
}

export const normalizeUrl = (url: string) => url.replace(/\/+$/, '').toLowerCase();

export const classifyLink = (label: string, url: string): IEveAction['type'] => {
  const haystack = `${label} ${url}`.toLowerCase();
  if (url.startsWith('mailto:') || haystack.includes('linkedin') || haystack.includes('contact')) {
    return 'contact';
  }
  if (haystack.includes('resume') || haystack.includes('/cv')) return 'resume';
  if (haystack.includes('write-up') || haystack.includes('writeup') || haystack.includes('blog')) {
    return 'blog';
  }
  if (haystack.includes('demo')) return 'demo';
  return 'external';
};

export const extractMarkdownLinks = (markdown: string): IEveAction[] => {
  const actions: IEveAction[] = [];
  const seen = new Set<string>();
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi;
  let match = linkPattern.exec(markdown);

  while (match) {
    const label = match[1].trim();
    const url = match[2].trim();
    const key = normalizeUrl(url);
    if (label && url && !seen.has(key)) {
      seen.add(key);
      actions.push({ label, url, type: classifyLink(label, url) });
    }
    match = linkPattern.exec(markdown);
  }

  return actions;
};

export const mergeActions = (actions: IEveAction[], extras: IEveAction[]): IEveAction[] => {
  const seen = new Set<string>();
  const merged: IEveAction[] = [];

  [...actions, ...extras].forEach((action) => {
    const key = normalizeUrl(action.url);
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(action);
  });

  return merged;
};

export const getExchanges = (messages: IChatMessage[]): IEveExchange[] => {
  const exchanges: IEveExchange[] = [];
  let current: IEveExchange | null = null;

  messages.forEach((msg) => {
    if (msg.role === 'user') {
      if (current) exchanges.push(current);
      current = { question: msg.content, answer: '', actions: [] };
      return;
    }

    if (current && msg.role === 'assistant') {
      current.answer = msg.content;
      current.actions = msg.actions ?? [];
    }
  });

  if (current) exchanges.push(current);
  return exchanges;
};

export const getTopicLabel = (question: string): string => {
  if (question.startsWith(GAP_ANALYSIS_PREFIX)) return 'Role fit';
  const prompt = EVE_QUICK_PROMPTS.find((item) => item.query === question);
  if (prompt) return prompt.label;

  const trimmed = question.trim();
  return trimmed.length > 72 ? `${trimmed.slice(0, 69).trimEnd()}…` : trimmed;
};

export const findPromptId = (question: string): string | null => {
  if (question.startsWith(GAP_ANALYSIS_PREFIX)) return 'gap';
  return EVE_QUICK_PROMPTS.find((item) => item.query === question)?.id ?? null;
};

const matchProject = (action: IEveAction, projects: IEveProjectMatch[]) => {
  const actionUrl = normalizeUrl(action.url);
  return projects.find((project) => {
    const demo = project.links.demo ? normalizeUrl(project.links.demo) : '';
    const blog = project.links.blog ? normalizeUrl(project.links.blog) : '';
    return (demo && demo === actionUrl) || (blog && blog === actionUrl);
  });
};

export const buildWorkItems = (
  actions: IEveAction[],
  projects: IEveProjectMatch[],
): IEveWorkItem[] => {
  const items = new Map<string, IEveWorkItem>();
  const order: string[] = [];

  actions.forEach((action) => {
    const project = matchProject(action, projects);
    const key = project?.title ?? action.url;

    if (!items.has(key)) {
      order.push(key);
      items.set(key, {
        key,
        title: project?.title ?? action.label,
        impact: project?.impact ?? undefined,
        image: project?.image ?? undefined,
        description: project?.description ?? undefined,
        category: project?.meta.category?.[0],
        date: project?.meta.date ?? undefined,
        stack: project?.meta.stack ?? undefined,
        matched: Boolean(project),
        actions: [],
      });
    }

    items.get(key)?.actions.push(action);
  });

  return order.map((key) => items.get(key)!);
};

export const MAX_WORK_SAMPLES = 2;

export const presentWork = (
  answer: string,
  actions: IEveAction[],
  projects: IEveProjectMatch[],
  limit = MAX_WORK_SAMPLES,
) => {
  const items = buildWorkItems(mergeActions(extractMarkdownLinks(answer), actions), projects);
  const matched = items.filter((item) => item.matched);
  const samples = matched.slice(0, limit);
  const overflowActions = matched.slice(limit).flatMap((item) => item.actions);
  const sampleUrls = new Set(
    samples.flatMap((item) => item.actions.map((action) => normalizeUrl(action.url))),
  );
  const seenLinks = new Set(sampleUrls);
  const links: IEveAction[] = [];

  [...actions, ...overflowActions].forEach((action) => {
    const key = normalizeUrl(action.url);
    if (seenLinks.has(key)) return;
    seenLinks.add(key);
    links.push(action);
  });

  return {
    projects: samples,
    links,
  };
};
