import React from 'react';
import { Stack } from '@mui/material';

import Title from './Title';
import ResumeAction from './ResumeAction';
import ResumeTimeline from './ResumeTimeline';

import * as s from '../styles/Resume.module.css';


export default function Resume({data}) {
    const resData = data.allFile.nodes[0].childDataJson.resume;
    
    return (
        <>
            <header className={ `container` }>
                <Stack 
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="flex-start"
                    spacing={2}
                >
                    <Title cs={ s.resumeTitle }>
                        <h2>Resume</h2>
                        <p>Discover current career highlights and skills</p>
                    </Title>
                    <ResumeAction />
                </Stack>
            </header>
            <section className={ `container` }>
                <ResumeTimeline data={resData} />
            </section>
        </>
    )
}
