import React from 'react';
import { Link } from 'gatsby';
import { Stack } from '@mui/material';
import { links } from '../helpers/variables';

import '../styles/global.css';

export default function Footer() {
  return (
    <footer className='footerContainer container'>
      <div className='footer1'>
        <div className='signOff'>
          <h3>Klea Merkuri</h3>
          <p>Elevating the web through innovative design and seamless functionality. Let's develop experiences one idea at a time.</p>
          <p>This portfolio is built with Gatsby and MaterialUI.</p>
        </div>
        <Stack direction='row' spacing={ 1 } className='socialLinks'>
          {/* GitHub */ }
          <a href={ links.github.url } target='_blank' rel='noreferrer'>GitHub</a>
          {/* CodePen */ }
          <a href={ links.codepen.url } target='_blank' rel='noreferrer'>CodePen</a>
          {/* LinkedIn */}
          <a href={ links.linkedin.url } target='_blank' rel='noreferrer'>LinkedIn</a>
          {/* Twitter */ }
          {/* Blog */ }
          <a href={ links.blog.url } target='_blank' rel='noreferrer'>Blog</a>
        </Stack>
      </div>
      <div className='footer2'>
        <div className='footerLinks'>
          <Link to='/'>Home</Link>
          <Link to='/portfolio'>Portfolio</Link>
          <Link to='/resume'>Resume</Link>
          <Link to='/about'>About</Link>
        </div>
        <div className='copyRight'>
          <p><span className='copyYr'>© { new Date().getFullYear() }</span> <span>Portfolio by Klea Merkuri. All Rights Reserved.</span></p>
        </div>
      </div>
    </footer>
  )
}
