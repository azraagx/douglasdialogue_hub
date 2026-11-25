import { useCallback, useEffect, useId, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { BREADCRUMBS } from '../content/navigation';
import { LINKS, PHASE_WINDOWS, SAP_FORM_LOCATION, SUPPORT } from '../content/config';
import type { ChecklistItem, LinkRef, PhaseId, Role } from '../content/types';
import type { ProcessStep } from '../content/phases';
import { useApp } from '../state/AppContext';
import { useEscape, useFocusTrap, useReveal } from '../lib/hooks';
import { media } from '../lib/base';
import { Icon, type IconName } from './Icon';
import { SmartLink } from './SmartLink';

/* ---------------- Breadcrumbs ---------------- */

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const trail = BREADCRUMBS[pathname];
  if (!trail) return null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) => (
          <li key={c.label}>
            {c.to && i < trail.length - 1 ? <SmartLink to={c.to}>{c.label}</SmartLink> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------- Page hero (inner pages) ---------------- */

export function PageHero({
  eyebrow, title, lead, image, imageAlt, children, tone = 'light', phase,
}: {
  eyebrow: string; title: string; lead: string; image?: string; imageAlt?: string; children?: ReactNode; tone?: 'light' | 'mint'; phase?: PhaseId;
}) {
  const w = phase ? PHASE_WINDOWS[phase] : null;
  return (
    <section className={`page-hero page-hero--${tone} ${image ? '' : 'page-hero--text'}`}>
      <div className="container page-hero__grid">
        <div className="page-hero__copy">
          <Breadcrumbs />
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display">{title}</h1>
          <p className="lead">{lead}</p>
          {w && (
            <p className="date-chip">
              <Icon name="clock" size={16} />
              <span>{w.display}</span>
              <span className={`tag ${w.status === 'confirmed' ? 'tag--ok' : 'tag--muted'}`}>
                {w.status === 'confirmed' ? 'Confirmed' : 'Indicative · confirm locally'}
              </span>
            </p>
          )}
          {children}
        </div>
        {image && (
          <figure className="page-hero__media">
            <img src={media(image)} alt={imageAlt ?? ''} />
          </figure>
        )}
      </div>
    </section>
  );
}

/* ---------------- Section wrapper with reveal ---------------- */

export function Section({ id, eyebrow, title, intro, children, className = '', tone }: {
  id?: string; eyebrow?: string; title?: string; intro?: ReactNode; children: ReactNode; className?: string; tone?: 'stone' | 'mint' | 'dark';
}) {
  const ref = useReveal<HTMLElement>();
  const hid = useId();
  return (
    <section id={id} ref={ref} className={`section ${tone ? `section--${tone}` : ''} ${className}`} aria-labelledby={title ? hid : undefined}>
      <div className="container">
        {(eyebrow || title) && (
          <header className="section__head" data-reveal>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 id={hid} className="h2">{title}</h2>}
            {intro && <div className="section__intro">{intro}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------------- Role badge ---------------- */

export function RoleNote({ children }: { children?: ReactNode }) {
  const { role } = useApp();
  return (
    <p className="role-note" aria-live="polite">
      <Icon name={role === 'manager' ? 'users' : 'user'} size={16} />
      <span>Showing <strong>{role === 'manager' ? 'Manager' : 'Employee'}</strong> guidance{children ? <> · {children}</> : null}</span>
    </p>
  );
}

/* ---------------- Checklist ---------------- */

export function Checklist({ items, title, id }: { items: ChecklistItem[]; title: string; id?: string }) {
  const { checked, toggleCheck, resetChecks } = useApp();
  const done = items.filter((i) => checked[i.id]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const printList = () => window.print();
  return (
    <div className="checklist" id={id}>
      <div className="checklist__head">
        <div>
          <h3 className="h4">{title}</h3>
          <p className="muted small">{done} of {items.length} prepared · demo only, saved in this browser</p>
        </div>
        <div className="checklist__ring" style={{ ['--p' as string]: pct }} aria-hidden="true"><span>{pct}%</span></div>
      </div>
      <ul className="checklist__list">
        {items.map((it) => (
          <li key={it.id}>
            <label className={`check ${checked[it.id] ? 'is-checked' : ''}`}>
              <input type="checkbox" checked={!!checked[it.id]} onChange={() => toggleCheck(it.id)} />
              <span className="check__box" aria-hidden="true"><Icon name="check" size={14} /></span>
              <span className="check__text">
                {it.text}
                {it.hint && <small>{it.hint}</small>}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="checklist__foot">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => resetChecks(items.map((i) => i.id))} disabled={!done}>
          <Icon name="reset" size={16} /> Reset
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={printList}>
          <Icon name="print" size={16} /> Print
        </button>
      </div>
      <p className="checklist__disclaimer"><Icon name="info" size={14} /> This is a personal preparation aid — not an official SAP completion status.</p>
    </div>
  );
}

/* ---------------- Accordion ---------------- */

export function Accordion({ title, children, defaultOpen = false, meta, id, open: controlledOpen, onToggle }: {
  title: ReactNode; children: ReactNode; defaultOpen?: boolean; meta?: ReactNode; id?: string; open?: boolean; onToggle?: (o: boolean) => void;
}) {
  const [inner, setInner] = useState(defaultOpen);
  const open = controlledOpen ?? inner;
  const uid = useId();
  const toggle = () => { const n = !open; setInner(n); onToggle?.(n); };
  return (
    <div className={`acc ${open ? 'is-open' : ''}`} id={id}>
      <h3 className="acc__h">
        <button type="button" className="acc__btn" aria-expanded={open} aria-controls={`${uid}-p`} id={`${uid}-b`} onClick={toggle}>
          <span className="acc__title">{title}</span>
          {meta && <span className="acc__meta">{meta}</span>}
          <span className="acc__icon" aria-hidden="true"><Icon name="plus" size={18} /></span>
        </button>
      </h3>
      <div className="acc__panel" id={`${uid}-p`} role="region" aria-labelledby={`${uid}-b`} hidden={!open}>
        <div className="acc__inner">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Process timeline (interactive steps) ---------------- */

export function StepTimeline({ steps, extra }: { steps: ProcessStep[]; extra?: (s: ProcessStep, i: number) => ReactNode }) {
  const { role } = useApp();
  const [active, setActive] = useState(0);
  const step = steps[active];
  const uid = useId();
  return (
    <div className="timeline">
      <div className="timeline__rail" role="tablist" aria-label="Process steps">
        <span className="timeline__progress" style={{ width: `${(active / (steps.length - 1)) * 100}%` }} aria-hidden="true" />
        {steps.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={active === i}
            aria-controls={`${uid}-p`}
            tabIndex={active === i ? 0 : -1}
            className={`timeline__step ${active === i ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let n = -1;
              if (e.key === 'ArrowRight') n = (i + 1) % steps.length;
              if (e.key === 'ArrowLeft') n = (i - 1 + steps.length) % steps.length;
              if (n >= 0) { e.preventDefault(); setActive(n); document.getElementById(`${uid}-t${n}`)?.focus(); }
            }}
          >
            <span className="timeline__dot">{String(i + 1).padStart(2, '0')}</span>
            <span className="timeline__label">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="timeline__panel" role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t${active}`} key={`${step.id}-${role}`}>
        <div className="timeline__panel-main">
          <p className="eyebrow">Step {active + 1} of {steps.length}{extra ? '' : ''}</p>
          <h3 className="h3">{step.title}</h3>
          <p className="lead-sm">{step.summary}</p>
          {extra?.(step, active)}
        </div>
        <div className="timeline__panel-side">
          <p className="eyebrow eyebrow--dark">{role === 'manager' ? 'As a manager' : 'As an employee'}</p>
          <ul className="check-list">
            {step.detail[role].map((d) => <li key={d}><Icon name="check" size={16} />{d}</li>)}
          </ul>
          {step.sap && <p className="sap-chip"><span>SAP</span>{step.sap}</p>}
          <div className="timeline__nav">
            <button type="button" className="btn btn--ghost btn--sm" disabled={active === 0} onClick={() => setActive(active - 1)}><Icon name="arrow-left" size={16} /> Previous</button>
            <button type="button" className="btn btn--dark btn--sm" disabled={active === steps.length - 1} onClick={() => setActive(active + 1)}>Next step <Icon name="arrow" size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Drawer (modal side panel) ---------------- */

export function Drawer({ open, onClose, label, children, wide = false }: { open: boolean; onClose: () => void; label: string; children: ReactNode; wide?: boolean }) {
  const close = useCallback(() => onClose(), [onClose]);
  useEscape(open, close);
  const ref = useFocusTrap<HTMLDivElement>(open);
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);
  if (!open) return null;
  // Portal to <body> so the drawer escapes <main>'s stacking context (page-transition animation)
  // and always sits above the sticky header.
  return createPortal(
    <div className="drawer" role="presentation">
      <div className="drawer__backdrop" onClick={close} />
      <div className={`drawer__panel ${wide ? 'drawer__panel--wide' : ''}`} role="dialog" aria-modal="true" aria-label={label} ref={ref}>
        <button type="button" className="icon-btn drawer__close" onClick={close} aria-label="Close" data-autofocus>
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ---------------- Related / contextual links ---------------- */

export function LinkList({ links, className = '' }: { links: LinkRef[]; className?: string }) {
  return (
    <ul className={`link-list ${className}`}>
      {links.map((l) => (
        <li key={l.label + l.to}>
          <SmartLink to={l.to} className="text-link">{l.label} <Icon name="arrow" size={16} className="arrow-move" /></SmartLink>
        </li>
      ))}
    </ul>
  );
}

export function ContextSupport({ items }: { items: { icon: IconName; title: string; text: string; to?: string; sap?: boolean }[] }) {
  return (
    <div className="support-grid">
      {items.map((it) =>
        it.sap ? <SapLinkCard key={it.title} /> : (
          <SmartLink key={it.title} to={it.to!} className="support-card" data-reveal>
            <span className="support-card__icon"><Icon name={it.icon} /></span>
            <strong>{it.title}</strong>
            <span className="muted">{it.text}</span>
            <span className="text-link">Open <Icon name="arrow" size={16} className="arrow-move" /></span>
          </SmartLink>
        ),
      )}
    </div>
  );
}

/* ---------------- SAP link (placeholder until verified) ---------------- */

export function SapLinkCard() {
  const has = !!LINKS.sapSuccessFactors.url;
  const inner = (
    <>
      <span className="support-card__icon support-card__icon--sap">SAP</span>
      <strong>SAP SuccessFactors</strong>
      <span className="muted">{SAP_FORM_LOCATION}</span>
      {has ? (
        <span className="text-link">Open SAP SuccessFactors <Icon name="external" size={16} /></span>
      ) : (
        <span className="placeholder-link" title="An official, verified link will be added here">Link placeholder · official URL to be provided</span>
      )}
    </>
  );
  return has ? (
    <a className="support-card" href={LINKS.sapSuccessFactors.url} target="_blank" rel="noreferrer" data-reveal>{inner}</a>
  ) : (
    <div className="support-card support-card--static" data-reveal>{inner}</div>
  );
}

export function SupportContact() {
  return (
    <p className="muted small">
      Questions about the process or SAP support? Contact <a className="text-link-inline" href={`mailto:${SUPPORT.email}`}>{SUPPORT.email}</a> or your local HR team.
    </p>
  );
}

/* ---------------- Role-aware toggle (local tab between employee/manager content) ---------------- */

export function RoleTabs({ render }: { render: (r: Role) => ReactNode }) {
  const { role, setRole } = useApp();
  return (
    <div className="role-tabs">
      <div className="seg" role="tablist" aria-label="Choose view">
        {(['employee', 'manager'] as Role[]).map((r) => (
          <button key={r} type="button" role="tab" aria-selected={role === r} className={role === r ? 'is-active' : ''} onClick={() => setRole(r)}>
            <Icon name={r === 'manager' ? 'users' : 'user'} size={16} /> {r === 'manager' ? 'Manager view' : 'Employee view'}
          </button>
        ))}
      </div>
      <div className="role-tabs__panel" role="tabpanel" key={role}>{render(role)}</div>
    </div>
  );
}

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'mint' | 'dark' | 'muted' }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

export function ButtonLink({ to, children, variant = 'primary' }: { to: string; children: ReactNode; variant?: 'primary' | 'ghost' | 'dark' | 'light' }) {
  return <SmartLink to={to} className={`btn btn--${variant}`}>{children}</SmartLink>;
}

export { Link };
