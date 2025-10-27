import React, { useState, useEffect, useRef } from 'react';
import ChatbotIcon from '../icons/ChatbotIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import CloseIcon from '../icons/CloseIcon';
import SubmitIcon from '../icons/SubmitIcon';
import useChatbot from '../hooks/use-chatbot';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    messages,
    input,
    setInput,
    isLoading,
    isTyping,
    handleSubmit,
    messagesEndRef,
    clearSession,
  } = useChatbot();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleMinimize = () => setIsOpen(false);
  const handleCloseClick = () => setShowConfirm(true);
  const handleCancelClose = () => setShowConfirm(false);
  const handleConfirmClose = () => {
    clearSession();
    setIsOpen(false);
    setShowConfirm(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="chatbot-indicator animate-scale-up"
        aria-label="Open AI chat">
        <ChatbotIcon className="icon-200" />
      </button>
    );
  }

  return (
    <div
      className="chatbot-container animate-scale-up"
      role="dialog"
      aria-labelledby="chatbot-title">
      {showConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-dialog animate-scale-up">
            <h3 className="fs-5 fw-bold text-slate-light mb-3">Clear Chat?</h3>
            <p className="text-slate-dark mb-4">
              Are you sure you want to close and clear the chat history?
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <button
                onClick={handleCancelClose}
                className="btn btn-outline-secondary">
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="btn btn-cta bg-orange-cta">
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="chatbot-header">
        <h2
          id="chatbot-title"
          className="fs-6 fw-bold text-slate-light mb-0">
          AI Assistant
        </h2>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleMinimize}
            className="chatbot-header-btn"
            aria-label="Minimize chat">
            <ChevronDownIcon className="icon-125" />
          </button>
          <button
            onClick={handleCloseClick}
            className="chatbot-header-btn"
            aria-label="Close chat">
            <CloseIcon className="icon-125" />
          </button>
        </div>
      </header>

      <div className="chatbot-body">
        <p className="chatbot-disclaimer">
          This is an AI-powered assistant. Responses may be experimental.
        </p>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`chat-message ${msg.role === 'assistant' ? 'ai' : 'user'}-message animate-fade-in`}>
              <div className="message-bubble">{msg.content || <>&nbsp;</>}</div>
            </div>
          ))}
          {(isLoading || isTyping) && (
            <div className="chat-message ai-message">
              <div className="message-bubble loading-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="chatbot-footer">
        <form
          onSubmit={handleSubmit}
          className="chatbot-form">
          <textarea
            id="chatbot-input"
            ref={textareaRef}
            rows={1}
            placeholder="Ask a question..."
            className="chatbot-input"
            aria-label="Chat input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isTyping}></textarea>
          <button
            type="submit"
            className="chatbot-send-btn"
            aria-label="Send message"
            disabled={isLoading || isTyping || !input.trim()}>
            <SubmitIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chatbot;
