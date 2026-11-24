import { COMPETENCIES, COMPETENCY_GROUPS } from '../content/competencies';
import { useApp } from '../state/AppContext';
import { media } from '../lib/base';
import { Drawer, LinkList } from './ui';
import { Icon } from './Icon';

export function CompetencyDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { role } = useApp();
  const c = COMPETENCIES.find((x) => x.id === id);
  return (
    <Drawer open={!!c} onClose={onClose} label={c ? `${c.name} competency` : 'Competency'}>
      {c && (
        <article className="comp-detail" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) onClose(); }}>
          {c.photo ? (
            // The photo already carries the competency name as large type, so the
            // visible heading is not repeated; an accessible heading remains for screen readers.
            <figure className="comp-detail__photo">
              <img src={media(c.photo)} alt={c.photoAlt} />
            </figure>
          ) : (
            <div className="comp-detail__iconhead">
              <img src={media(c.icon)} alt="" />
            </div>
          )}
          <div className="comp-detail__body">
            <p className="eyebrow">{COMPETENCY_GROUPS[c.group].title} · {COMPETENCY_GROUPS[c.group].appliesTo}</p>
            <h2 className={c.photo ? 'sr-only' : 'h2'}>{c.name}</h2>
            <p className="lead-sm">{c.definition}</p>

            <h3 className="h5">Observable behaviours</h3>
            <ul className="check-list">
              {c.behaviours.map((b) => <li key={b}><Icon name="check" size={16} />{b}</li>)}
            </ul>
            <p className="fine-print">Behaviours from the official DOUGLAS competency framework.</p>

            <h3 className="h5">Why it matters</h3>
            <p>{c.whyItMatters}</p>

            <h3 className="h5">{role === 'manager' ? 'Questions for your dialogue' : 'Questions to reflect on'}</h3>
            <ul className="dot-list">
              {c.questions.map((q) => <li key={q}>{q}</li>)}
            </ul>

            {role === 'manager' && (
              <div className="callout callout--mint">
                <Icon name="users" />
                <div>
                  <strong>Assessment tip for managers</strong>
                  <p>Base your rating on concrete, observed examples from the whole year and explain it with a comment in SAP. Each competency is weighted equally within its group.</p>
                </div>
              </div>
            )}

            <h3 className="h5">Related resources</h3>
            <LinkList links={c.related} />
          </div>
        </article>
      )}
    </Drawer>
  );
}
