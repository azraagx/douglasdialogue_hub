import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { DialogueAssistant } from './components/DialogueAssistant';
import { useApp } from './state/AppContext';
import { t } from './content/i18n';
import { Dashboard } from './pages/Dashboard';
import { ObjectiveSetting } from './pages/ObjectiveSetting';
import { MidYear } from './pages/MidYear';
import { YearEnd } from './pages/YearEnd';
import { KnowledgeCenter } from './pages/KnowledgeCenter';
import { PromptLibrary } from './pages/PromptLibrary';
import { LearningNuggets } from './pages/LearningNuggets';
import { CompetencyGuide } from './pages/CompetencyGuide';
import { NotFound } from './pages/NotFound';
import { InfoBar } from './components/InfoBar';

const TITLES: Record<string, string> = {
  '/': 'Dialogue Dashboard',
  '/objective-setting': 'Objective Setting',
  '/mid-year': 'Mid-Year Dialogue',
  '/year-end': 'Year-End Dialogue',
  '/knowledge-center': 'Knowledge Center',
  '/ai-prompts': 'AI Prompt Library',
  '/learning-nuggets': 'Learning Nuggets',
  '/competency-goal-guide': 'Competency & Goal Guide',
};

/** Scroll handling: top on page change, smooth to #anchor when present. Focus moves to main for screen readers. */
function useRouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    document.title = `${TITLES[pathname] ?? 'Page not found'} · #DOUGLASDialogue Hub`;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (hash) {
      window.setTimeout(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    if (!first.current && !hash) document.getElementById('main')?.focus({ preventScroll: true });
    first.current = false;
  }, [pathname, hash]);
}

export function App() {
  const location = useLocation();
  const { liveMessage } = useApp();
  useRouteEffects();
  return (
    <>
      <a className="skip-link" href="#main">{t('skip')}</a>
      <InfoBar />
      <AppHeader />
      <main id="main" tabIndex={-1} className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/objective-setting" element={<ObjectiveSetting />} />
          <Route path="/mid-year" element={<MidYear />} />
          <Route path="/year-end" element={<YearEnd />} />
          <Route path="/knowledge-center" element={<KnowledgeCenter />} />
          <Route path="/ai-prompts" element={<PromptLibrary />} />
          <Route path="/learning-nuggets" element={<LearningNuggets />} />
          <Route path="/competency-goal-guide" element={<CompetencyGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <AppFooter />
      <DialogueAssistant />
      <div className="sr-only" role="status" aria-live="polite">{liveMessage}</div>
    </>
  );
}
