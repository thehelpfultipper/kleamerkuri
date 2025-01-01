import React, { useState, useEffect } from 'react';
import { Grid, Skeleton } from '@mui/material';
import Modal from './UI/Modal';
import DisableItem from './UI/DisableItem';

export default function GridTile({ project, col, onMouseEnter, onMouseLeave, isDisabled }) {
    const [open, setOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const { title, image, meta } = project;
    const { category, date } = meta;

    let categoryStr = category.length > 1 ? category.join(' · ') : category[0];

    const openModal = () => {
        setOpen(true);
    }

    // Disable scrolling when the modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling
        }

        return () => {
            // Cleanup: Reset overflow when the component is unmounted
            document.body.style.overflow = 'auto';
        };
    }, [open]);

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

    return (
        <>
            <Grid
                className={`projectTile`}
                item
                xs={col === 2 ? 6 : 4}
                onClick={openModal}
            >
                {
                    !imageLoaded && <Skeleton variant="rectangular" height={200} sx={{ width: '100%' }} />
                }
                {imageLoaded &&
                    <DisableItem
                        cs={` displayItem rnd`}
                        isDisabled={isDisabled}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}>
                        <div className={`tileWrapper rnd`} style={{ backgroundImage: `url(${image})` }}>
                            <div className={`tileOverlay rnd`}></div>
                            <div className={`tileContent rnd`}>
                                <p>
                                    <span className={`tileContent__date`}><small>{date}</small></span>
                                </p>
                                <h3>{title}</h3>
                                <p className={`tileContent_catWrap`}>
                                    <span className={`tileContent__category`}>{categoryStr}</span>
                                </p>
                            </div>
                        </div>
                    </DisableItem>
                }
            </Grid>
            {open && <Modal open={open} setOpen={setOpen} project={project} />}
        </>
    )
}
