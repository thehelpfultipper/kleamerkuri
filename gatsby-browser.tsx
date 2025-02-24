/* eslint-disable import/prefer-default-export */
import type { GatsbyBrowser } from 'gatsby';
import React from 'react';
import LayoutSidebar from './src/components/LayoutSidebar';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element, props }) => (
  <LayoutSidebar {...props}>{element}</LayoutSidebar>
);
