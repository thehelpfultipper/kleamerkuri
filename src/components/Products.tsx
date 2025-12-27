import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { IProduct } from '../helpers/interfaces';
import ProductCard from './ProductCard';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import { links } from '../helpers/variables';
import InlineNotice from './UI/InlineNotice';

const Products: React.FC = () => {
  const data = useStaticQuery(graphql`
    query ProductsData {
      allFile(filter: { sourceInstanceName: { eq: "data" }, name: { eq: "products" } }) {
        nodes {
          childDataJson {
            products {
              title
              image
              description
              links {
                blog
                demo
              }
              featured
            }
          }
        }
      }
    }
  `);

  if (!data || !data.allFile.nodes) {
    console.error('There was an error getting products data.');
  }
  const { products }: { products: IProduct[] } = data.allFile.nodes[0].childDataJson || {};
  const featuredProducts = products.filter((product) => product.featured);
  const nonFeaturedProducts = products.filter((product) => !product.featured);
  return (
    <section
      id="products"
      className="py-5 my-5">
      <h2 className="fs-2 fw-bold text-slate-light mb-5 text-center">
        <span className="text-sky-blue font-monospace">03.</span> My Products
      </h2>
      <div className="row g-4">
        {featuredProducts.map((product) => (
          <div
            className="col-12 col-md-4"
            key={product.title}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <InlineNotice>
        <p>Check out Chrome extensions collection:</p>
        <ul>
          {nonFeaturedProducts.map((p, i) => (
            <li key={`ext_${i + 1}`}>
              <a
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer">
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </InlineNotice>
      <div className="text-center mt-5 pt-3">
        <a
          href={links.resources.url}
          target="_blank"
          rel="noreferrer"
          className="btn-cta d-inline-block">
          Browse Products
          <ExternalLinkIcon className="ms-1 ext-link" />
        </a>
      </div>
    </section>
  );
};

export default Products;
