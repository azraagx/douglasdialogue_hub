import { useState } from 'react';
import { PHASES, NEXT_STEPS } from '../content/phases';
import { PHASE_WINDOWS, CYCLE } from '../content/config';
import { NUGGETS } from '../content/nuggets';
import type { PhaseId } from '../content/types';
import { useApp } from '../state/AppContext';
import { currentPhase } from '../lib/phase';
import { useReveal } from '../lib/hooks';
import { media } from '../lib/base';
import { Icon, type IconName } from '../components/Icon';
import { SmartLink } from '../components/SmartLink';
import { Section, SapLinkCard, SupportContact } from '../components/ui';

const MODULES: { to: string; title: string; text: string; icon: IconName; eyebrow: string; image?: string; alt?: string }[] = [
  { to: '/knowledge-center', eyebrow: 'Module 02', title: 'Knowledge Center', text: 'Clear answers, process guides, checklists and SAP help — searchable in seconds.', icon: 'book', image: 'img/office-glass.jpg', alt: 'DOUGLAS colleagues working in a bright, glass-walled office' },
  { to: '/ai-prompts', eyebrow: 'Module 03', title: 'AI Prompt Library', text: 'Curated Microsoft Copilot prompts to prepare, reflect and communicate.', icon: 'sparkle' },
  { to: '/learning-nuggets', eyebrow: 'Module 04', title: 'Learning Nuggets', text: 'Three short lessons — five minutes or less — on objectives, preparation and feedback.', icon: 'clock' },
  { to: '/competency-goal-guide', eyebrow: 'Module 05', title: 'Competency & Goal Guide', text: 'Objective types, seven competencies and how the evaluation is structured.', icon: 'target', image: 'img/team-trio.jpg', alt: 'Three DOUGLAS colleagues standing together and smiling' },
];

const MANAGER_SHORTCUTS = [
  { to: '/mid-year#prepare', label: 'Prepare for a team dialogue' },
  { to: '/competency-goal-guide#leadership', label: 'Review competencies' },
  { to: '/competency-goal-guide#rating', label: 'Understand ratings' },
  { to: '/ai-prompts', label: 'Manager prompts' },
];

function Hero() {
  const now = currentPhase();
  const phase = PHASES.find((p) => p.id === now.id)!;
  const w = PHASE_WINDOWS[now.id];
  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow anim-in" style={{ ['--d' as string]: '0ms' }}>#DOUGLASDIALOGUE</p>
          <h1 className="hero__title anim-in" style={{ ['--d' as string]: '80ms' }}>
            A better dialogue <span className="hero__title-accent">starts here.</span>
          </h1>
          <p className="hero__lead anim-in" style={{ ['--d' as string]: '180ms' }}>
            Your space to prepare, reflect and grow. Explore every phase of your dialogue journey and find the guidance you need.
          </p>
          <div className="hero__ctas anim-in" style={{ ['--d' as string]: '260ms' }}>
            <SmartLink to="/#journey" className="btn btn--dark">Explore your dialogue journey <Icon name="arrow" size={18} className="arrow-move" /></SmartLink>
            <SmartLink to="/#resources" className="btn btn--ghost">Find the right resource</SmartLink>
          </div>
          <p className="hero__mantra anim-in" style={{ ['--d' as string]: '340ms' }}>
            <span>Reflect.</span> <span>Connect.</span> <span>Grow.</span>
          </p>
        </div>
        <div className="hero__visual anim-in" style={{ ['--d' as string]: '120ms' }}>
          <div className="hero__mint" aria-hidden="true" />
          <figure className="hero__photo">
            <img src={media('img/hero-team.jpg')} alt="Three DOUGLAS colleagues smiling together in front of a mint background" />
          </figure>
          <SmartLink to={`/${now.id}`} className="hero__float">
            <span className="hero__float-label">{now.state === 'active' ? 'Current phase' : 'Next phase'} · {CYCLE.label}</span>
            <strong>{phase.number} — {phase.title}</strong>
            <span className="hero__float-date"><Icon name="clock" size={14} /> {w.display}</span>
            <span className="hero__float-note">Based on the configured process calendar</span>
          </SmartLink>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const now = currentPhase();
  const ref = useReveal<HTMLOListElement>();
  return (
    <Section id="journey" eyebrow="Your annual journey" title="Three phases. One continuous dialogue." intro={<p>Each phase builds on the last — from setting objectives, to reflecting mid-way, to recognising growth at Year-End. Select a phase to open its guide.</p>}>
      <ol className="journey" ref={ref}>
        <span className="journey__line" aria-hidden="true" />
        {PHASES.map((p, i) => {
          const w = PHASE_WINDOWS[p.id];
          const isNow = p.id === now.id;
          return (
            <li key={p.id} className={`journey__item ${isNow ? 'is-now' : ''}`} data-reveal style={{ ['--i' as string]: i }}>
              <article className="phase-card">
                <div className="phase-card__media">
                  <img src={media(p.image)} alt="" loading="lazy" />
                  <span className="phase-card__num" aria-hidden="true">{p.number}</span>
                </div>
                <div className="phase-card__body">
                  <div className="phase-card__meta">
                    <span><Icon name="clock" size={14} /> {w.display}</span>
                    {isNow && <span className="tag tag--mint">{now.state === 'active' ? 'Now' : 'Up next'}</span>}
                  </div>
                  <h3 className="h3">
                    <SmartLink to={`/${p.id}`} className="stretched">{p.title}</SmartLink>
                  </h3>
                  <p>{p.short}</p>
                  <span className="text-link" aria-hidden="true">Open phase guide <Icon name="arrow" size={16} className="arrow-move" /></span>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      <p className="fine-print"><Icon name="info" size={14} /> Dates come from the configured process calendar ({PHASES.map((p) => `${p.title}: ${PHASE_WINDOWS[p.id].status}`).join(' · ')}). Your personal status is always shown in SAP SuccessFactors.</p>
    </Section>
  );
}

function NextSteps() {
  const { role } = useApp();
  const now = currentPhase();
  const [phase, setPhase] = useState<PhaseId>(now.id);
  const steps = NEXT_STEPS[phase][role];
  return (
    <Section id="next" tone="mint" className="next" eyebrow="What should I do now?" title="Your next steps">
      <div className="next__grid">
        <div className="next__controls" data-reveal>
          <p>Choose a phase and get guidance tailored to your {role === 'manager' ? 'Manager' : 'Employee'} view. Switch the view at the top of the page at any time.</p>
          <div className="seg seg--stack" role="radiogroup" aria-label="Choose a dialogue phase">
            {PHASES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={phase === p.id} className={phase === p.id ? 'is-active' : ''} onClick={() => setPhase(p.id)}>
                <span className="seg__num">{p.number}</span> {p.title}
                {p.id === now.id && <span className="tag tag--dark">{now.state === 'active' ? 'Now' : 'Next'}</span>}
              </button>
            ))}
          </div>
          {role === 'manager' && (
            <div className="next__shortcuts">
              <p className="eyebrow eyebrow--dark">Manager shortcuts</p>
              <ul>
                {MANAGER_SHORTCUTS.map((s) => (
                  <li key={s.to}><SmartLink to={s.to} className="chip chip--light">{s.label}</SmartLink></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <ol className="next__list" key={`${phase}-${role}`} aria-live="polite">
          {steps.map((s, i) => (
            <li key={s.title} className="next-card anim-in" style={{ ['--d' as string]: `${i * 70}ms` }}>
              <span className="next-card__n">{i + 1}</span>
              <div>
                <h3 className="h4">{s.title}</h3>
                <p>{s.text}</p>
                <SmartLink to={s.to} className="text-link">{s.cta} <Icon name="arrow" size={16} className="arrow-move" /></SmartLink>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function Modules() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section id="resources" eyebrow="Find the right resource" title="Everything for your dialogue, in one place." intro={<p>Your Dialogue Dashboard brings together four resource modules — each designed to answer a question in minutes, not hours.</p>}>
      <div className="modules" ref={ref}>
        {MODULES.map((m, i) => (
          <SmartLink key={m.to} to={m.to} className={`module-card ${m.image ? 'module-card--image' : ''} module-card--${i}`} data-reveal style={{ ['--i' as string]: i }}>
            {m.image && (
              <span className="module-card__media"><img src={media(m.image)} alt="" loading="lazy" /></span>
            )}
            <span className="module-card__body">
              <span className="module-card__icon"><Icon name={m.icon} size={22} /></span>
              <span className="eyebrow">{m.eyebrow}</span>
              <span className="module-card__title">{m.title}</span>
              <span className="module-card__text">{m.text}</span>
              <span className="text-link">Explore <Icon name="arrow" size={16} className="arrow-move" /></span>
            </span>
          </SmartLink>
        ))}
      </div>
    </Section>
  );
}

function FeaturedNugget() {
  const n = NUGGETS[0];
  return (
    <Section className="featured">
      <div className="featured__card" data-reveal>
        <figure className="featured__media"><img src={media(n.image)} alt={n.imageAlt} loading="lazy" /></figure>
        <div className="featured__body">
          <p className="eyebrow">Learning Nugget · Learn in under five minutes</p>
          <h2 className="h2">{n.title}</h2>
          <p className="lead-sm">{n.description}</p>
          <p className="featured__meta"><Icon name="clock" size={16} /> {n.minutes} min read · {n.category}</p>
          <SmartLink to={`/learning-nuggets?nugget=${n.id}`} className="btn btn--primary">Explore the Nugget <Icon name="arrow" size={18} className="arrow-move" /></SmartLink>
        </div>
      </div>
    </Section>
  );
}

function SapSupport() {
  const { setAssistantOpen } = useApp();
  return (
    <Section id="support" tone="stone" eyebrow="Support & SAP guidance" title="Learn here. Complete your official actions in SAP SuccessFactors.">
      <div className="support-grid">
        <SapLinkCard />
        <SmartLink to="/knowledge-center" className="support-card" data-reveal>
          <span className="support-card__icon"><Icon name="book" /></span>
          <strong>Twelve essential FAQs</strong>
          <span className="muted">From “What is #DOUGLASDialogue?” to role changes and SAP steps.</span>
          <span className="text-link">Open the Knowledge Center <Icon name="arrow" size={16} className="arrow-move" /></span>
        </SmartLink>
        <button type="button" className="support-card" data-reveal onClick={() => setAssistantOpen(true)}>
          <span className="support-card__icon"><Icon name="chat" /></span>
          <strong>Ask the Dialogue Guide</strong>
          <span className="muted">A guided helper that points you to the right content. Bottom-right, on every page.</span>
          <span className="text-link">Open the guide <Icon name="arrow" size={16} className="arrow-move" /></span>
        </button>
      </div>
      <div className="support-foot"><SupportContact /><p className="muted small">{CYCLE.scopeNote}</p></div>
    </Section>
  );
}

export function Dashboard() {
  const { role } = useApp();
  return (
    <>
      <Hero />
      <div className="welcome-strip">
        <div className="container welcome-strip__inner">
          <p>
            <strong>{role === 'manager' ? 'Welcome, leader.' : 'Welcome.'}</strong>{' '}
            {role === 'manager'
              ? 'Guide your team through every phase — with checklists, conversation guides and rating guidance made for managers.'
              : 'Everything you need to prepare your objectives, reflect on progress and shape your development.'}
          </p>
        </div>
      </div>
      <Journey />
      <NextSteps />
      <Modules />
      <FeaturedNugget />
      <SapSupport />
    </>
  );
}
