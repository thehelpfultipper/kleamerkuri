import React from 'react';
import parse from 'html-react-parser';
import Title from './Title';

export default function About({about}) {
    return (
        <section id='about'>
            <Title>
                <h2>Hi, I'm Klea 👋</h2>
            </Title>
            {
                about ? 
                    about.map((item, index) => {
                    return <p key={index+1}>{parse(item)}</p>
                }) : <p>It seems I'll remain a secret 👀</p>
            }
        </section>
    )
}