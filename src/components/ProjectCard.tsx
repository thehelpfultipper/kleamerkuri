import React from 'react';
import { IProject } from '../helpers/interfaces';

interface ProjectCardProps {
  project: IProject;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { title, description, meta, image } = project;

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
      className="card card-custom bg-slate-800 h-100 shadow-lg">
      <div className="card-img-container rounded-top">
        <img
          src={image}
          alt={`${title} screenshot`}
          className="card-img-top img-cover"
        />
        <div className="card-img-overlay project-overlay d-flex align-items-center justify-content-center">
          <span className="text-white fw-bold fs-5">View Details</span>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <h3 className="fs-5 fw-bold card-title-link mb-2">{title}</h3>
        <p className="card-text text-slate-dark small mb-4 flex-grow-1">
          {description.substring(0, 100)}...
        </p>

        <div className="d-flex flex-wrap gap-2">
          {meta?.stack?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="badge rounded-pill bg-slate-700 text-sky-blue font-monospace px-2 py-1">
              {tech}
            </span>
          ))}
          {meta?.stack?.length > 3 && (
            <span className="badge rounded-pill bg-slate-700 text-sky-blue font-monospace px-2 py-1">
              +{meta?.stack?.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
