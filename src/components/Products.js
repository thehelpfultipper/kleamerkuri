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
        query ProductsData {
            allFile(filter: {sourceInstanceName: {eq: "data"}, name: {eq: "products"}}) {
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
        return;
    }
    let products = data.allFile.nodes[0].childDataJson.products;
    return (
        <section id='products'>
            <InlineNotice icon='👇' type='message'>Download these for free</InlineNotice>
            {
                products.map((p, index) => {
                    return (
                        <DisableItem
                            key={index}
                            cs={`productItem displayItem rnd`}
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
                                    <a className={`demo`} href={p.links.demo} target="_blank" rel="noreferer">
                                        <h3>
                                            {p.title}
                                            <span className={`arrowWrap`}>
                                                <ArrowOutwardIcon className={`arrow arrowOut`} />
                                            </span>
                                        </h3>
                                        <div className={`rnd`}></div>
                                    </a>
                                    <p>{p.description}</p>
                                </Grid>
                            </Grid>
                        </DisableItem>
                    )
                })
            }
        </section>
    )
}
