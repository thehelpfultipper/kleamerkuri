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
  flags: {
    PRESERVE_WEBPACK_CACHE: true, // Preserve webpack cache between builds
    PRESERVE_FILE_DOWNLOAD_CACHE: true, // Preserve file download cache between builds
    FAST_REFRESH: true, // Enable Fast Refresh for development
    PARALLEL_SOURCING: true, // Enable parallel sourcing to speed up sourcing plugins
    DEV_SSR: true, // Enable server-side rendering in development for better consistency
  },
  developMiddleware: app => {
    app.set('etag', 'strong') // Set ETag headers to strong for better caching
  },
};
