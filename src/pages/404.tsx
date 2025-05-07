import React from 'react';
import { Link } from 'gatsby';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <section className="container">
      <div className="wrapper">
        <h1 className="title">{'< 404 />'}</h1>
        <h2 className="subTitle">Page Not Found</h2>
        <p>
          {`You either stumbled upon a page that doesn't exist or broke the site
          😓. Here are a few things you can try:`}
        </p>
        <ol className="optionsList">
          <li>
            <strong>Check the URL:</strong> Make sure you've entered the correct URL. Sometimes a
            small typo can lead you astray.
          </li>
          <li>
            <strong>Go Back to the Homepage:</strong> Click <Link to="/">here</Link> to return to
            the homepage and explore from there.
          </li>
          <li>
            <strong>Explore My Portfolio:</strong> While you're here, why not take a look at some of
            my recent projects? Click <Link to="/portfolio/">here</Link> to browse through my
            portfolio.
          </li>
        </ol>
        <p>Thanks for visiting!</p>
      </div>
      <Footer />
    </section>
  );
}
