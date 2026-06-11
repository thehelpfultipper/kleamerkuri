import React, { useState, useMemo, useEffect } from 'react';
import { PageProps, navigate, useStaticQuery, graphql } from 'gatsby';
import { IProject } from '../helpers/interfaces';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const categories = ['All', 'Enterprise', 'AI & RAG', 'Tools & DX', 'Design Systems'];

const Archive: React.FC<PageProps> = ({ location, path }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const data = useStaticQuery(graphql`
    query ProjectsData {
      allProjectsJson(sort: { meta: { date: DESC } }) {
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
  if (!data?.allProjectsJson?.nodes) {
    console.error('There was an error getting projects data.');
  }

  const projects = useMemo<IProject[]>(
    () => data?.allProjectsJson?.nodes ?? [],
    [data?.allProjectsJson?.nodes],
  );

  const filteredProjects = useMemo(() => {
    const killList = ['Pokémon Search App', 'Tic Tac Toe Game', 'Shopping Cart App', 'Inspirational Quote App'];

    let list = projects.filter((p: IProject) => !killList.includes(p.title));

    if (activeCategory !== 'All') {
      list = list.filter((p: IProject) => p?.meta?.category.includes(activeCategory));
    }
    return list;
  }, [activeCategory, projects]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    setActiveCategory(categoryParam || 'All');
  }, [location.search])

  const handleFilterChange = (category: string) => {
    const newParams = new URLSearchParams();
    if (category !== 'All') {
      newParams.set('category', category);
    }
    navigate(`${path}?${newParams.toString()}`);
  };

  return (
    <>
      <section id="projects-archive" className="section-block">
        <div className="text-center archive-hero mx-auto max-w-prose mb-5">
          <p className="section-label font-monospace text-uppercase text-secondary mb-2">
            Case Studies
          </p>
          <h1 className="fs-1 fw-semibold text-slate-light tracking-tight">Technical Work</h1>
          <hr className="section-divider mx-auto" />
          <p className="mt-4 text-secondary section-heading__description mx-auto">
            Systems architected, products shipped, and tools built for enterprise scale and developer
            productivity.
          </p>
        </div>

        {/* Updated Filter UI */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`btn btn-sm px-4 py-2 rounded-pill font-monospace transition-all ${activeCategory === category
                  ? 'bg-sky-blue text-navy fw-bold'
                  : 'bg-slate-800 text-slate-dark hover-text-sky-blue border border-slate-700'
                }`}>
              {category}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="row g-4">
            {filteredProjects.map((project: IProject) => (
              <div className="col-12 col-md-6 col-lg-4" key={project.title}>
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-secondary fs-5">No specialized projects found in this category.</p>
          </div>
        )}
      </section>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          show={!!selectedProject}
          onHide={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default Archive;
