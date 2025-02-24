import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Grid } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import DisableItem from './UI/DisableItem';
import InlineNotice from './UI/InlineNotice';
import { IProduct } from '../helpers/interfaces';

import '../styles/projects.scss';

export default function Products() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = useStaticQuery(graphql`
    query ProductsData {
      allFile(filter: { sourceInstanceName: { eq: "data" }, name: { eq: "products" } }) {
        nodes {
          childDataJson {
            products {
              title
              image
              description
              links {
                blog
                demo
              }
            }
          }
        }
      }
    }
  `);

  if (!data) {
    console.error('There was an error getting products data.');
  }
  const { products }: { products: IProduct[] } = data.allFile.nodes[0].childDataJson || {};
  return (
    <section id="products">
      <InlineNotice
        icon="👇"
        type="message">
        Download these for free
      </InlineNotice>
      {products &&
        products.map((p, index) => (
          <DisableItem
            key={index}
            cs="productItem displayItem rnd"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            isDisabled={activeIndex !== null && index !== activeIndex}>
            <Grid
              container
              spacing={4}>
              <Grid
                item
                lg={4}>
                <div className="imgWrap sml">
                  <img
                    src={p.image}
                    className="respImg rnd"
                    loading="lazy"
                    alt={p.title}
                  />
                </div>
              </Grid>
              <Grid
                item
                lg={8}>
                <a
                  className="demo"
                  href={p.links.demo}
                  target="_blank"
                  rel="noreferrer">
                  <h3>
                    {p.title}
                    <span className="arrowWrap">
                      <ArrowOutwardIcon className="arrow arrowOut" />
                    </span>
                  </h3>
                  <div className="rnd" />
                </a>
                <p>{p.description}</p>
              </Grid>
            </Grid>
          </DisableItem>
        ))}
    </section>
  );
}
