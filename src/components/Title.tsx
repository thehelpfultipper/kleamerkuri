import React from 'react';

interface ITitleProps {
  children: React.ReactElement;
  size?: 'sm' | 'lg';
  cs?: string;
}

export default function Title({ children, size, cs }: ITitleProps) {
  return (
    <div className={`titleContainer${cs ? ` ${cs}` : ''}`}>
      <div className={`content ${size}`}>{children}</div>
    </div>
  );
}
