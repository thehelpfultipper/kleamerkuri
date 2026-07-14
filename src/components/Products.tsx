import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { IProduct } from '../helpers/interfaces';
import ProductCard from './ProductCard';
import SectionHeading from './UI/SectionHeading';

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

  const { products }: { products: IProduct[] } = data.allFile.nodes[0].childDataJson || {};
  const featuredProducts = products.filter((product) => product.featured);
  const otherProducts = products.filter((product) => !product.featured).slice(0, -1);

  return (
    <section id="products" className="section-block">
      <SectionHeading
        label="Shipped Tools"
        title="Products"
        description="Extensions and utilities built to improve developer workflows and user productivity."
        align="center"
      />
      <div className="row g-3 g-lg-4">
        {featuredProducts.map((product) => (
          <div className="col-12 col-md-6 col-lg-4" key={product.title}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-top border-slate-700">
        <h3 className="fs-6 fw-semibold text-slate-light font-monospace text-uppercase section-label mb-4">
          Utility Library
        </h3>
        <div className="row g-3 g-md-4">
          {otherProducts.map((p) => (
            <div key={p.title} className="col-12 col-md-6">
              <a
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center p-3 p-md-4 bg-slate-800 rounded-3 text-decoration-none border-subtle hover-border-sky-blue transition-all">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="fs-6 fw-semibold text-slate-light mb-1 text-truncate">{p.title}</h4>
                  <p className="text-secondary small mb-0 text-truncate">{p.description}</p>
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
