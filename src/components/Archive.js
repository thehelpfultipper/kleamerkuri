import React, { useState } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Title from './Title';
import { ArrowBack } from '@mui/icons-material';
import ProjectFilter from './ProjectsFilter';
import GridContainer from './Grid';
import Footer from './Footer';

import '../styles/archive.scss';

export default function Archive() {
    const [displayCat, setDisplayCat] = useState('All');
    const [page, setPage] = useState(1);
    const categorySelectHandler = category => {
        setPage(1); // Reset page
        setDisplayCat(category);
    }
    const data = useStaticQuery(graphql`
        query ProjectsData {
          allProjectsJson(sort: {meta: {date: DESC}}) {
            nodes {
              title
              featured
              image
              description
              meta {
                category
                date(formatString: "MMM DD, YYYY")
                stack
              }
              links {
                blog
                demo
              }
            }
          }
        }
    `);

    if (!data) {
        console.error('There was an error getting projects data.');
        return;
    }
    const projects = data.allProjectsJson.nodes;
    
    return (
        <section className={`container`} id='archive'>
            <header>
                <Title>
                    <p className={`actionLink`}>
                        <span className={`arrowWrap`}>
                            <ArrowBack className={`arrow arrowBack`} />
                        </span>
                        <Link to="/">Back to home</Link>
                    </p>
                </Title>
                <h1>All projects</h1>
            </header>
            <main>
                <ProjectFilter category={displayCat} onDisplayCat={categorySelectHandler} />
                <GridContainer category={displayCat} page={page} setPage={setPage} data={projects} />
            </main>
            <Footer />
        </section>
    )
}


