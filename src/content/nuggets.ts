import type { Block, LinkRef } from './types';

export interface NuggetSection { title: string; blocks: Block[] }

export interface Nugget {
  id: string;
  title: string;
  description: string;
  minutes: number;
  category: string;
  image: string;
  imageAlt: string;
  sections: NuggetSection[];
  checklist?: string[];
  related: LinkRef[];
}

export const NUGGETS: Nugget[] = [
  {
    id: 'smart',
    title: 'How to write a SMART objective',
    description: 'Turn a good intention into an objective everyone understands — and can measure.',
    minutes: 4,
    category: 'Objective Setting',
    image: 'img/portrait-mint.jpg',
    imageAlt: 'Portrait of a smiling DOUGLAS colleague in front of a mint background',
    sections: [
      {
        title: 'Why clear objectives matter',
        blocks: [
          { kind: 'p', text: 'Objectives create a shared understanding of what success looks like. They are the foundation for regular check-ins, the Mid-Year Dialogue and the Year-End evaluation.' },
          { kind: 'p', text: 'A good objective clearly describes what you want to achieve, how success will be measured and by when.' },
        ],
      },
      {
        title: 'What SMART means',
        blocks: [
          { kind: 'list', items: [
            'Specific — describe the result you want to achieve.',
            'Measurable — define clear indicators or criteria for success.',
            'Achievable — set an ambitious but realistic objective.',
            'Relevant — connect it to your role and business priorities.',
            'Time-bound — agree on a clear deadline.',
          ] },
        ],
      },
      {
        title: 'From unclear to clear',
        blocks: [
          { kind: 'example', tone: 'unclear', label: 'Unclear', text: 'Improve team communication.' },
          { kind: 'example', tone: 'clear', label: 'Clearer', text: 'Introduce a monthly team update and collect feedback after each session through the end of Q2.' },
          { kind: 'callout', tone: 'mint', title: 'Go one step further', text: 'Agree on what “partially fulfilled”, “fulfilled” and “exceeded” would mean. It makes the Year-End conversation easier and fairer.' },
        ],
      },
    ],
    checklist: [
      'Would someone else understand exactly what I want to achieve?',
      'Can I tell — with numbers or clear criteria — when it’s done?',
      'Is it ambitious, yet realistic with my resources?',
      'Does it connect to team or company priorities?',
      'Is there a clear deadline?',
    ],
    related: [{ label: 'Objective Setting', to: '/objective-setting' }, { label: 'Competency & Goal Guide', to: '/competency-goal-guide#objectives' }, { label: 'SMART Copilot prompt', to: '/ai-prompts?category=Objective%20writing' }],
  },
  {
    id: 'prepare',
    title: 'Preparing for a Dialogue',
    description: 'Five quiet minutes of preparation make every conversation more meaningful.',
    minutes: 5,
    category: 'Mid-Year & Year-End',
    image: 'img/duo-mint.jpg',
    imageAlt: 'Two DOUGLAS colleagues smiling side by side in front of a mint background',
    sections: [
      {
        title: 'Reflect on achievements',
        blocks: [
          { kind: 'p', text: 'Go through your objectives one by one. What has been achieved — fully or partially? Note concrete results and examples rather than general impressions.' },
        ],
      },
      {
        title: 'Identify discussion topics',
        blocks: [
          { kind: 'list', items: ['Challenges that slowed you down', 'Priorities that have changed', 'Projects or tasks coming up'] },
        ],
      },
      {
        title: 'Prepare useful questions',
        blocks: [
          { kind: 'p', text: 'Open questions lead to better conversations. For example:' },
          { kind: 'list', items: ['“What would success look like for the second half of the year?”', '“Where do you see my biggest strength right now?”', '“What support could help me reach this objective?”'] },
        ],
      },
      {
        title: 'Recognise development needs',
        blocks: [
          { kind: 'p', text: 'Think about skills that would help you in your current role or a next step. Development can happen on the job (new tasks, projects), off the job (trainings, self-learning) or through reflection and feedback.' },
        ],
      },
      {
        title: 'Make the conversation meaningful',
        blocks: [
          { kind: 'callout', tone: 'mint', title: 'Our guidelines for the dialogue', text: 'Passion — discuss goals with enthusiasm. Appreciation — acknowledge achievements respectfully. Ownership — take responsibility for your objectives and follow-through.' },
        ],
      },
    ],
    related: [{ label: 'Mid-Year Dialogue', to: '/mid-year#prepare' }, { label: 'Mid-Year reflection prompt', to: '/ai-prompts?phase=mid-year' }],
  },
  {
    id: 'feedback',
    title: 'Giving Meaningful Feedback',
    description: 'Specific, observable and forward-looking — feedback that helps people grow.',
    minutes: 4,
    category: 'Leadership & Year-End',
    image: 'img/team-men.jpg',
    imageAlt: 'Four DOUGLAS colleagues sitting together and smiling',
    sections: [
      {
        title: 'Be specific',
        blocks: [
          { kind: 'example', tone: 'unclear', label: 'Vague', text: '“Your presentations are good.”' },
          { kind: 'example', tone: 'clear', label: 'Specific', text: '“In last month’s team update, your summary of the three key figures made the decision easy for everyone.”' },
        ],
      },
      {
        title: 'Refer to observable situations',
        blocks: [{ kind: 'p', text: 'Describe what you saw or heard, and its effect — not assumptions about intentions or personality.' }],
      },
      {
        title: 'Focus on constructive development',
        blocks: [{ kind: 'p', text: 'Link feedback to objectives and competencies. Balance recognition with one or two clear development areas.' }],
      },
      {
        title: 'Invite the other perspective',
        blocks: [{ kind: 'list', items: ['“How did you experience that situation?”', '“What would you do differently next time?”'] }],
      },
      {
        title: 'Agree on practical next steps',
        blocks: [{ kind: 'callout', tone: 'mint', title: 'No surprises', text: 'Give feedback constantly and immediately throughout the year, so the Year-End Dialogue confirms what has already been discussed.' }],
      },
    ],
    related: [{ label: 'Year-End Dialogue', to: '/year-end' }, { label: 'Leadership Competencies', to: '/competency-goal-guide#leadership' }, { label: 'Feedback prompt', to: '/ai-prompts?category=Feedback' }],
  },
];
