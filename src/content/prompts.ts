import type { LinkRef, PhaseId, RoleTag } from './types';

export type PromptCategory = 'Objective writing' | 'Preparation' | 'Reflection' | 'Feedback';

export interface Prompt {
  id: string;
  title: string;
  role: RoleTag;
  phase: PhaseId;
  category: PromptCategory;
  description: string;
  text: string;
  related: LinkRef[];
}

export const PROMPT_CATEGORIES: PromptCategory[] = ['Objective writing', 'Preparation', 'Reflection', 'Feedback'];

export const PRIVACY_NOTE = 'Do not enter personal, confidential or sensitive employee information into AI tools.';

export const PROMPTS: Prompt[] = [
  {
    id: 'improve-smart',
    title: 'Improve a SMART Objective',
    role: 'both',
    phase: 'objective-setting',
    category: 'Objective writing',
    description: 'Turn a vague draft into a specific, measurable and time-bound objective.',
    text: 'Review the following fictional objective using the SMART framework. Identify unclear elements and suggest a more specific, measurable and time-bound version. Do not assume personal employee information.',
    related: [{ label: 'SMART nugget', to: '/learning-nuggets?nugget=smart' }, { label: 'Objective Setting', to: '/objective-setting#smart' }],
  },
  {
    id: 'prepare-os',
    title: 'Prepare for Objective Setting',
    role: 'employee',
    phase: 'objective-setting',
    category: 'Preparation',
    description: 'Get a practical checklist for your objective-setting conversation.',
    text: 'Act as a professional development coach. Give me a practical checklist for preparing an objective-setting conversation, including priorities, expected outcomes and questions to discuss. Use general examples only.',
    related: [{ label: 'Objective Setting checklist', to: '/objective-setting#checklist' }],
  },
  {
    id: 'midyear-reflection',
    title: 'Prepare a Mid-Year Reflection',
    role: 'employee',
    phase: 'mid-year',
    category: 'Reflection',
    description: 'Structure your thoughts on achievements, challenges and support needs.',
    text: 'Create a structured Mid-Year reflection template covering achievements, challenges, changed priorities, learning opportunities and support needs. Do not ask for confidential employee information.',
    related: [{ label: 'Mid-Year preparation', to: '/mid-year#prepare' }],
  },
  {
    id: 'midyear-conversation',
    title: 'Prepare a Mid-Year Conversation',
    role: 'manager',
    phase: 'mid-year',
    category: 'Preparation',
    description: 'Build a supportive agenda for a Mid-Year development discussion.',
    text: 'Create a supportive conversation agenda for a Mid-Year development discussion. Include open questions, progress review, feedback and next steps. Use fictional examples and avoid personal data.',
    related: [{ label: 'Manager conversation guide', to: '/mid-year#prepare' }],
  },
  {
    id: 'feedback',
    title: 'Give Constructive Feedback',
    role: 'manager',
    phase: 'year-end',
    category: 'Feedback',
    description: 'Learn to phrase specific, respectful and actionable feedback.',
    text: 'Explain how to structure specific, respectful and actionable performance feedback using fictional workplace situations. Include examples of constructive phrasing and open-ended follow-up questions.',
    related: [{ label: 'Feedback nugget', to: '/learning-nuggets?nugget=feedback' }, { label: 'Year-End', to: '/year-end' }],
  },
  {
    id: 'yearend-reflection',
    title: 'Prepare for Year-End Reflection',
    role: 'both',
    phase: 'year-end',
    category: 'Reflection',
    description: 'A neutral checklist covering objectives, competencies and development.',
    text: 'Create a neutral preparation checklist for a Year-End dialogue. Include objective review, relevant competencies, achievements, development opportunities and discussion questions. Use no real employee information.',
    related: [{ label: 'Year-End Dialogue', to: '/year-end#views' }, { label: 'Competencies', to: '/competency-goal-guide#core' }],
  },
];
