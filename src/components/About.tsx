import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import profilePic from '../assets/profile-pic.webp';
import { useTheme } from '../contexts/ThemeContext';

const About: React.FC = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark' || theme === null;
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

  const skillCategories = [
    { label: 'Architecture', skills: ['React', 'Gatsby', 'Next.js', 'Headless CMS'] },
    { label: 'Specialized', skills: ['Design Systems', 'AI/RAG Integration', 'WCAG 2.1 Accessibility'] },
    { label: 'Tools/Languages', skills: ['TypeScript', 'Node.js', 'GraphQL', 'Python'] }
  ];

  return (
    <section
      id="about"
      className="py-5 my-5">
      <h2 className="fs-2 fw-bold text-slate-light mb-5 text-center">
        <span className="text-sky-blue font-monospace">05.</span> Engineering Philosophy
      </h2>
      <div className="col-lg-4 order-1 order-lg-2 mx-auto">
        <div className="mb-4 d-flex justify-content-center">
          <img
            src={profilePic}
            alt="Klea Merkuri"
            className="rounded-circle border border-3 border-sky-blue shadow-lg"
            style={{ width: '130px', height: '130px', objectFit: 'cover' }}
          />
        </div>
        <div
          className="mb-4 text-center px-4 py-2 rounded-3"
          style={{
            background: isDarkTheme ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <p className="font-monospace mb-0 fw-bold small" style={{ color: isDarkTheme ? 'var(--bs-sky-blue)' : '#4c1d95' }}>
            <span className="text-orange-cta me-2">📍</span>
            ENGINEERING FROM: LOS ANGELES, CA
          </p>
        </div>
      </div>
      <div className="row align-items-center g-5">
        <div className="col-lg-8 order-2 order-lg-1 mx-auto">
          <div className="text-slate-dark d-flex flex-column gap-3 fs-5 text-start text-lg-center">
            {about.map((item: string, i: number) => (
              <p key={i}>{item}</p>
            ))}
          </div>
          <div className="row mt-4 text-start text-lg-center">
            {skillCategories.map((cat) => (
              <div key={cat.label} className="col-md-4 mb-4">
                <h4 className="fs-6 fw-bold text-slate-light font-monospace text-uppercase mb-3">{cat.label}</h4>
                <ul className="list-unstyled font-monospace small">
                  {cat.skills.map((skill) => (
                    <li key={skill} className="mb-2 text-slate-dark">
                      <span className="text-sky-blue me-2">▹</span>{skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
