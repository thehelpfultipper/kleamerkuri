import React from 'react';
import GitHubIcon from '../icons/GitHubIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import BlogIcon from '../icons/BlogIcon';
import { links } from '../helpers/variables';

const Footer: React.FC = () => {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-top border-slate-700">
      <div className="container container-px d-flex flex-column align-items-center text-center py-4">
        <div className="d-flex align-items-center gap-4 mb-3">
          <a
            href={links.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in new tab)"
            className="social-link">
            <GitHubIcon className="icon-150" aria-hidden="true" />
          </a>
          <a
            href={links.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in new tab)"
            className="social-link">
            <LinkedInIcon className="icon-150" aria-hidden="true" />
          </a>
          <a
            href={links.blog.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Blog (opens in new tab)"
            className="social-link">
            <BlogIcon className="icon-150" aria-hidden="true" />
          </a>
        </div>
        <div className="text-secondary small mb-4">
          <p className="mb-1">
            Built with <span className="text-slate-light font-monospace">Gatsby</span> and{' '}
            <span className="text-slate-light font-monospace">Bootstrap</span>.
          </p>
          <p className="mb-0">
            Eve uses{' '}
            <span className="text-slate-light font-monospace">RAG</span> and{' '}
            <span className="text-slate-light font-monospace">Gemini function calling</span> on{' '}
            <span className="text-slate-light font-monospace">Supabase</span>. AI-assisted — verify
            critical details.
          </p>
        </div>

        <p className="text-secondary footer-copy small mb-0">
          Copyright &copy; {year || '2026'} Klea Merkuri. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
