import React from 'react';

interface FocusThread {
  id: string;
  label: string;
  impact: string;
  href: string;
  isExternal?: boolean;
}

const focusThreads: FocusThread[] = [
  {
    id: '01',
    label: 'Enterprise migration',
    impact: '5K+ articles · 20% faster loads',
    href: '#projects',
  },
  {
    id: '02',
    label: 'Design systems',
    impact: 'WCAG · Salesforce / Genesys integrations',
    href: '#experience',
  },
  {
    id: '03',
    label: 'Applied AI',
    impact: 'RAG, CLI tools, shipped experiments',
    href: '#eve',
  },
  {
    id: '04',
    label: 'Writing',
    impact: 'AI workflows · The Helpful Tipper',
    href: 'https://www.thehelpfultipper.com',
    isExternal: true,
  },
];

const HeroFocusIndex: React.FC = () => (
  <nav className="hero-focus" aria-label="Focus areas">
    <p className="hero-focus-label mb-0">Focus areas</p>
    <ol className="hero-focus-list list-unstyled mb-0">
      {focusThreads.map((thread, index) => (
        <li
          key={thread.id}
          className="hero-focus-item"
          style={{ '--hero-focus-delay': `${index * 70}ms` } as React.CSSProperties}>
          <a
            href={thread.href}
            className="hero-focus-link"
            aria-label={`${thread.label}: ${thread.impact}`}
            {...(thread.isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}>
            <span className="hero-focus-num" aria-hidden="true">
              {thread.id}
            </span>
            <span className="hero-focus-content">
              <span className="hero-focus-title">{thread.label}</span>
              <span className="hero-focus-impact">{thread.impact}</span>
            </span>
            <span className="hero-focus-arrow" aria-hidden="true">
              {thread.isExternal ? '↗' : '→'}
            </span>
          </a>
        </li>
      ))}
    </ol>
  </nav>
);

export default HeroFocusIndex;
