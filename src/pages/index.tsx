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
      description="Hi I'm Klea, a full-stack engineer passionate about creating intuitive, scalable, and user-friendly web experiences."
    />
  );
}
