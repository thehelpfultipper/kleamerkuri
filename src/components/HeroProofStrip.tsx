import React from 'react';

const proofMetrics = [
  { value: '5K+', label: 'articles migrated' },
  { value: '20%', label: 'faster loads' },
  { value: 'WCAG 2.1', label: 'compliance' },
  { value: 'Real-time', label: 'BI sync' },
];

const HeroProofStrip: React.FC = () => (
  <div className="hero-proof-strip font-monospace" aria-label="Key engineering outcomes">
    {proofMetrics.map((metric) => (
      <span key={metric.label} className="hero-proof-item">
        <span className="hero-proof-value">{metric.value}</span>
        {metric.label}
      </span>
    ))}
  </div>
);

export default HeroProofStrip;
