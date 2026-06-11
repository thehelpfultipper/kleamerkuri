import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SubmitIcon from '../icons/SubmitIcon';
import CloseIcon from '../icons/CloseIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChatbotIcon from '../icons/ChatbotIcon';
import { useChatbotContext } from '../contexts/ChatbotContext';
import { IEveAction } from '../helpers/interfaces';

interface EveChatProps {
  variant?: 'inline' | 'floating';
  onMinimize?: () => void;
  showClearOnClose?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('hidden') && !el.closest('[aria-hidden="true"]'),
  );

const trapFocus = (container: HTMLElement, event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const FloatingActionChips: React.FC<{ actions: IEveAction[] }> = ({ actions }) => (
  <ul className="eve-action-chips" aria-label="Suggested actions">
    {actions.map((action) => (
      <li key={`${action.type}-${action.url}`}>
        <a
          href={action.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${action.label} (opens in new tab)`}
          className={`eve-action-chip eve-action-chip--${action.type}`}>
          {action.label}
        </a>
      </li>
    ))}
  </ul>
);

const InlineActionLinks: React.FC<{ actions: IEveAction[] }> = ({ actions }) => (
  <ul className="eve-action-links" aria-label="Suggested actions">
    {actions.map((action) => (
      <li key={`${action.type}-${action.url}`}>
        <a
          href={action.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${action.label} (opens in new tab)`}
          className="eve-action-link">
          {action.label} →
        </a>
      </li>
    ))}
  </ul>
);

interface EveChatCoreProps {
  variant: 'inline' | 'floating';
  onMinimize?: () => void;
  showClearOnClose?: boolean;
}

const EveChatCore: React.FC<EveChatCoreProps> = ({
  variant,
  onMinimize,
  showClearOnClose = false,
}) => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isTyping,
    handleSubmit,
    clearSession,
  } = useChatbotContext();

  const [showConfirm, setShowConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const confirmDialogRef = useRef<HTMLDivElement>(null);
  const confirmCancelRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const clearChatBtnRef = useRef<HTMLButtonElement>(null);
  const hiddenContentRef = useRef<HTMLDivElement>(null);
  const isFloating = variant === 'floating';

  const isBusy = isLoading || isTyping;
  const chatTitleId = isFloating ? 'eve-floating-chat-title' : 'eve-inline-chat-title';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    const container = messagesScrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!isFloating) return;
    textareaRef.current?.focus();

    const inertTargets = [
      document.querySelector('main'),
      document.querySelector('header'),
      document.querySelector('footer'),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement);

    inertTargets.forEach((el) => el.setAttribute('inert', ''));

    return () => {
      inertTargets.forEach((el) => el.removeAttribute('inert'));
    };
  }, [isFloating]);

  useEffect(() => {
    const hiddenContent = hiddenContentRef.current;
    if (!hiddenContent) return;

    if (showConfirm) {
      hiddenContent.setAttribute('inert', '');
    } else {
      hiddenContent.removeAttribute('inert');
    }
  }, [showConfirm]);

  useEffect(() => {
    if (!showConfirm || isFloating) return;

    const aside = containerRef.current
      ?.closest('.eve-copilot-grid')
      ?.querySelector<HTMLElement>('.eve-sidebar');

    if (!aside) return;

    aside.setAttribute('inert', '');
    return () => aside.removeAttribute('inert');
  }, [showConfirm, isFloating]);

  useEffect(() => {
    if (!showConfirm) return;

    confirmCancelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowConfirm(false);
        if (isFloating) {
          closeBtnRef.current?.focus();
        } else {
          clearChatBtnRef.current?.focus();
        }
        return;
      }

      if (confirmDialogRef.current) {
        trapFocus(confirmDialogRef.current, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showConfirm, isFloating]);

  useEffect(() => {
    if (!isFloating || showConfirm) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onMinimize?.();
        return;
      }

      if (containerRef.current) {
        trapFocus(containerRef.current, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFloating, showConfirm, onMinimize]);

  const containerClass = isFloating
    ? 'chatbot-container animate-scale-up'
    : 'eve-transcript-panel';

  const handleConfirmClose = () => {
    clearSession();
    setShowConfirm(false);
    if (isFloating) {
      onMinimize?.();
    } else {
      clearChatBtnRef.current?.focus();
    }
  };

  const renderMessages = () =>
    messages.map((msg, index) =>
      msg.content ? (
        isFloating ? (
          <div
            key={`${msg.role}-${index}`}
            className={`chat-message ${msg.role === 'assistant' ? 'ai' : 'user'}-message animate-fade-in`}
            aria-label={msg.role === 'assistant' ? 'Eve' : 'You'}>
            <div className="message-bubble">
              {msg.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === 'assistant' && msg.actions && msg.actions.length > 0 && (
              <FloatingActionChips actions={msg.actions} />
            )}
          </div>
        ) : (
          <div
            key={`${msg.role}-${index}`}
            className={`eve-turn eve-turn--${msg.role === 'assistant' ? 'assistant' : 'user'} animate-fade-in`}>
            <p className="eve-turn-label font-monospace">
              {msg.role === 'assistant' ? 'Eve' : 'You'}
            </p>
            <div className="eve-turn-body">
              {msg.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === 'assistant' && msg.actions && msg.actions.length > 0 && (
              <InlineActionLinks actions={msg.actions} />
            )}
          </div>
        )
      ) : null,
    );

  const renderLoading = () =>
    isFloating ? (
      <div className="chat-message ai-message">
        <div
          className="message-bubble loading-indicator"
          role="status"
          aria-label="Eve is responding">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </div>
      </div>
    ) : (
      <div className="eve-turn eve-turn--assistant">
        <p className="eve-turn-label font-monospace">Eve</p>
        <p className="eve-turn-loading font-monospace" role="status" aria-label="Eve is responding">
          <span className="eve-loading-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          Thinking…
        </p>
      </div>
    );

  const chatUi = (
    <div
      ref={containerRef}
      id={isFloating ? 'eve-floating-chat' : undefined}
      className={containerClass}
      role={isFloating ? (showConfirm ? undefined : 'dialog') : 'region'}
      aria-modal={isFloating && !showConfirm ? true : undefined}
      aria-labelledby={isFloating && !showConfirm ? chatTitleId : undefined}
      aria-label={isFloating ? undefined : 'Eve portfolio copilot chat'}>
      {showConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-backdrop" aria-hidden="true" />
          <div
            ref={confirmDialogRef}
            className="exit-confirm-dialog animate-scale-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-confirm-title"
            aria-describedby="exit-confirm-desc">
            <h3 id="exit-confirm-title" className="fs-5 fw-bold text-slate-light mb-3">
              Clear chat?
            </h3>
            <p id="exit-confirm-desc" className="text-slate-dark mb-4">
              {isFloating
                ? 'Are you sure you want to close and clear the chat history?'
                : 'This will clear your conversation history with Eve.'}
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <button
                ref={confirmCancelRef}
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  if (isFloating) {
                    closeBtnRef.current?.focus();
                  } else {
                    clearChatBtnRef.current?.focus();
                  }
                }}
                className="btn btn-outline-secondary">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="btn btn-cta bg-orange-cta">
                Clear history
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={hiddenContentRef}
        className={isFloating ? 'chatbot-content' : 'eve-transcript-content'}
        aria-hidden={showConfirm || undefined}>
        {isFloating ? (
          <header className="chatbot-header">
            <h2
              id={chatTitleId}
              className="fs-6 fw-bold text-slate-light mb-0 d-flex align-items-center gap-2">
              <ChatbotIcon className="icon-125" aria-hidden="true" />
              Eve
            </h2>
            <div className="d-flex align-items-center gap-2">
              {onMinimize && (
                <button
                  type="button"
                  onClick={onMinimize}
                  className="chatbot-header-btn"
                  aria-label="Minimize chat">
                  <ChevronDownIcon className="icon-125" aria-hidden="true" />
                </button>
              )}
              {showClearOnClose && (
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="chatbot-header-btn"
                  aria-label="Close chat">
                  <CloseIcon className="icon-125" aria-hidden="true" />
                </button>
              )}
            </div>
          </header>
        ) : (
          <header className="eve-transcript-header">
            <span className="eve-transcript-header-label font-monospace">Conversation</span>
            <button
              ref={clearChatBtnRef}
              type="button"
              className="eve-clear-btn font-monospace"
              disabled={isBusy || messages.length === 0}
              onClick={() => setShowConfirm(true)}>
              Clear chat
            </button>
          </header>
        )}

        <div
          ref={messagesScrollRef}
          className={isFloating ? 'chatbot-body' : 'eve-transcript-body'}>
          <div
            className={isFloating ? 'chat-messages' : 'eve-transcript-messages'}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-busy={isBusy || undefined}
            aria-label="Chat messages">
            {renderMessages()}
            {(isLoading || isTyping) && renderLoading()}
          </div>
        </div>

        <footer className={isFloating ? 'chatbot-footer mt-0' : 'eve-transcript-footer'}>
          <form
            onSubmit={handleSubmit}
            className={isFloating ? 'chatbot-form' : 'eve-input-bar'}>
            <textarea
              id={isFloating ? 'chatbot-input' : 'eve-chat-input'}
              ref={textareaRef}
              rows={1}
              placeholder="Ask about projects, experience, or skills..."
              className={isFloating ? 'chatbot-input' : 'eve-input-bar__field'}
              aria-label="Chat input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isBusy}
            />
            <button
              type="submit"
              className={isFloating ? 'chatbot-send-btn' : 'eve-input-bar__send'}
              aria-label="Send message"
              disabled={isBusy || !input.trim()}>
              <SubmitIcon aria-hidden="true" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );

  if (isFloating && typeof document !== 'undefined') {
    return createPortal(chatUi, document.body);
  }

  return chatUi;
};

const EveChat: React.FC<EveChatProps> = ({ variant = 'inline', ...rest }) => (
  <EveChatCore variant={variant} {...rest} />
);

export default EveChat;
