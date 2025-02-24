import React from 'react';
import type { GatsbySSR } from 'gatsby';
import LayoutSidebar from './src/components/LayoutSidebar';

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({ element, props }) => (
  <LayoutSidebar {...props}>{element}</LayoutSidebar>
);
