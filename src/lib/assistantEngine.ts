import { ASSISTANT_COPY, INTENTS } from '../content/assistant';
import { NEXT_STEPS, PHASES } from '../content/phases';
import { PHASE_WINDOWS } from '../content/config';
import type { LinkRef, Role } from '../content/types';
import { currentPhase } from './phase';

export interface AssistantReply { text: string; links: LinkRef[]; matched: boolean }

/**
 * Local keyword/intent matching against approved hub content.
 * Nothing typed here leaves the browser.
 */
export function answer(input: string, role: Role): AssistantReply {
  const q = ` ${input.toLowerCase().replace(/[?!.,]/g, ' ')} `;
  let roleFromText: Role = role;
  if (/\b(i am|i'm|as) a (manager|leader|line manager)\b/.test(q)) roleFromText = 'manager';
  if (/\b(i am|i'm|as) an? employee\b/.test(q)) roleFromText = 'employee';

  let best: { score: number; idx: number } = { score: 0, idx: -1 };
  INTENTS.forEach((intent, idx) => {
    const score = intent.keywords.reduce((s, k) => (q.includes(k) ? s + k.length : s), 0);
    if (score > best.score) best = { score, idx };
  });
  if (best.idx < 0) return { text: ASSISTANT_COPY.fallback, links: [{ label: 'Knowledge Center', to: '/knowledge-center' }], matched: false };

  const intent = INTENTS[best.idx];
  if (intent.reply === '__NOW__') {
    const p = currentPhase();
    const phase = PHASES.find((x) => x.id === p.id)!;
    const w = PHASE_WINDOWS[p.id];
    const steps = NEXT_STEPS[p.id][roleFromText];
    const lead = p.state === 'active'
      ? `According to the configured calendar, ${phase.title} is the current phase (${w.display}).`
      : `The next phase in the configured calendar is ${phase.title} (${w.display}).`;
    return {
      text: `${lead} As ${roleFromText === 'manager' ? 'a manager' : 'an employee'}, focus on: ${steps.map((s) => s.title.toLowerCase()).join('; ')}. Your personal status is always in SAP SuccessFactors.`,
      links: steps.map((s) => ({ label: s.cta, to: s.to })),
      matched: true,
    };
  }
  const text = typeof intent.reply === 'string' ? intent.reply : intent.reply[roleFromText];
  const links = Array.isArray(intent.links) ? intent.links : intent.links[roleFromText];
  return { text, links, matched: true };
}
