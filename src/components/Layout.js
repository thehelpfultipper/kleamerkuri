import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import Header from './Header';
import Footer from './Footer';
import ScrollTop from './UI/ScrollTop';

import '../styles/global.css';

export default function Layout({ children }) {
    const data = useStaticQuery(graphql`
        query Logo {
            file(relativePath: {eq: "profile-km.png"}) {
                childImageSharp {
                    gatsbyImageData(
                        placeholder: BLURRED
                        formats: [AUTO, WEBP, AVIF]
                    )
                }
            }
        }
    `);

    const logo = data.file.childImageSharp.gatsbyImageData;

    return (
        <React.Fragment>
            <Header mainLogo={logo} />
            <main>{ React.cloneElement(children, {mainLogo: logo})}</main>
            <Footer />
            <ScrollTop />
        </React.Fragment>
    )
}
