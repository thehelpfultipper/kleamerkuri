import React, { useState, useRef } from 'react';
import ChatbotIcon from '../icons/ChatbotIcon';
import EveChat from './EveChat';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="chatbot-indicator animate-scale-up"
        hidden={isOpen}
        aria-label="Open Eve AI assistant"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'eve-floating-chat' : undefined}>
        <ChatbotIcon className="icon-200" aria-hidden="true" />
        <span className="chatbot-indicator-label font-monospace">Eve</span>
      </button>

      {isOpen && (
        <EveChat
          variant="floating"
          onMinimize={handleClose}
          showClearOnClose
        />
      )}
    </>
  );
};

export default Chatbot;
