/**
 * Competency definitions and behaviours are taken verbatim from the official
 * DOUGLAS Competency slides and Mid-Year Guideline (2025).
 * "Why it matters" and "conversation questions" are educational guidance written
 * for this hub — have HR review them before go-live.
 */
export interface Competency {
  id: string;
  name: string;
  group: 'core' | 'leadership';
  icon: string;
  /** Photo with the competency name already baked in — used as a visual header only. */
  photo?: string;
  photoAlt?: string;
  definition: string;
  behaviours: string[]; // official
  whyItMatters: string;
  questions: string[];
  related: { label: string; to: string }[];
}

export const COMPETENCY_GROUPS = {
  core: {
    title: 'Core Competencies',
    intro: '… define the behaviours and skills that drive our success and shape how we work together.',
    appliesTo: 'Evaluated for all employees',
  },
  leadership: {
    title: 'Leadership Competencies',
    intro: '… set the standards for how we inspire, guide and enable our teams.',
    appliesTo: 'Additionally evaluated for line managers',
  },
};

export const COMPETENCIES: Competency[] = [
  {
    id: 'drive-results',
    name: 'Drive Results',
    group: 'core',
    icon: 'icons/drive-results.png',
    definition: 'Taking ownership of objectives and seeing them through to completion.',
    behaviours: ['Own objectives and tasks', 'Make decisions and prioritise effectively', 'Solve challenges and ensure completion'],
    whyItMatters: 'Clear ownership turns objectives into outcomes — and makes progress visible in every dialogue.',
    questions: ['Which result am I most proud of, and what did I personally contribute?', 'How did I decide what to prioritise when time was short?', 'Which challenge did I resolve, and how?'],
    related: [{ label: 'SMART Objectives nugget', to: '/learning-nuggets?nugget=smart' }, { label: 'Objective Setting', to: '/objective-setting' }],
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    group: 'core',
    icon: 'icons/teamwork.png',
    definition: 'Building cooperation and trust to achieve shared success.',
    behaviours: ['Encourage cooperation, trust and a positive work environment', 'Work effectively with others and look beyond own goals to achieve shared success', 'Foster commitment and team spirit'],
    whyItMatters: 'Many of our results depend on colleagues across teams, stores and countries working as one.',
    questions: ['When did I help a colleague or team succeed beyond my own goals?', 'How did I contribute to a positive team atmosphere?', 'What could make our collaboration even better?'],
    related: [{ label: 'Preparing for a Dialogue nugget', to: '/learning-nuggets?nugget=prepare' }],
  },
  {
    id: 'continuous-learning',
    name: 'Continuous Learning',
    group: 'core',
    icon: 'icons/continuous-learning.png',
    photo: 'img/comp-continuous-learning.jpg',
    photoAlt: 'Continuous Learning — a colleague using a learning app on a smartphone',
    definition: 'Growing knowledge and skills and staying curious about what’s next.',
    behaviours: ['Continuously enhance knowledge and skills', 'Stay current with market and industry trends', 'Proactively seek opportunities for personal and professional growth'],
    whyItMatters: 'Beauty and retail move fast. Learning keeps us — and our customers’ experience — ahead.',
    questions: ['What new skill or knowledge did I build this year?', 'Which trend or insight changed how I work?', 'What learning opportunity would I like to pursue next?'],
    related: [{ label: 'Development Objectives', to: '/competency-goal-guide#objectives' }, { label: 'Learning Nuggets', to: '/learning-nuggets' }],
  },
  {
    id: 'embrace-change',
    name: 'Embrace Change',
    group: 'core',
    icon: 'icons/embrace-change.png',
    photo: 'img/comp-embrace-change.jpg',
    photoAlt: 'Embrace Change — two colleagues smiling at a computer screen in the office',
    definition: 'Meeting new ideas and conditions with a positive, agile attitude.',
    behaviours: ['Adapt to new ideas, processes or conditions with a positive attitude', 'Be willing to let go of old methods and strive to be better every day', 'Stay agile in learning and applying new approaches'],
    whyItMatters: 'Changing priorities are normal — the Mid-Year Dialogue exists precisely to realign.',
    questions: ['Which change did I adapt to this year, and how?', 'What old habit did I let go of to work better?', 'Where could I try a new approach next?'],
    related: [{ label: 'Mid-Year Dialogue', to: '/mid-year' }],
  },
  {
    id: 'integrity',
    name: 'Integrity',
    group: 'leadership',
    icon: 'icons/integrity.png',
    photo: 'img/comp-integrity.jpg',
    photoAlt: 'Integrity — a DOUGLAS leader speaking on stage to an audience',
    definition: 'Acting consistently, honestly and fairly as a leader.',
    behaviours: ['Show consistency between words, actions and values', 'Be honest, transparent and trustworthy', 'Act in a fair and ethical manner'],
    whyItMatters: 'Trust is the foundation of an open dialogue — and of fair evaluation.',
    questions: ['Where did my actions visibly match what I communicated?', 'How transparent was I about decisions affecting the team?', 'Would my team describe my evaluations as fair?'],
    related: [{ label: 'Giving Meaningful Feedback nugget', to: '/learning-nuggets?nugget=feedback' }],
  },
  {
    id: 'empowerment',
    name: 'Empowerment',
    group: 'leadership',
    icon: 'icons/empowerment.png',
    photo: 'img/comp-empowerment.jpg',
    photoAlt: 'Empowerment — three DOUGLAS store colleagues applauding in a store',
    definition: 'Energising people and enabling them to grow and decide.',
    behaviours: ['Show enthusiasm and optimism to energise others and strengthen motivation', 'Encourage autonomy and ownership in decision making', 'Enable individuals to realise their full potential'],
    whyItMatters: 'Empowered teams own their objectives — and grow through them.',
    questions: ['Where did I give a team member more ownership this year?', 'How did I support individual development?', 'What motivates each person in my team?'],
    related: [{ label: 'Mid-Year conversation guide', to: '/mid-year#prepare' }],
  },
  {
    id: 'direction',
    name: 'Direction',
    group: 'leadership',
    icon: 'icons/direction.png',
    photo: 'img/comp-direction.jpg',
    photoAlt: 'Direction — a large DOUGLAS audience applauding at a company event',
    definition: 'Providing clarity, orientation and alignment with business priorities.',
    behaviours: ['Set and articulate a clear direction for the team', 'Provide clarity and guidance in uncertain or complex situations', 'Align actions with business priorities'],
    whyItMatters: 'Clear direction makes objectives meaningful — everyone sees how they contribute.',
    questions: ['Does every team member know how their objectives connect to our priorities?', 'How did I guide the team through uncertainty?', 'Where do we need more clarity next year?'],
    related: [{ label: 'Objective Setting for managers', to: '/objective-setting#steps' }],
  },
];

/** Evaluation framework — from the #DOUGLASDialogue Booklet ("Fair Evaluation"). Requires confirmation for the current cycle. */
export const RATING = {
  status: 'Based on the #DOUGLASDialogue Booklet. Weighting and scale are subject to HR confirmation for the current process year.',
  scale: [
    { label: 'Not fulfilled', text: 'The agreed objective or expected behaviour was not achieved.' },
    { label: 'Partially fulfilled', text: 'The objective was achieved in part, as defined when the objective was set.' },
    { label: 'Requirements fulfilled', text: 'The objective or expected behaviour was achieved as agreed.' },
    { label: 'Exceeded', text: 'Results clearly went beyond what was agreed.' },
  ],
  weighting: {
    employee: [
      { label: 'Performance Objectives', value: 40, note: 'Each Performance Objective is weighted the same.' },
      { label: 'DOUGLAS Competencies', value: 60, note: 'Each competency is weighted the same.' },
    ],
    manager: [
      { label: 'Performance Objectives', value: 40, note: 'Each Performance Objective is weighted the same.' },
      { label: 'Core Competencies', value: 30, note: 'Four Core Competencies.' },
      { label: 'Leadership Competencies', value: 30, note: 'Integrity, Empowerment, Direction.' },
    ],
  },
};
