import React from 'react';
import { IProject } from '../helpers/interfaces';
import BlogIcon from '../icons/BlogIcon';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import { Modal } from 'react-bootstrap';

interface ProjectModalProps {
  project: IProject;
  show: boolean;
  onHide: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      aria-labelledby={`modal-title-${project.title}`}
      contentClassName="animate-scale-up">
      <Modal.Body className="p-0">
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3 p-2 z-3"
          onClick={onHide}
          aria-label="Close"></button>

        <div className="row g-0">
          <div className="col-lg-6">
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="w-100 h-100 object-fit-cover rounded-start-2"
            />
          </div>
          <div className="col-lg-6 p-4 p-lg-5">
            {project?.meta?.category ? (
              <span className="font-monospace text-sky-blue small">
                {project.meta.category.join(' ')}
              </span>
            ) : null}
            <h2
              id={`modal-title-${project.title}`}
              className="fs-2 fw-bold text-slate-light mt-1 mb-4">
              {project.title}
            </h2>

            <p className="text-slate-dark mb-4">{project.description}</p>

            <h3 className="fs-5 fw-bold text-slate-light mb-3">Tech Stack</h3>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {project?.meta?.stack.map((tech) => (
                <span
                  key={tech}
                  className="badge rounded-pill bg-slate-700 text-sky-blue font-monospace px-3 py-2 fw-normal">
                  {tech}
                </span>
              ))}
            </div>

            <div className="d-flex align-items-center gap-4 border-top border-slate-700 pt-4">
              {project?.links?.demo && (
                <a
                  href={project?.links?.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center social-link text-slate-light fw-semibold text-decoration-none">
                  <ExternalLinkIcon className="me-2 icon-125" /> Demo
                </a>
              )}
              {project?.links?.blog && (
                <a
                  href={project?.links?.blog}
                  className="d-flex align-items-center social-link text-slate-light fw-semibold text-decoration-none">
                  <BlogIcon className="me-2 icon-125" /> Read More
                </a>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectModal;
