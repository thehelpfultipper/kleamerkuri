/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: 'KM Portfolio',
    description: 'A creative minimalist developer portfolio built with Gatsby and Material-UI',
    author: 'Klea Merkuri',
    keywords: 'Web Developer, Frontend Developer, Full Stack Developer, JavaScript Developer, UI/UX Designer',
    siteImage: 'https://thehelpfultipper.com/kleamerkuri/site-image.png',
    siteUrl: 'https://thehelpfultipper.com/kleamerkuri'
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    'gatsby-transformer-json',
    'gatsby-plugin-sass',
    {
      resolve: "gatsby-plugin-anchor-links",
      options: {
        offset: -20
      }
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/sitemap.xml',
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: ({ site }) => {
          return site.siteMetadata.siteUrl;
        },
        resolvePages: ({ allSitePage }) => {
          return allSitePage.nodes.map(page => {
            return { path: page.path };
          });
        },
        serialize: ({ path, modifiedGmt }) => {
          return {
            url: path,
            lastmod: modifiedGmt,
            changefreq: `daily`,
            priority: 0.7,
          }
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: `${__dirname}/src/assets/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'projects',
        path: `${__dirname}/src/data/projects`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/src/data/`,
      },
    }
  ],
  pathPrefix: "/kleamerkuri",
  flags: {
    FAST_REFRESH: true, // Enable Fast Refresh for development
    PARALLEL_SOURCING: true, // Enable parallel sourcing to speed up sourcing plugins
    DEV_SSR: true, // Enable server-side rendering in development for better consistency
  },
  developMiddleware: app => {
    app.set('etag', 'strong') // Set ETag headers to strong for better caching
  },
};
