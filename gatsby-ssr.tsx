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
  const preBodyComp = [
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
  ];

  if (process.env.NODE_ENV === 'production') {
    setHeadComponents([
      <script
        key="gtm-head"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NV7XJ655');
          `,
        }}
      />,
    ]);

    //   setPreBodyComponents([
    //     <noscript
    //       key="gtm-body"
    //       dangerouslySetInnerHTML={{
    //         __html: `
    //           <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NV7XJ655"
    // height="0" width="0" style="display:none;visibility:hidden"></iframe>
    //         `,
    //       }}
    //     />,
    //   ]);
    preBodyComp.push(
      <noscript
        key="gtm-body"
        dangerouslySetInnerHTML={{
          __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NV7XJ655"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `,
        }}
      />,
    );
  }

  setPreBodyComponents(preBodyComp);
};
