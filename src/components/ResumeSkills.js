import React, {useState} from 'react';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import * as s from '../styles/Resume.module.css';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={ 0 } square { ...props } />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={ <PlayArrowIcon sx={ { fontSize: '0.9rem' } } /> }
        { ...props }
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        marginBottom: 0,
        marginTop: 0,
    }
}));

export default function ResumeSkills({sk}) {
    const [isClicked, setIsClicked] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const accordionClickHandler = (idx) => {
         setActiveItem(idx);
         setIsClicked(!isClicked);
    }

    return (
        sk.map((skill, i) => {
            return (
                <TimelineItem key={ i } className={ `${s.skillsTimelineItem} ${i+1===sk.length && s.mb20}`}>
                    <TimelineSeparator>
                        <TimelineDot 
                            data-id={ `panel${i + 1}-header` }
                            variant={ (activeItem === i) && isClicked ? 'outlined' : 'filled'}
                        />
                        {i+1!==sk.length && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{py: 0}}>
                        <Accordion onClick={ () => accordionClickHandler(i) }>
                            <AccordionSummary
                                expandIcon={ <PlayArrowIcon className={s.expandIcon} /> }
                                aria-controls={`panel${i+1}-content`}
                                id={ `panel${i + 1}-header` }
                            >
                                <h4 className={s.nullMargin}>{ skill.category }</h4>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <ul>
                                        { skill.items.map((item, j) => {
                                            return (
                                                <li key={ j }>{ item }</li>
                                            )
                                        }) }
                                    </ul>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </TimelineContent>
                </TimelineItem>
            )
        })
    )
}
