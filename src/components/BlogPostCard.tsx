import React from 'react';
import { IPost } from '../helpers/interfaces';

interface BlogPostCardProps {
  post: IPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { title, date, link, image } = post;

  return (
    <a href={link} className="text-decoration-none d-block h-100">
      <article className="card card-custom card-blog bg-slate-800 h-100 overflow-hidden">
        <div className="card-img-container card-blog-img">
          <img src={image} alt={title} className="card-img-top" />
        </div>
        <div className="card-body">
          <p className="card-meta font-monospace mb-2">{date}</p>
          <h3 className="fs-5 fw-semibold mb-0 text-slate-light">{title}</h3>
        </div>
        <footer className="card-blog-footer">
          <span className="text-secondary small font-monospace">Read →</span>
        </footer>
      </article>
    </a>
  );
};

export default BlogPostCard;
