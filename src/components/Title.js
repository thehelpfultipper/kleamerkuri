import React from 'react';
import PropTypes from 'prop-types';

import * as s from '../styles/Title.module.css';

export default function Title({ children, size, cs }) {
    return (
        <div className={ `${s.titleContainer}${cs ? ` ${cs}` : ''}` }>
            <div className={ `${s.content} ${s[size]}` }>
                { children }
            </div>
        </div>
    )
}

Title.propTypes = {
    size: PropTypes.oneOf(['sm', 'lg'])
}

Title.defaultProps = {
    size: 'sm'
}
