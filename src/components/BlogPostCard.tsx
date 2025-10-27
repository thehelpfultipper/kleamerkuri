import React from 'react';
import { IPost } from '../helpers/interfaces';

interface BlogPostCardProps {
  post: IPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { title, date, link, image } = post;

  return (
    <a
      href={link}
      className="text-decoration-none d-block h-100">
      <article className="card card-custom bg-slate-800 h-100 shadow-lg">
        <div className="card-img-container rounded-top">
          <img
            src={image}
            alt={`${title} blog post illustration`}
            className="card-img-top img-cover"
          />
        </div>
        <div className="card-body p-4 d-flex flex-column">
          <header className="flex-grow-1">
            <p className="text-sky-blue font-monospace small mb-2">{date}</p>
            <h3 className="fs-5 fw-bold mb-3 card-title-link">{title}</h3>
          </header>
          <footer className="mt-auto">
            <span className="text-orange-cta fw-semibold small">Read More &rarr;</span>
          </footer>
        </div>
      </article>
    </a>
  );
};

export default BlogPostCard;
