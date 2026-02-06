import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import BlogPostCard from './BlogPostCard';
import { IPost } from '../helpers/interfaces';
import { links } from '../helpers/variables';
import InlineNotice from './UI/InlineNotice';

const Blog: React.FC = () => {
  const data = useStaticQuery(graphql`
    query PostsData {
      allFile(filter: { sourceInstanceName: { eq: "data" }, name: { eq: "posts" } }) {
        nodes {
          childDataJson {
            posts {
              date
              image
              link
              title
              featured
            }
          }
        }
      }
    }
  `);

  if (!data || !data.allFile.nodes) {
    console.error('There was an error getting posts data.');
  }

  const { posts }: { posts: IPost[] } = data.allFile.nodes[0].childDataJson || {};

  const featuredPosts = useMemo(() => {
    return posts.filter((p: IPost) => p.featured === 'true');
  }, [posts]);

  const extraPosts = useMemo(() => {
    return posts.filter((p: IPost) => p.featured === 'false');
  }, [posts]);

  return (
    <section
      id="blog"
      className="py-5 mt-5">
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 className="fs-2 fw-bold text-slate-light mb-2">
            <span className="text-sky-blue font-monospace">02.</span> Technical Insights
          </h2>
          <p className="text-slate-dark mb-0">Writing on performance, accessibility, and AI integration.</p>
        </div>
        <a href={links.blog.url} target="_blank" rel="noreferrer" className="text-sky-blue font-monospace text-decoration-none d-none d-md-block">
          View all posts &rarr;
        </a>
      </div>
      <div className="row g-4">
        {featuredPosts.map((post) => (
          <div className="col-12 col-md-6 col-lg-4" key={post.title}>
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
      <InlineNotice>
        <h3 className="fs-6 fw-bold text-slate-light font-monospace text-uppercase tracking-widest mb-4">
          Further Reading
        </h3>
        <ul>
          {extraPosts.map((p, i) => (
            <li key={`ext_${i + 1}`}>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer">
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </InlineNotice>
    </section>
  );
};

export default Blog;
