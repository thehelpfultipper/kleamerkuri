import React, { useState, useMemo, useEffect } from 'react';
import { PageProps, navigate, useStaticQuery, graphql } from 'gatsby';
import { IProject } from '../helpers/interfaces';
import { categories } from '../helpers/variables';
import ProjectCard from './ProjectCard';
import Pagination from './Pagination';
import ProjectModal from './ProjectModal';

const PROJECTS_PER_PAGE = 6;

const Archive: React.FC<PageProps> = ({ location, path }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const data = useStaticQuery(graphql`
    query ProjectsData {
      allProjectsJson(sort: { meta: { date: DESC } }) {
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
    console.error('There was an error getting projects data.');
  }
  const projects = data.allProjectsJson.nodes || [];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const pageParam = params.get('page');
    setActiveCategory(categoryParam || 'All');
    setCurrentPage(pageParam ? parseInt(pageParam, 10) : 1);
  }, [location.search]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p: IProject) => p?.meta?.category.includes(activeCategory));
  }, [activeCategory, projects]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    // Ensure valid page number for slicing
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    const start = (validPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [currentPage, totalPages, filteredProjects]);

  const handleFilterChange = (category: string) => {
    const newParams = new URLSearchParams();
    if (category !== 'All') {
      newParams.set('category', category);
    }
    newParams.set('page', '1'); // Reset to first page on category change
    navigate(`${path}?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', page.toString());
    navigate(`${path}?${newParams.toString()}`);
    // Scroll to top of the project list on page change
    if (typeof window !== 'undefined') {
      document.getElementById('projects-archive')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCardClick = (project: IProject) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <section
        id="projects-archive"
        className="py-5">
        <div className="text-center my-5 archive-hero mx-auto">
          <h1 className="display-4 fw-bold text-slate-light tracking-tight">My Projects Archive</h1>
          <p className="mt-4 fs-5 mx-auto text-slate-dark">
            A collection of my work, from web apps to development tools.
          </p>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`btn btn-sm rounded-pill font-monospace ${
                activeCategory === category ? 'bg-sky-blue text-navy' : 'bg-slate-800 text-sky-blue'
              }`}>
              {category}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <>
            <div className="row g-4">
              {paginatedProjects.map((project: IProject) => (
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-5">
            <p className="text-slate-dark fs-5">No projects found for this category.</p>
          </div>
        )}
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

export default Archive;
