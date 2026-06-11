import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import GitHubIcon from '../icons/GitHubIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import { links } from '../helpers/variables';
import HeroProofStrip from './HeroProofStrip';
import HeroFocusIndex from './HeroFocusIndex';

const scrollToEve = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('eve')?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
};

const Hero: React.FC = () => {
  const data = useStaticQuery(graphql`
    query HeroProfileData {
      allFile(
        filter: { sourceInstanceName: { eq: "data" }, relativePath: { eq: "profile.json" } }
      ) {
        nodes {
          childDataJson {
            profile {
              name
              title
              subtitle
              lead
              employer
            }
          }
        }
      }
    }
  `);

  const { profile } = data.allFile.nodes[0].childDataJson || {};
  const { name, title, subtitle, lead, employer } = profile || {};
  const roleTitle = title?.split('|')[0]?.trim() || 'Software Engineer';

  return (
    <section
      id="hero"
      className="position-relative d-flex flex-column justify-content-center">
      <div className="row align-items-center g-4 g-lg-5">
        <div className="col-lg-7">
          <p className="hero-eyebrow font-monospace mb-4">
            {roleTitle} · {employer} · Los Angeles, CA
          </p>
          <h1 className="hero-title fw-bold text-slate-light tracking-tight">
            {name}.
          </h1>
          <p className="hero-subtitle tracking-tight">{subtitle}</p>
          <p className="hero-intro">{lead}</p>

          <HeroProofStrip />

          <div className="mt-4 pt-2 d-flex flex-column flex-sm-row align-items-sm-center gap-3">
            <a
              href="#projects"
              className="btn-cta text-center"
              title="View selected work">
              Selected work
            </a>
            <button
              type="button"
              onClick={scrollToEve}
              className="btn-ghost text-center"
              aria-label="Scroll to Ask Eve section">
              Ask Eve
            </button>
            <div className="d-flex align-items-center justify-content-center gap-3 ms-sm-2">
              <a
                href={links.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub (opens in new tab)">
                <GitHubIcon className="icon-175" aria-hidden="true" />
              </a>
              <a
                href={links.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn (opens in new tab)">
                <LinkedInIcon className="icon-175" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <HeroFocusIndex />
        </div>
      </div>
    </section>
  );
};

export default Hero;
