import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { search, POPULAR_SEARCHES, type SearchEntry, type SearchGroup } from '../lib/searchIndex';
import { NUGGETS } from '../content/nuggets';
import { useEscape, useFocusTrap } from '../lib/hooks';
import { media } from '../lib/base';
import { Icon } from './Icon';
import { SmartLink } from './SmartLink';

/** Search field in the header — opens the search panel. */
export function SearchTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="search-trigger" onClick={onOpen} aria-haspopup="dialog">
      <Icon name="search" size={20} />
      <span>Search</span>
      <span className="sr-only">the #DOUGLASDialogue Hub</span>
    </button>
  );
}

const GROUP_ORDER: SearchGroup[] = ['Pages', 'FAQs & guides', 'Copilot prompts', 'Learning Nuggets', 'Competencies'];

function Highlight({ text, q }: { text: string; q: string }) {
  const word = q.trim().split(/\s+/)[0]?.toLowerCase();
  if (!word) return <>{text}</>;
  const i = text.toLowerCase().indexOf(word);
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + word.length)}</mark>{text.slice(i + word.length)}</>;
}

/** Side panel modelled on the DOUGLAS shop search: popular searches, recommendations, live results. */
export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useEscape(open, close);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    if (open) { setQ(''); setActive(0); }
  }, [open]);

  const results = useMemo(() => search(q), [q]);
  const grouped = useMemo(
    // Groups appear in order of their best-ranked hit, so the most relevant result is always on top.
    () => GROUP_ORDER.filter((g) => results.some((r) => r.group === g))
      .sort((a, b) => results.findIndex((r) => r.group === a) - results.findIndex((r) => r.group === b))
      .map((g) => ({ g, items: results.filter((r) => r.group === g) })),
    [results],
  );
  const flat = grouped.flatMap((x) => x.items);

  const go = (e: SearchEntry) => { onClose(); navigate(e.to); };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!flat.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % flat.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + flat.length) % flat.length); }
    if (e.key === 'Enter') { e.preventDefault(); go(flat[active]); }
  };

  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => {
    document.getElementById(`sr-${flat[active]?.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, flat]);

  if (!open) return null;
  let idx = -1;

  return (
    <div className="search-panel" role="presentation">
      <div className="search-panel__backdrop" onClick={close} />
      <div className="search-panel__sheet" role="dialog" aria-modal="true" aria-labelledby="search-title" ref={trapRef}>
        <header className="search-panel__head">
          <h2 id="search-title">Search</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close search"><Icon name="close" /></button>
        </header>

        <div className="search-panel__field">
          <Icon name="search" size={20} />
          <label htmlFor="hub-search" className="sr-only">Search the hub</label>
          <input
            id="hub-search"
            ref={inputRef}
            data-autofocus
            type="search"
            autoComplete="off"
            placeholder="Search topics, FAQs, prompts…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            role="combobox"
            aria-expanded={!!flat.length}
            aria-controls="search-results"
            aria-activedescendant={flat[active] ? `sr-${flat[active].id}` : undefined}
          />
          {q && <button type="button" className="icon-btn icon-btn--sm" aria-label="Clear search" onClick={() => { setQ(''); inputRef.current?.focus(); }}><Icon name="close" size={16} /></button>}
        </div>

        <div className="search-panel__body">
          {!q.trim() && (
            <>
              <section>
                <h3 className="search-panel__label">Popular searches</h3>
                <ul className="search-panel__popular">
                  {POPULAR_SEARCHES.map((p) => (
                    <li key={p}><button type="button" onClick={() => { setQ(p); inputRef.current?.focus(); }}>{p}</button></li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="search-panel__label">Our recommendations</h3>
                <ul className="search-panel__recs">
                  {NUGGETS.map((n) => (
                    <li key={n.id}>
                      <SmartLink to={`/learning-nuggets?nugget=${n.id}`} onClick={onClose} className="search-rec">
                        <img src={media(n.image)} alt="" />
                        <span className="search-rec__meta">Learning Nugget · {n.minutes} min</span>
                        <span className="search-rec__title">{n.title}</span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {q.trim() && (
            <div id="search-results" role="listbox" aria-label="Search results">
              <p className="search-panel__count" role="status" aria-live="polite">
                {flat.length ? `${flat.length} ${flat.length === 1 ? 'result' : 'results'} for “${q.trim()}”` : ''}
              </p>
              {!flat.length && (
                <div className="search-panel__empty">
                  <p><strong>No results for “{q.trim()}”.</strong></p>
                  <p className="muted">Try another keyword — for example “SMART”, “Mid-Year” or “SAP” — or ask the Dialogue Guide.</p>
                </div>
              )}
              {grouped.map(({ g, items }) => (
                <section key={g} className="search-panel__group">
                  <h3 className="search-panel__label">{g}</h3>
                  <ul>
                    {items.map((r) => {
                      idx += 1;
                      const i = idx;
                      return (
                        <li key={r.id}>
                          <SmartLink
                            id={`sr-${r.id}`}
                            role="option"
                            aria-selected={active === i}
                            to={r.to}
                            onClick={onClose}
                            onMouseEnter={() => setActive(i)}
                            className={`search-hit ${active === i ? 'is-active' : ''}`}
                          >
                            <span className="search-hit__title"><Highlight text={r.title} q={q} /></span>
                            <span className="search-hit__sum">{r.summary}</span>
                            <Icon name="arrow" size={16} className="search-hit__arrow" />
                          </SmartLink>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
        <p className="search-panel__foot">Searches only the content of this hub. Nothing you type is sent anywhere.</p>
      </div>
    </div>
  );
}
