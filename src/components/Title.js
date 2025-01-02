import React from 'react';
import PropTypes from 'prop-types';

// import * as s from '../styles/Title.module.css';
import '../styles/title.scss';

export default function Title({ children, size = 'sm', cs }) {

    return (
       <div className={ `titleContainer${cs ? ` ${cs}` : ''}` }>
        <div className={ `content ${size}` }>
            { children }
        </div>
    </div>
    )
}

Title.propTypes = {
    size: PropTypes.oneOf(['sm', 'lg'])
}