import React from 'react';
import { Link } from 'gatsby';

import * as s from '../styles/Home.module.css';

import GridContainer from './Grid';
import Title from './Title';

export default function Home() {
  const itemsPerPage = 6;

  return (
    <>
      <header className={`${s.heroSection} container`}>
        <Title size='lg'>
          <h1>Hi, I'm Klea 👋</h1>
          <p>Developer and digital creator based in LA transforming visions into immersive digital experiences.</p>
        </Title>
      </header>

      <section className={`container`}>
        <div className={s.projectsSection__header}>
          <h3>Explore recent projects</h3>
          <Link to='/portfolio'>View all</Link>
        </div>
        <GridContainer col={2} max={itemsPerPage} />
      </section>
    </>
  )
}
