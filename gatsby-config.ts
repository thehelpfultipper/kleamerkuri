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
    title: 'Klea Merkuri',
    description: 'A creative minimalist developer portfolio built with Gatsby and Material-UI.',
    author: 'Klea Merkuri',
    keywords:
      'Web Developer, Frontend Developer, Full Stack Developer, Software Engineer, JavaScript Developer, UI/UX Designer',
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
      resolve: 'gatsby-plugin-anchor-links',
      options: {
        offset: -20,
      },
    },
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
        sitemap: `${process.env.SITE_ROOT}/sitemap-index.xml`,
        host: process.env.SITE_ROOT,
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
      },
    },
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        allowList: ['SITE_ROOT', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'],
      },
    },
  ],
  pathPrefix: '/kleamerkuri',
  flags: {
    DEV_SSR: true,
  },
  developMiddleware: (app: any) => {
    app.set('etag', 'strong'); // Set ETag headers to strong for better caching
  },
};
