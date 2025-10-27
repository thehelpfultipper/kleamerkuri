import React from 'react';

const ChatbotLoader: React.FC = () => {
  return (
    <div
      className="chatbot-indicator"
      aria-label="Loading chatbot">
      <div
        className="spinner-border"
        role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
export default ChatbotLoader;
