import React from 'react';
import type { GatsbySSR } from 'gatsby';
import Layout from './src/components/Layout';

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHeadComponents,
  setPreBodyComponents,
}) => {
  setHeadComponents([
    <link
      key="inter-font"
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />,
    <link
      key="inter-font-gstatic"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="inter-font-stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />,
  ]);

  setPreBodyComponents([
    <script
      key="theme-select"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              try {
                // try to use stored preference first
                const stored = window.localStorage.getItem('theme');
                if (stored === 'light' || stored === 'dark') {
                  document.documentElement.setAttribute('data-bs-theme', stored);
                  return;
                }
                // fallback to system preference
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-bs-theme', 'dark');
                  return;
                }
                // final fallback
                document.documentElement.setAttribute('data-bs-theme', 'light');
              } catch (e) {
                // If anything fails, don't crash page render. Use a safe fallback (light).
                document.documentElement.setAttribute('data-bs-theme', 'light');
              }
            })();
          `.trim(),
      }}
    />,
  ]);
};
