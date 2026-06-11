import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { links } from '../helpers/variables';
import { IResume } from '../helpers/interfaces';
import { highlightMetrics } from '../helpers/highlightMetrics';
import SectionHeading from './UI/SectionHeading';

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
              education {
                school
                degree
                honors
              }
            }
          }
        }
      }
    }
  `);

  const res: IResume = expData.allFile.nodes[0]?.childDataJson?.resume || {};
  const exp = res?.experience || [];
  const education = res?.education;

  const activeExperience = exp[activeTab];

  const renderExpError = (
    <p className="text-secondary">
      Experience data unavailable. View my full background on{' '}
      <a href={links.linkedin.url} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      .
    </p>
  );

  return (
    <section id="experience" className="section-block mx-auto max-w-content">
      <SectionHeading label="Career" title="Experience" align="center" />
      <div className="experience-container d-flex flex-column flex-md-row">
        <div
          className="experience-tabs border-start border-slate-700"
          role="tablist"
          aria-label="Job tabs">
          {exp.length > 0
            ? exp.map((job, index) => (
                <button
                  key={`${job.title}_${index + 1}`}
                  className={`experience-tab text-start px-4 py-3 border-start font-monospace ${
                    index === activeTab
                      ? 'active text-sky-blue'
                      : 'text-secondary border-transparent'
                  }`}
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
            className="experience-content animate-fade-in ps-md-5 pt-4 pt-md-0"
            id={`panel-${activeTab}`}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`tab-${activeTab}`}>
            <h3 className="fs-5 fw-semibold text-slate-light mb-2">
              {activeExperience.title}{' '}
              <span className="text-secondary fw-normal">@ {activeExperience.company}</span>
            </h3>
            <p className="font-monospace text-secondary small mb-4">{activeExperience.dates}</p>
            <ul>
              {activeExperience.desc.map((item, i) => (
                <li key={i + 1}>{highlightMetrics(item)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {education && (
        <div className="experience-education mt-5 pt-4 border-top border-slate-700">
          <h3 className="fs-6 fw-semibold text-slate-light font-monospace text-uppercase section-label mb-3">
            Education
          </h3>
          <p className="fw-semibold text-slate-light mb-1">{education.degree}</p>
          <p className="font-monospace text-secondary small mb-0">
            {education.school}
            {education.honors ? ` · ${education.honors}` : ''}
          </p>
        </div>
      )}
    </section>
  );
};

export default Experience;
