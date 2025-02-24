import React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ScrollTop() {
  const trigger = useScrollTrigger();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const anchor = (target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const style = {
    boxShadow:
      '0px 3px 4px -1px rgba(0,0,0,0.12), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
  };

  return (
    <Fade in={trigger}>
      <Box
        id="back-to-top-anchor"
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab
          size="small"
          aria-label="scroll back to top"
          style={style}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  );
}
