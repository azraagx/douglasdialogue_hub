import { useState } from 'react';
import { CHECKLISTS, OBJECTIVE_STEPS, PHASES } from '../content/phases';
import { PHASE_WINDOWS, CYCLE, SAP_FORM_LOCATION } from '../content/config';
import { useApp } from '../state/AppContext';
import { Icon } from '../components/Icon';
import { SmartLink } from '../components/SmartLink';
import { Checklist, ContextSupport, PageHero, RoleNote, Section, StepTimeline, SupportContact } from '../components/ui';

const SMART = [
  { letter: 'S', word: 'Specific', text: 'Describe the result you want to achieve.', q: 'What exactly is my contribution? What do I want to accomplish?' },
  { letter: 'M', word: 'Measurable', text: 'Define clear indicators or criteria for success.', q: 'How can we measure the result — even without KPIs?' },
  { letter: 'A', word: 'Achievable', text: 'Set an ambitious but realistic objective.', q: 'Consider previous results, current resources and market conditions.' },
  { letter: 'R', word: 'Relevant', text: 'Connect the objective to your role and business priorities.', q: 'Is it aligned with company, department and team objectives?' },
  { letter: 'T', word: 'Time-bound', text: 'Agree on a clear deadline.', q: 'By when will it be implemented and measured?' },
];

function SmartGuide() {
  const [active, setActive] = useState(0);
  const s = SMART[active];
  return (
    <div className="smart">
      <div className="smart__letters" role="tablist" aria-label="SMART criteria">
        {SMART.map((x, i) => (
          <button
            key={x.letter}
            id={`smart-t${i}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls="smart-panel"
            tabIndex={active === i ? 0 : -1}
            className={`smart__letter ${active === i ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onKeyDown={(e) => {
              let n = -1;
              if (e.key === 'ArrowRight') n = (i + 1) % SMART.length;
              if (e.key === 'ArrowLeft') n = (i - 1 + SMART.length) % SMART.length;
              if (n >= 0) { e.preventDefault(); setActive(n); document.getElementById(`smart-t${n}`)?.focus(); }
            }}
          >
            <span className="smart__big">{x.letter}</span>
            <span className="smart__word">{x.word}</span>
          </button>
        ))}
      </div>
      <div className="smart__panel" id="smart-panel" role="tabpanel" aria-labelledby={`smart-t${active}`} key={active}>
        <p className="eyebrow">{s.word}</p>
        <p className="smart__text">{s.text}</p>
        <p className="muted">{s.q}</p>
      </div>
      <div className="smart__examples">
        <div className="example example--unclear">
          <span className="example__label"><Icon name="close" size={14} /> Unclear</span>
          <p>“Improve team communication.”</p>
        </div>
        <Icon name="arrow" size={28} className="smart__arrow" />
        <div className="example example--clear">
          <span className="example__label"><Icon name="check" size={14} /> Clearer</span>
          <p>“Introduce a monthly team update and collect feedback after each session through the end of Q2.”</p>
        </div>
      </div>
      <p className="fine-print"><Icon name="info" size={14} /> Fictional example for educational purposes — not an assessment of any employee.</p>
    </div>
  );
}

export function ObjectiveSetting() {
  const { role } = useApp();
  const phase = PHASES[0];
  const w = PHASE_WINDOWS['objective-setting'];
  return (
    <>
      <PageHero
        eyebrow={`Phase 01 · ${CYCLE.label}`}
        title="Objective Setting"
        lead="Turn ambitions into meaningful objectives. Discuss the year ahead with your manager, agree on clear objectives and build a shared understanding of what success looks like."
        image={phase.image}
        imageAlt={phase.imageAlt}
        phase="objective-setting"
      >
        <div className="hero-actions">
          <SmartLink to="/objective-setting#smart" className="btn btn--dark">Write a SMART objective <Icon name="arrow" size={18} className="arrow-move" /></SmartLink>
          <SmartLink to="/objective-setting#checklist" className="btn btn--ghost">Open your checklist</SmartLink>
        </div>
      </PageHero>

      <Section id="overview" eyebrow="Phase overview" title="Why Objective Setting matters">
        <div className="overview-grid">
          <article className="info-tile" data-reveal>
            <Icon name="target" size={24} />
            <h3 className="h4">Purpose</h3>
            <ul className="dot-list">
              <li>Translate business and team priorities into meaningful individual objectives.</li>
              <li>Create clarity on your contribution and the results expected.</li>
              <li>Agree on how achievement will be measured.</li>
              <li>Build the foundation for check-ins, Mid-Year and Year-End.</li>
            </ul>
          </article>
          <article className="info-tile" data-reveal>
            <Icon name="users" size={24} />
            <h3 className="h4">Who participates</h3>
            <p>You and your manager, together. Objective Setting can be part of a regular check-in or jour fixe — a separate meeting is not required.</p>
            <p className="muted small">{CYCLE.scopeNote}</p>
          </article>
          <article className="info-tile" data-reveal>
            <Icon name="book" size={24} />
            <h3 className="h4">What to prepare</h3>
            <p>{role === 'manager'
              ? 'Your team’s priorities and milestones — and how each team member contributes to them.'
              : 'Ideas for your objectives based on your role, team priorities and learnings from the previous year.'}</p>
          </article>
          <article className="info-tile info-tile--mint" data-reveal>
            <span className="sap-badge">SAP</span>
            <h3 className="h4">Where objectives are recorded</h3>
            <p>Enter your new objectives in the #DOUGLASDialogue form for 2026/27 in SAP SuccessFactors.</p>
            <p className="small">{SAP_FORM_LOCATION}</p>
            <p className="date-line"><Icon name="clock" size={16} /> {w.display} · <span className="tag tag--ok">Confirmed</span></p>
          </article>
        </div>
        <div className="callout callout--note" data-reveal>
          <Icon name="info" />
          <div><strong>Previous Year-End still open?</strong><p>Please complete it as soon as possible. The new cycle started on 15 October as planned.</p></div>
        </div>
      </Section>

      <Section id="steps" tone="stone" eyebrow="Step by step" title="Your Objective Setting journey" intro={<RoleNote>switch the view at the top to compare</RoleNote>}>
        <StepTimeline steps={OBJECTIVE_STEPS} />
      </Section>

      <Section id="types" eyebrow="Objective types" title="Two kinds of objectives">
        <div className="types-grid">
          <article className="type-card type-card--dark" data-reveal>
            <p className="eyebrow">Mandatory · typically 2–4</p>
            <h3 className="h3">Performance Objectives</h3>
            <p>Priorities and focus projects that guide you for the next twelve months — the business or individual outcomes you want to achieve.</p>
            <ul className="check-list">
              <li><Icon name="check" size={16} />Clear and measurable, directly supporting strategic priorities.</li>
              <li><Icon name="check" size={16} />For each objective, agree what “partially fulfilled”, “fulfilled” and “exceeded” mean.</li>
            </ul>
          </article>
          <article className="type-card" data-reveal>
            <p className="eyebrow">Optional</p>
            <h3 className="h3">Development Objectives</h3>
            <p>Focus on your personal and professional development — short- or long-term.</p>
            <ul className="check-list">
              <li><Icon name="check" size={16} />Useful when new skills are needed for performance objectives, e.g. English for international projects.</li>
              <li><Icon name="check" size={16} />On the job, off the job (trainings, self-learning) or individual (reflection, feedback).</li>
            </ul>
          </article>
        </div>
        <p className="fine-print"><Icon name="info" size={14} /> The range of two to four Performance Objectives comes from the #DOUGLASDialogue Booklet and is subject to the current process approval.</p>
      </Section>

      <Section id="smart" tone="mint" eyebrow="SMART objectives guide" title="Make your objectives meaningful">
        <SmartGuide />
      </Section>

      <Section id="checklist" eyebrow="Role-based checklist" title={role === 'manager' ? 'Your manager checklist' : 'Your preparation checklist'}>
        <div className="checklist-layout">
          <Checklist items={CHECKLISTS['objective-setting'][role]} title={role === 'manager' ? 'Manager · Objective Setting' : 'Employee · Objective Setting'} />
          <aside className="aside-note" data-reveal>
            <p className="eyebrow">{role === 'manager' ? 'Leaders' : 'Employees'}</p>
            <p className="aside-note__quote">
              {role === 'manager'
                ? 'Please discuss and agree on objectives with your team members and complete their approval and documentation in SAP by 30 November.'
                : 'Prepare ideas for your objectives, discuss them with your manager and ensure the agreed objectives are documented in SAP.'}
            </p>
            <p className="muted small">From the FY 2026/27 Objective Setting communication.</p>
          </aside>
        </div>
      </Section>

      <Section id="support" tone="stone" eyebrow="Contextual support" title="Help for this phase">
        <ContextSupport
          items={[
            { icon: 'clock', title: 'SMART Objectives nugget', text: 'Learn to write a SMART objective in four minutes.', to: '/learning-nuggets?nugget=smart' },
            { icon: 'sparkle', title: 'Copilot prompts', text: 'Two prompts for Objective Setting — copy and use.', to: '/ai-prompts?phase=objective-setting' },
            { icon: 'help', title: 'Related FAQs', text: 'Objective types, SMART and participation.', to: '/knowledge-center?phase=objective-setting' },
            { icon: 'external', title: 'SAP SuccessFactors', text: '', sap: true },
          ]}
        />
        <div className="support-foot"><SupportContact /></div>
      </Section>
    </>
  );
}
