import React, { useState, useEffect, useMemo, useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SectionHeading from './UI/SectionHeading';
import { useChatbotContext } from '../contexts/ChatbotContext';
import { EVE_QUICK_PROMPTS, GAP_ANALYSIS_PREFIX, IEveQuickPrompt } from '../helpers/eve-prompts';
import {
  IEveProjectMatch,
  IEveWorkItem,
  PATH_HINTS,
  findPromptId,
  getExchanges,
  getTopicLabel,
  presentWork,
} from '../helpers/eve-discovery';
import { IEveAction } from '../helpers/interfaces';

const TECH_TAGS = ['pgvector', 'RAG', 'Function Calling', 'Gemini', 'Edge Functions'];

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

const getPrimaryAction = (actions: IEveAction[]) =>
  actions.find((action) => action.type === 'demo') ??
  actions.find((action) => action.type === 'blog') ??
  actions[0];

const scrollAnswerIntoView = (target: HTMLElement | null) => {
  if (!target) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
};

const AskEveSection: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    isTyping,
    clearSession,
  } = useChatbotContext();
  const hasUserQuery = messages.some((msg) => msg.role === 'user');
  const isBusy = isLoading || (isTyping && hasUserQuery);

  const data = useStaticQuery(graphql`
    query EveDiscoveryProjects {
      allProjectsJson(sort: { meta: { date: DESC } }) {
        nodes {
          title
          impact
          image
          description
          meta {
            category
            date(formatString: "YYYY")
            stack
          }
          links {
            blog
            demo
          }
        }
      }
    }
  `);

  const projects: IEveProjectMatch[] = useMemo(
    () => data?.allProjectsJson?.nodes ?? [],
    [data?.allProjectsJson?.nodes],
  );

  const [showGapInput, setShowGapInput] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [viewedIndex, setViewedIndex] = useState(-1);

  const jdTextareaRef = useRef<HTMLTextAreaElement>(null);
  const gapPromptBtnRef = useRef<HTMLButtonElement>(null);
  const askInputRef = useRef<HTMLTextAreaElement>(null);
  const answerHeadingRef = useRef<HTMLHeadingElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const confirmDialogRef = useRef<HTMLDivElement>(null);
  const confirmCancelRef = useRef<HTMLButtonElement>(null);
  const startOverBtnRef = useRef<HTMLButtonElement>(null);
  const hiddenContentRef = useRef<HTMLDivElement>(null);
  const previousExchangeCount = useRef(0);

  const exchanges = useMemo(() => getExchanges(messages), [messages]);
  const isAnswerState = exchanges.length > 0;
  const activeIndex = viewedIndex >= 0 && viewedIndex < exchanges.length ? viewedIndex : exchanges.length - 1;
  const activeExchange = isAnswerState ? exchanges[activeIndex] : null;
  const activeTopic = activeExchange ? getTopicLabel(activeExchange.question) : '';
  const activePromptId = activeExchange ? findPromptId(activeExchange.question) : null;
  const presentedWork = useMemo(
    () =>
      activeExchange
        ? presentWork(activeExchange.answer, activeExchange.actions, projects)
        : { projects: [], links: [] },
    [activeExchange, projects],
  );
  const submitTypedQuestion = async () => {
    const text = input.trim();
    if (!text || isBusy) return;
    setInput('');
    setViewedIndex(exchanges.length);
    await sendMessage(text);
  };

  const closeGapInput = () => {
    setShowGapInput(false);
    setJobDescription('');
    gapPromptBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!showGapInput) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('eve-gap-panel')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
    });
    jdTextareaRef.current?.focus();
  }, [showGapInput]);

  useEffect(() => {
    if (askInputRef.current) {
      askInputRef.current.style.height = 'auto';
      askInputRef.current.style.height = `${askInputRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (exchanges.length > previousExchangeCount.current) {
      setViewedIndex(exchanges.length - 1);
      const isFirstExchange = previousExchangeCount.current === 0;
      window.requestAnimationFrame(() => {
        const target = answerHeadingRef.current ?? responseRef.current;
        scrollAnswerIntoView(target);
        if (isFirstExchange) {
          answerHeadingRef.current?.focus();
        }
      });
    } else if (exchanges.length === 0) {
      setViewedIndex(-1);
    }
    previousExchangeCount.current = exchanges.length;
  }, [exchanges.length]);

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
    if (!showConfirm) return;

    confirmCancelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowConfirm(false);
        startOverBtnRef.current?.focus();
        return;
      }

      if (confirmDialogRef.current) {
        trapFocus(confirmDialogRef.current, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showConfirm]);

  const handleQuickPrompt = async (prompt: IEveQuickPrompt) => {
    if (prompt.requiresJobDescription) {
      setShowGapInput(true);
      return;
    }

    if (prompt.query) {
      setShowGapInput(false);
      setViewedIndex(exchanges.length);
      await sendMessage(prompt.query);
    }
  };

  const handleGapAnalysisSubmit = async () => {
    const jd = jobDescription.trim();
    if (!jd || isBusy) return;
    setShowGapInput(false);
    setJobDescription('');
    setViewedIndex(exchanges.length);
    await sendMessage(`${GAP_ANALYSIS_PREFIX}\n\n${jd}`);
  };

  const handleAskKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitTypedQuestion();
    }
  };

  const handleAskSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void submitTypedQuestion();
  };

  const handleStartOver = () => {
    clearSession();
    setShowConfirm(false);
    setShowGapInput(false);
    setJobDescription('');
    setViewedIndex(-1);
    window.requestAnimationFrame(() => askInputRef.current?.focus());
  };

  const renderAskForm = () => (
    <form className={`eve-ask${isAnswerState ? ' eve-ask--followup' : ''}`} onSubmit={handleAskSubmit}>
      {isAnswerState ? (
        <div className="eve-ask-glass" aria-hidden="true">
          <span className="eve-ask-glass__blur eve-ask-glass__blur--1" />
          <span className="eve-ask-glass__blur eve-ask-glass__blur--2" />
          <span className="eve-ask-glass__blur eve-ask-glass__blur--3" />
          <span className="eve-ask-glass__blur eve-ask-glass__blur--4" />
          <span className="eve-ask-glass__wash" />
        </div>
      ) : null}
      <label htmlFor="eve-ask-input" className="eve-ask-label">
        {isAnswerState ? 'Ask another question' : 'What do you want to know about Klea?'}
      </label>
      <div className="eve-ask-row">
        <textarea
          id="eve-ask-input"
          ref={askInputRef}
          rows={1}
          className="eve-ask-field"
          placeholder="A role, a project, a stack — or anything in between"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAskKeyDown}
          disabled={isBusy}
        />
        <button type="submit" className="eve-ask-submit" disabled={isBusy || !input.trim()}>
          Ask
        </button>
      </div>
    </form>
  );

  const renderGapPanel = () =>
    showGapInput ? (
      <div id="eve-gap-panel" className="eve-gap-input">
        <label htmlFor="eve-jd-input" className="eve-gap-input-label">
          Paste a job description
        </label>
        <textarea
          id="eve-jd-input"
          ref={jdTextareaRef}
          className="eve-gap-textarea"
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              closeGapInput();
            }
          }}
          placeholder="Paste the full job description here..."
          disabled={isBusy}
        />
        <div className="eve-gap-actions">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={closeGapInput}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-sm btn-cta"
            disabled={!jobDescription.trim() || isBusy}
            onClick={handleGapAnalysisSubmit}>
            Check fit
          </button>
        </div>
      </div>
    ) : null;

  const renderWorkItem = (item: IEveWorkItem, index: number) => {
    const meta = [item.date, item.category].filter(Boolean).join(' · ');
    const primary = getPrimaryAction(item.actions);

    return (
      <li
        key={item.key}
        className="eve-work-item"
        style={{ '--eve-work-delay': `${index * 60}ms` } as React.CSSProperties}>
        <div className="eve-work-copy">
          {meta && <p className="eve-work-meta font-monospace">{meta}</p>}
          <h5 className="eve-work-title">
            {primary ? (
              <a
                href={primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="eve-work-title-link"
                aria-label={`${item.title} (opens in new tab)`}>
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h5>
          {item.impact && <p className="eve-work-impact">{item.impact}</p>}
        </div>
        <ul className="eve-work-actions">
          {item.actions.map((action) => (
            <li key={`${action.type}-${action.url}`}>
              <a
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="eve-work-link"
                aria-label={`${action.label} (opens in new tab)`}>
                {action.label}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  const renderPathButton = (prompt: IEveQuickPrompt, options?: { selected?: boolean }) => {
    const hint = PATH_HINTS[prompt.id];
    const isRoleFit = Boolean(prompt.requiresJobDescription);

    return (
      <li key={prompt.id} className="eve-path-item">
        <button
          ref={isRoleFit ? gapPromptBtnRef : undefined}
          type="button"
          className={`eve-path-btn${options?.selected ? ' is-current' : ''}`}
          disabled={isBusy}
          aria-current={options?.selected ? 'true' : undefined}
          aria-expanded={isRoleFit ? showGapInput : undefined}
          aria-controls={isRoleFit ? 'eve-gap-panel' : undefined}
          aria-label={hint ? `${prompt.label}. ${hint}` : prompt.label}
          onClick={() => handleQuickPrompt(prompt)}>
          <span className="eve-path-label">{prompt.label}</span>
          {hint && <span className="eve-path-hint">{hint}</span>}
        </button>
      </li>
    );
  };

  return (
    <section
      id="eve"
      className={`section-block eve-section${isAnswerState ? ' eve-section--answer' : ' eve-section--discover'}`}>
      <div ref={hiddenContentRef}>
        <SectionHeading
          label="Portfolio Copilot"
          title="Ask Eve"
          description="Ask one thing. Eve opens the matching work from this portfolio."
          align="start"
        />

        {!isAnswerState && renderAskForm()}

        {isAnswerState && activeExchange ? (
          <div ref={responseRef} className="eve-response" aria-busy={isBusy || undefined}>
            {exchanges.length > 1 && (
              <nav className="eve-trail" aria-label="Questions already asked">
                <ol className="eve-trail-list">
                  {exchanges.map((exchange, index) => {
                    const label = getTopicLabel(exchange.question);
                    const isCurrent = index === activeIndex;
                    return (
                      <li key={`${exchange.question}-${index}`}>
                        {isCurrent ? (
                          <span className="eve-trail-current" aria-current="true">
                            {label}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="eve-trail-btn"
                            onClick={() => setViewedIndex(index)}>
                            {label}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            <header className="eve-response-header">
              <div>
                <p className="eve-kicker font-monospace mb-0">Opened for</p>
                <h3 ref={answerHeadingRef} tabIndex={-1} className="eve-response-title" id="eve-answer-title">
                  {activeTopic}
                </h3>
              </div>
              <button
                ref={startOverBtnRef}
                type="button"
                className="eve-start-over font-monospace"
                disabled={isBusy}
                onClick={() => setShowConfirm(true)}>
                Start over
              </button>
            </header>

            <div className="eve-answer" aria-labelledby="eve-answer-title">
              <p className="eve-kicker font-monospace mb-3">Eve&apos;s note</p>
              {activeExchange.answer ? (
                <div className={`eve-answer-body${isBusy ? ' is-streaming' : ''}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeExchange.answer}</ReactMarkdown>
                </div>
              ) : (
                <p className="eve-answer-status font-monospace" role="status">
                  {presentedWork.projects.length > 0 || presentedWork.links.length > 0
                    ? 'Writing a note…'
                    : 'Looking through the portfolio…'}
                </p>
              )}
            </div>

            {renderAskForm()}

            {(presentedWork.projects.length > 0 || presentedWork.links.length > 0) && (
              <section className="eve-work" aria-labelledby="eve-work-heading">
                <h4 id="eve-work-heading" className="eve-kicker font-monospace">
                  {presentedWork.projects.length > 0 ? 'Related work' : 'Links'}
                </h4>
                {presentedWork.projects.length > 0 && (
                  <ul className="eve-work-list">
                    {presentedWork.projects.map((item, index) => renderWorkItem(item, index))}
                  </ul>
                )}
                {presentedWork.links.length > 0 && (
                  <ul className="eve-action-links" aria-label="More links">
                    {presentedWork.links.map((action) => (
                      <li key={`${action.type}-${action.url}`}>
                        <a
                          href={action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="eve-work-link"
                          aria-label={`${action.label} (opens in new tab)`}>
                          {action.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        ) : null}

        <nav
          className={`eve-paths${isAnswerState ? ' eve-paths--compact' : ''}`}
          aria-label="Explore Klea's work">
          <p className="eve-kicker font-monospace mb-0">
            {isAnswerState ? 'Other directions' : 'Choose a direction'}
          </p>
          <ol className="eve-path-list">
            {EVE_QUICK_PROMPTS.map((prompt) =>
              renderPathButton(prompt, { selected: prompt.id === activePromptId }),
            )}
          </ol>
          {renderGapPanel()}
        </nav>

        <p className="eve-footnote font-monospace mb-0">
          <span className="visually-hidden">Built with </span>
          {TECH_TAGS.map((tag, index) => (
            <React.Fragment key={tag}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              <span>{tag}</span>
            </React.Fragment>
          ))}
          <span className="eve-footnote-note">
            {' '}
            Responses use Klea&apos;s portfolio data — verify critical details.
          </span>
        </p>
      </div>

      {showConfirm && (
        <div className="eve-confirm-overlay">
          <div className="eve-confirm-backdrop" aria-hidden="true" />
          <div
            ref={confirmDialogRef}
            className="eve-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eve-confirm-title"
            aria-describedby="eve-confirm-desc">
            <h3 id="eve-confirm-title" className="fs-5 fw-bold text-slate-light mb-3">
              Start over?
            </h3>
            <p id="eve-confirm-desc" className="text-slate-dark mb-4">
              This will clear your questions and return Eve to the starting view.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <button
                ref={confirmCancelRef}
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowConfirm(false);
                  startOverBtnRef.current?.focus();
                }}>
                Cancel
              </button>
              <button type="button" className="btn btn-cta bg-orange-cta" onClick={handleStartOver}>
                Clear questions
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AskEveSection;
