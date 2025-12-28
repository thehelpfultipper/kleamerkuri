if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({
    path: './environments/.env.production',
  });
} else {
  require('dotenv').config({
    path: './environments/.env.development',
  });
}

module.exports = {
  siteMetadata: {
    title: 'Klea Merkuri | Front-End Engineer',
    description: 'Front-End Engineer specializing in high-performance web applications, accessible design systems, and modern React architectures.',
    author: 'Klea Merkuri',
    keywords:
      'Front-End Engineer, React Developer, TypeScript, Web Performance, Design Systems, Finance of America, Gatsby, JavaScript, UI/UX, Software Engineer',
    siteImage: 'https://thehelpfultipper.com/kleamerkuri/site-image.png',
    siteUrl: 'https://thehelpfultipper.com/kleamerkuri',
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-transformer-json',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
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
        resolveSiteUrl: ({ site }: { site: { siteMetadata: { siteUrl: string } } }) =>
          site.siteMetadata.siteUrl,
        resolvePages: ({
          allSitePage,
        }: {
          allSitePage: { nodes: { path: { page: { path: string } } }[] };
        }) => allSitePage.nodes.map((page) => ({ path: page.path })),
        serialize: ({ path, modifiedGmt }: { path: string; modifiedGmt: string }) => ({
          url: path,
          lastmod: modifiedGmt || new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.7,
        }),
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/' }],
        sitemap: `${process.env.GATSBY_SITE_ROOT}/sitemap-index.xml`,
        host: process.env.GATSBY_SITE_ROOT,
      },
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
        path: `${__dirname}/src/data/projects/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/src/data/`,
        ignore: [`**/projects/**`],
      },
    }
  ],
  pathPrefix: '/kleamerkuri',
  flags: {
    DEV_SSR: true,
  },
  developMiddleware: (app: any) => {
    app.set('etag', 'strong'); // Set ETag headers to strong for better caching
  },
};
