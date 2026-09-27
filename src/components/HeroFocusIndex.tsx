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
    label: 'Public Web',
    impact: 'High-traffic experiences · React · performance',
    href: '#projects',
  },
  {
    id: '02',
    label: 'Design Systems',
    impact: 'Reusable UI · accessibility · Figma → code',
    href: '#experience',
  },
  {
    id: '03',
    label: 'Interactive Experiences',
    impact: 'WebGL · animation · visual storytelling',
    href: 'https://thehelpfultipper.github.io/stripe-first-300/',
    isExternal: true,
  },
  {
    id: '04',
    label: 'Applied AI',
    impact: 'RAG · local AI · developer tooling',
    href: '#eve',
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
