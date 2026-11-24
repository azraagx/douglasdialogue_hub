import { useState } from 'react';
import { CHECKLISTS, PHASES, YEAREND_REFLECTION, YEAREND_STEPS } from '../content/phases';
import { YEAR_END_STEP_DATES } from '../content/config';
import { COMPETENCIES, RATING } from '../content/competencies';
import { KNOWLEDGE } from '../content/knowledge';
import { useApp } from '../state/AppContext';
import { media } from '../lib/base';
import { Icon } from '../components/Icon';
import { SmartLink } from '../components/SmartLink';
import { Accordion, Checklist, ContextSupport, PageHero, RoleTabs, Section, StepTimeline, SupportContact } from '../components/ui';
import { CompetencyDrawer } from '../components/CompetencyDrawer';

const EXCEPTIONS = [
  { title: 'New starters', text: 'Employees who join by 1 April take part and conduct a Year-End Review. Those who join after 1 April take part from the next fiscal year.' },
  { title: 'Internal role change', text: 'You discuss the evaluation of your objectives and competencies with your new manager. Depending on Mid-Year decisions, objectives from both your previous and new role may be evaluated.' },
  { title: 'Change of manager', text: 'The new manager takes over your existing objectives, can discuss them with you in the Year-End Dialogue and, if necessary, share additional input from your previous manager.' },
  { title: 'Employee exits', text: 'The Year-End Dialogue can be conducted on a voluntary basis — if needed combined with a feedback or exit interview. Open workflows are deactivated after the departure.' },
  { title: 'Completing the annual process', text: 'The #DOUGLASDialogue needs to be completed by 15 October (hard deadline per the booklet). The manager documents the final evaluation and clicks “Send to Completion”.' },
];

export function YearEnd() {
  const { role } = useApp();
  const phase = PHASES[2];
  const [comp, setComp] = useState<string | null>(null);
  const weighting = RATING.weighting[role];
  const visibleComps = COMPETENCIES.filter((c) => role === 'manager' || c.group === 'core');
  const related = KNOWLEDGE.find((k) => k.id === 'changes');

  return (
    <>
      <PageHero
        eyebrow="Phase 03"
        title="Year-End Dialogue"
        lead="Reflect on achievements. Recognise growth. Shape what’s next. A detailed review of performance objectives and competencies at the end of the fiscal year."
        image={phase.image}
        imageAlt={phase.imageAlt}
        tone="mint"
        phase="year-end"
      >
        <div className="hero-actions">
          <SmartLink to="/year-end#timeline" className="btn btn--dark">See the four steps <Icon name="arrow" size={18} className="arrow-move" /></SmartLink>
          <SmartLink to="/year-end#views" className="btn btn--ghost">{role === 'manager' ? 'Assessment guidance' : 'Prepare your self-evaluation'}</SmartLink>
        </div>
      </PageHero>

      <Section id="timeline" eyebrow="Four steps · flexible timing" title="From self-evaluation to completion" intro={<p>All steps can be scheduled between 1 September and 15 October based on mutual availability. The process is progressive: the employee completes step 1 first, then the manager completes step 2, followed by the joint dialogue.</p>}>
        <StepTimeline
          steps={YEAREND_STEPS}
          extra={(_, i) => <p className="date-line"><Icon name="clock" size={16} /> {YEAR_END_STEP_DATES[i]} <span className="tag tag--muted">Indicative</span></p>}
        />
      </Section>

      <Section id="views" tone="stone" eyebrow="Role-specific preparation" title="Prepare in your role">
        <RoleTabs
          render={(r) => (
            <div className="reflect-grid">
              {YEAREND_REFLECTION[r].map((b, i) => (
                <article key={b.title} className="reflect-card" style={{ ['--i' as string]: i }}>
                  <span className="reflect-card__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="h4">{b.title}</h3>
                  <ul className="dot-list">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </article>
              ))}
              {r === 'manager' && (
                <article className="reflect-card reflect-card--dark">
                  <p className="eyebrow eyebrow--light">Official process reminders</p>
                  <ul className="check-list check-list--light">
                    <li><Icon name="check" size={16} />Schedule a face-to-face “Year-End Dialogue” meeting.</li>
                    <li><Icon name="check" size={16} />The rating becomes visible to the employee once you click “Send to Year-End Dialogue”.</li>
                    <li><Icon name="check" size={16} />Agree on the final rating together; then document it and click “Send to Completion”.</li>
                    <li><Icon name="check" size={16} />Give constant feedback during the year — no surprises at Year-End.</li>
                  </ul>
                </article>
              )}
            </div>
          )}
        />
      </Section>

      <Section id="evaluation" eyebrow="Evaluation explainer" title="How objectives and competencies fit together">
        <div className="eval">
          <div className="eval__bar" data-reveal role="img" aria-label={`Overall evaluation: ${weighting.map((w) => `${w.label} ${w.value}%`).join(', ')}`}>
            {weighting.map((w, i) => (
              <div key={w.label} className={`eval__seg eval__seg--${i}`} style={{ flexGrow: w.value }}>
                <strong>{w.value}%</strong>
                <span>{w.label}</span>
              </div>
            ))}
          </div>
          <div className="eval__notes">
            {weighting.map((w, i) => (
              <div key={w.label} className="eval__note" data-reveal>
                <span className={`eval__key eval__seg--${i}`} aria-hidden="true" />
                <div><strong>{w.label}</strong><p className="muted">{w.note}</p></div>
              </div>
            ))}
          </div>
          <div className="scale" data-reveal>
            <p className="eyebrow">Evaluation scale</p>
            <ol className="scale__list">
              {RATING.scale.map((s, i) => (
                <li key={s.label} className="scale__item"><span className="scale__bar" style={{ ['--lvl' as string]: i + 1 }} aria-hidden="true" /><strong>{s.label}</strong></li>
              ))}
            </ol>
          </div>
          <p className="callout callout--note"><Icon name="info" /><span><strong>Content requiring confirmation.</strong> {RATING.status} This hub explains the framework; it does not calculate scores.</span></p>
        </div>
      </Section>

      <Section id="competencies" tone="stone" eyebrow="Competency support" title={role === 'manager' ? 'Core and Leadership Competencies' : 'The four Core Competencies'}>
        <div className="comp-mini">
          {visibleComps.map((c) => (
            <button key={c.id} type="button" className={`comp-mini__item ${c.group === 'leadership' ? 'is-lead' : ''}`} onClick={() => setComp(c.id)} data-reveal>
              <img src={media(c.icon)} alt="" />
              <span>{c.name}</span>
              <small>{c.group === 'leadership' ? 'Leadership' : 'Core'}</small>
            </button>
          ))}
        </div>
        <SmartLink to="/competency-goal-guide#core" className="text-link">Open the Competency & Goal Guide <Icon name="arrow" size={16} className="arrow-move" /></SmartLink>
      </Section>

      <Section id="exceptions" eyebrow="FAQ & exceptions" title="Special situations">
        <div className="acc-group">
          {EXCEPTIONS.map((e) => (
            <Accordion key={e.title} title={e.title}><p>{e.text}</p></Accordion>
          ))}
        </div>
        <div className="callout callout--note" data-reveal>
          <Icon name="info" />
          <div><strong>Confirm with local HR / current guidance</strong><p>These descriptions follow the #DOUGLASDialogue Booklet. Country-specific rules may differ — use only current, approved local rules.</p></div>
        </div>
        {related && <SmartLink to="/knowledge-center?item=changes" className="text-link">Related FAQ: {related.title} <Icon name="arrow" size={16} className="arrow-move" /></SmartLink>}
      </Section>

      <Section id="checklist" tone="mint" eyebrow="Final checklist" title="Remaining process steps">
        <div className="checklist-layout">
          <Checklist items={CHECKLISTS['year-end'][role]} title={role === 'manager' ? 'Manager · Year-End' : 'Employee · Year-End'} />
          <aside className="aside-note aside-note--light" data-reveal>
            <p className="eyebrow eyebrow--dark">No surprises</p>
            <p className="aside-note__quote">Give feedback constantly and immediately throughout the year. The Year-End Dialogue should confirm what has already been discussed.</p>
            <p className="small">No evaluations are entered or stored in this hub.</p>
          </aside>
        </div>
      </Section>

      <Section id="support" eyebrow="Contextual resources" title="Help for this phase">
        <ContextSupport
          items={[
            { icon: 'book', title: 'Giving Meaningful Feedback', text: 'A four-minute Learning Nugget.', to: '/learning-nuggets?nugget=feedback' },
            { icon: 'sparkle', title: 'Copilot prompts', text: 'Year-End reflection and feedback prompts.', to: '/ai-prompts?phase=year-end' },
            { icon: 'help', title: 'Year-End FAQ', text: 'Preparation, evaluation and changes.', to: '/knowledge-center?phase=year-end' },
            { icon: 'external', title: 'SAP SuccessFactors', text: '', sap: true },
          ]}
        />
        <div className="support-foot"><SupportContact /></div>
      </Section>

      <CompetencyDrawer id={comp} onClose={() => setComp(null)} />
    </>
  );
}
