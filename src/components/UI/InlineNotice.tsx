import React from 'react';

interface InlineNoticeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const InlineNotice: React.FC<InlineNoticeProps> = ({ icon, children }) => {
  return (
    <aside className="inline-comment animate-fade-in my-5 py-4">
      <div className="d-flex align-items-start">
        {icon && <div className="inline-comment-icon me-3">{icon}</div>}
        <div className="inline-comment-content text-slate-dark">{children}</div>
      </div>
    </aside>
  );
};

export default InlineNotice;
