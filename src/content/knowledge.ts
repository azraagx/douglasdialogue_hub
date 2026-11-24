import type { Block, LinkRef, PhaseTag, RoleTag } from './types';

export type ContentType = 'FAQ' | 'Checklist' | 'Process guide' | 'SAP instructions' | 'Competency explanation' | 'Learning reference';

export interface KnowledgeItem {
  id: string;
  type: ContentType;
  title: string;
  phase: PhaseTag;
  role: RoleTag;
  /** Short answer / teaser, always visible when expanded. */
  answer: string;
  body?: Block[];
  related: LinkRef[];
  /** Flags content where local policy must be confirmed. */
  confirmWithHR?: boolean;
  source?: string;
}

export const CONTENT_TYPES: ContentType[] = ['FAQ', 'Process guide', 'Checklist', 'SAP instructions', 'Competency explanation', 'Learning reference'];

/** Twelve base FAQs + supporting knowledge articles. */
export const KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'what-is',
    type: 'FAQ',
    title: 'What is #DOUGLASDialogue?',
    phase: 'all',
    role: 'both',
    answer:
      '#DOUGLASDialogue is the instrument of our feedback culture: a continuous, face-to-face exchange between manager and employee about performance (the “what”), competencies (the “how”) and development.',
    body: [
      { kind: 'p', text: 'It is guided by our values Passion, Appreciation and Ownership, and is supported in SAP SuccessFactors.' },
    ],
    related: [{ label: 'The three phases', to: '/#journey' }],
    source: '#DOUGLASDialogue Booklet',
  },
  {
    id: 'three-phases',
    type: 'FAQ',
    title: 'What are the three dialogue phases?',
    phase: 'all',
    role: 'both',
    answer: 'Objective Setting (October – November), the Mid-Year Dialogue (April – June) and the Year-End Review & Dialogue (September – mid-October).',
    related: [
      { label: 'Objective Setting', to: '/objective-setting' },
      { label: 'Mid-Year Dialogue', to: '/mid-year' },
      { label: 'Year-End Dialogue', to: '/year-end' },
    ],
    source: '#DOUGLASDialogue Booklet · FY 2026/27 communication',
  },
  {
    id: 'participants',
    type: 'FAQ',
    title: 'Who participates in each dialogue?',
    phase: 'all',
    role: 'both',
    answer:
      'Every dialogue is a joint conversation between an employee and their manager. Young Talents (interns, apprentices, dual students, working students) and temporary workers do not take part. For FY 2026/27 the process applies to all country clusters except BENE and PT.',
    body: [
      { kind: 'p', text: 'Employees who join by 1 April set objectives and take part in the cycle. Those who join after 1 April participate from the next fiscal year.' },
      { kind: 'callout', tone: 'note', title: 'Confirm with local HR', text: 'Country-specific participation rules may apply. Check current guidance with your local HR team.' },
    ],
    related: [{ label: 'Objective Setting', to: '/objective-setting' }],
    confirmWithHR: true,
    source: '#DOUGLASDialogue Booklet · FY 2026/27 communication',
  },
  {
    id: 'objective-types',
    type: 'FAQ',
    title: 'What is the difference between Performance and Development Objectives?',
    phase: 'objective-setting',
    role: 'both',
    answer:
      'Performance Objectives are priorities and focus projects for the next 12 months — two to four are defined per person. Development Objectives are optional and focus on personal development, for example when new skills are needed.',
    related: [{ label: 'Competency & Goal Guide', to: '/competency-goal-guide#objectives' }],
    source: '#DOUGLASDialogue Booklet',
  },
  {
    id: 'smart',
    type: 'FAQ',
    title: 'What makes an objective SMART?',
    phase: 'objective-setting',
    role: 'both',
    answer: 'A SMART objective is Specific, Measurable, Achievable, Relevant and Time-bound: it clearly describes what you want to achieve, how success is measured and by when.',
    related: [
      { label: 'SMART Objectives nugget', to: '/learning-nuggets?nugget=smart' },
      { label: 'SMART guide on Objective Setting', to: '/objective-setting#smart' },
    ],
    source: 'FY 2026/27 Objective Setting communication',
  },
  {
    id: 'midyear-adjust',
    type: 'FAQ',
    title: 'Can objectives be adjusted during Mid-Year?',
    phase: 'mid-year',
    role: 'both',
    answer:
      'Yes. If goals are no longer relevant, priorities have shifted or sub-goals are no longer achievable, existing objectives should be revised and new ones can be added. Employee and manager can adjust objectives in the system; the manager confirms new or revised objectives.',
    body: [{ kind: 'callout', tone: 'note', title: 'Special cases', text: 'Deleting objectives (e.g. after an internal job change) follows the current approved process. Confirm details with local HR.' }],
    related: [{ label: 'Objectives & changes', to: '/mid-year#changes' }],
    confirmWithHR: true,
    source: '#DOUGLASDialogue Booklet · Mid-Year FAQ',
  },
  {
    id: 'midyear-final',
    type: 'FAQ',
    title: 'Is Mid-Year a final performance evaluation?',
    phase: 'mid-year',
    role: 'both',
    answer:
      'No. The Mid-Year Dialogue is a structured reflection on the first six months — successes, challenges, changed priorities and support needed. The formal evaluation and final rating happen at Year-End.',
    related: [{ label: 'Mid-Year Dialogue', to: '/mid-year' }],
    source: 'Mid-Year Guideline for Line Managers',
  },
  {
    id: 'prepare-yearend',
    type: 'FAQ',
    title: 'How should I prepare for Year-End?',
    phase: 'year-end',
    role: 'both',
    answer:
      'Employees complete a self-evaluation of Performance Objectives and DOUGLAS Competencies, explaining each rating with a comment. Managers then evaluate, and both discuss and agree on the final rating in a face-to-face dialogue.',
    related: [
      { label: 'Year-End Dialogue', to: '/year-end' },
      { label: 'Feedback nugget', to: '/learning-nuggets?nugget=feedback' },
    ],
    source: '#DOUGLASDialogue Booklet',
  },
  {
    id: 'core-competencies',
    type: 'FAQ',
    title: 'What are Core Competencies?',
    phase: 'all',
    role: 'both',
    answer: 'The four DOUGLAS Core Competencies — Drive Results, Teamwork, Continuous Learning and Embrace Change — define the behaviours and skills that drive our success and shape how we work together.',
    related: [{ label: 'Explore the competencies', to: '/competency-goal-guide#core' }],
    source: 'DOUGLAS Competency slides',
  },
  {
    id: 'leadership-competencies',
    type: 'FAQ',
    title: 'What additional competencies apply to managers?',
    phase: 'all',
    role: 'manager',
    answer: 'Line managers are additionally evaluated on three Leadership Competencies: Integrity, Empowerment and Direction. They set the standards for how we inspire, guide and enable our teams.',
    related: [{ label: 'Leadership Competencies', to: '/competency-goal-guide#leadership' }],
    source: 'DOUGLAS Competency slides',
  },
  {
    id: 'changes',
    type: 'FAQ',
    title: 'What happens if my manager or role changes?',
    phase: 'year-end',
    role: 'both',
    answer:
      'Role change: you discuss the evaluation of your objectives and competencies with your new manager; objectives from both roles may be evaluated. New manager: they take over your existing objectives and can share input from your previous manager. Exit: the Year-End Dialogue can be held voluntarily; open workflows are deactivated.',
    body: [{ kind: 'callout', tone: 'note', title: 'Confirm with local HR', text: 'Exceptions can differ by country. Always check the current, approved local rules.' }],
    related: [{ label: 'Year-End FAQ & exceptions', to: '/year-end#exceptions' }],
    confirmWithHR: true,
    source: '#DOUGLASDialogue Booklet · Year-End FAQ',
  },
  {
    id: 'where-official',
    type: 'FAQ',
    title: 'Where should I complete official process steps?',
    phase: 'all',
    role: 'both',
    answer:
      'All official actions — entering objectives, evaluations and workflow steps — are completed in SAP SuccessFactors. Your #DOUGLASDialogue form is on the homepage under “For You Today” or via the Performance tab.',
    related: [{ label: 'SAP step-by-step', to: '/knowledge-center?item=sap-steps' }],
    source: 'FY 2026/27 Objective Setting communication',
  },

  /* ---- Supporting articles ---- */
  {
    id: 'sap-steps',
    type: 'SAP instructions',
    title: 'SAP SuccessFactors: workflow steps at a glance',
    phase: 'all',
    role: 'both',
    answer: 'The #DOUGLASDialogue form moves through defined workflow steps. These are the buttons you will see in SAP SuccessFactors.',
    body: [
      { kind: 'list', items: [
        'Objective Setting — manager approves objectives and clicks “Send to Mid-Year Dialogue”.',
        'Mid-Year — results documented; manager confirms new or revised objectives.',
        'Year-End self-evaluation — employee clicks “Send to Manager”.',
        'Year-End manager evaluation — manager clicks “Send to Year-End Dialogue”; the rating becomes visible to the employee.',
        'Completion — manager documents the final evaluation and clicks “Send to Completion”.',
      ] },
      { kind: 'callout', tone: 'mint', title: 'Where to find the form', text: 'SAP SuccessFactors homepage → “For You Today”, or via the Performance tab.' },
    ],
    related: [{ label: 'Year-End timeline', to: '/year-end#timeline' }],
    source: '#DOUGLASDialogue Booklet · FY 2026/27 communication',
  },
  {
    id: 'roles',
    type: 'Process guide',
    title: 'Roles & responsibilities',
    phase: 'all',
    role: 'both',
    answer: 'The #DOUGLASDialogue is a joint dialogue. Leaders take overall responsibility for implementing it; employees take responsibility for their own objectives and evaluation.',
    body: [
      { kind: 'p', text: 'Leaders:' },
      { kind: 'list', items: ['Clearly communicate company, department and team objectives and check proposed goals against them.', 'Make sure the dialogue is joint and takes place face-to-face.', 'Give constant, immediate feedback throughout the year — there should be no surprises at Year-End.'] },
      { kind: 'p', text: 'Employees:' },
      { kind: 'list', items: ['Suggest your own objectives and consider your influence on them.', 'Prepare your own evaluation and bring examples.', 'Be clear about your development wishes and actively shape the dialogue.'] },
    ],
    related: [{ label: 'Dashboard', to: '/' }],
    source: '#DOUGLASDialogue Booklet',
  },
  {
    id: 'success-levels',
    type: 'Learning reference',
    title: 'Defining success levels for an objective',
    phase: 'objective-setting',
    role: 'both',
    answer: 'When setting objectives, define what “partially fulfilled”, “fulfilled” and “exceeded” mean. This makes expectations explicit and the Year-End evaluation fairer.',
    body: [
      { kind: 'example', tone: 'clear', label: 'Fictional example', text: 'Objective: launch a monthly team update by 31 March. Partially fulfilled: concept agreed but fewer than three updates held. Fulfilled: monthly updates held from April with feedback collected. Exceeded: format adopted by a neighbouring team.' },
    ],
    related: [{ label: 'SMART guide', to: '/objective-setting#smart' }],
    source: '#DOUGLASDialogue Booklet (concept); example is fictional',
  },
  {
    id: 'midyear-guide',
    type: 'Checklist',
    title: 'Mid-Year conversation structure for line managers',
    phase: 'mid-year',
    role: 'manager',
    answer: 'The recommended structure: 1) review of the first six months, 2) feedback and development, 3) objective adjustment — only if needed.',
    body: [
      { kind: 'list', items: ['Create an open, trusting atmosphere — ideally in person, face-to-face.', 'Use concrete examples for feedback.', 'Encourage dialogue and let the employee actively contribute.', 'Document results in SAP SF and update objectives as discussed.'] },
    ],
    related: [{ label: 'Mid-Year preparation cards', to: '/mid-year#prepare' }],
    source: 'Mid-Year Guideline for Line Managers',
  },
  {
    id: 'evaluation',
    type: 'Competency explanation',
    title: 'How the overall evaluation is structured',
    phase: 'year-end',
    role: 'both',
    answer: 'According to the #DOUGLASDialogue Booklet, Performance Objectives account for 40% and DOUGLAS Competencies for 60% of the overall evaluation. For leaders, competencies split into Core (30%) and Leadership (30%).',
    body: [{ kind: 'callout', tone: 'note', title: 'Subject to confirmation', text: 'Weighting and scale are subject to HR confirmation for the current process year. This hub does not calculate ratings.' }],
    related: [{ label: 'Rating guidance', to: '/competency-goal-guide#rating' }],
    confirmWithHR: true,
    source: '#DOUGLASDialogue Booklet',
  },
];
