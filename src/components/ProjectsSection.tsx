import React, { useState } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { IProject } from '../helpers/interfaces';

const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const data = useStaticQuery(graphql`
    query FeaturedProjectsData {
      allProjectsJson(filter: { featured: { eq: "true" } }, sort: { meta: { date: DESC } }) {
        nodes {
          title
          featured
          image
          description
          meta {
            category
            date(formatString: "MMM DD, YYYY")
            stack
          }
          links {
            blog
            demo
          }
        }
      }
    }
  `);

  if (!data || !data.allProjectsJson.nodes) {
    console.error('There was an error getting featured projects data.');
  }

  const featuredProjects: IProject[] = data.allProjectsJson.nodes || [];

  const handleCardClick = (project: IProject) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <section
        id="projects"
        className="py-5 my-5">
        <h2 className="fs-2 fw-bold text-slate-light mb-5 text-center">
          <span className="text-sky-blue font-monospace">01.</span> My Projects
        </h2>
        <div className="row g-4">
          {featuredProjects.map((project) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={project.title}>
              <ProjectCard
                project={project}
                onClick={() => handleCardClick(project)}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-5 pt-3">
          <Link
            to="/portfolio"
            className="btn-cta d-inline-block">
            View All Projects &rarr;
          </Link>
        </div>
      </section>
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          show={!!selectedProject}
          onHide={handleCloseModal}
        />
      )}
    </>
  );
};

export default ProjectsSection;
