import React from 'react';
import { Grid } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import DisableItem from './UI/DisableItem';
import { IProject, IMouseEvents } from '../helpers/interfaces';

import '../styles/projects.scss';

interface IProjectItemProps {
  project: IProject;
  isDisabled: boolean;
  onMouseLeave: IMouseEvents;
  onMouseEnter: IMouseEvents;
}

export default function ProjectItem({
  project,
  isDisabled,
  onMouseLeave,
  onMouseEnter,
}: IProjectItemProps) {
  const { title, description, image: imageSrc, links, meta } = project;
  return (
    <DisableItem
      cs="projectItem displayItem rnd"
      isDisabled={isDisabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <Grid
        container
        spacing={4}>
        <Grid
          item
          lg={4}>
          <div className="imgWrap">
            <img
              src={imageSrc}
              className="respImg rnd"
              loading="lazy"
              alt={title}
            />
          </div>
        </Grid>
        <Grid
          item
          lg={8}>
          <a
            className="demo"
            href={links.demo}
            target="_blank"
            rel="noreferrer">
            <h3>
              {title}
              <span className="arrowWrap">
                <ArrowOutwardIcon className="arrow arrowOut" />
              </span>
            </h3>
            <div className="rnd" />
          </a>
          <p>{description}</p>
          <div className="stackWrap">
            {meta &&
              meta.stack &&
              meta.stack.map((item, index) => (
                <span
                  className="stack"
                  key={index}>
                  {item}
                </span>
              ))}
          </div>
        </Grid>
      </Grid>
    </DisableItem>
  );
}
