import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NUGGETS, type Nugget } from '../content/nuggets';
import { media } from '../lib/base';
import { useReveal } from '../lib/hooks';
import { Icon } from '../components/Icon';
import { Blocks } from '../components/Blocks';
import { LinkList, PageHero, Section } from '../components/ui';

function NuggetReader({ n, onBack }: { n: Nugget; onBack: () => void }) {
  const total = n.sections.length + (n.checklist ? 1 : 0);
  const [step, setStep] = useState(0);
  const headRef = useRef<HTMLHeadingElement>(null);
  const idx = NUGGETS.findIndex((x) => x.id === n.id);
  const nextNugget = NUGGETS[(idx + 1) % NUGGETS.length];
  const [, setParams] = useSearchParams();

  useEffect(() => { setStep(0); }, [n.id]);
  useEffect(() => { headRef.current?.focus(); }, [step, n.id]);

  const isChecklist = n.checklist && step === n.sections.length;
  const section = n.sections[step];
  const last = step === total - 1;

  return (
    <div className="reader">
      <div className="reader__bar">
        <button type="button" className="text-link back-link" onClick={onBack}><Icon name="arrow-left" size={16} /> All Learning Nuggets</button>
        <span className="reader__time"><Icon name="clock" size={14} /> {n.minutes} min</span>
      </div>
      <div className="reader__grid">
        <aside className="reader__aside">
          <figure className="reader__media"><img src={media(n.image)} alt={n.imageAlt} /></figure>
          <p className="eyebrow">Learning Nugget · {n.category}</p>
          <h1 className="h2">{n.title}</h1>
          <ol className="reader__toc" aria-label="Sections">
            {n.sections.map((s, i) => (
              <li key={s.title}>
                <button type="button" className={step === i ? 'is-active' : i < step ? 'is-done' : ''} aria-current={step === i ? 'step' : undefined} onClick={() => setStep(i)}>
                  <span>{i + 1}</span>{s.title}
                </button>
              </li>
            ))}
            {n.checklist && (
              <li>
                <button type="button" className={isChecklist ? 'is-active' : ''} aria-current={isChecklist ? 'step' : undefined} onClick={() => setStep(n.sections.length)}>
                  <span>{n.sections.length + 1}</span>Your self-checklist
                </button>
              </li>
            )}
          </ol>
        </aside>
        <div className="reader__main">
          <div className="reader__progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-label="Nugget progress">
            <span style={{ width: `${((step + 1) / total) * 100}%` }} />
          </div>
          <div className="reader__content" key={`${n.id}-${step}`}>
            <p className="eyebrow">Part {step + 1} of {total}</p>
            <h2 className="h2" tabIndex={-1} ref={headRef}>{isChecklist ? 'Your five-point self-checklist' : section.title}</h2>
            {isChecklist ? (
              <ul className="check-list check-list--big">
                {n.checklist!.map((c) => <li key={c}><Icon name="check" size={18} />{c}</li>)}
              </ul>
            ) : (
              <Blocks blocks={section.blocks} />
            )}
            {last && (
              <div className="reader__end">
                <p className="eyebrow">Keep going</p>
                <LinkList links={n.related} />
              </div>
            )}
          </div>
          <div className="reader__nav">
            <button type="button" className="btn btn--ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><Icon name="arrow-left" size={18} /> Back</button>
            {!last ? (
              <button type="button" className="btn btn--dark" onClick={() => setStep(step + 1)}>Next <Icon name="arrow" size={18} className="arrow-move" /></button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={() => setParams({ nugget: nextNugget.id })}>
                Next nugget: {nextNugget.title} <Icon name="arrow" size={18} className="arrow-move" />
              </button>
            )}
          </div>
          <p className="fine-print"><Icon name="info" size={14} /> Learning Nuggets are short reading units. No completion record or training credit is saved.</p>
        </div>
      </div>
    </div>
  );
}

export function LearningNuggets() {
  const [params, setParams] = useSearchParams();
  const active = NUGGETS.find((n) => n.id === params.get('nugget'));
  const ref = useReveal<HTMLDivElement>();

  useEffect(() => { window.scrollTo({ top: 0 }); }, [active?.id]);

  if (active) {
    return (
      <Section className="reader-wrap">
        <NuggetReader n={active} onBack={() => setParams({})} />
      </Section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Module 04 · Learning Nuggets"
        title="Small lessons. Meaningful growth."
        lead="Practical learning moments you can complete in five minutes or less."
        image="img/duo-mint-b.jpg"
        imageAlt="Two DOUGLAS colleagues smiling in front of a mint background"
        tone="mint"
      />
      <Section eyebrow="Three nuggets" title="Choose your five minutes">
        <div className="nugget-grid" ref={ref}>
          {NUGGETS.map((n, i) => (
            <article key={n.id} className="nugget-card" data-reveal style={{ ['--i' as string]: i }}>
              <div className="nugget-card__media"><img src={media(n.image)} alt="" loading="lazy" /></div>
              <div className="nugget-card__body">
                <p className="nugget-card__meta"><span className="tag tag--mint">{n.category}</span><span><Icon name="clock" size={14} /> {n.minutes} min</span></p>
                <h2 className="h3">{n.title}</h2>
                <p className="muted">{n.description}</p>
                <button type="button" className="btn btn--dark btn--sm stretched-btn" onClick={() => setParams({ nugget: n.id })} aria-label={`Start Nugget: ${n.title}`}>
                  Start Nugget <Icon name="arrow" size={16} className="arrow-move" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
