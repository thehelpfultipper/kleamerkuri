import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import profilePic from '../assets/profile-pic.webp';
import SectionHeading from './UI/SectionHeading';

const BLOG_MENTION = 'The Helpful Tipper';

const About: React.FC = () => {
  const data = useStaticQuery(graphql`
    query ProfileData {
      allFile(
        filter: { sourceInstanceName: { eq: "data" }, relativePath: { eq: "profile.json" } }
      ) {
        nodes {
          childDataJson {
            profile {
              about
              facts
              blog {
                name
                url
              }
            }
          }
        }
      }
    }
  `);

  const { profile } = data.allFile.nodes[0].childDataJson || {};

  const about: string[] = profile?.about || [];
  const facts: string[] = profile?.facts || [];
  const blog = profile?.blog;

  const capabilityAreas = [
    {
      label: 'Architecture',
      statement: 'Headless CMS migrations and real-time data pipelines',
      skills: ['React', 'Gatsby', 'Next.js', 'GraphQL'],
    },
    {
      label: 'Mobile & AI',
      statement: 'Cross-platform apps and context-aware AI workflows',
      skills: ['Flutter', 'Python', 'RAG', 'Model Context Protocol (MCP)'],
    },
    {
      label: 'Quality',
      statement: 'Accessible design systems and developer tooling',
      skills: ['Design Systems', 'WCAG 2.1 AA', 'TypeScript', 'Node.js'],
    },
  ];

  const renderAboutParagraph = (text: string, index: number) => {
    const isLast = index === about.length - 1;
    const hasBlogLink =
      isLast && blog?.url && text.includes(BLOG_MENTION);

    if (hasBlogLink) {
      const [before, after] = text.split(BLOG_MENTION);
      return (
        <p key={index} className="mb-0">
          {before}
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-blue text-decoration-none">
            {blog.name || BLOG_MENTION}
          </a>
          {after}
        </p>
      );
    }

    return (
      <p key={index} className="mb-0">
        {text}
      </p>
    );
  };

  return (
    <section id="about" className="section-block">
      <SectionHeading label="Background" title="About" align="center" />
      <div className="row align-items-start g-4 g-lg-5 max-w-wide mx-auto">
        <div className="col-lg-3 text-center text-lg-start">
          <img
            src={profilePic}
            alt="Klea Merkuri"
            className="rounded-circle border border-2 border-slate-700 mb-3"
            style={{ width: '96px', height: '96px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-lg-9">
          <div className="about-body d-flex flex-column gap-3 mb-5">
            {about.map((item, i) => renderAboutParagraph(item, i))}
          </div>
          {facts.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-5 pb-2">
              {facts.map((fact) => (
                <span
                  key={fact}
                  className="badge rounded-pill border border-slate-700 text-secondary font-monospace px-3 py-2 fw-normal">
                  {fact}
                </span>
              ))}
            </div>
          )}
          <div className="row text-start g-4">
            {capabilityAreas.map((area) => (
              <div key={area.label} className="col-md-4 about-capability">
                <h4 className="fw-semibold text-slate-light">{area.label}</h4>
                <p className="mb-3">{area.statement}</p>
                <ul className="list-unstyled font-monospace mb-0">
                  {area.skills.map((skill) => (
                    <li key={skill} className="mb-2">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
