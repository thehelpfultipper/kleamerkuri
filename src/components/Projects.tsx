import React, { useState } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProjectItem from './ProjectItem';
import { IProject } from '../helpers/interfaces';

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = useStaticQuery(graphql`
    query FeaturedProjectsData {
      allProjectsJson(filter: { featured: { eq: "true" } }, sort: { meta: { date: ASC } }) {
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

  if (!data) {
    console.error('There was an error getting featured projects data.');
  }
  const projects: IProject[] = data.allProjectsJson.nodes || [];
  return (
    <section id="projects">
      {projects &&
        projects.map((p, index) => (
          <ProjectItem
            project={p}
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            isDisabled={activeIndex !== null && index !== activeIndex}
          />
        ))}
      <p className="actionLink">
        <Link to="/portfolio">View projects archive</Link>
        <span className="arrowWrap">
          <ArrowForwardIcon className="arrow arrowIn" />
        </span>
      </p>
    </section>
  );
}
