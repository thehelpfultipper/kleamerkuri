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
    siteImage: 'https://thehelpfultipper.github.io/kleamerkuri/site-image.png',
    siteUrl: 'https://thehelpfultipper.github.io/kleamerkuri/'
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    'gatsby-transformer-json',
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
        name: 'data',
        path: `${__dirname}/src/data/`,
      },
    }
  ],
  pathPrefix: "/kleamerkuri",
};
