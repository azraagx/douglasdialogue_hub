import { PHASE_WINDOWS } from '../content/config';
import type { PhaseId } from '../content/types';

export interface PhaseStatus { id: PhaseId; state: 'active' | 'upcoming' | 'between' }

/**
 * Determines the current phase from the configured calendar (content/config.ts).
 * This is calendar orientation only — never a personal SAP completion status.
 */
export function currentPhase(today = new Date()): PhaseStatus {
  const order: PhaseId[] = ['objective-setting', 'mid-year', 'year-end'];
  const t = today.toISOString().slice(0, 10);
  for (const id of order) {
    const w = PHASE_WINDOWS[id];
    if (t >= w.start && t <= w.end) return { id, state: 'active' };
  }
  const upcoming = order
    .map((id) => ({ id, start: PHASE_WINDOWS[id].start }))
    .filter((p) => p.start > t)
    .sort((a, b) => a.start.localeCompare(b.start))[0];
  return { id: upcoming?.id ?? 'objective-setting', state: 'upcoming' };
}
