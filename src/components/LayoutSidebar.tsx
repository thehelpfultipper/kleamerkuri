import React, { PropsWithChildren } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import GatsbyImg from './UI/GatsbyImg';

import '../styles/global.scss';

export default function LayoutSidebar({ children }: PropsWithChildren) {
  const q = useStaticQuery(graphql`
    {
      file(relativePath: { eq: "profile-header.webp" }) {
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED)
        }
      }
    }
  `);

  return (
    <>
      <div className="mainBanner container rnd">{<GatsbyImg data={q} />}</div>
      {children}
    </>
  );
}
