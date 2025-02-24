import React from 'react';
import PropTypes from 'prop-types';

import '../styles/title.scss';

interface ITitleProps {
  children: React.ReactElement;
  size?: string;
  cs?: string;
}

export default function Title({ children, size = 'sm', cs }: ITitleProps) {
  return (
    <div className={`titleContainer${cs ? ` ${cs}` : ''}`}>
      <div className={`content ${size}`}>{children}</div>
    </div>
  );
}

Title.propTypes = {
  size: PropTypes.oneOf(['sm', 'lg']),
};
