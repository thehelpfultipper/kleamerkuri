import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import GatsbyImg from './UI/GatsbyImg';

import '../styles/profile.scss';

export default function ProfileLogo() {
  const q = useStaticQuery(graphql`
    {
      file(relativePath: { eq: "profile-pic.webp" }) {
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED)
        }
      }
    }
  `);
  return (
    <div className="profileImg">
      {
        <GatsbyImg
          data={q}
          alt="Profile pic"
          cs="logo"
        />
      }
    </div>
  );
}
