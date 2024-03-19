// imports
import { pathPrefix } from '../../gatsby-config';

// exports
export const categories = [
    "All",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Python", 
    "SCSS"
];

export const links = {
    linkedin: {
        url: "https://www.linkedin.com/in/kmerkuri97",
        text: "LinkedIn"
    },
    resume: {
        url: process.env.NODE_ENV === 'development' ? '' : pathPrefix + "/Klea_Resume_24.pdf",
        text: "Download"
    },
    github: {
        url: "https://github.com/thehelpfultipper/",
        text: "GitHub"
    },
    codepen: {
        url: "https://codepen.io/thehelpfultipper",
        text: "CodePen"
    },
    blog: {
        url: "https://thehelpfultipper.com/",
        text: "Blog"
    }
}
