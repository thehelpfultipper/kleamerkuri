import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ExperienceItem from './ExperienceItem';
import { links } from '../helpers/variables';
import InlineNotice from './UI/InlineNotice';

import '../styles/experience.scss';

export default function Experience() {
    const [activeIndex, setActiveIndex] = useState(null);

    const expData = useStaticQuery(graphql`
        query ResumeData {
            allFile(
                filter: {sourceInstanceName: {eq: "data"}, relativePath: {eq: "resume.json"}}
            ) {
                nodes {
                    childDataJson {
                        resume {
                        summary
                        experience {
                            company
                            dates
                            desc {
                                action
                                support
                            }
                            location
                            title
                        }
                        skills {
                            category
                            items
                        }
                        }
                    }
                }
            }
        }
    `);
    if (!expData) {
        console.error('Error getting experience data.');
        return;
    }
    const res = expData.allFile.nodes[0].childDataJson.resume;
    const exp = res.experience;

    const renderExpError = (
        <p>Something's not showing up but here's more on me 👉 <a href={links.linkedin} target='_blank' rel='noreferrer'>LinkedIn</a></p>
    );

    return (
        <section id='experience'>
            <InlineNotice type='note' icon='💡'>
                Click on the each action to learn more
            </InlineNotice>
            {
                exp ? exp.map((item, index) => {
                    return (
                        <ExperienceItem
                            exp={item}
                            key={index}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            isDisabled={activeIndex !== null && index !== activeIndex}
                        />
                    )
                }) : renderExpError
            }
            <div className={`expActionWrap`}>
                <p className={`actionLink`}>
                    <a
                        href={links.resume.url}
                        target='_blank'
                        rel='noreferrer'
                    >View full resume</a>
                    <span className={`arrowWrap`}>
                        <ArrowOutwardIcon className={`arrow arrowOut`} />
                    </span>
                </p>
            </div>
          <InlineNotice icon='📝' type='highlight'>
            Checkout <a href={links.portfolios.km.v1} target='_blank' rel='noreferrer'>portfolio v1</a> for predecessor
          </InlineNotice>
        </section>
    )
}
