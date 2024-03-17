import { graphql } from "gatsby";

import * as React from "react";

import Resume from "../components/Resume";
import SEO from "../components/SEO";


export default function ResumePage({data}) {
    return <Resume data={data} />;
}

// export resume data
export const query = graphql`
    query ResumeData {
        allFile(
            filter: {sourceInstanceName: {eq: "data"}, relativePath: {eq: "resume.json"}}
        ) {
            nodes {
                childDataJson {
                    resume {
                    summary
                    experience {
                        company
                        dates
                        desc
                        location
                        title
                    }
                    skills {
                        category
                        items
                    }
                    }
                }
            }
        }
    }
`;

export function Head() {
    return (
        <SEO
            title="Resume"
            description="Discover current career highlights and skills."
        />
    );
}