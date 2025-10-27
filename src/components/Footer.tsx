import React from 'react';
import GitHubIcon from '../icons/GitHubIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import BlogIcon from '../icons/BlogIcon';
import { links } from '../helpers/variables';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 border-top border-slate-800">
      <div className="container container-px d-flex flex-column align-items-center text-center">
        <div className="d-flex align-items-center gap-4 mb-3">
          <a
            href={links.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-link">
            <GitHubIcon className="icon-150" />
          </a>
          <a
            href={links.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-link">
            <LinkedInIcon className="icon-150" />
          </a>
          <a
            href={links.blog.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Blog"
            className="social-link">
            <BlogIcon className="icon-150" />
          </a>
        </div>
        <div className="text-slate-dark small mb-3">
          <p>
            <span>This portfolio is built with </span>
            <span className="text-slate-light font-monospace">Gatsby</span>
            <span> & </span>
            <span className="text-slate-light font-monospace">Bootstrap.</span>
          </p>
          <p>
            <span>Eve the AI is powered by </span>
            <a
              href="https://gemini.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link text-slate-light font-monospace">
              Google Gemini
            </a>
            <span> and served through </span>
            <span className="text-slate-light font-monospace">Supabase</span>
            <span>. She can sometimes be wrong.</span>
          </p>
        </div>

        <p className="text-slate-dark footer-copy">
          Copyright &copy; {new Date().getFullYear()} Klea Merkuri. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
