import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ASSISTANT_COPY, QUICK_ACTIONS } from '../content/assistant';
import type { LinkRef } from '../content/types';
import { answer } from '../lib/assistantEngine';
import { useApp } from '../state/AppContext';
import { useEscape } from '../lib/hooks';
import { t } from '../content/i18n';
import { Icon } from './Icon';
import { SmartLink } from './SmartLink';

interface Msg { id: number; from: 'guide' | 'user'; text: string; links?: LinkRef[] }

/**
 * Floating, guided demo assistant. Rule-based and fully local:
 * no input is transmitted, stored or sent to any AI model.
 */
export function DialogueAssistant() {
  const { assistantOpen: open, setAssistantOpen, role } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: 'guide', text: ASSISTANT_COPY.welcome }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const idRef = useRef(1);
  const close = useCallback(() => setAssistantOpen(false), [setAssistantOpen]);
  useEscape(open, close);
  const wasOpen = useRef(false);
  useEffect(() => {
    // Non-modal panel: move focus in on open, return it to the launcher on close.
    if (open) window.setTimeout(() => document.getElementById('assistant-input')?.focus(), 60);
    else if (wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) { setError('Please type a question or choose a suggestion.'); return; }
    setError('');
    setMsgs((m) => [...m, { id: idRef.current++, from: 'user', text: q }]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      const r = answer(q, role);
      setMsgs((m) => [...m, { id: idRef.current++, from: 'guide', text: r.text, links: r.links }]);
      setTyping(false);
    }, 650);
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); ask(input); };
  const showQuick = msgs.length <= 1;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`assistant-launcher ${open ? 'is-hidden' : ''}`}
        onClick={() => setAssistantOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open Dialogue Guide assistant"
      >
        <span className="assistant-launcher__icon"><Icon name="sparkle" size={20} /></span>
        <span className="assistant-launcher__text">Dialogue Guide</span>
      </button>

      <div className={`assistant ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        {open && (
          <div className="assistant__panel" role="dialog" aria-modal="false" aria-labelledby="assistant-title">
            <header className="assistant__head">
              <span className="assistant__avatar" aria-hidden="true"><Icon name="sparkle" size={18} /></span>
              <div>
                <h2 id="assistant-title">{t('assistant.name')}</h2>
                <p>{t('assistant.sub')}</p>
              </div>
              <button type="button" className="icon-btn" onClick={close} aria-label="Minimise Dialogue Guide">
                <Icon name="minus" />
              </button>
            </header>

            <div className="assistant__log" ref={logRef} role="log" aria-live="polite" aria-label="Conversation">
              {msgs.map((m) => (
                <div key={m.id} className={`bubble bubble--${m.from}`}>
                  <p>{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <ul className="bubble__links">
                      {m.links.map((l) => (
                        <li key={l.label}>
                          <SmartLink to={l.to} onClick={() => { if (window.innerWidth < 720) close(); }}>
                            {l.label} <Icon name="arrow" size={14} />
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {typing && (
                <div className="bubble bubble--guide bubble--typing" aria-label="Dialogue Guide is typing">
                  <span /><span /><span />
                </div>
              )}
              {showQuick && (
                <div className="quick">
                  <p className="eyebrow">Suggestions</p>
                  <ul>
                    {QUICK_ACTIONS.map((q) => (
                      <li key={q}><button type="button" className="chip" onClick={() => ask(q)}>{q}</button></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <form className="assistant__form" onSubmit={onSubmit}>
              <label htmlFor="assistant-input" className="sr-only">Ask the Dialogue Guide</label>
              <input
                id="assistant-input"
                data-autofocus
                value={input}
                onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
                placeholder="Ask about objectives, phases, SAP…"
                autoComplete="off"
                maxLength={300}
                aria-invalid={!!error}
                aria-describedby="assistant-hint"
              />
              <button type="submit" className="assistant__send" aria-label="Send">
                <Icon name="send" size={18} />
              </button>
            </form>
            <p id="assistant-hint" className={`assistant__hint ${error ? 'is-error' : ''}`}>
              {error || `${ASSISTANT_COPY.disclosure} ${ASSISTANT_COPY.privacy}`}
            </p>
            {!showQuick && (
              <button type="button" className="assistant__more" onClick={() => setMsgs([{ id: idRef.current++, from: 'guide', text: ASSISTANT_COPY.welcome }])}>
                <Icon name="reset" size={14} /> Start over
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
