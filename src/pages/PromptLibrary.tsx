import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRIVACY_NOTE, PROMPT_CATEGORIES, PROMPTS, type Prompt } from '../content/prompts';
import { LINKS } from '../content/config';
import type { PhaseId, Role } from '../content/types';
import { useApp } from '../state/AppContext';
import { copyText } from '../lib/clipboard';
import { Icon } from '../components/Icon';
import { LinkList, PageHero, Section } from '../components/ui';

const PHASE_LABEL: Record<PhaseId, string> = { 'objective-setting': 'Objective Setting', 'mid-year': 'Mid-Year', 'year-end': 'Year-End' };
const ROLE_LABEL = { both: 'Employee · Manager', employee: 'Employee', manager: 'Manager' };

function PromptCard({ p, index, recommended, focus }: { p: Prompt; index: number; recommended: boolean; focus: boolean }) {
  const [open, setOpen] = useState(focus);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!focus) return;
    setOpen(true);
    window.setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  }, [focus]);
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const { announce } = useApp();
  const copy = async () => {
    const ok = await copyText(p.text);
    setCopied(ok ? 'ok' : 'fail');
    announce(ok ? `Prompt “${p.title}” copied to clipboard.` : 'Copy failed. Please select the prompt text and copy it manually.');
    if (ok) setOpen(true);
    window.setTimeout(() => setCopied('idle'), 2400);
  };
  return (
    <article ref={ref} className={`prompt-card anim-in ${open ? 'is-open' : ''} ${focus ? 'is-target' : ''}`} style={{ ['--d' as string]: `${index * 60}ms` }}>
      <div className="prompt-card__top">
        <span className="prompt-card__n">P{index + 1}</span>
        {recommended && <span className="tag tag--mint"><Icon name="sparkle" size={12} /> For your view</span>}
      </div>
      <h2 className="h4">{p.title}</h2>
      <p className="muted">{p.description}</p>
      <ul className="tag-row" aria-label="Tags">
        <li className="tag"><Icon name={p.role === 'manager' ? 'users' : 'user'} size={12} /> {ROLE_LABEL[p.role]}</li>
        <li className="tag">{PHASE_LABEL[p.phase]}</li>
        <li className="tag tag--outline">{p.category}</li>
      </ul>
      <button type="button" className="prompt-card__toggle" aria-expanded={open} aria-controls={`pt-${p.id}`} onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide prompt' : 'Show prompt'} <Icon name="chevron" size={16} className={`chev ${open ? 'is-open' : ''}`} />
      </button>
      <div className="prompt-card__text" id={`pt-${p.id}`} hidden={!open}>
        <p>{p.text}</p>
      </div>
      <div className="prompt-card__actions">
        <button type="button" className={`btn btn--sm ${copied === 'ok' ? 'btn--success' : 'btn--dark'}`} onClick={copy}>
          <Icon name={copied === 'ok' ? 'check' : 'copy'} size={16} />
          {copied === 'ok' ? 'Copied!' : copied === 'fail' ? 'Copy failed' : 'Copy Prompt'}
        </button>
        <span className="sr-only" aria-live="polite">{copied === 'ok' ? 'Copied' : ''}</span>
      </div>
      {copied === 'fail' && <p className="small error-text">Your browser blocked copying. Select the text above and copy it manually.</p>}
      <div className="prompt-card__related">
        <LinkList links={p.related} className="link-list--inline" />
      </div>
    </article>
  );
}

export function PromptLibrary() {
  const { role } = useApp();
  const [params, setParams] = useSearchParams();
  const phase = params.get('phase') ?? 'any';
  const roleF = params.get('role') ?? 'any';
  const category = params.get('category') ?? 'any';

  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (v === 'any') n.delete(k); else n.set(k, v);
    setParams(n, { replace: true });
  };

  const results = useMemo(
    () => PROMPTS.filter((p) =>
      (phase === 'any' || p.phase === phase) &&
      (roleF === 'any' || p.role === roleF || p.role === 'both') &&
      (category === 'any' || p.category === category)),
    [phase, roleF, category],
  );
  const isRecommended = (p: Prompt) => p.role === role || p.role === 'both';
  const filtersOn = phase !== 'any' || roleF !== 'any' || category !== 'any';

  return (
    <>
      <PageHero
        eyebrow="Module 03 · AI Prompt Library"
        title="Better conversations begin with better prompts."
        lead="Practical Microsoft Copilot prompts to help you prepare, reflect and communicate. Copy a prompt, then paste it into DOUGLAS’ approved Copilot environment."
      >
        <div className="privacy-banner" role="note">
          <Icon name="info" size={20} />
          <p><strong>{PRIVACY_NOTE}</strong> This site does not call any AI model itself.</p>
        </div>
      </PageHero>

      <Section className="prompts">
        <div className="filter-bar" role="group" aria-label="Filter prompts">
          <div className="filter-bar__group">
            <span className="filters__label" id="fl-role">Role</span>
            <div className="seg seg--sm" role="radiogroup" aria-labelledby="fl-role">
              {(['any', 'employee', 'manager'] as ('any' | Role)[]).map((r) => (
                <button key={r} type="button" role="radio" aria-checked={roleF === r} className={roleF === r ? 'is-active' : ''} onClick={() => set('role', r)}>
                  {r === 'any' ? 'All' : r === 'manager' ? 'Manager' : 'Employee'}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-bar__group">
            <span className="filters__label" id="fl-phase">Dialogue phase</span>
            <div className="seg seg--sm" role="radiogroup" aria-labelledby="fl-phase">
              {(['any', 'objective-setting', 'mid-year', 'year-end'] as const).map((p) => (
                <button key={p} type="button" role="radio" aria-checked={phase === p} className={phase === p ? 'is-active' : ''} onClick={() => set('phase', p)}>
                  {p === 'any' ? 'All' : PHASE_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-bar__group">
            <label className="filters__label" htmlFor="fl-cat">Category</label>
            <select id="fl-cat" value={category} onChange={(e) => set('category', e.target.value)}>
              <option value="any">All categories</option>
              {PROMPT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {filtersOn && <button type="button" className="btn btn--ghost btn--sm" onClick={() => setParams(new URLSearchParams(), { replace: true })}><Icon name="reset" size={16} /> Reset</button>}
        </div>

        <p className="kc__count" role="status" aria-live="polite">{results.length} of {PROMPTS.length} prompts</p>

        {results.length === 0 ? (
          <div className="empty">
            <span className="empty__icon"><Icon name="sparkle" size={28} /></span>
            <h2 className="h3">No prompt matches this combination</h2>
            <p className="muted">Try another phase or role — or reset the filters to see all six prompts.</p>
            <button type="button" className="btn btn--dark" onClick={() => setParams(new URLSearchParams(), { replace: true })}>Show all prompts</button>
          </div>
        ) : (
          <div className="prompt-grid" key={`${phase}${roleF}${category}`}>
            {results.map((p) => <PromptCard key={p.id} p={p} index={PROMPTS.indexOf(p)} recommended={isRecommended(p)} focus={params.get('prompt') === p.id} />)}
          </div>
        )}

        <div className="how" data-reveal>
          <p className="eyebrow">How to use</p>
          <ol className="how__steps">
            <li><span>1</span>Choose a prompt and click <strong>Copy Prompt</strong>.</li>
            <li><span>2</span>Open {LINKS.microsoftCopilot.url ? <a href={LINKS.microsoftCopilot.url} target="_blank" rel="noreferrer">Microsoft Copilot</a> : 'the DOUGLAS-approved Microsoft Copilot environment'} and paste it.</li>
            <li><span>3</span>Add fictional or general context only — never personal employee data.</li>
            <li><span>4</span>Use the result as inspiration; official actions happen in SAP SuccessFactors.</li>
          </ol>
        </div>
      </Section>
    </>
  );
}
