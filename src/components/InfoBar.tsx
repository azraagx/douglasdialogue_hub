import { PHASES } from '../content/phases';
import { PHASE_WINDOWS, CYCLE } from '../content/config';
import { currentPhase } from '../lib/phase';
import { SmartLink } from './SmartLink';

/** Slim mint service bar above the header — mirrors the DOUGLAS shop's announcement bar. */
export function InfoBar() {
  const now = currentPhase();
  const phase = PHASES.find((p) => p.id === now.id)!;
  return (
    <div className="info-bar">
      <p>
        <span className="info-bar__muted">#DOUGLASDialogue {CYCLE.label}</span>
        <span aria-hidden="true" className="info-bar__sep" />
        <SmartLink to={`/${now.id}`}>
          {now.state === 'active' ? 'Current phase' : 'Next phase'}: {phase.title} · {PHASE_WINDOWS[now.id].display}
        </SmartLink>
        <span aria-hidden="true" className="info-bar__sep info-bar__hide-s" />
        <span className="info-bar__hide-s">Learn here. Complete official steps in SAP SuccessFactors.</span>
      </p>
    </div>
  );
}
