import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import HeaderNavItem from './HeaderNavItem';

import '../styles/global.css';

export default function HeaderNavLinks({ isFull, mainLogo, profile, cs}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <nav className={ `navLinks${cs ? ` ${cs}` : ''}` }>
            {
                isFull ?
                    ['Home', 'Portfolio', 'Resume', 'About'].map((name, index) => {
                        let path = name.toLowerCase();
                        return <HeaderNavItem show={true} profile={ profile } key={ index } name={ name } path={ path } logo={ path === 'about' ? mainLogo : null } />
                    }) :
                    <>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={ open ? 'mobile-nav-menu' : undefined }
                            aria-expanded={ open ? 'true' : undefined }
                            aria-haspopup="true"
                            onClick={ handleClick }
                        >
                            <MoreVertIcon sx={ { fill: 'var(--dark-gray)'}} />
                        </IconButton>
                        <Menu
                            id="mobile-nav-menu"
                            MenuListProps={ {
                                'aria-labelledby': 'long-button',
                            } }
                            anchorEl={ anchorEl }
                            open={ open }
                            onClose={ handleClose }
                            slotProps={ {
                                paper: {
                                    style: {
                                        width: '100%',
                                        borderRadius: 0,
                                        boxShadow: 'none',
                                        background: 'var(--light-gray)',
                                    }
                                },
                            } }
                        >
                            {
                                ['Home', 'Portfolio', 'Resume', 'About'].map((name, index) => {
                                    let path = name.toLowerCase();
                                    return <MenuItem key={ index } onClick={ handleClose }>
                                        <HeaderNavItem show={false} profile={ profile } name={ name } path={ path } logo={ path === 'about' ? mainLogo : null } />
                                        </MenuItem>
                                })
                            }
                        </Menu>
                    </>
            }
        </nav>
    )
}
