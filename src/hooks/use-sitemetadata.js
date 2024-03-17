import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

export default function useSiteMetadata() {
    const data = useStaticQuery(graphql`
        query SiteMetadata {
            site {
                siteMetadata {
                    author
                    description
                    title,
                    keywords
                }
            }
        }
    `);
  return data.site.siteMetadata;

}