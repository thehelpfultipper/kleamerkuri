import React from 'react';

export default function DisableItem({ children, cs, isDisabled, onMouseEnter, onMouseLeave }) {
    return (
        <div
            className={`${cs} ${isDisabled ? 'disabled' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </div>
    )
}
