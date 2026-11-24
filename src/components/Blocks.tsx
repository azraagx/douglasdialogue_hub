import type { Block } from '../content/types';
import { Icon } from './Icon';

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'p':
            return <p key={i}>{b.text}</p>;
          case 'list':
            return (
              <ul key={i} className="dot-list">
                {b.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            );
          case 'callout':
            return (
              <div key={i} className={`callout callout--${b.tone ?? 'mint'}`}>
                <Icon name={b.tone === 'note' ? 'info' : 'sparkle'} />
                <div>
                  {b.title && <strong>{b.title}</strong>}
                  <p>{b.text}</p>
                </div>
              </div>
            );
          case 'example':
            return (
              <div key={i} className={`example example--${b.tone}`}>
                <span className="example__label">
                  <Icon name={b.tone === 'clear' ? 'check' : 'close'} size={14} /> {b.label}
                </span>
                <p>{b.text}</p>
              </div>
            );
        }
      })}
    </>
  );
}
