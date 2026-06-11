import React from 'react';
import Home from '../components/Home';
import SEO from '../components/SEO';

export default function IndexPage() {
  return <Home />;
}

export function Head() {
  return (
    <SEO
      title="Home"
      description="Software Engineer building design systems, cross-platform mobile applications, and applied AI integrations for enterprise environments."
    />
  );
}
