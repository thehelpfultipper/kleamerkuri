import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import GitHubIcon from '../icons/GitHubIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import { links } from '../helpers/variables';
import PlexusBackground from './PlexusBackground';
import WireframeOverlay from './WireframeOverlay';
import { useTheme } from '../contexts/ThemeContext';

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const data = useStaticQuery(graphql`
    query HeroProfileData {
      allFile(
        filter: { sourceInstanceName: { eq: "data" }, relativePath: { eq: "profile.json" } }
      ) {
        nodes {
          childDataJson {
            profile {
              name
              lead
            }
          }
        }
      }
    }
  `);

  const { profile } = data.allFile.nodes[0].childDataJson || {};
  const { name } = profile || {};

  return (
    <section
      id="hero"
      className="position-relative min-vh-100 d-flex flex-column justify-content-center pt-5 mt-5 mt-md-3">
      {isDarkTheme && (
        <>
          <PlexusBackground />
          <WireframeOverlay />
        </>
      )}
      <div className="hero-content">
        <p className="text-sky-blue font-monospace mb-4 fs-5">Senior Software Engineer</p>
        <h1 className="display-4 display-sm-2 display-lg-1 fw-bold text-slate-light tracking-tight">
          {name}.
          <span className="d-block mt-2 display-5 display-sm-3 display-lg-2 text-slate-dark fw-bold tracking-tight">
            I build for the enterprise scale.
          </span>
        </h1>
        <p className="mt-4 fs-5 text-slate-dark hero-intro max-w-700">
          Specializing in <span className="text-slate-light">Design Systems</span> and
          <span className="text-slate-light"> Headless Architecture</span>. I translate complex
          business logic into performant, WCAG-compliant frontend patterns that drive
          <span className="text-slate-light"> scalable growth</span>.
        </p>
        <div className="mt-5 d-flex flex-column flex-sm-row align-items-sm-center gap-4">
          <a
            href="#projects"
            className="btn-cta text-center text-sm-left"
            title="View my professional portfolio">
            View Featured Work
          </a>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <a
              href={links.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link">
              <GitHubIcon className="w-7 h-7 icon-175" />
            </a>
            <a
              href={links.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link">
              <LinkedInIcon className="w-7 h-7 icon-175" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
