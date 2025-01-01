import React, { useState } from 'react';
import { Grid, Pagination } from '@mui/material';
import GridTile from './GridTile';

import '../styles/grid.scss';

export default function GridContainer({ col, max, category, page, setPage, data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  let projects = data;
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
        className={`projectGrid`}
        container
        spacing={{ xs: colCount / 2, md: colCount / 2 + 1 }}
        columns={{ xs: colCount, sm: colCount * 2, md: 12 }}
      >
        {
          projectsToShow &&
          projectsToShow.map((project, index) => {
            return <GridTile
              key={index}
              project={project}
              col={col}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              isDisabled={activeIndex !== null && index !== activeIndex}
            />
          })
        }
      </Grid>
      {
        col !== 2 &&
        <Pagination
          count={Math.ceil(projects.length / projectsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          className={`pagination`}
        />
      }
    </>

  )
}

GridContainer.defaultProps = {
  col: 4
}
