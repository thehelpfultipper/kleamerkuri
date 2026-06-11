import React from 'react';
import { IProduct } from '../helpers/interfaces';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, description, image, links } = product;

  return (
    <article className="card card-static bg-slate-800 h-100">
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img src={image} alt={title} className="card-img-top img-cover" />
        <div className="badge badge-live position-absolute top-0 end-0 m-3">LIVE</div>
      </div>

      <div className="card-body d-flex flex-column">
        <h3 className="fs-5 fw-semibold text-slate-light mb-2">{title}</h3>
        <p className="card-text text-secondary mb-4 flex-grow-1">{description}</p>
      </div>

      {links?.demo && links.demo !== '' ? (
        <div className="card-footer p-3">
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-sky-blue d-flex align-items-center justify-content-center w-100 py-2 font-monospace small">
            <ExternalLinkIcon className="me-2 icon-125" />
            View Live
          </a>
        </div>
      ) : null}
    </article>
  );
};

export default ProductCard;
