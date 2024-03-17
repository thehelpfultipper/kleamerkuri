import React from 'react';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import * as s from '../styles/Resume.module.css';


export default function ResumeExperience({ exp }) {
    return (
        exp.map((item, i) => {
            return (
                <TimelineItem key={ i }>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <h4 className={ `${s.nullMargin}` }>{ item.title }</h4>
                        <div className={ s.resExp__info }>
                            <p className={ s.infoDetails }>{ item.company }, <span>{ item.dates }</span></p>
                            <p className={s.infoDetails}>{ item.location }</p>
                        </div>
                        <div>
                            <ul>
                                {
                                    item.desc.map((desc, i) => {
                                        return (
                                            <li key={ i }>{ desc }</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </TimelineContent>
                </TimelineItem>
            )
        })
    )
}
