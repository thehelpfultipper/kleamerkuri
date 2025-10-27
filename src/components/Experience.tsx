import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { links } from '../helpers/variables';
import { IResume } from '../helpers/interfaces';

const Experience: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const expData = useStaticQuery(graphql`
    query experienceData {
      allFile(filter: { sourceInstanceName: { eq: "data" }, relativePath: { eq: "resume.json" } }) {
        nodes {
          childDataJson {
            resume {
              experience {
                company
                dates
                desc
                location
                title
              }
            }
          }
        }
      }
    }
  `);
  if (!expData || !expData.allFile.nodes) {
    console.error('Error getting experience data.');
  }
  const res: IResume = expData.allFile.nodes[0]?.childDataJson?.resume || {};
  const exp = res?.experience || null;

  const activeExperience = exp[activeTab];

  const renderExpError = (
    <p>
      Something's not showing up but here's more on me 👉{' '}
      <a
        href={links.linkedin.url}
        target="_blank"
        rel="noreferrer">
        LinkedIn
      </a>
    </p>
  );

  return (
    <section
      id="experience"
      className="py-5 my-5 mx-auto">
      <h2 className="fs-2 fw-bold text-slate-light mb-5 text-center">
        <span className="text-sky-blue font-monospace">04.</span> Where I've Worked
      </h2>
      <div className="experience-container">
        <div
          className="experience-tabs font-monospace"
          role="tablist"
          aria-label="Job tabs">
          {exp
            ? exp.map((job, index) => (
                <button
                  key={`${job.title}_${index + 1}`}
                  className={`experience-tab ${index === activeTab ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                  role="tab"
                  aria-selected={index === activeTab}
                  aria-controls={`panel-${index}`}
                  id={`tab-${index}`}>
                  {job.company}
                </button>
              ))
            : renderExpError}
        </div>
        {activeExperience && (
          <div
            className="experience-content animate-fade-in"
            id={`panel-${activeTab}`}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`tab-${activeTab}`}>
            <h3 className="fs-5 fw-bold text-slate-light mb-1">
              {activeExperience.title}{' '}
              <span className="text-sky-blue">@ {activeExperience.company}</span>
            </h3>
            <p className="font-monospace text-slate-dark small mb-4">{activeExperience.dates}</p>
            <ul className="text-slate-dark">
              {activeExperience.desc.map((item, i) => (
                <li key={i + 1}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
