import React, { useState } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import SectionHeading from './UI/SectionHeading';
import { IProject } from '../helpers/interfaces';
import InlineNotice from './UI/InlineNotice';
import { portfolios } from '../helpers/variables';

const EVE_PROJECT_TITLE = 'Eve – Portfolio RAG Assistant';

const prtList = [
  { link: portfolios.km.v1, text: 'Version 1.0 — Gatsby and Material UI' },
  { link: portfolios.km.v2, text: 'Version 2.0 — AI and Supabase era' },
];

const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const data = useStaticQuery(graphql`
    query FeaturedProjectsData {
      allProjectsJson(filter: { featured: { eq: "true" } }, sort: { meta: { date: DESC } }) {
        nodes {
          title
          featured
          impact
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
  const signatureProject = featuredProjects.find((p) => p.title === EVE_PROJECT_TITLE);
  const otherProjects = featuredProjects.filter((p) => p.title !== EVE_PROJECT_TITLE);

  const handleCardClick = (project: IProject) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <section id="projects" className="section-block">
        <SectionHeading
          label="Selected Work"
          title="Projects"
          description="Systems architected, products shipped, and tools built for enterprise scale."
        />
        <div className="row g-3 g-lg-4">
          {signatureProject && (
            <div className="col-12" key={signatureProject.title}>
              <ProjectCard
                project={signatureProject}
                onClick={() => handleCardClick(signatureProject)}
                featured
              />
            </div>
          )}
          {otherProjects.map((project) => (
            <div className="col-12 col-md-6 col-lg-4" key={project.title}>
              <ProjectCard project={project} onClick={() => handleCardClick(project)} />
            </div>
          ))}
        </div>
        <div className="text-center mt-5 pt-2">
          <Link to="/portfolio" className="btn-ghost d-inline-block">
            View all case studies
          </Link>
        </div>
        <InlineNotice>
          <p className="mb-2">
            Previous portfolio versions — a record of how my engineering and design have evolved:
          </p>
          <ul>
            {prtList.map((item, i) => (
              <li key={`prt_${i + 1}`}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </InlineNotice>
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
