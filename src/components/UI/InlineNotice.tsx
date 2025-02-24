import React from 'react';

import '../../styles/notice.scss';

interface InlineNoticeProps {
  children: React.ReactNode;
  icon?: string;
  type?: string;
}

export default function InlineNotice({ children, icon, type }: InlineNoticeProps) {
  let classType = '';
  switch (type) {
    case 'note':
      classType = 'note';
      break;
    case 'message':
      classType = 'message';
      break;
    case 'highlight':
      classType = 'highlight';
      break;
    default:
      classType = '';
  }
  return (
    <p className={`notice inline ${classType}`}>
      {icon && <span>{icon}</span>}
      {children}
    </p>
  );
}
