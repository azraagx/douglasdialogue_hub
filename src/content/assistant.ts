import type { LinkRef, Role } from './types';

/**
 * Guided demo assistant — rule-based, runs entirely in the browser.
 * No input is sent anywhere. To connect an enterprise-approved AI service later,
 * replace `answer()` in lib/assistantEngine.ts with a call to an approved backend
 * (never embed API keys in client code).
 */
export interface Intent {
  id: string;
  /** Lowercase keywords / phrases. Each match adds to the score. */
  keywords: string[];
  reply: Record<Role, string> | string;
  links: LinkRef[] | Record<Role, LinkRef[]>;
}

export const ASSISTANT_COPY = {
  welcome: 'Hi! I’m your Dialogue Guide. What would you like help with?',
  fallback: 'I don’t have verified guidance on that yet. You can explore the Knowledge Center or contact your local HR team.',
  disclosure: 'Guided prototype · Not connected to a live AI model.',
  privacy: 'Please don’t share personal or confidential information.',
};

export const QUICK_ACTIONS = [
  'What should I do now?',
  'Help me understand SMART objectives.',
  'How do I prepare for Mid-Year?',
  'Explain Year-End.',
  'Show manager resources.',
  'Find a Copilot prompt.',
];

export const INTENTS: Intent[] = [
  {
    id: 'now',
    keywords: ['do now', 'next step', 'what should i', 'where am i', 'current phase', 'what now', 'to do'],
    reply: '__NOW__', // computed from the configured calendar + role
    links: [],
  },
  {
    id: 'smart',
    keywords: ['smart', 'write an objective', 'write objective', 'good objective', 'measurable', 'time-bound', 'time bound'],
    reply:
      'A SMART objective is Specific, Measurable, Achievable, Relevant and Time-bound. In short: say what you want to achieve, how success is measured and by when. Example — unclear: “Improve team communication.” Clearer: “Introduce a monthly team update and collect feedback after each session through the end of Q2.”',
    links: [{ label: 'SMART nugget (4 min)', to: '/learning-nuggets?nugget=smart' }, { label: 'SMART guide', to: '/objective-setting#smart' }],
  },
  {
    id: 'sap',
    keywords: ['sap', 'successfactors', 'enter', 'where do i', 'form', 'system', 'document my', 'send to'],
    reply:
      'Official actions are completed in SAP SuccessFactors — this hub only explains them. Your #DOUGLASDialogue form is on the SAP SuccessFactors homepage under “For You Today” or via the Performance tab.',
    links: [{ label: 'SAP workflow steps', to: '/knowledge-center?item=sap-steps' }],
  },
  {
    id: 'midyear',
    keywords: ['mid-year', 'mid year', 'midyear', 'half year', 'six months'],
    reply: {
      employee: 'Mid-Year is a reflection on the first six months — not a final rating. Prepare by asking: What have I achieved? Which challenges did I face? Have priorities changed? What support would help? What would I like to develop?',
      manager: 'Use the recommended structure from the Mid-Year Guideline: 1) review the first six months, 2) feedback and development, 3) adjust objectives only if needed. Create an open atmosphere, use concrete examples and document results in SAP.',
    },
    links: {
      employee: [{ label: 'Mid-Year preparation', to: '/mid-year#prepare' }, { label: 'Preparing for a Dialogue nugget', to: '/learning-nuggets?nugget=prepare' }],
      manager: [{ label: 'Manager conversation guide', to: '/mid-year#prepare' }, { label: 'Objectives & changes', to: '/mid-year#changes' }],
    },
  },
  {
    id: 'yearend',
    keywords: ['year-end', 'year end', 'yearend', 'self-evaluation', 'self evaluation', 'self-assessment', 'final rating', 'annual review'],
    reply: {
      employee: 'Year-End has four steps: your self-evaluation (“Send to Manager”), your manager’s evaluation, the joint dialogue and completion. Prepare by rating each objective and competency with a short comment and concrete examples.',
      manager: 'As a manager, evaluate objectives and competencies with comments (including Leadership Competencies for people leaders), click “Send to Year-End Dialogue”, hold a face-to-face dialogue to agree the final rating, then click “Send to Completion”.',
    },
    links: {
      employee: [{ label: 'Year-End Dialogue', to: '/year-end' }, { label: 'Core Competencies', to: '/competency-goal-guide#core' }],
      manager: [{ label: 'Year-End Dialogue', to: '/year-end#views' }, { label: 'Competency & Goal Guide', to: '/competency-goal-guide#rating' }],
    },
  },
  {
    id: 'manager',
    keywords: ['manager resource', 'manager', 'leader', 'my team', 'line manager', 'leadership'],
    reply: 'Here are the most relevant resources for managers: the Objective Setting manager checklist, the Mid-Year conversation guide, Leadership Competencies and the rating framework. Tip: switch the view to “Manager” at the top to see manager guidance on every page.',
    links: [
      { label: 'Objective Setting — manager steps', to: '/objective-setting#steps' },
      { label: 'Mid-Year conversation guide', to: '/mid-year#prepare' },
      { label: 'Leadership Competencies', to: '/competency-goal-guide#leadership' },
    ],
  },
  {
    id: 'prompt',
    keywords: ['prompt', 'copilot', 'ai ', ' ai', 'chatgpt'],
    reply: 'The AI Prompt Library has six curated Microsoft Copilot prompts — for objective writing, preparation, reflection and feedback. Copy one into your approved Copilot environment, and never include personal or confidential employee information.',
    links: [{ label: 'AI Prompt Library', to: '/ai-prompts' }],
  },
  {
    id: 'feedback-prompt',
    keywords: ['prompt for feedback', 'feedback prompt', 'prompt about feedback', 'prompt on feedback'],
    reply: 'I recommend the curated prompt “Give Constructive Feedback” (Manager · Year-End). Open it in the AI Prompt Library, copy it and paste it into your approved Microsoft Copilot environment. Use fictional situations only — no personal employee data.',
    links: [{ label: 'Open “Give Constructive Feedback”', to: '/ai-prompts?category=Feedback' }, { label: 'All prompts', to: '/ai-prompts' }],
  },
  {
    id: 'feedback',
    keywords: ['feedback', 'constructive', 'criticism'],
    reply: 'Good feedback is specific, refers to observable situations, focuses on development, invites the other person’s view and ends with practical next steps. For a ready-made Copilot prompt, see “Give Constructive Feedback”.',
    links: [{ label: 'Giving Meaningful Feedback nugget', to: '/learning-nuggets?nugget=feedback' }, { label: 'Feedback prompt', to: '/ai-prompts?category=Feedback' }],
  },
  {
    id: 'competencies',
    keywords: ['competenc', 'drive results', 'teamwork', 'continuous learning', 'embrace change', 'integrity', 'empowerment', 'direction'],
    reply: 'There are four Core Competencies for everyone — Drive Results, Teamwork, Continuous Learning and Embrace Change — plus three Leadership Competencies for line managers: Integrity, Empowerment and Direction.',
    links: [{ label: 'Competency & Goal Guide', to: '/competency-goal-guide#core' }],
  },
  {
    id: 'rating',
    keywords: ['rating', 'weight', 'scale', 'percent', '%', 'score', 'evaluat'],
    reply: 'According to the #DOUGLASDialogue Booklet, Performance Objectives count 40% and competencies 60% (for leaders: Core 30%, Leadership 30%). The scale is: not fulfilled, partially fulfilled, requirements fulfilled, exceeded. These figures are subject to HR confirmation for the current year.',
    links: [{ label: 'Rating guidance', to: '/competency-goal-guide#rating' }],
  },
  {
    id: 'objective-setting',
    keywords: ['objective setting', 'set objectives', 'set goals', 'goal setting', 'how many objectives', 'development objective', 'performance objective'],
    reply: 'In Objective Setting you agree on two to four Performance Objectives (plus optional Development Objectives) with your manager. For FY 2026/27 it runs from 15 October to 30 November 2026, and objectives must be documented in SAP SuccessFactors.',
    links: [{ label: 'Objective Setting', to: '/objective-setting' }, { label: 'Objective types', to: '/competency-goal-guide#objectives' }],
  },
  {
    id: 'change',
    keywords: ['new manager', 'manager changes', 'role change', 'job change', 'leave the company', 'leaving', 'exit', 'new starter', 'joined', 'new joiner'],
    reply: 'For changes of role or manager, exits and new starters, the booklet describes general rules (e.g. people joining after 1 April take part from the next fiscal year). Exceptions can differ by country — please confirm with your local HR team.',
    links: [{ label: 'Year-End FAQ & exceptions', to: '/year-end#exceptions' }, { label: 'Knowledge Center', to: '/knowledge-center' }],
  },
];
