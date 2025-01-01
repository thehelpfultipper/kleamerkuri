import * as React from "react";
import Home from "../components/Home";
import SEO from "../components/SEO";

export default function IndexPage({profile}) {
  return <Home profile={profile} />;
}

export function Head() {
  return (
    <SEO
      title="Home"
      description="Hi I'm Klea, a developer and digital creator based in LA transforming visions into immersive digital experiences."
    />
  );
}
