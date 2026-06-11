import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import BlogPostCard from './BlogPostCard';
import { IPost } from '../helpers/interfaces';
import { links } from '../helpers/variables';
import InlineNotice from './UI/InlineNotice';
import SectionHeading from './UI/SectionHeading';

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

  const { posts }: { posts: IPost[] } = data.allFile.nodes[0].childDataJson || {};

  const featuredPosts = useMemo(() => posts.filter((p: IPost) => p.featured === 'true'), [posts]);
  const extraPosts = useMemo(() => posts.filter((p: IPost) => p.featured === 'false'), [posts]);

  return (
    <section id="blog" className="section-block">
      <div className="section-heading-row d-flex justify-content-between align-items-end gap-4 flex-wrap">
        <SectionHeading
          label="Writing"
          title="Technical Insights"
          description="Performance, accessibility, and AI integration."
        />
        <a
          href={links.blog.url}
          target="_blank"
          rel="noreferrer"
          className="text-sky-blue font-monospace small text-decoration-none d-none d-md-block flex-shrink-0">
          View all posts →
        </a>
      </div>
      <div className="row g-3 g-lg-4">
        {featuredPosts.map((post) => (
          <div className="col-12 col-md-6 col-lg-4" key={post.title}>
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
      <InlineNotice>
        <h3 className="fs-6 fw-semibold text-slate-light font-monospace text-uppercase section-label mb-4">
          Further Reading
        </h3>
        <ul>
          {extraPosts.map((p, i) => (
            <li key={`ext_${i + 1}`}>
              <a href={p.link} target="_blank" rel="noopener noreferrer">
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
