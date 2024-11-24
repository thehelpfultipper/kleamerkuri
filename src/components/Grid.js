import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Grid, Pagination } from '@mui/material';

import GridTile from './GridTile';

import * as s from '../styles/Grid.module.css';

export default function GridContainer({ col, max, category, page, setPage }) {
  const data = useStaticQuery(graphql`
    query ProjectsData {
      allFile(
        filter: {sourceInstanceName: {eq: "data"}, relativePath: {eq: "projects.json"}}
        sort: {childDataJson: {projects: {meta: {date: DESC}}}}
      ) {
        nodes {
          childDataJson {
            projects {
              title
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
      }
    }
  `);

  let projects = data.allFile.nodes[0].childDataJson.projects;
  const projectsPerPage = 6;
  let projectsToShow;

  const categoryFilter = category => {
    if (category === 'All') return projects;
    return projects.filter(project => project.meta.category.includes(category));
  }

  const colCount = col === 2 ? projectsPerPage : col;

  if (max) {
    projectsToShow = projects.slice(0, max);
  } else {
    const start = (page - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    projects = categoryFilter(category);
    projectsToShow = projects.slice(start, end);
  }

  return (
    <>
      <Grid
        className={ s.projectGrid }
        container
        spacing={ { xs: colCount / 2, md: colCount / 2 + 1 } }
        columns={ { xs: colCount, sm: colCount * 2, md: 12 } }
      >
        {
          projectsToShow && 
          projectsToShow.map((project, index) => {
            return <GridTile 
                      key={ index } 
                      project={ project } 
                      col={ col } 
                    />
          })
        }
      </Grid>
      {
        col !== 2 &&
        <Pagination
          count={ Math.ceil(projects.length / projectsPerPage) }
          page={ page }
          onChange={ (event, value) => setPage(value) }
          className={ s.pagination}
        />
      }
    </>

  )
}

GridContainer.defaultProps = {
  col: 4
}
