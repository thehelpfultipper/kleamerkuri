/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GatsbyBrowser } from 'gatsby';
import React from 'react';
import Layout from './src/components/Layout';
import './src/styles/main.scss';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);
