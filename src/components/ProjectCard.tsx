import React from 'react';
import { IProject } from '../helpers/interfaces';

interface ProjectCardProps {
  project: IProject;
  onClick: () => void;
  featured?: boolean;
}

const getPreview = (description: string, maxLength = 160): string => {
  if (description.length <= maxLength) return description;
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.substring(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, featured = false }) => {
  const { title, description, impact, meta, image } = project;

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      className={`card card-custom bg-slate-800 h-100 ${featured ? 'card-featured' : ''}`}>
      <div className={featured ? 'card-featured-inner' : ''}>
        <div className="card-img-container rounded-top">
          <img
            src={image}
            alt={`${title} screenshot`}
            className={`card-img-top ${featured ? '' : 'img-cover'}`}
          />
        </div>

        <div className={`card-body d-flex flex-column ${featured ? 'card-featured-body' : ''}`}>
          <h3 className="fs-5 fw-semibold card-title-link mb-2">{title}</h3>
          {impact && <p className="card-impact font-monospace mb-2">{impact}</p>}
          <p className="card-meta font-monospace mb-3">
            {meta.date.split('-')[0]} · {meta.category[0]}
          </p>

          <p className="card-text text-secondary small mb-4 flex-grow-1">
            {getPreview(description)}
          </p>

          <div className="d-flex flex-wrap gap-2">
            {meta?.stack?.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="badge rounded-pill border border-slate-700 text-secondary font-monospace px-2 py-1">
                {tech}
              </span>
            ))}
            {meta?.stack?.length > 3 && (
              <span className="badge rounded-pill border border-slate-700 text-secondary font-monospace px-2 py-1">
                +{meta?.stack?.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
