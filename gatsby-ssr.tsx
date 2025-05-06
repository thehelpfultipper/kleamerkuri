import React from 'react';
import type { GatsbySSR } from 'gatsby';
import LayoutSidebar from './src/components/LayoutSidebar';

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({ element, props }) => (
  <LayoutSidebar {...props}>{element}</LayoutSidebar>
);

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHeadComponents,
  setPreBodyComponents,
}) => {
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

    setPreBodyComponents([
      <noscript
        key="gtm-body"
        dangerouslySetInnerHTML={{
          __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NV7XJ655"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `,
        }}
      />,
    ]);
  }
};
