/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import parse from 'html-react-parser';
import Title from './Title';

export default function About({ about }: { about: string[] }) {
  return (
    <section id="about">
      <Title>
        <h2>Hi, I'm Klea 👋</h2>
      </Title>
      {about ? (
        about.map((item, index) => <p key={index + 1}>{parse(item)}</p>)
      ) : (
        <p>It seems I'll remain a secret 👀</p>
      )}
    </section>
  );
}
