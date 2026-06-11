import React from 'react';
import Hero from './Hero';
import AskEveSection from './AskEveSection';
import Blog from './Blog';
import ProjectsSection from './ProjectsSection';
import Products from './Products';
import Experience from './Experience';
import About from './About';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <AskEveSection />
      <ProjectsSection />
      <Blog />
      <Products />
      <Experience />
      <About />
    </>
  );
};

export default Home;
