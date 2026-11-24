import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COMPETENCIES, COMPETENCY_GROUPS, RATING, type Competency } from '../content/competencies';
import { useApp } from '../state/AppContext';
import { media } from '../lib/base';
import { useReveal } from '../lib/hooks';
import { Icon } from '../components/Icon';
import { SmartLink } from '../components/SmartLink';
import { PageHero, Section } from '../components/ui';
import { CompetencyDrawer } from '../components/CompetencyDrawer';

/**
 * Approved competency video. Leave `src` empty to hide the player
 * (no broken video is ever shown). Add captions as a .vtt file.
 */
const COMPETENCY_VIDEO = { src: '', captions: '', poster: 'img/group-mint-wide.jpg', title: 'The DOUGLAS competencies explained', description: 'A short introduction to the Core and Leadership Competencies.', transcript: '' };

function CompCard({ c, onOpen, i }: { c: Competency; onOpen: () => void; i: number }) {
  return (
    <article className={`comp-card comp-card--${c.group}`} data-reveal style={{ ['--i' as string]: i }}>
      <div className="comp-card__icon"><img src={media(c.icon)} alt="" /></div>
      <h3 className="h4">{c.name}</h3>
      <p className="muted">{c.definition}</p>
      <ul className="comp-card__list">{c.behaviours.map((b) => <li key={b}>{b}</li>)}</ul>
      <button type="button" className="text-link stretched-btn" onClick={onOpen} aria-label={`Open details: ${c.name}`}>
        Explore {c.name} <Icon name="arrow" size={16} className="arrow-move" />
      </button>
    </article>
  );
}

export function CompetencyGuide() {
  const { role, setRole } = useApp();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);
  // Deep link from search: ?competency=<id> opens the detail drawer.
  useEffect(() => {
    const id = params.get('competency');
    if (id && COMPETENCIES.some((c) => c.id === id)) setOpen(id);
  }, [params]);
  const closeDrawer = () => { setOpen(null); if (params.get('competency')) setParams({}, { replace: true }); };
  const ref = useReveal<HTMLDivElement>();
  const core = COMPETENCIES.filter((c) => c.group === 'core');
  const lead = COMPETENCIES.filter((c) => c.group === 'leadership');
  const weighting = RATING.weighting[role];

  return (
    <>
      <PageHero
        eyebrow="Module 05 · Competency & Goal Guide"
        title="Know your goals. Understand your impact."
        lead="Explore the objectives and competencies behind meaningful development conversations."
        image="img/group-mint-wide.jpg"
        imageAlt="DOUGLAS colleagues laughing together in front of a mint background"
      >
        <nav className="jump" aria-label="On this page">
          <SmartLink to="/competency-goal-guide#objectives">Objectives</SmartLink>
          <SmartLink to="/competency-goal-guide#core">Core Competencies</SmartLink>
          <SmartLink to="/competency-goal-guide#leadership">Leadership</SmartLink>
          <SmartLink to="/competency-goal-guide#rating">Rating</SmartLink>
        </nav>
      </PageHero>

      <Section id="objectives" eyebrow="A · Objective types" title="Performance and Development Objectives">
        <div className="obj-split">
          <article className="obj-col obj-col--perf" data-reveal>
            <p className="eyebrow">The “what” · mandatory</p>
            <h3 className="h3">Performance Objectives</h3>
            <dl>
              <dt>Purpose</dt><dd>Priorities and focus projects that guide you for the next twelve months — typically two to four, each weighted equally.</dd>
              <dt>Example (fictional)</dt><dd>“Introduce a monthly team update and collect feedback after each session through the end of Q2.”</dd>
              <dt>Key questions</dt><dd>What exactly do I want to achieve? How will we measure it? What does “partially fulfilled”, “fulfilled” and “exceeded” look like?</dd>
            </dl>
            <SmartLink to="/learning-nuggets?nugget=smart" className="text-link">SMART guidance <Icon name="arrow" size={16} className="arrow-move" /></SmartLink>
          </article>
          <article className="obj-col obj-col--dev" data-reveal>
            <p className="eyebrow">Your growth · optional</p>
            <h3 className="h3">Development Objectives</h3>
            <dl>
              <dt>Purpose</dt><dd>Focus on personal development — for example when there is a performance gap or new skills are needed for Performance Objectives.</dd>
              <dt>Example (fictional)</dt><dd>“Complete an English business-communication course by March to lead the international project update.”</dd>
              <dt>Key questions</dt><dd>Which skills help me now or in a next step? On the job, off the job or through reflection and feedback?</dd>
            </dl>
            <SmartLink to="/objective-setting#types" className="text-link">Objective Setting <Icon name="arrow" size={16} className="arrow-move" /></SmartLink>
          </article>
        </div>
      </Section>

      <Section id="core" tone="stone" eyebrow="B · Core Competencies" title="How we work together" intro={<p>{COMPETENCY_GROUPS.core.intro} <strong>{COMPETENCY_GROUPS.core.appliesTo}.</strong></p>}>
        <div className="comp-grid" ref={ref}>
          {core.map((c, i) => <CompCard key={c.id} c={c} i={i} onOpen={() => setOpen(c.id)} />)}
        </div>
      </Section>

      <Section id="leadership" tone="dark" eyebrow="C · Leadership Competencies" title="How we inspire, guide and enable" intro={<p>{COMPETENCY_GROUPS.leadership.intro} <strong>{COMPETENCY_GROUPS.leadership.appliesTo}.</strong></p>}>
        {role === 'employee' && (
          <div className="lead-intro" data-reveal>
            <p>These three competencies describe what you can expect from leadership at DOUGLAS. Detailed assessment guidance is shown in the Manager view.</p>
            <button type="button" className="btn btn--light btn--sm" onClick={() => setRole('manager')}>Switch to Manager view</button>
          </div>
        )}
        <div className={`lead-grid ${role === 'employee' ? 'lead-grid--intro' : ''}`}>
          {lead.map((c, i) => (
            <article key={c.id} className="lead-card" data-reveal style={{ ['--i' as string]: i }}>
              <div className="lead-card__media">
                {/* Photo carries the competency name as large type — no visible duplicate heading over it. */}
                <img src={media(c.photo!)} alt={c.photoAlt} loading="lazy" />
              </div>
              <div className="lead-card__body">
                <h3 className="sr-only">{c.name}</h3>
                <p className="lead-card__def">{c.definition}</p>
                {role === 'manager' && <ul className="comp-card__list comp-card__list--light">{c.behaviours.map((b) => <li key={b}>{b}</li>)}</ul>}
                <button type="button" className="text-link text-link--light stretched-btn" onClick={() => setOpen(c.id)} aria-label={`Open details: ${c.name}`}>
                  {role === 'manager' ? 'Assessment guidance' : 'Learn more'} <Icon name="arrow" size={16} className="arrow-move" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="rating" eyebrow="D · Rating & assessment" title="How the evaluation is structured">
        <div className="rating">
          <div className="rating__donut-wrap" data-reveal>
            <Donut parts={weighting} />
            <div className="seg seg--sm" role="radiogroup" aria-label="Show weighting for">
              <button type="button" role="radio" aria-checked={role === 'employee'} className={role === 'employee' ? 'is-active' : ''} onClick={() => setRole('employee')}>Employees</button>
              <button type="button" role="radio" aria-checked={role === 'manager'} className={role === 'manager' ? 'is-active' : ''} onClick={() => setRole('manager')}>Leaders</button>
            </div>
          </div>
          <div className="rating__cards">
            {weighting.map((w, i) => (
              <div key={w.label} className="rating-card" data-reveal>
                <span className={`eval__key eval__seg--${i}`} aria-hidden="true" />
                <div>
                  <p className="rating-card__v">{w.value}%</p>
                  <h3 className="h5">{w.label}</h3>
                  <p className="muted small">{w.note}</p>
                </div>
              </div>
            ))}
            <div className="rating-card rating-card--wide" data-reveal>
              <div>
                <h3 className="h5">How it fits into Year-End</h3>
                <p className="muted small">Self-evaluation → manager evaluation → joint dialogue to agree the final rating → completion in SAP SuccessFactors.</p>
                <SmartLink to="/year-end#timeline" className="text-link">Year-End timeline <Icon name="arrow" size={16} className="arrow-move" /></SmartLink>
              </div>
            </div>
          </div>
        </div>
        <div className="scale scale--wide" data-reveal>
          <p className="eyebrow">Four-level evaluation scale</p>
          <ol className="scale__list">
            {RATING.scale.map((s, i) => (
              <li key={s.label} className="scale__item">
                <span className="scale__bar" style={{ ['--lvl' as string]: i + 1 }} aria-hidden="true" />
                <strong>{s.label}</strong>
                <span className="muted small">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="callout callout--note"><Icon name="info" /><span><strong>Subject to HR approval.</strong> {RATING.status} No scores are calculated in this hub.</span></p>
      </Section>

      {COMPETENCY_VIDEO.src && (
        <Section id="video" tone="stone" eyebrow="E · Media" title={COMPETENCY_VIDEO.title}>
          <div className="video">
            <video controls preload="none" poster={media(COMPETENCY_VIDEO.poster)}>
              <source src={COMPETENCY_VIDEO.src} />
              {COMPETENCY_VIDEO.captions && <track kind="captions" src={COMPETENCY_VIDEO.captions} srcLang="en" label="English" default />}
            </video>
            <p>{COMPETENCY_VIDEO.description}</p>
            {COMPETENCY_VIDEO.transcript && <details><summary>Transcript</summary><p>{COMPETENCY_VIDEO.transcript}</p></details>}
          </div>
        </Section>
      )}

      <CompetencyDrawer id={open} onClose={closeDrawer} />
    </>
  );
}

function Donut({ parts }: { parts: { label: string; value: number }[] }) {
  const r = 70, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 200 200" className="donut" role="img" aria-label={`Weighting: ${parts.map((p) => `${p.label} ${p.value}%`).join(', ')}`}>
      <circle cx="100" cy="100" r={r} className="donut__track" />
      {parts.map((p, i) => {
        const len = (p.value / 100) * c;
        const el = <circle key={p.label} cx="100" cy="100" r={r} className={`donut__seg eval__stroke--${i}`} strokeDasharray={`${len - 3} ${c - len + 3}`} strokeDashoffset={-offset} />;
        offset += len;
        return el;
      })}
      <text x="100" y="96" textAnchor="middle" className="donut__big">100%</text>
      <text x="100" y="118" textAnchor="middle" className="donut__small">Overall evaluation</text>
    </svg>
  );
}
