import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONTENT_TYPES, KNOWLEDGE, type ContentType, type KnowledgeItem } from '../content/knowledge';
import { isVisibleFor, type PhaseTag, type RoleTag } from '../content/types';
import { useApp } from '../state/AppContext';
import { Icon } from '../components/Icon';
import { Blocks } from '../components/Blocks';
import { Accordion, Drawer, LinkList, PageHero, Section, SupportContact } from '../components/ui';

const PHASE_LABEL: Record<PhaseTag, string> = { all: 'All phases', 'objective-setting': 'Objective Setting', 'mid-year': 'Mid-Year', 'year-end': 'Year-End' };
const ROLE_LABEL: Record<RoleTag, string> = { both: 'Everyone', employee: 'Employees', manager: 'Managers' };

function searchable(k: KnowledgeItem) {
  const body = (k.body ?? []).map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : '')).join(' ');
  return `${k.title} ${k.answer} ${body} ${k.type}`.toLowerCase();
}

function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase().trim());
  if (idx < 0) return text;
  const len = q.trim().length;
  return <>{text.slice(0, idx)}<mark>{text.slice(idx, idx + len)}</mark>{text.slice(idx + len)}</>;
}

export function KnowledgeCenter() {
  const { role } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const phase = (params.get('phase') as PhaseTag | null) ?? 'all';
  const type = (params.get('type') as ContentType | 'any' | null) ?? 'any';
  const itemParam = params.get('item');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [article, setArticle] = useState<KnowledgeItem | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'any' || value === 'all') next.delete(key); else next.set(key, value);
    next.delete('item');
    setParams(next, { replace: true });
  };

  // Deep links: ?item=<id> opens the FAQ or article.
  useEffect(() => {
    if (!itemParam) return;
    const k = KNOWLEDGE.find((x) => x.id === itemParam);
    if (!k || !isVisibleFor(k.role, role)) return;
    if (k.type === 'FAQ') {
      setOpenFaq(k.id);
      window.setTimeout(() => document.getElementById(`kc-${k.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    } else setArticle(k);
  }, [itemParam, role]);

  // Close an open article/FAQ if the view switches to a role that may not see it.
  useEffect(() => {
    if (article && !isVisibleFor(article.role, role)) setArticle(null);
  }, [role, article]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return KNOWLEDGE.filter((k) => {
      if (phase !== 'all' && k.phase !== phase && k.phase !== 'all') return false;
      if (!isVisibleFor(k.role, role)) return false;
      if (type !== 'any' && k.type !== type) return false;
      if (q && !q.split(/\s+/).every((w) => searchable(k).includes(w))) return false;
      return true;
    });
  }, [query, phase, role, type]);

  const faqs = results.filter((r) => r.type === 'FAQ');
  const articles = results.filter((r) => r.type !== 'FAQ');
  const activeFilters = (phase !== 'all' ? 1 : 0) + (type !== 'any' ? 1 : 0) + (query ? 1 : 0);
  const reset = () => { setQuery(''); setParams(new URLSearchParams(), { replace: true }); };

  return (
    <>
      <PageHero
        eyebrow="Module 02 · Knowledge Center"
        title="Knowledge, when you need it."
        lead="Find clear answers, practical guides and the right resources for every dialogue phase."
        image="img/office-glass.jpg"
        imageAlt="DOUGLAS colleagues working in a bright, glass-walled office"
      >
        <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); listRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>
          <label htmlFor="kc-search" className="sr-only">Search the Knowledge Center</label>
          <Icon name="search" size={20} />
          <input
            id="kc-search"
            type="search"
            placeholder="Search FAQs, guides and SAP help…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); const n = new URLSearchParams(params); if (e.target.value) n.set('q', e.target.value); else n.delete('q'); n.delete('item'); setParams(n, { replace: true }); }}
          />
          {query && <button type="button" className="icon-btn icon-btn--sm" aria-label="Clear search" onClick={() => { setQuery(''); setParam('q', null); }}><Icon name="close" size={16} /></button>}
        </form>
      </PageHero>

      <Section className="kc">
        <div className="kc__layout">
          <aside className="filters" aria-label="Filters">
            <div className="filters__group">
              <label htmlFor="f-phase" className="filters__label">Phase</label>
              <select id="f-phase" value={phase} onChange={(e) => setParam('phase', e.target.value)}>
                {(['all', 'objective-setting', 'mid-year', 'year-end'] as PhaseTag[]).map((p) => <option key={p} value={p}>{PHASE_LABEL[p]}</option>)}
              </select>
            </div>
            <fieldset className="filters__group">
              <legend className="filters__label">Content type</legend>
              <div className="chips">
                <button type="button" className={`chip ${type === 'any' ? 'is-active' : ''}`} aria-pressed={type === 'any'} onClick={() => setParam('type', null)}>All</button>
                {CONTENT_TYPES.map((t) => (
                  <button key={t} type="button" className={`chip ${type === t ? 'is-active' : ''}`} aria-pressed={type === t} onClick={() => setParam('type', t)}>{t}</button>
                ))}
              </div>
            </fieldset>
            {activeFilters > 0 && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={reset}><Icon name="reset" size={16} /> Reset filters</button>
            )}
          </aside>

          <div className="kc__results" ref={listRef}>
            <p className="kc__count" role="status" aria-live="polite">
              {results.length} {results.length === 1 ? 'result' : 'results'}{query && <> for “{query}”</>}
            </p>

            {results.length === 0 && (
              <div className="empty">
                <span className="empty__icon"><Icon name="search" size={28} /></span>
                <h2 className="h3">No matching guidance yet</h2>
                <p className="muted">Try a different word, or reset the filters. For questions not covered here, ask the Dialogue Guide or contact your local HR team.</p>
                <button type="button" className="btn btn--dark" onClick={reset}>Reset search & filters</button>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="kc__block">
                <h2 className="h3 kc__h">Frequently asked questions</h2>
                <div className="acc-group">
                  {faqs.map((k) => (
                    <Accordion
                      key={k.id}
                      id={`kc-${k.id}`}
                      title={highlight(k.title, query)}
                      meta={<><span className="tag">{PHASE_LABEL[k.phase]}</span>{k.role !== 'both' && <span className="tag tag--dark">{ROLE_LABEL[k.role]}</span>}</>}
                      open={openFaq === k.id}
                      onToggle={(o) => setOpenFaq(o ? k.id : null)}
                    >
                      <p>{highlight(k.answer, query)}</p>
                      {k.body && <Blocks blocks={k.body} />}
                      <div className="kc__related">
                        <span className="eyebrow">Related</span>
                        <LinkList links={k.related} className="link-list--inline" />
                      </div>
                      {k.source && <p className="fine-print">Source: {k.source}</p>}
                    </Accordion>
                  ))}
                </div>
              </div>
            )}

            {articles.length > 0 && (
              <div className="kc__block">
                <h2 className="h3 kc__h">Guides, checklists & SAP help</h2>
                <div className="article-grid">
                  {articles.map((k) => (
                    <button key={k.id} type="button" className="article-card" onClick={() => setArticle(k)}>
                      <span className="tag tag--mint">{k.type}</span>
                      <strong>{highlight(k.title, query)}</strong>
                      <span className="muted">{k.answer}</span>
                      <span className="article-card__meta">{PHASE_LABEL[k.phase]} · {ROLE_LABEL[k.role]}</span>
                      <span className="text-link">Read <Icon name="arrow" size={16} className="arrow-move" /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="support-foot"><SupportContact /></div>
          </div>
        </div>
      </Section>

      <Drawer open={!!article} onClose={() => { setArticle(null); if (itemParam) setParam('item', null); }} label={article?.title ?? 'Article'} wide>
        {article && (
          <article className="article">
            <button type="button" className="text-link back-link" onClick={() => { setArticle(null); if (itemParam) setParam('item', null); }}>
              <Icon name="arrow-left" size={16} /> Back to Knowledge Center
            </button>
            <p className="eyebrow">{article.type} · {PHASE_LABEL[article.phase]} · {ROLE_LABEL[article.role]}</p>
            <h2 className="h2">{article.title}</h2>
            <p className="lead-sm">{article.answer}</p>
            {article.body && <Blocks blocks={article.body} />}
            <h3 className="h5">Related</h3>
            <div onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setArticle(null); }}><LinkList links={article.related} /></div>
            {article.source && <p className="fine-print">Source reference: {article.source}</p>}
          </article>
        )}
      </Drawer>
    </>
  );
}
