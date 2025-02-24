import * as React from 'react';
import Archive from '../components/Archive';
import SEO from '../components/SEO';

export default function PortfolioPage() {
  return <Archive />;
}

export function Head() {
  return (
    <SEO
      title="Portfolio Archive"
      description="Explore my latest projects and achievements."
    />
  );
}
