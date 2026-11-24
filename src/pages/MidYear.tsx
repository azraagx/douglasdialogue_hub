import { useState } from 'react';
import { CHECKLISTS, MIDYEAR_OBJECTIVE_CHANGES, MIDYEAR_PREP_QUESTIONS, MIDYEAR_STEPS, PHASES } from '../content/phases';
import { useApp } from '../state/AppContext';
import { Icon } from '../components/Icon';
import { SmartLink } from '../components/SmartLink';
import { Checklist, ContextSupport, PageHero, RoleNote, Section, StepTimeline, SupportContact } from '../components/ui';

function PrepCards() {
  const { role } = useApp();
  const [open, setOpen] = useState<number | null>(0);
  const qs = MIDYEAR_PREP_QUESTIONS[role];
  return (
    <div className="prep-grid" key={role}>
      {qs.map((q, i) => {
        const isOpen = open === i;
        return (
          <article key={q.q} className={`prep-card ${isOpen ? 'is-open' : ''}`} data-reveal style={{ ['--i' as string]: i }}>
            <button type="button" className="prep-card__btn" aria-expanded={isOpen} aria-controls={`prep-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
              <span className="prep-card__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="prep-card__q">{q.q}</span>
              <span className="acc__icon" aria-hidden="true"><Icon name="plus" size={18} /></span>
            </button>
            <div id={`prep-${i}`} className="prep-card__a" hidden={!isOpen}>
              <p>{q.hint}</p>
            </div>
          </article>
        );
      })}
      {role === 'manager' && (
        <aside className="prep-card prep-card--guide" data-reveal>
          <p className="eyebrow eyebrow--dark">Mid-Year Guideline for Line Managers</p>
          <p className="h4">Recommended structure</p>
          <ol className="num-list">
            <li>Review of the first six months</li>
            <li>Feedback and development</li>
            <li>Objective adjustment — only if needed</li>
          </ol>
          <ul className="check-list">
            <li><Icon name="check" size={16} />Open, trusting atmosphere — ideally face-to-face</li>
            <li><Icon name="check" size={16} />Use concrete examples for feedback</li>
            <li><Icon name="check" size={16} />Let the employee actively contribute</li>
            <li><Icon name="check" size={16} />Document results in SAP SF</li>
          </ul>
        </aside>
      )}
    </div>
  );
}

export function MidYear() {
  const { role } = useApp();
  const phase = PHASES[1];
  return (
    <>
      <PageHero
        eyebrow="Phase 02"
        title="Mid-Year Dialogue"
        lead="Pause. Reflect. Realign. A structured conversation about the first six months — achievements, challenges and changed priorities. It is a progress conversation, not the final annual rating."
        image={phase.image}
        imageAlt={phase.imageAlt}
        phase="mid-year"
      >
        <div className="hero-actions">
          <SmartLink to="/mid-year#prepare" className="btn btn--dark">Prepare your conversation <Icon name="arrow" size={18} className="arrow-move" /></SmartLink>
          <SmartLink to="/mid-year#checklist" className="btn btn--ghost">Open your checklist</SmartLink>
        </div>
      </PageHero>

      <Section id="purpose" eyebrow="Purpose & overview" title="Time for reflection in the middle of the year">
        <div className="purpose-list">
          {[
            ['Review progress', 'Look at progress against agreed objectives — which (partial) objectives have been reached?'],
            ['Recognise successes', 'Highlight notable achievements and acknowledge them with appreciation.'],
            ['Identify barriers & changes', 'Clarify challenges, changed strategic conditions, project changes and priorities.'],
            ['Discuss development', 'Talk about strengths, potential for improvement and the support that helps.'],
            ['Adjust when appropriate', 'Align objectives for the second half of the year, following the applicable process.'],
          ].map(([t, d], i) => (
            <div key={t} className="purpose-item" data-reveal style={{ ['--i' as string]: i }}>
              <span className="purpose-item__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h4">{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="journey" tone="stone" eyebrow="Conversation journey" title="Four stages to a meaningful Mid-Year" intro={<RoleNote />}>
        <StepTimeline steps={MIDYEAR_STEPS} />
      </Section>

      <Section id="prepare" eyebrow={role === 'manager' ? 'Conversation Preparation Guide' : 'Conversation preparation'} title={role === 'manager' ? 'Questions to guide your team dialogues' : 'Questions to reflect on before you meet'}>
        <PrepCards />
      </Section>

      <Section id="changes" tone="mint" eyebrow="Objectives & changes" title="Review, adjust, add — then confirm in SAP">
        <ol className="change-flow">
          {MIDYEAR_OBJECTIVE_CHANGES.map((c, i) => (
            <li key={c.title} className="change-flow__item" data-reveal style={{ ['--i' as string]: i }}>
              <span className="change-flow__n">{i + 1}</span>
              <h3 className="h4">{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>
        <div className="callout callout--note" data-reveal>
          <Icon name="info" />
          <div><strong>Confirm with local HR / current guidance</strong><p>Rules for deleting or replacing objectives in special cases (e.g. internal job changes) depend on the current, approved process.</p></div>
        </div>
      </Section>

      <Section id="checklist" eyebrow="Mid-Year checklist" title={role === 'manager' ? 'Your manager checklist' : 'Your preparation checklist'}>
        <div className="checklist-layout">
          <Checklist items={CHECKLISTS['mid-year'][role]} title={role === 'manager' ? 'Manager · Mid-Year' : 'Employee · Mid-Year'} />
          <aside className="aside-note" data-reveal>
            <p className="eyebrow">Good to know</p>
            <p className="aside-note__quote">We recommend that all employees and managers take part in the Mid-Year Dialogue — for an appreciative reflection on the first six months.</p>
            <p className="muted small">#DOUGLASDialogue Booklet · Mid-Year FAQ</p>
          </aside>
        </div>
      </Section>

      <Section id="support" tone="stone" eyebrow="Contextual resources" title="Help for this phase">
        <ContextSupport
          items={[
            { icon: 'help', title: 'Mid-Year FAQ', text: 'Adjusting objectives, final rating and more.', to: '/knowledge-center?phase=mid-year' },
            { icon: 'book', title: 'Preparing for a Dialogue', text: 'A five-minute Learning Nugget.', to: '/learning-nuggets?nugget=prepare' },
            { icon: 'sparkle', title: 'Copilot prompts', text: role === 'manager' ? 'Build a supportive conversation agenda.' : 'Structure your Mid-Year reflection.', to: '/ai-prompts?phase=mid-year' },
            { icon: 'external', title: 'SAP SuccessFactors', text: '', sap: true },
          ]}
        />
        <div className="support-foot"><SupportContact /></div>
      </Section>
    </>
  );
}
