import React from 'react';
import { IMouseEvents } from '../../helpers/interfaces';

// Define the props interface
interface DisableItemProps {
  children: React.ReactNode;
  cs?: string;
  isDisabled?: boolean;
  onMouseEnter?: IMouseEvents;
  onMouseLeave?: IMouseEvents;
}

export default function DisableItem({
  children,
  cs,
  isDisabled,
  onMouseEnter,
  onMouseLeave,
}: DisableItemProps) {
  return (
    <div
      className={`${cs} ${isDisabled ? 'disabled' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
}
