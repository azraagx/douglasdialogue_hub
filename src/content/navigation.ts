import type { PhaseId } from './types';

export const ROUTE_SLUGS = [
  'objective-setting',
  'mid-year',
  'year-end',
  'knowledge-center',
  'ai-prompts',
  'learning-nuggets',
  'competency-goal-guide',
];

export interface NavItem {
  label: string;
  to: string;
  children?: { label: string; to: string; description: string }[];
}

export const PHASE_ROUTES: Record<PhaseId, string> = {
  'objective-setting': '/objective-setting',
  'mid-year': '/mid-year',
  'year-end': '/year-end',
};

export const MAIN_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/' },
  {
    label: 'Dialogue Phases',
    to: '/objective-setting',
    children: [
      { label: 'Objective Setting', to: '/objective-setting', description: 'Turn ambitions into meaningful objectives.' },
      { label: 'Mid-Year Dialogue', to: '/mid-year', description: 'Pause. Reflect. Realign.' },
      { label: 'Year-End Dialogue', to: '/year-end', description: 'Recognise growth. Shape what’s next.' },
    ],
  },
  { label: 'Knowledge Center', to: '/knowledge-center' },
  { label: 'Learning Nuggets', to: '/learning-nuggets' },
  { label: 'AI Prompts', to: '/ai-prompts' },
  { label: 'Competency & Goal Guide', to: '/competency-goal-guide' },
];

/** Breadcrumb trails per route. */
export const BREADCRUMBS: Record<string, { label: string; to?: string }[]> = {
  '/objective-setting': [{ label: 'Home', to: '/' }, { label: 'Dialogue Phases', to: '/#journey' }, { label: 'Objective Setting' }],
  '/mid-year': [{ label: 'Home', to: '/' }, { label: 'Dialogue Phases', to: '/#journey' }, { label: 'Mid-Year Dialogue' }],
  '/year-end': [{ label: 'Home', to: '/' }, { label: 'Dialogue Phases', to: '/#journey' }, { label: 'Year-End Dialogue' }],
  '/knowledge-center': [{ label: 'Home', to: '/' }, { label: 'Resources', to: '/#resources' }, { label: 'Knowledge Center' }],
  '/ai-prompts': [{ label: 'Home', to: '/' }, { label: 'Resources', to: '/#resources' }, { label: 'AI Prompt Library' }],
  '/learning-nuggets': [{ label: 'Home', to: '/' }, { label: 'Resources', to: '/#resources' }, { label: 'Learning Nuggets' }],
  '/competency-goal-guide': [{ label: 'Home', to: '/' }, { label: 'Resources', to: '/#resources' }, { label: 'Competency & Goal Guide' }],
};
