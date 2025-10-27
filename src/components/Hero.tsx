import React from 'react';
import GitHubIcon from '../icons/GitHubIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import { links } from '../helpers/variables';

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="min-vh-100 d-flex flex-column justify-content-center py-5 mt-5 mt-md-3 mt-xs-0">
      <div className="hero-content">
        <p className="text-sky-blue font-monospace mb-4 fs-5">Hi, my name is</p>
        <h1 className="display-4 display-sm-2 display-lg-1 fw-bold text-slate-light tracking-tight">
          Klea Merkuri.
        </h1>
        <h2 className="mt-2 display-5 display-sm-3 display-lg-2 fw-bold text-slate-dark tracking-tight">
          Full-Stack Web Developer | React | Node.js
        </h2>
        <p className="mt-4 fs-5 text-slate-dark hero-intro">
          I am a passionate <span className="text-slate-light">web developer</span> specializing in
          building exceptional digital experiences. My expertise lies in{' '}
          <span className="text-slate-light">React development</span> and creating robust back-end
          systems with Node.js, with a strong focus on{' '}
          <span className="text-slate-light">performance optimization</span> and user-centric
          design.
        </p>
        <div className="mt-5 d-flex flex-column flex-sm-row align-items-sm-center gap-4">
          <a
            href="#experience"
            className="btn-cta text-center text-sm-left">
            My Experience
          </a>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <a
              href={links.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="social-link">
              <GitHubIcon className="w-7 h-7 icon-175" />
            </a>
            <a
              href={links.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
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
