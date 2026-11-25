export type Role = 'employee' | 'manager';
export type RoleTag = Role | 'both';
export type PhaseId = 'objective-setting' | 'mid-year' | 'year-end';
export type PhaseTag = PhaseId | 'all';

/** Tiny rich-text helper: strings, or lists. Keeps content editable without HTML. */
export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'callout'; title?: string; text: string; tone?: 'mint' | 'note' }
  | { kind: 'example'; label: string; text: string; tone: 'unclear' | 'clear' };

export interface LinkRef {
  label: string;
  to: string; // internal route, optionally with ?query or #anchor
}

export interface ChecklistItem {
  id: string;
  text: string;
  hint?: string;
}

/** True if content tagged with `tag` should be shown in the given role view. */
export const isVisibleFor = (tag: RoleTag, role: Role) => tag === 'both' || tag === role;
