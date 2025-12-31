import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import SpaceEarth from './SpaceEarth';

const About: React.FC = () => {
  const data = useStaticQuery(graphql`
    query ProfileData {
      allFile(
        filter: { sourceInstanceName: { eq: "data" }, relativePath: { eq: "profile.json" } }
      ) {
        nodes {
          childDataJson {
            profile {
              about
            }
          }
        }
      }
    }
  `);

  if (!data || !data.allFile.nodes) {
    console.error('There was an error getting profile data.');
  }

  const { profile } = data.allFile.nodes[0].childDataJson || {};

  const about = profile?.about || [];

  const skills = [
    'React',
    'Gatsby',
    'TypeScript',
    'Node.js',
    'GraphQL',
    'Python',
    'LLMs/AI Integrations',
    'CI/CD Pipelines',
    'WordPress',
    'PHP',
    'Sass/SCSS',
    'WebGL',
    'Google AI Studio',
    'Next.js',
    'Git'
  ];

  return (
    <section
      id="about"
      className="py-5 my-5 text-center">
      <h2 className="fs-2 fw-bold text-slate-light mb-3">
        <span className="text-sky-blue font-monospace">05.</span> About Me
      </h2>
      <div className="mb-5 position-relative mx-auto" style={{ height: '450px', maxWidth: '900px' }}>
        <SpaceEarth />
      </div>
      <div className="mt-5">
        <div className="text-slate-dark d-flex flex-column gap-3 fs-5 mx-auto">
          {about.map((item: string, i: number) => (
            <p key={i + 1}>{item}</p>
          ))}
          <p>Here are a few technologies I’ve been working with recently:</p>
        </div>
        <ul className="list-unstyled row mt-4 font-monospace mx-auto profile-tech-wrapper">
          {skills.map((skill) => (
            <li
              key={skill}
              className="col-12 col-sm-6 col-lg-4 d-flex align-items-center mb-2">
              <span className="text-sky-blue me-2">▹</span>
              <span className="text-slate-light small">{skill}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default About;
