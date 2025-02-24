import React from 'react';
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { links } from '../helpers/variables';

const CustomStack = styled(Stack)({
  '&': {
    marginTop: 30,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 30,
    marginRight: 15,
    opacity: '.7',
    transition: 'opacity cubic-bezier(.4,0,.2,1) .15s',
    transform: 'scale(.95)',
  },
  '& .MuiSvgIcon-root:hover': {
    fontSize: 30,
    marginRight: 15,
    opacity: '1',
    transform: 'scale(1)',
  },
});

export default function ActionLinks() {
  const { linkedin, github, blog } = links;
  return (
    <CustomStack
      direction="row"
      spacing={1}
      className="socialLinks">
      <a
        href={linkedin.url}
        target="_blank"
        rel="noreferrer">
        <LinkedInIcon />
      </a>
      <a
        href={github.url}
        target="_blank"
        rel="noreferrer">
        <GitHubIcon />
      </a>
      <a
        href={blog.url}
        target="_blank"
        rel="noreferrer">
        <RssFeedIcon />
      </a>
    </CustomStack>
  );
}
