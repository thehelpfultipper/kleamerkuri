import React from 'react';
import { IProduct } from '../helpers/interfaces';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, description, image, links } = product;
  return (
    <article className="card card-custom bg-slate-800 h-100 shadow-lg">
      <div className="position-relative">
        <img
          src={image}
          alt={`${title} preview`}
          className="card-img-top img-cover"
        />
        <div className="badge bg-sky-blue text-navy font-monospace position-absolute top-0 end-0 m-2 fs-6">
          Free
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <h3 className="fs-5 fw-bold card-title-link mb-2">{title}</h3>
        <p className="card-text text-slate-dark small mb-4 flex-grow-1">{description}</p>
      </div>

      {links?.demo && links.demo !== '' ? (
        <div className="card-footer bg-slate-900/50 p-3">
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta d-flex align-items-center justify-content-center w-100 py-2">
            <ExternalLinkIcon className="me-2 icon-125" />
            Get It Now
          </a>
        </div>
      ) : null}
    </article>
  );
};

export default ProductCard;
