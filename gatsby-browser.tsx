/* eslint-disable import/prefer-default-export */
import type { GatsbyBrowser } from 'gatsby';
import React from 'react';
import LayoutSidebar from './src/components/LayoutSidebar';
import { ThemeProvider } from './src/context/ThemeContext';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element, props }) => (
  <ThemeProvider>
    <LayoutSidebar {...props}>{element}</LayoutSidebar>
  </ThemeProvider>
);
