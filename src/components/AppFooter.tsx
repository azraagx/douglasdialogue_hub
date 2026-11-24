import { Link } from 'react-router-dom';
import { CYCLE, SUPPORT } from '../content/config';
import { media } from '../lib/base';

export function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src={media('brand/douglas-group-logo-white.svg')} alt="DOUGLAS Group" width="120" height="40" className="site-footer__logo" />
          <p className="site-footer__claim">Reflect. Connect. Grow.</p>
          <p className="small">Everything you need for a meaningful #DOUGLASDialogue — all in one place.</p>
        </div>
        <nav aria-label="Dialogue phases">
          <p className="eyebrow">Dialogue phases</p>
          <ul>
            <li><Link to="/objective-setting">Objective Setting</Link></li>
            <li><Link to="/mid-year">Mid-Year Dialogue</Link></li>
            <li><Link to="/year-end">Year-End Dialogue</Link></li>
          </ul>
        </nav>
        <nav aria-label="Resources">
          <p className="eyebrow">Resources</p>
          <ul>
            <li><Link to="/knowledge-center">Knowledge Center</Link></li>
            <li><Link to="/learning-nuggets">Learning Nuggets</Link></li>
            <li><Link to="/ai-prompts">AI Prompt Library</Link></li>
            <li><Link to="/competency-goal-guide">Competency & Goal Guide</Link></li>
          </ul>
        </nav>
        <div>
          <p className="eyebrow">Support</p>
          <p className="small">Learn here. Complete your official actions in SAP SuccessFactors.</p>
          <p className="small"><a href={`mailto:${SUPPORT.email}`}>{SUPPORT.email}</a></p>
        </div>
      </div>
      <div className="container site-footer__legal">
        <p>#DOUGLASDialogue Hub · {CYCLE.label} · Prototype for internal guidance. No personal data is processed or stored; demo checklists stay in your browser.</p>
      </div>
    </footer>
  );
}
