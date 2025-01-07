import React from 'react';
import useSiteMetadata from '../hooks/use-sitemetadata';

const pathPrefix = '/kleamerkuri';

export default function SEO({ title, description, children }) {
  const prefix = process.env.NODE_ENV === 'development' ? '' : pathPrefix;

  const { 
    description: siteDesc, 
    title: siteTitle, 
    author, 
    keywords,
    siteUrl,
    siteImage
  } = useSiteMetadata();

  const seo = {
    title: `${title} - ${siteTitle}` || siteTitle,
    description: description || siteDesc
  }

  return (
    <>
      <meta name="description" content={ seo.description } />
      <meta name="author" content={ author } />
      <meta name="keywords" content={ keywords } />
      <meta name="title" property="og:title" content={ seo.title } />
      <meta name="url" property="og:url" content={ siteUrl } />
      <meta name="image" property="og:image" content={ siteImage } />
      <meta name="description" property="og:description" content={ seo.description } />
      <meta property="og:type" content="website" />
      <link rel="icon" href={`${prefix}/favicon.ico`} />
      <title>{ seo.title }</title>
      { children }
    </>
  )
}
