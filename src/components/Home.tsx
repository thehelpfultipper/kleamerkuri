import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Grid from '@mui/material/Unstable_Grid2';
import Header from './Header';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Posts from './Posts';
import Products from './Products';
import ChatbotLoader from './ChatbotLoader';

export default function Home() {
  const data = useStaticQuery(graphql`
    query ProfileData {
      allFile(
        filter: { sourceInstanceName: { eq: "data" }, relativePath: { eq: "profile.json" } }
      ) {
        nodes {
          childDataJson {
            profile {
              facts
              name
              pronouns
              story
              employer
              title
              contact {
                email
                phone
              }
              blog {
                url
                name
              }
              lead
              about
            }
          }
        }
      }
    }
  `);

  if (!data) {
    console.error('There was an error getting profile data.');
  }

  const { profile } = data.allFile.nodes[0].childDataJson || {};
  const about = profile?.about || [];
  return (
    <Grid
      container
      spacing={4}
      justifyContent="space-between"
      className="container"
      style={{ position: 'relative' }}>
      <Grid md={4}>
        <Header profile={profile} />
      </Grid>
      <Grid md={8}>
        <main>
          <About about={about} />
          <Experience />
          <Projects />
          <Products />
          <Posts />
        </main>
        <footer>
          <div className="copyRight">
            <p>
              🙌 This portfolio is built with <strong>Gatsby</strong> and{' '}
              <strong>MaterialUI</strong>.
            </p>
            <p>
              🤖 Eve the AI is powered by <strong>Gemini</strong> and served through{' '}
              <strong>Supabase</strong>. She can sometimes be wrong.
            </p>
            <p className="mb-0">
              <span className="copyYr">© {new Date().getFullYear()}</span>{' '}
              <span>Portfolio by Klea Merkuri. All Rights Reserved.</span>
            </p>
          </div>
        </footer>
        <ChatbotLoader />
      </Grid>
    </Grid>
  );
}
