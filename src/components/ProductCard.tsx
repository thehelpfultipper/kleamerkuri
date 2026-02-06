import React from 'react';
import { IProduct } from '../helpers/interfaces';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import { useTheme } from '../contexts/ThemeContext';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark' || theme === null;
  const { title, description, image, links } = product;
  return (
    <article className="card card-custom bg-slate-800 h-100 shadow-lg">
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img
          src={image}
          alt={title}
          className="card-img-top img-cover transition-transform group-hover-scale"
        />
        <div className="badge bg-sky-blue text-navy font-monospace position-absolute top-0 end-0 m-3 shadow-sm">
          LIVE PRODUCT
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <h3 className="fs-5 fw-bold text-slate-light mb-2">{title}</h3>
        <p className="card-text text-slate-dark small mb-4 flex-grow-1">
          {description}
        </p>
      </div>

      {links?.demo && links.demo !== '' ? (
        <div
          className="card-footer p-3"
          style={{ background: isDarkTheme ? 'rgba(40, 40, 40, 0.5)' : 'rgba(0, 0, 0, 0.05)', borderTop: `1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}` }}
        >
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
