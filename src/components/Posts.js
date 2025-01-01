import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Grid } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import DisableItem from './UI/DisableItem';
import InlineNotice from './UI/InlineNotice';

import '../styles/projects.scss';

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(null);
  const data = useStaticQuery(graphql`
    query PostsData {
      allFile(filter: {sourceInstanceName: {eq: "data"}, name: {eq: "posts"}}) {
        nodes {
          childDataJson {
            posts {
              date
              image
              link
              title
            }
          }
        }
      }
    }
`);

  if (!data) {
    console.error('There was an error getting posts data.');
    return;
  }
  let posts = data.allFile.nodes[0].childDataJson.posts;
  return (
    <section id='posts'>
      <InlineNotice icon='🤓' type='highlight'>A look at the blog</InlineNotice>
      {
        posts.map((p, index) => {
          return (
            <DisableItem
              key={index}
              cs={`postItem displayItem rnd`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              isDisabled={activeIndex !== null && index !== activeIndex}>
              <Grid container spacing={4}>
                <Grid item lg={4}>
                  <div className={`imgWrap sml`}>
                    <img src={p.image} className={`respImg rnd`} loading='lazy' />
                  </div>
                </Grid>
                <Grid item lg={8}>
                  <a className={`demo`} href={p.link} target="_blank" rel="noreferer">
                    <h3>
                      {p.title}
                      <span className={`arrowWrap`}>
                        <ArrowOutwardIcon className={`arrow arrowOut`} />
                      </span>
                    </h3>
                    <div className={`rnd`}></div>
                  </a>
                  <small>{p.date}</small>
                </Grid>
              </Grid>
            </DisableItem>
          )
        })
      }
    </section>
  )
}
