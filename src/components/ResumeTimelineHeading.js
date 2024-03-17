import React, {useEffect, useRef, useState} from 'react';
import { TimelineItem, TimelineContent, TimelineDot } from '@mui/lab';

import * as s from '../styles/Resume.module.css';

export default function ResumeTimelineHeading({ icon, title }) {
    let sectionRef = useRef(null);
    const [isSectionAtTop, setIsSectionAtTop] = useState(false);

    const handleScroll = () => {
        // Check if the top of the section is close to the top of the viewport
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        setIsSectionAtTop(sectionTop <= 200);
    };

    useEffect(() => {
        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <TimelineItem className={ isSectionAtTop ? s.activeSection : '' }>
            <div ref={ sectionRef }></div>
            <TimelineDot className={ `${s.centerLine}` }>
                { icon }
            </TimelineDot>
            <TimelineContent className={ s.baselineAlign }>
                <h3 className={ s.nullMargin }>{ title }</h3>
            </TimelineContent>
        </TimelineItem>
    )
}
