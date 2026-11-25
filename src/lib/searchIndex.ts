import { KNOWLEDGE } from '../content/knowledge';
import { PROMPTS } from '../content/prompts';
import { NUGGETS } from '../content/nuggets';
import { COMPETENCIES } from '../content/competencies';
import { blockText } from './text';
import { isVisibleFor, type Role, type RoleTag } from '../content/types';

export type SearchGroup = 'Pages' | 'FAQs & guides' | 'Copilot prompts' | 'Learning Nuggets' | 'Competencies';

export interface SearchEntry {
  id: string;
  group: SearchGroup;
  title: string;
  /** Short line shown under the title. */
  summary: string;
  to: string;
  /** Extra words that should find this entry (synonyms, German terms, abbreviations). */
  keywords: string;
  /** Full text, searched with lower weight. */
  body: string;
  /** Which role view may see this entry (default: everyone). */
  role?: RoleTag;
}

/** Pages and key sections — so a search can jump straight to the right place. */
const PAGES: Omit<SearchEntry, 'group' | 'body'>[] = [
  { id: 'p-dash', title: 'Dialogue Dashboard', summary: 'Your phases, next steps and resources', to: '/', keywords: 'home start overview dashboard next steps what should i do now' },
  { id: 'p-os', title: 'Objective Setting', summary: 'Phase 01 · Turn ambitions into meaningful objectives', to: '/objective-setting', keywords: 'phase 01 goals ziele zielsetzung objectives october november' },
  { id: 'p-os-smart', title: 'SMART objectives guide', summary: 'Objective Setting · Specific, Measurable, Achievable, Relevant, Time-bound', to: '/objective-setting#smart', keywords: 'smart specific measurable achievable relevant time-bound example' },
  { id: 'p-os-check', title: 'Objective Setting checklist', summary: 'Objective Setting · Role-based checklist', to: '/objective-setting#checklist', keywords: 'checklist to do tasks aufgaben' },
  { id: 'p-os-types', title: 'Performance & Development Objectives', summary: 'Objective Setting · Two kinds of objectives', to: '/objective-setting#types', keywords: 'performance development objective types 2-4 optional' },
  { id: 'p-my', title: 'Mid-Year Dialogue', summary: 'Phase 02 · Pause. Reflect. Realign.', to: '/mid-year', keywords: 'phase 02 midyear mid year halbjahr april june progress' },
  { id: 'p-my-prep', title: 'Mid-Year conversation preparation', summary: 'Mid-Year · Questions for employees and managers', to: '/mid-year#prepare', keywords: 'prepare preparation questions conversation guide line managers' },
  { id: 'p-my-change', title: 'Adjusting objectives at Mid-Year', summary: 'Mid-Year · Review, adjust, add, confirm in SAP', to: '/mid-year#changes', keywords: 'change adjust add delete objectives revise' },
  { id: 'p-ye', title: 'Year-End Dialogue', summary: 'Phase 03 · Reflect, recognise growth, shape what’s next', to: '/year-end', keywords: 'phase 03 yearend year end jahresende annual review september october' },
  { id: 'p-ye-time', title: 'Year-End four steps', summary: 'Year-End · Self-evaluation, manager evaluation, dialogue, completion', to: '/year-end#timeline', keywords: 'self evaluation self-assessment manager evaluation completion timeline deadline' },
  { id: 'p-ye-exc', title: 'Special situations', summary: 'Year-End · New starters, role change, new manager, exits', to: '/year-end#exceptions', keywords: 'new starter role change new manager exit leaving exceptions' },
  { id: 'p-kc', title: 'Knowledge Center', summary: 'FAQs, guides, checklists and SAP help', to: '/knowledge-center', keywords: 'faq help questions answers wissen' },
  { id: 'p-ai', title: 'AI Prompt Library', summary: 'Curated Microsoft Copilot prompts', to: '/ai-prompts', keywords: 'ai copilot prompts ki' },
  { id: 'p-ln', title: 'Learning Nuggets', summary: 'Three lessons in five minutes or less', to: '/learning-nuggets', keywords: 'learning training lernen nuggets microlearning' },
  { id: 'p-cg', title: 'Competency & Goal Guide', summary: 'Objectives, seven competencies and ratings', to: '/competency-goal-guide', keywords: 'competencies kompetenzen goals guide' },
  { id: 'p-cg-rating', title: 'Rating & evaluation framework', summary: 'Competency & Goal Guide · Weighting and scale', to: '/competency-goal-guide#rating', keywords: 'rating weighting 40 60 percent scale evaluation bewertung not fulfilled partially exceeded' },
];

let cache: SearchEntry[] | null = null;

export function getIndex(): SearchEntry[] {
  if (cache) return cache;
  cache = [
    ...PAGES.map((p) => ({ ...p, group: 'Pages' as const, body: '' })),
    ...KNOWLEDGE.map((k) => ({
      id: `k-${k.id}`,
      group: 'FAQs & guides' as const,
      title: k.title,
      summary: `${k.type} · ${k.answer}`,
      to: `/knowledge-center?item=${k.id}`,
      keywords: k.type,
      role: k.role,
      body: `${k.answer} ${blockText(k.body ?? [])}`,
    })),
    ...PROMPTS.map((p) => ({
      id: `pr-${p.id}`,
      group: 'Copilot prompts' as const,
      title: p.title,
      summary: p.description,
      to: `/ai-prompts?prompt=${p.id}`,
      keywords: `${p.category} ${p.role} ${p.phase} copilot prompt ai`,
      body: p.text,
      role: p.role,
    })),
    ...NUGGETS.map((n) => ({
      id: `n-${n.id}`,
      group: 'Learning Nuggets' as const,
      title: n.title,
      summary: `${n.minutes} min · ${n.description}`,
      to: `/learning-nuggets?nugget=${n.id}`,
      keywords: `${n.category} nugget learning`,
      body: n.sections.map((s) => `${s.title} ${blockText(s.blocks)}`).join(' '),
    })),
    ...COMPETENCIES.map((c) => ({
      id: `c-${c.id}`,
      group: 'Competencies' as const,
      title: c.name,
      summary: `${c.group === 'core' ? 'Core' : 'Leadership'} Competency · ${c.definition}`,
      to: `/competency-goal-guide?competency=${c.id}`,
      keywords: `${c.group} competency kompetenz`,
      body: `${c.behaviours.join(' ')} ${c.whyItMatters}`,
    })),
  ];
  return cache;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Every word must match somewhere; title and keyword hits rank higher. */
export function search(query: string, role: Role, limit = 24): SearchEntry[] {
  const words = norm(query).split(/[^a-z0-9%-]+/).filter((w) => w.length > 1 || /\d/.test(w));
  if (!words.length) return [];
  const scored: { e: SearchEntry; score: number }[] = [];
  for (const e of getIndex()) {
    if (e.role && !isVisibleFor(e.role, role)) continue;
    const title = norm(e.title), kw = norm(`${e.keywords} ${e.summary}`), body = norm(e.body);
    let score = 0;
    let all = true;
    for (const w of words) {
      if (title.includes(w)) score += title.startsWith(w) ? 12 : 8;
      else if (kw.includes(w)) score += 4;
      else if (body.includes(w)) score += 1;
      else { all = false; break; }
    }
    if (all) scored.push({ e, score: score + (e.group === 'Pages' ? 1 : 0) });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.e);
}

export const POPULAR_SEARCHES = ['SMART objectives', 'Mid-Year preparation', 'Year-End self-evaluation', 'Competencies', 'SAP SuccessFactors', 'Feedback'];
