import React from 'react';
import { PageProps } from 'gatsby';
import Archive from '../components/Archive';
import SEO from '../components/SEO';

export default function PortfolioPage(props: PageProps) {
  return <Archive {...props} />;
}

export function Head() {
  return (
    <SEO
      title="Portfolio Archive"
      description="Explore my latest projects and achievements."
    />
  );
}
