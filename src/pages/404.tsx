import React from 'react';
import { Link } from 'gatsby';

const NotFoundPage: React.FC = () => {
  return (
    <section
      id="not-found"
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center py-5">
      <div className="animate-fade-in">
        <p className="display-1 fw-bold font-monospace text-sky-blue mb-4">404</p>
        <h1 className="display-4 fw-bold text-slate-light tracking-tight">Page Not Found</h1>
        <p
          className="mt-4 fs-5 text-slate-dark"
          style={{ maxWidth: '42rem' }}>
          Oops! The page you’re looking for doesn’t exist. It might have been moved or deleted.
        </p>
        <div className="mt-5">
          <Link
            to="/"
            className="btn-cta">
            Go Back Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
