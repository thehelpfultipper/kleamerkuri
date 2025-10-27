import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import BlogPostCard from './BlogPostCard';
import { IPost } from '../helpers/interfaces';
import { links } from '../helpers/variables';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
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
      className="py-5 my-5">
      <h2 className="fs-2 fw-bold text-slate-light mb-5 text-center">
        <span className="text-sky-blue font-monospace">02.</span> From My Blog
      </h2>
      <div className="row g-4">
        {featuredPosts.map((post) => (
          <div
            className="col-12 col-md-6 col-lg-4"
            key={post.title}>
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
      <InlineNotice>
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
      <div className="text-center mt-5 pt-3">
        <a
          href={links.blog.url}
          target="_blank"
          rel="noreferrer"
          className="btn-cta d-inline-block">
          Go to Blog
          <ExternalLinkIcon className="ms-1 ext-link" />
        </a>
      </div>
    </section>
  );
};

export default Blog;
