import React from 'react';

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  description,
  align = 'start',
}) => (
  <div className={`section-heading text-${align}`}>
    <p className="section-label font-monospace text-uppercase text-secondary mb-2">
      {label}
    </p>
    <h2 className="fs-2 fw-semibold text-slate-light mb-0">{title}</h2>
    <hr className={`section-divider ${align === 'center' ? 'mx-auto' : ''}`} />
    {description && (
      <p className={`section-heading__description text-secondary mb-0 ${align === 'center' ? 'mx-auto' : ''}`}>
        {description}
      </p>
    )}
  </div>
);

export default SectionHeading;
