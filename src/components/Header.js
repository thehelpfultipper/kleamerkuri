import React from 'react';
import { Link } from 'gatsby';
import { useLocation } from '@reach/router';

import HeaderNavLinks from './HeaderNavLinks';

import '../styles/global.css';

export default function Header({mainLogo}) {
    const location = useLocation();

    return (
        <header className={`headerContainer container`} style={ location.pathname === '/about/' ? { background: '#fff' } : { background: 'transparent'}}>
            <HeaderNavLinks isFull={false} profile={false} cs='d-sm' />
            <div className='logoWrapper'>
                <Link to="/">KM</Link>
            </div>
            <HeaderNavLinks isFull={true} mainLogo={mainLogo} profile={true} />
        </header>
    )
}
