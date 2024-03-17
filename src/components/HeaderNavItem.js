import React from 'react';
import { Link } from 'gatsby';
import { useLocation } from '@reach/router';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';
import { GatsbyImage } from 'gatsby-plugin-image';

import '../styles/global.css';


export default function HeaderNavItem({name, path, ...props}) {
    let pathName = path === 'home' ? '/' : `/${path}/`;

    const location = useLocation();

    const linkClasses = (p) => {
        return classNames({
            'navLink': true,
            'mob': props.show,
            'active': location.pathname === p,
            'navProfile': p === '/about/' && props.profile
        });
    };

  return (
      path === 'about' && props.profile ?
        <Link className={ linkClasses(pathName) } to={pathName}>
            <Avatar sx={ { width: 30, height: 30 } }>
                <GatsbyImage image={ props.logo } alt='Profile pic' />
            </Avatar>
        </Link> :
        <Link className={ linkClasses(pathName) } to={pathName}>{name}</Link>
  )
}