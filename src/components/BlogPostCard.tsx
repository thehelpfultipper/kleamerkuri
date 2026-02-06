import React from 'react';
import { IPost } from '../helpers/interfaces';

interface BlogPostCardProps {
  post: IPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { title, date, link, image } = post;

  return (
    <a href={link} className="text-decoration-none d-block h-100 group">
      <article className="card card-custom bg-slate-800 h-100 border-0 shadow-sm overflow-hidden">
        <div className="card-img-container" style={{ height: '200px' }}>
          <img
            src={image}
            alt={title}
            className="card-img-top img-cover transition-transform"
          />
        </div>
        <div className="card-body p-4 d-flex flex-column">
          <p className="text-sky-blue font-monospace small mb-2">{date}</p>
          <h3 className="fs-5 fw-bold mb-3 text-slate-light group-hover-sky-blue">{title}</h3>
          <footer className="mt-auto pt-3 border-top border-slate-700">
            <span className="text-slate-dark small font-monospace">Read Insight &rarr;</span>
          </footer>
        </div>
      </article>
    </a>
  );
};

export default BlogPostCard;
