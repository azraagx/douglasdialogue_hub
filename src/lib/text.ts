import type { Block } from '../content/types';

/** Flattens rich-text blocks into plain text (for search). */
export function blockText(blocks: Block[]): string {
  return blocks
    .map((b) => ('items' in b ? b.items.join(' ') : `${'title' in b && b.title ? b.title : ''} ${'label' in b ? b.label : ''} ${b.text}`))
    .join(' ');
}
