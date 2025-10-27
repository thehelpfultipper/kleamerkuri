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
  return (
    <section
      id="products"
      className="py-5 my-5">
      <h2 className="fs-2 fw-bold text-slate-light mb-5 text-center">
        <span className="text-sky-blue font-monospace">03.</span> My Products
      </h2>
      <div className="row g-4">
        {products.map((product) => (
          <div
            className="col-12 col-md-4"
            key={product.title}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
