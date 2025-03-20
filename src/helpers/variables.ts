import { IHelperLinks } from './interfaces';

const pathPrefix = '/kleamerkuri';

// exports
export const portfolios = {
  km: {
    v1: 'https://thehelpfultipper.com/portfolios/v1/kleamerkuri/',
  },
};

export const categories: string[] = ['All', 'HTML', 'CSS', 'JavaScript', 'React', 'Python', 'SCSS'];

export const links: IHelperLinks = {
  linkedin: {
    url: 'https://www.linkedin.com/in/kmerkuri97',
    text: 'LinkedIn',
  },
  resume: {
    url: `${pathPrefix}/klea-merkuri-software-engineer-resume.pdf`,
    text: 'Download',
  },
  github: {
    url: 'https://github.com/thehelpfultipper/',
    text: 'GitHub',
  },
  codepen: {
    url: 'https://codepen.io/thehelpfultipper',
    text: 'CodePen',
  },
  blog: {
    url: 'https://thehelpfultipper.com/',
    text: 'Blog',
  },
};
