import React from 'react';
import { Link } from 'gatsby';
import { useLocation } from '@reach/router';
import { pathPrefix } from '../../gatsby-config';

import HeaderNavLinks from './HeaderNavLinks';

import '../styles/global.css';

export default function Header({mainLogo}) {
    const prefix = process.env.NODE_ENV === 'development' ? '' : pathPrefix;

    const location = useLocation();

    return (
        <header className={`headerContainer container`} style={ location.pathname === prefix + '/about/' ? { background: '#fff' } : { background: 'transparent'}}>
            <HeaderNavLinks isFull={false} profile={false} cs='d-sm' />
            <div className='logoWrapper'>
                <Link to="/">KM</Link>
            </div>
            <HeaderNavLinks isFull={true} mainLogo={mainLogo} profile={true} />
        </header>
    )
}
