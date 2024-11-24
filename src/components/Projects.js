import React, { useState } from 'react';

import Title from './Title';
import ProjectFilter from './ProjectsFilter';
import GridContainer from './Grid';


export default function Projects() {
    const [displayCat, setDisplayCat] = useState('All');
    const [page, setPage] = useState(1);

    const categorySelectHandler = (category) => {
        setDisplayCat(category);
        setPage(1); // Reset the page
    }

    return (
        <>
            <header className={ `container` }>
                <Title>
                    <h2>Projects</h2>
                    <p>Explore my latest projects and achievements</p>
                </Title>
                <ProjectFilter category={ displayCat } onDisplayCat={ categorySelectHandler } />
            </header>
            <section className={ `container` }>
                <GridContainer category={ displayCat } page={page} setPage={setPage} />
            </section>
        </>
    )
}
