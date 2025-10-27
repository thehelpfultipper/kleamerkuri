import React from 'react';
import Hero from './Hero';
import Blog from './Blog';
import ProjectsSection from './ProjectsSection';
import Products from './Products';
import Experience from './Experience';
import About from './About';
import InlineNotice from './UI/InlineNotice';
import { portfolios } from '../helpers/variables';

const Home: React.FC = () => {
  const prtList = [
    { link: portfolios.km.v1, text: 'Version 1.0 - Start with Gatsby and MaterialUI' },
    { link: portfolios.km.v2, text: 'Version 2.0 - The AI & Supabase Era' },
  ];
  return (
    <>
      <Hero />
      <ProjectsSection />
      <InlineNotice icon="👀">
        <p>
          Curious about the evolution of my work? Here's a look back at my previous portfolios to
          see how my skills and design have progressed:
        </p>
        <ul>
          {prtList.map((item, i) => (
            <li key={`prt_${i + 1}`}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </InlineNotice>
      <Blog />
      <Products />
      <Experience />
      <About />
    </>
  );
};

export default Home;
