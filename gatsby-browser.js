import React from 'react';
import LayoutSidebar from './src/components/LayoutSidebar';

export function wrapPageElement({ element, props }) {
    return <LayoutSidebar {...props}>{element}</LayoutSidebar>;
};
