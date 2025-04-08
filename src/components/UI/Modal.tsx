import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IconButton, Skeleton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IProject } from '../../helpers/interfaces';

import '../../styles/modal.scss';

interface IModalProps {
  open?: boolean;
  setOpen: (isOpen: boolean) => void;
  project: IProject;
}

export default function Modal({ setOpen, project }: IModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    title,
    description,
    image,
    links: { demo, blog },
    meta,
  } = project;
  const { category, date, stack } = meta;

  const closeModal = () => {
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  // Check if the image is loaded
  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  }, [image]);

  return ReactDOM.createPortal(
    <div
      className="modalOverlay"
      role="presentation"
      onClick={closeModal}
      onKeyDown={handleKeyDown}
      aria-hidden>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription">
        <div
          className="modalContent"
          onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <div className="modalHeader__info">
              <h2 id="modalTitle">{title}</h2>
              <p>
                <small>{date}</small>
              </p>
            </div>
            <IconButton
              className="close"
              onClick={closeModal}
              aria-label="Close modal">
              <CloseIcon />
            </IconButton>
          </div>
          <div className="modalBody">
            <div className="modalVisualsWrap">
              <div className="modalImgWrap">
                {imageLoaded ? (
                  <img
                    src={image}
                    alt={title}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ width: '100%' }}
                  />
                )}
              </div>
              <div className="action">
                <Button
                  variant="outlined"
                  className="actionBtn"
                  href={demo}
                  target="_blank"
                  rel="noreferrer">
                  Demo
                </Button>
                {blog && (
                  <Button
                    variant="outlined"
                    className="actionBtn"
                    href={blog}
                    target="_blank"
                    rel="noreferrer">
                    Blog
                  </Button>
                )}
              </div>
            </div>
            <div className="modalDetailsWrap">
              <ul className="catList">
                {category.map((cat, i) => (
                  <li
                    key={i}
                    className="catItem"
                    onClick={closeModal}>
                    {cat}
                  </li>
                ))}
              </ul>
              <p id="modalDescription">
                <span className="label">Description</span> {description}
              </p>
              <div className="stackWrap">
                <p>
                  <span className="label">Stack</span>
                </p>
                <ul className="stackList">
                  {stack.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
