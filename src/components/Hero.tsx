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
              title
              lead
            }
          }
        }
      }
    }
  `);

  const { profile } = data.allFile.nodes[0].childDataJson || {};
  const { name, title } = profile || {};

  return (
    <section
      id="hero"
      className="position-relative min-vh-100 d-flex flex-column justify-content-center py-5 mt-5 mt-md-3 mt-xs-0">
      {isDarkTheme && (
        <>
          <PlexusBackground />
          <WireframeOverlay />
        </>
      )}
      <div className="hero-content">
        <p className="text-sky-blue font-monospace mb-4 fs-5">Hi, my name is</p>
        <h1 className="display-4 display-sm-2 display-lg-1 fw-bold text-slate-light tracking-tight">
          {name}.
          <span className="d-block mt-2 display-5 display-sm-3 display-lg-2 text-slate-dark fw-bold tracking-tight">
            {title}
          </span>
        </h1>
        <p className="mt-4 fs-5 text-slate-dark hero-intro max-w-700">
          I’m a <span className="text-slate-light">software engineer</span> specializing in building
          exceptional digital experiences. Currently, I’m focused on crafting high-performance,{' '}
          <span className="text-slate-light">accessible front-end patterns</span> and{' '}
          <span className="text-slate-light">design systems</span> that bridge the gap between
          visionary design and scalable technology.
        </p>
        <div className="mt-5 d-flex flex-column flex-sm-row align-items-sm-center gap-4">
          <a
            href="#experience"
            className="btn-cta text-center text-sm-left"
            title="View my professional experience">
            Check out my work
          </a>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <a
              href={links.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}'s GitHub profile`}
              className="social-link">
              <GitHubIcon className="w-7 h-7 icon-175" />
            </a>
            <a
              href={links.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}'s LinkedIn profile`}
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
