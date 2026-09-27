export interface IEveQuickPrompt {
  id: string;
  label: string;
  query: string | null;
  requiresJobDescription?: boolean;
}

export const EVE_QUICK_PROMPTS: IEveQuickPrompt[] = [
  {
    id: 'recent',
    label: 'Most recent project',
    query: "What's Klea's most recent project? Include demo links.",
  },
  {
    id: 'frontend',
    label: 'Frontend & Web',
    query: 'What frontend and web experience does Klea have? Include React and shipped web work.',
  },
  {
    id: 'design-systems',
    label: 'Design systems',
    query: "Tell me about Klea's design systems work.",
  },
  {
    id: 'rag',
    label: 'AI & tooling',
    query: "Show me Klea's AI and developer tooling work and how they work.",
  },
  {
    id: 'gap',
    label: 'Role fit',
    query: null,
    requiresJobDescription: true,
  },
  {
    id: 'contact',
    label: 'Contact Klea',
    query: 'How can I reach Klea for opportunities?',
  },
];

export const GAP_ANALYSIS_PREFIX =
  "Perform a gap analysis of Klea's experience against this job description:";
