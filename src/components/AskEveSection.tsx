import React, { useState, useEffect, useRef } from 'react';
import SectionHeading from './UI/SectionHeading';
import EveChat from './EveChat';
import { useChatbotContext } from '../contexts/ChatbotContext';
import { EVE_QUICK_PROMPTS, GAP_ANALYSIS_PREFIX } from '../helpers/eve-prompts';

const TECH_TAGS = ['pgvector', 'RAG', 'Function Calling', 'Gemini', 'Edge Functions'];

const CAPABILITIES = [
  'RAG over portfolio embeddings',
  'Gemini function calling for structured queries',
  'Demo links, write-ups, and next steps',
];

const AskEveSection: React.FC = () => {
  const chatbot = useChatbotContext();
  const { sendMessage, isLoading, isTyping } = chatbot;
  const isBusy = isLoading || isTyping;

  const [showGapInput, setShowGapInput] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const jdTextareaRef = useRef<HTMLTextAreaElement>(null);
  const gapPromptBtnRef = useRef<HTMLButtonElement>(null);

  const closeGapInput = () => {
    setShowGapInput(false);
    setJobDescription('');
    gapPromptBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!showGapInput) return;
    document.getElementById('eve-gap-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    jdTextareaRef.current?.focus();
  }, [showGapInput]);

  const handleQuickPrompt = async (promptId: string) => {
    const prompt = EVE_QUICK_PROMPTS.find((p) => p.id === promptId);
    if (!prompt) return;

    if (prompt.requiresJobDescription) {
      setShowGapInput(true);
      return;
    }

    if (prompt.query) {
      await sendMessage(prompt.query);
    }
  };

  const handleGapAnalysisSubmit = async () => {
    const jd = jobDescription.trim();
    if (!jd || isBusy) return;
    setShowGapInput(false);
    setJobDescription('');
    await sendMessage(`${GAP_ANALYSIS_PREFIX}\n\n${jd}`);
  };

  return (
    <section id="eve" className="section-block eve-section">
      <SectionHeading
        label="Portfolio Copilot"
        title="Ask Eve"
        description="Eve uses Retrieval-Augmented Generation (RAG) over Klea's portfolio embeddings and Gemini Function Calling to query structured professional data — then surfaces demo links, write-ups, and next steps as action items."
        align="center"
      />

      <div
        className="eve-tech-strip font-monospace mx-auto"
        aria-label="Eve technical stack">
        {TECH_TAGS.map((tag) => (
          <span key={tag} className="eve-tech-item">
            <span className="eve-tech-tag">{tag}</span>
          </span>
        ))}
      </div>

      <div className="max-w-wide mx-auto eve-prompts-bar">
        <div className="eve-prompts-header text-center">
          <p className="eve-prompts-label font-monospace mb-1">Starter questions</p>
          <p className="eve-prompts-hint mb-0">
            {showGapInput
              ? 'Paste a job description to see how Klea matches — strengths, gaps, and relevant projects.'
              : 'Click a prompt to ask Eve. Role fit opens a paste field first — or type your own in the conversation panel.'}
          </p>
        </div>

        <div className="eve-prompts-row" role="group" aria-label="Quick prompts">
          {EVE_QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.id}
              ref={prompt.requiresJobDescription ? gapPromptBtnRef : undefined}
              type="button"
              className="btn-ghost eve-prompt-btn"
              disabled={isBusy}
              aria-expanded={prompt.requiresJobDescription ? showGapInput : undefined}
              aria-controls={prompt.requiresJobDescription ? 'eve-gap-panel' : undefined}
              onClick={() => handleQuickPrompt(prompt.id)}>
              {prompt.label}
            </button>
          ))}
        </div>

        {showGapInput && (
          <div id="eve-gap-panel" className="eve-gap-input mt-3">
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
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={closeGapInput}>
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
        )}
      </div>

      <div className="max-w-wide mx-auto eve-copilot-panel">
        <div className="row g-0 eve-copilot-grid">
          <aside className="col-lg-4 eve-sidebar" aria-label="Eve copilot controls">
            <p className="eve-sidebar-label font-monospace mb-3">Eve · Portfolio Copilot</p>

            <ul className="eve-capabilities list-unstyled mb-3">
              {CAPABILITIES.map((item) => (
                <li key={item} className="eve-capability-item">
                  {item}
                </li>
              ))}
            </ul>

            <p className="eve-sidebar-hint mb-0">
              New here? Try a starter question above to see Eve in action.
            </p>

            <p className="eve-sidebar-disclaimer font-monospace mb-0">
              AI-powered portfolio copilot. Responses use RAG over Klea&apos;s data — verify
              critical details.
            </p>
          </aside>

          <div className="col-lg-8 eve-transcript-col">
            <EveChat variant="inline" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskEveSection;
