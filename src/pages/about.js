import * as React from "react";

import About from "../components/About";
import SEO from "../components/SEO";

export default function AboutPage({mainLogo}) {
    return <About mainLogo={mainLogo} />;
}

export function Head() {
    return (
        <SEO
            title="About"
            description="Discover more about me and my journey."
        />
    );
}
