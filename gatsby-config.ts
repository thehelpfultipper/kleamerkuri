import * as dotenv from 'dotenv';
const envPath = process.env.NODE_ENV === 'production' ? './environments/.env.production' : './environments/.env.development';
dotenv.config({ path: envPath });

module.exports = {
  siteMetadata: {
    title: 'Klea Merkuri | Software Engineer',
    description: 'Software Engineer specializing in design systems, cross-platform mobile applications, and applied AI integrations for enterprise environments.',
    author: 'Klea Merkuri',
    keywords:
      'Software Engineer, Design Systems, React Developer, TypeScript, Flutter, AI Integration, RAG, Web Performance, Gatsby, JavaScript, MCP, Mobile Development',
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
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: ['G-8JSXM2V0J4'],
        gtagConfig: {
          anonymize_ip: true,
        },
        pluginConfig: {
          head: true,
        },
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
  developMiddleware: (app: { set: (name: string, value: string) => void }) => {
    app.set('etag', 'strong'); // Set ETag headers to strong for better caching
  },
};
