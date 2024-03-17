import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import PsychologyIcon from '@mui/icons-material/Psychology';

import ResumeExperience from './ResumeExperience';
import ResumeSkills from './ResumeSkills';
import ResumeTimelineHeading from './ResumeTimelineHeading';

import * as s from '../styles/Resume.module.css';

export default function ResumeTimeline({ data }) {
    return (
        <Timeline
            sx={ {
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
                '@media (max-width: 280px)': {
                    paddingLeft: '1px',
                }
            } }
        >
            <ResumeTimelineHeading icon={ <PersonIcon /> } title='Profile' />
            <TimelineItem className={s.mb20}>
                <TimelineSeparator>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className={s.summary}>
                    <p className={s.nullMargin}>{ data.summary }</p>
                </TimelineContent>
            </TimelineItem>
            <ResumeTimelineHeading icon={ <PsychologyIcon /> } title='Skills' />
            <ResumeSkills sk={ data.skills } />
            <ResumeTimelineHeading icon={ <WorkIcon /> } title='Employment history' />
            <ResumeExperience exp={ data.experience } />
        </Timeline>
    )
}
