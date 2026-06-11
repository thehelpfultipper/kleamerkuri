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
    id: 'rag',
    label: 'AI & RAG work',
    query: "Show me Klea's AI and RAG projects and how they work.",
  },
  {
    id: 'gatsby',
    label: 'Gatsby experience',
    query: 'What enterprise Gatsby and React experience does Klea have?',
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
