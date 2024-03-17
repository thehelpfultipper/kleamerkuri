import React from 'react';
import { Button } from '@mui/material';

import { links } from '../helpers/variables';

import * as s from '../styles/Resume.module.css';

export default function ResumeAction() {
    const pdfURL = links.resume.url;

    return (
        <div className={ s.resumeAction }>
            <Button
                className={ `${s.download} ${s.actionBtn}` }
                variant='contained'
                size={ 'small' }
                onClick={ () => window.open(pdfURL, '_blank')}
            >
                { links.resume.text }
            </Button>
            <Button
                href={ links.linkedin.url }
                className={ `${s.linkedin} ${s.actionBtn}` }
                variant='outlined'
                size={'small'}
            >
                { links.linkedin.text }
            </Button>
        </div>
    );
}
