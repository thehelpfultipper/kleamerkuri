import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { IProduct } from '../helpers/interfaces';
import ProductCard from './ProductCard';

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
  const otherProducts = products.filter((product) => !product.featured);
  return (
    <section
      id="products"
      className="py-5 mt-5">
      <div className="text-center mb-5">
        <h2 className="fs-2 fw-bold text-slate-light mb-3">
          <span className="text-sky-blue font-monospace">03.</span> Engineered Solutions
        </h2>
        <p className="text-slate-dark max-w-700 mx-auto">
          Tools and extensions I’ve built and released to improve developer workflows and user productivity.
        </p>
      </div>
      <div className="row g-4">
        {featuredProducts.map((product) => (
          <div className="col-12 col-md-6 col-lg-4" key={product.title}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-top border-slate-800">
        <h3 className="fs-6 fw-bold text-slate-light font-monospace text-uppercase tracking-widest mb-4">
          Utility Library
        </h3>
        <div className="row g-3">
          {otherProducts.map((p) => (
            <div key={p.title} className="col-12 col-md-6">
              <a href={p.links.demo} target="_blank" rel="noopener noreferrer"
                className="d-flex align-items-center p-3 bg-slate-800 rounded-3 text-decoration-none border border-slate-700 hover-border-sky-blue transition-all">
                <div className="me-3">
                  <span className="text-sky-blue">▹</span>
                </div>
                <div className="overflow-hidden">
                  <h4 className="fs-6 fw-bold text-slate-light mb-0 text-truncate">{p.title}</h4>
                  <p className="text-slate-dark x-small mb-0 text-truncate">{p.description}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
