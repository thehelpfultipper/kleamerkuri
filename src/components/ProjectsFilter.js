import React, {useState, useEffect, useRef} from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { KeyboardArrowUp } from '@mui/icons-material';
import { categories } from '../helpers/variables';

import '../styles/filter.scss';

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
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(211, 211, 211, .6)',
    borderRadius: '50px',
    background: '#d3d3d333',
    color: '#787878',
    '&:hover': {
        borderColor: 'rgba(211, 211, 211, .7)',
    },
    '@media (max-width: 600px)': {
        position: 'static',
        maxWidth: '80%',
        width: '100%',
        height: '100%',
        opacity: '1',
        visibility: 'visible'
    }
});

export default function ProjectFilter({onDisplayCat}) {
    const [ activeBtn, setActiveBtn ] = useState('All');
    const [ isOpen, setIsOpen ] = useState(false);
    const menuRef = useRef(null);
    const btnRef = useRef(null);

    const filterHandler = (category) => {
        setActiveBtn(category);
        onDisplayCat(category);
        isOpen && setIsOpen(prev => !prev);

        // Close the menu
        menuRef.current.classList.remove('show');
    }

    const filterButtons = categories.map((category, index) => {
        return (
            <button
                type="button"
                className={ `filterBtn${category === activeBtn ? ` active` : ''}` }
                key={ index }
                onClick={ () => filterHandler(category) }
            >
                { category }
            </button>
        );
    });

    const showMenuHandler = () => {
        setIsOpen(prev => !prev);
        menuRef.current.classList.toggle('show');
    }

    useEffect(() => {
        const outsideClickHandler = (e) => {
            if(
                btnRef && btnRef.current && !btnRef.current.contains(e.target) &&
                menuRef && menuRef.current && !menuRef.current.contains(e.target)
            ) {
                setIsOpen(false);
                if(menuRef.current.classList.contains('show')) {
                    menuRef.current.classList.remove('show');
                }
            }
        };

        window.addEventListener('click', outsideClickHandler);

        return () => {
            window.removeEventListener('click', outsideClickHandler);
        }
        
    }, []);

    return (
        <div className={ `filterContainer` }>
            <label 
                htmlFor='filterMenu'
            >Categories: </label>
            <div 
                id='filterMenu'
                className={ `filterBtnsMenu` }
            >
                <ToggleButton
                ref={btnRef}
                    variant='outlined'
                    aria-controls={ 'filterMenuList' }
                    endIcon={ isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDownIcon />}
                    onClick={ showMenuHandler }
                >
                    { activeBtn}
                </ToggleButton>
                <div 
                    id={'filterMenuList'}
                    className={ `filterBtns dMob` }
                    ref={ menuRef }
                >
                    { filterButtons }
                </div>
            </div>
        </div>
    );
}