import React, { useState } from 'react';

import Title from './Title';
import ProjectFilter from './ProjectsFilter';
import GridContainer from './Grid';


export default function Projects() {
    const [displayCat, setDisplayCat] = useState('All');

    const categorySelectHandler = (category) => {
        setDisplayCat(category);
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
                <GridContainer category={ displayCat } />
            </section>
        </>
    )
}
