import React, {useState, useEffect, useRef} from 'react';
import { useLocation } from '@reach/router';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { KeyboardArrowUp } from '@mui/icons-material';


import { categories } from '../helpers/variables';

import * as s from '../styles/Projects.module.css';

const ToggleButton = styled(Button)({
    visibility: 'hidden',
    width: '1px',
    height: '1px',
    opacity: '0',
    position: 'absolute',
    top: '-999999px',
    left: '-999999px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'var(--grey-txt)',
    color: 'var(--grey-txt)',
    '&:hover': {
        borderColor: 'var(--grey-txt)',
    },
    '@media (max-width: 545px)': {
        position: 'static',
        maxWidth: '145px',
        width: '100%',
        height: '100%',
        opacity: '1',
        visibility: 'visible'
    }
});

export default function ProjectFilter({onDisplayCat}) {
    const [ activeBtn, setActiveBtn ] = useState('All');
    const [ isOpen, setIsOpen ] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);

    const filterHandler = (category) => {
        setActiveBtn(category);
        onDisplayCat(category);
        isOpen && setIsOpen(!isOpen);

        // Close the menu
        menuRef.current.classList.remove(s.show);
    }

    const filterButtons = categories.map((category, index) => {
        return (
            <button
                type="button"
                className={ `${s.filterBtn}${category === activeBtn ? ` ${s.active}` : ''}` }
                key={ index }
                onClick={ () => filterHandler(category) }
            >
                { category }
            </button>
        );
    });

    const showMenuHandler = () => {
        setIsOpen(!isOpen);
        menuRef.current.classList.toggle(s.show);
    }

    useEffect(() => {
        // Access the query string from the current location
        const queryString = location.search;

        // Parse the query string into URLSearchParams
        const searchParams = new URLSearchParams(queryString);

        // Extract the specific query parameter you're interested in
        const categoryParam = searchParams.get('q');

        // Set the state with the extracted query parameter
        categoryParam && filterHandler(categoryParam);
        
    }, [location.search]);

    return (
        <div className={ `${s.filterContainer}` }>
            <label 
                htmlFor='filterMenu'
            >Filters: </label>
            <div 
                id='filterMenu'
                className={ `${s.filterBtnsMenu}` }
            >
                <ToggleButton
                    variant='outlined'
                    aria-controls={ 'filterMenuList' }
                    endIcon={ isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDownIcon />}
                    onClick={ showMenuHandler }
                >
                    { activeBtn}
                </ToggleButton>
                <div 
                    id={'filterMenuList'}
                    className={ `${s.filterBtns} ${s?.dMob}` }
                    ref={ menuRef }
                >
                    { filterButtons }
                </div>
            </div>
        </div>
    );
}