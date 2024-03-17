import * as React from "react";

import Projects from "../components/Projects";
import SEO from "../components/SEO";

export default function PortfolioPage() {
    return <Projects />;
}

export function Head() {
    return (
        <SEO
            title="Portfolio"
            description="Explore my latest projects and achievements."
        />
    );
}