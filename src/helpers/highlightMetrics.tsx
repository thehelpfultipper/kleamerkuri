import React from 'react';

// Refined to avoid matching numbers embedded in words (like "B2B") or version numbers ("WCAG 2.1").
const METRIC_PATTERN = /(\b\d{1,3}(?:,\d{3})+\+?\b|\b\d+(?:\.\d+)?%|\b\d+K\+|\b\d+x\b)/g;
const METRIC_MATCH = /^(\d{1,3}(?:,\d{3})+\+?|\d+(?:\.\d+)?%|\d+K\+|\d+x)$/;

export const highlightMetrics = (text: string): React.ReactNode[] =>
  text.split(METRIC_PATTERN).map((part, index) =>
    // Only highlight if separated by word boundaries and not surrounded by periods (i.e., not decimals/versions)
    METRIC_MATCH.test(part) ? (
      <strong key={index} className="text-slate-light fw-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
