import React from 'react';

import useSiteMetadata from '../hooks/use-sitemetadata';

export default function SEO({ title, description, children }) {
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
    description: description || siteDesc,
  }

  return (
    <>
      <meta name="description" content={ seo.description } />
      <meta name="author" content={ author } />
      <meta name="keywords" content={ keywords } />
      <meta name="og:title" content={ seo.title } />
      <meta name="og:url" content={ siteUrl } />
      <meta name="og:image" content={ siteImage } />
      <meta name="og:description" content={ seo.description } />
      <meta name="og:type" content="website" />
      <link rel="icon" href="/favicon.ico" />
      <title>{ seo.title }</title>
      { children }
    </>
  )
}
