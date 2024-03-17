import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {IconButton, Skeleton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'gatsby';

import * as s from '../../styles/Modal.module.css';
import { Button } from '@mui/material';

export default function Modal({ setOpen, project }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const { title, description, image, links: { demo, blog }, meta } = project;
    const { category, date, stack } = meta;


    const closeModal = () => {
        setOpen(false);
    }

    // Check if the image is loaded
    useEffect(() => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            setImageLoaded(true);
        };
        img.onerror = error => {
            console.error('Error loading image:', error);
        };
    }, [image]);

    return ReactDOM.createPortal(
        <div className={ s.modalOverlay } onClick={ closeModal }>
            <div className={ s.modal }>
                <div className={ s.modalContent } onClick={ e => e.stopPropagation() }>
                    <div className={ s.modalHeader }>
                        <div className={ s.modalHeader__info }>
                            <h2>{ title }</h2>
                            <p><small>{ date }</small></p>
                        </div>
                        <IconButton className={ s.close } onClick={ closeModal }>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className={ s.modalBody }>
                        <div className={ s.modalVisualsWrap }>
                            <div className={ s.modalImgWrap }>
                                {imageLoaded ? <img src={ image } alt={ title } /> : <Skeleton variant="rectangular" height={200} sx={{width:'100%'}} />}
                            </div>
                            <div className={ s.action }>
                                <Button variant="outlined" className={ s.actionBtn } href={ demo } target="_blank" rel="noreferrer">Demo</Button>
                                <Button variant="outlined" className={ s.actionBtn } href={ blog } target="_blank" rel="noreferrer">Blog</Button>
                            </div>
                        </div>
                        <div className={ s.modalDetailsWrap }>
                            <ul className={ s.catList }>
                                {
                                    category.map((cat, i) => (
                                        <li key={ i } className={ s.catItem } onClick={closeModal}><Link to={ `/portfolio/?q=${cat}` }>{ cat }</Link></li>
                                    ))
                                }
                            </ul>
                            <p><span className={ s.label }>Description</span> { description }</p>
                            <div className={ s.stackWrap }>
                                <p>
                                    <span className={ s.label }>Stack</span>
                                </p>
                                <ul className={ s.stackList }>
                                    {
                                        stack.map((tech, i) => (
                                            <li key={ i }>{ tech }</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>,
        document.body
    );
};