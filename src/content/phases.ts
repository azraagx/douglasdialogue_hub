import type { ChecklistItem, PhaseId, Role } from './types';

export interface PhaseSummary {
  id: PhaseId;
  number: string;
  title: string;
  short: string;
  tagline: string;
  months: string;
  image: string;
  imageAlt: string;
}

/** Sources: #DOUGLASDialogue Booklet, Mid-Year Guideline (Apr 2025), FY 2026/27 Objective Setting communication. */
export const PHASES: PhaseSummary[] = [
  {
    id: 'objective-setting',
    number: '01',
    title: 'Objective Setting',
    short: 'Set meaningful goals and create clarity for the year ahead.',
    tagline: 'Turn ambitions into meaningful objectives.',
    months: 'October – November',
    image: 'img/objective-office.jpg',
    imageAlt: 'A smiling DOUGLAS colleague working at her desk in a bright office',
  },
  {
    id: 'mid-year',
    number: '02',
    title: 'Mid-Year Dialogue',
    short: 'Reflect on progress, celebrate achievements and realign priorities.',
    tagline: 'Pause. Reflect. Realign.',
    months: 'April – June',
    image: 'img/midyear-colleagues.jpg',
    imageAlt: 'Two DOUGLAS colleagues discussing work together at a screen',
  },
  {
    id: 'year-end',
    number: '03',
    title: 'Year-End Dialogue',
    short: 'Review performance, recognise growth and plan the next steps.',
    tagline: 'Reflect on achievements. Recognise growth. Shape what’s next.',
    months: 'September – October',
    image: 'img/yearend-group.jpg',
    imageAlt: 'Three DOUGLAS colleagues smiling together in front of a mint background',
  },
];

export interface ProcessStep {
  id: string;
  title: string;
  summary: string;
  detail: Record<Role, string[]>;
  sap?: string;
  when?: string;
}

/* ---------------- Objective Setting ---------------- */

export const OBJECTIVE_STEPS: ProcessStep[] = [
  {
    id: 'prepare',
    title: 'Prepare and reflect',
    summary: 'Look at priorities, last year’s learnings and what success should look like.',
    detail: {
      employee: [
        'Review your role, your team’s priorities and learnings from the previous year.',
        'Collect two to four ideas for Performance Objectives and note any development wishes.',
        'Think about how each idea could be measured.',
      ],
      manager: [
        'Consider your team’s priorities: where do you want to go, what are the milestones?',
        'Translate department and company objectives into what each team member can contribute.',
        'Schedule the conversation — it can be part of a regular check-in or jour fixe.',
      ],
    },
  },
  {
    id: 'draft',
    title: 'Draft performance objectives',
    summary: 'Formulate clear, SMART objectives and define success levels.',
    detail: {
      employee: [
        'Write each objective so it states what you want to achieve, how it is measured and by when.',
        'Describe what “partially fulfilled”, “fulfilled” and “exceeded” would mean.',
        'Optionally draft a Development Objective for skills you want to build.',
      ],
      manager: [
        'Support team members who need help turning ideas into SMART objectives.',
        'Check proposed objectives against company, department and team objectives.',
        'Prepare your view on success levels for each objective.',
      ],
    },
  },
  {
    id: 'align',
    title: 'Discuss and align',
    summary: 'Agree on objectives and expectations together.',
    detail: {
      employee: [
        'Present your objectives and development needs openly.',
        'Discuss priorities and agree on aligned objectives with your manager.',
        'Clarify the success levels you have agreed on.',
      ],
      manager: [
        'Review the employee’s objectives and align them with team and company objectives.',
        'Agree on final objectives through open discussion.',
        'Make expectations explicit: what does “fulfilled” look like?',
      ],
    },
  },
  {
    id: 'document',
    title: 'Document in SAP SuccessFactors',
    summary: 'Make sure agreed objectives are recorded in the #DOUGLASDialogue form.',
    detail: {
      employee: [
        'Ensure the agreed objectives are documented in your #DOUGLASDialogue form for 2026/27.',
        'Finalise objectives with SMART criteria and clearly defined success levels.',
      ],
      manager: [
        'Check clarity, SMART criteria and success levels.',
        'Approve and confirm the final objectives.',
        'Click “Send to Mid-Year Dialogue” in SAP to finalise the Objective Setting step.',
      ],
    },
    sap: 'Official actions take place in SAP SuccessFactors only.',
  },
];

/* ---------------- Mid-Year ---------------- */

export const MIDYEAR_STEPS: ProcessStep[] = [
  {
    id: 'reflect',
    title: 'Reflect on progress',
    summary: 'Look back on the first six months of the year.',
    detail: {
      employee: [
        'Which (partial) objectives have you achieved so far?',
        'Note notable successes and the challenges you met.',
      ],
      manager: [
        'Review progress against each agreed objective.',
        'Note successes worth recognising and concrete examples for feedback.',
      ],
    },
  },
  {
    id: 'prepare',
    title: 'Prepare the conversation',
    summary: 'Gather examples, questions and topics you want to raise.',
    detail: {
      employee: [
        'Write down questions and the support you would find helpful.',
        'Consider whether your priorities have changed.',
      ],
      manager: [
        'Schedule a “Mid-Year Dialogue” meeting — ideally in person, face-to-face.',
        'Prepare feedback on strengths and potential areas for improvement.',
      ],
    },
  },
  {
    id: 'discuss',
    title: 'Discuss challenges & opportunities',
    summary: 'Hold an open, constructive dialogue.',
    detail: {
      employee: [
        'Share your view actively and openly.',
        'Talk about development wishes and what would help you succeed.',
      ],
      manager: [
        'Create an open, trusting atmosphere and use concrete examples.',
        'Clarify changed framework conditions, project changes and priorities.',
        'Encourage the employee to actively contribute.',
      ],
    },
  },
  {
    id: 'next',
    title: 'Agree on next steps',
    summary: 'Align objectives for the second half of the year — only if needed.',
    detail: {
      employee: [
        'Agree on any adjustments and the support you need.',
        'Objectives can be adjusted by employee and manager in the system.',
      ],
      manager: [
        'Agree which objectives should be adjusted or expanded, if any.',
        'Document results in SAP SuccessFactors and confirm new or revised objectives.',
      ],
    },
    sap: 'Results and objective updates are documented in SAP SuccessFactors.',
  },
];

export const MIDYEAR_PREP_QUESTIONS: Record<Role, { q: string; hint: string }[]> = {
  employee: [
    { q: 'What have I achieved so far?', hint: 'List results per objective — including partial progress and milestones.' },
    { q: 'Which challenges have I faced?', hint: 'Describe what got in the way and what you tried.' },
    { q: 'Have my priorities changed?', hint: 'Note changed conditions, projects or business priorities since Objective Setting.' },
    { q: 'What support would help me?', hint: 'Be specific: resources, decisions, time, feedback or contacts.' },
    { q: 'What would I like to develop?', hint: 'Skills or experiences you want to grow — on the job, off the job or through reflection.' },
  ],
  manager: [
    { q: 'Which achievements should be recognised?', hint: 'From the Mid-Year Guideline: which notable successes should be highlighted?' },
    { q: 'What barriers can I help remove?', hint: 'Which challenges have arisen, and what support measures help goal achievement?' },
    { q: 'Do the current objectives still reflect business priorities?', hint: 'Clarify changed strategic conditions, project changes and priorities.' },
    { q: 'What feedback is most useful?', hint: 'Which strengths has the employee shown? Where is potential for improvement? Use concrete examples.' },
    { q: 'How can development be supported?', hint: 'What additional tasks or projects are upcoming, and what support is needed?' },
  ],
};

export const MIDYEAR_OBJECTIVE_CHANGES = [
  {
    title: 'Review objectives',
    text: 'Are the objectives still relevant? Have priorities shifted? Are sub-goals no longer achievable due to changed conditions?',
  },
  {
    title: 'Adjust existing objectives',
    text: 'If priorities or conditions have changed, existing objectives should be revised. Employee and manager can adjust objectives in the system.',
  },
  {
    title: 'Add objectives when applicable',
    text: 'New objectives can be added at Mid-Year — for example when additional tasks or projects come up.',
  },
  {
    title: 'Confirm in SAP SuccessFactors',
    text: 'The manager confirms new or revised objectives in SAP. Special cases such as deletions follow the current, approved process — confirm with local HR.',
  },
];

/* ---------------- Year-End ---------------- */

export const YEAREND_STEPS: ProcessStep[] = [
  {
    id: 'self',
    title: 'Employee Self-Evaluation',
    summary: 'Employees reflect on objectives and competencies, gather examples and prepare their assessment.',
    detail: {
      employee: [
        'Evaluate your Performance Objectives and the DOUGLAS Competencies.',
        'Explain each rating with a short comment and concrete examples.',
        'Click “Send to Manager” in SAP when you are done.',
      ],
      manager: [
        'Remind your team that the self-evaluation is the first step.',
        'Your own evaluation follows once the employee has sent the form.',
      ],
    },
    sap: 'SAP action: “Send to Manager”',
  },
  {
    id: 'manager',
    title: 'Manager Evaluation',
    summary: 'Managers review available information, evaluate according to the current framework and prepare feedback.',
    detail: {
      employee: [
        'Your manager evaluates your Performance Objectives and competencies.',
        'As soon as your manager clicks “Send to Year-End Dialogue”, the rating becomes visible to you.',
      ],
      manager: [
        'Evaluate objectives and competencies and explain each rating with a comment.',
        'Prepare concrete, specific feedback and examples.',
        'Click “Send to Year-End Dialogue” when you are done.',
      ],
    },
    sap: 'SAP action: “Send to Year-End Dialogue”',
  },
  {
    id: 'dialogue',
    title: 'Dialogue',
    summary: 'Employee and manager discuss results, achievements, expectations and development.',
    detail: {
      employee: [
        'Present your self-assessment on objectives and competencies.',
        'Discuss differences in view openly and talk about your development.',
      ],
      manager: [
        'Schedule a face-to-face “Year-End Dialogue” meeting.',
        'Reflect on and discuss the evaluation of competencies and objectives.',
        'Give concrete feedback and agree on the final rating together.',
      ],
    },
  },
  {
    id: 'completion',
    title: 'Completion',
    summary: 'The final evaluation is documented and the process is completed in SAP SuccessFactors.',
    detail: {
      employee: ['Your manager documents the final evaluation in SAP.', 'Keep your agreed development ideas in mind for the next Objective Setting.'],
      manager: ['Adjust and document the final evaluation.', 'Click “Send to Completion” in SAP.'],
    },
    sap: 'SAP action: “Send to Completion”',
  },
];

export const YEAREND_REFLECTION: Record<Role, { title: string; items: string[] }[]> = {
  employee: [
    {
      title: 'Reflection questions',
      items: [
        'Which results am I most proud of this year — and why?',
        'Where did I fall short of what we agreed, and what did I learn?',
        'How did I show the four Core Competencies in my daily work?',
        'What would I like to develop next year?',
      ],
    },
    {
      title: 'Collect achievement examples',
      items: [
        'Concrete outcomes per objective, measured against the agreed success levels.',
        'Situations that show Drive Results, Teamwork, Continuous Learning or Embrace Change.',
        'Feedback received from colleagues, customers or partners.',
      ],
    },
    {
      title: 'Self-evaluation preparation',
      items: [
        'Rate each objective and competency on the four-level scale.',
        'Add a short comment explaining each rating.',
        'Note topics you want to discuss in the dialogue.',
      ],
    },
  ],
  manager: [
    {
      title: 'Assessment guidance',
      items: [
        'Base each rating on the agreed objectives and their defined success levels.',
        'Use examples from across the whole year — there should be no surprises at Year-End.',
        'Explain every rating with a comment.',
      ],
    },
    {
      title: 'Competencies & leadership',
      items: [
        'Evaluate the four Core Competencies for every team member.',
        'For people leaders, also evaluate the three Leadership Competencies: Integrity, Empowerment, Direction.',
      ],
    },
    {
      title: 'Constructive feedback preparation',
      items: [
        'Be specific and refer to observable situations.',
        'Balance recognition and development areas.',
        'Prepare open questions that invite the employee’s perspective.',
      ],
    },
  ],
};

/* ---------------- Role-based checklists ---------------- */

export const CHECKLISTS: Record<PhaseId, Record<Role, ChecklistItem[]>> = {
  'objective-setting': {
    employee: [
      { id: 'os-e1', text: 'Review your role and team priorities', hint: 'Include learnings from the previous year.' },
      { id: 'os-e2', text: 'Prepare two to four objective ideas' },
      { id: 'os-e3', text: 'Formulate measurable outcomes and success levels', hint: 'Partially fulfilled · fulfilled · exceeded' },
      { id: 'os-e4', text: 'Align your objectives with your manager' },
      { id: 'os-e5', text: 'Make sure agreed objectives are documented in SAP SuccessFactors' },
    ],
    manager: [
      { id: 'os-m1', text: 'Clarify team priorities and milestones' },
      { id: 'os-m2', text: 'Schedule a conversation with each team member', hint: 'A regular check-in or jour fixe is enough.' },
      { id: 'os-m3', text: 'Support employees in writing SMART objectives' },
      { id: 'os-m4', text: 'Review quality, relevance and alignment' },
      { id: 'os-m5', text: 'Agree on expectations and success levels' },
      { id: 'os-m6', text: 'Approve objectives and click “Send to Mid-Year Dialogue” in SAP', hint: 'By 30 Nov 2026 for FY 2026/27.' },
    ],
  },
  'mid-year': {
    employee: [
      { id: 'my-e1', text: 'Review progress against each objective' },
      { id: 'my-e2', text: 'Note successes and challenges' },
      { id: 'my-e3', text: 'Check whether priorities have changed' },
      { id: 'my-e4', text: 'Prepare questions and support needs' },
      { id: 'my-e5', text: 'Review updated objectives in SAP after the dialogue' },
    ],
    manager: [
      { id: 'my-m1', text: 'Schedule a “Mid-Year Dialogue” meeting with each team member' },
      { id: 'my-m2', text: 'Prepare recognition and concrete feedback examples' },
      { id: 'my-m3', text: 'Check objectives against current business priorities' },
      { id: 'my-m4', text: 'Agree on adjustments and support measures' },
      { id: 'my-m5', text: 'Document results and confirm revised objectives in SAP' },
    ],
  },
  'year-end': {
    employee: [
      { id: 'ye-e1', text: 'Collect examples for each objective and competency' },
      { id: 'ye-e2', text: 'Complete your self-evaluation with comments' },
      { id: 'ye-e3', text: 'Click “Send to Manager” in SAP' },
      { id: 'ye-e4', text: 'Prepare topics and questions for the dialogue' },
      { id: 'ye-e5', text: 'Discuss and agree on development ideas for next year' },
    ],
    manager: [
      { id: 'ye-m1', text: 'Evaluate objectives and competencies with comments' },
      { id: 'ye-m2', text: 'Include Leadership Competencies for people leaders' },
      { id: 'ye-m3', text: 'Click “Send to Year-End Dialogue” in SAP' },
      { id: 'ye-m4', text: 'Hold a face-to-face dialogue and agree on the final rating' },
      { id: 'ye-m5', text: 'Document the final evaluation and click “Send to Completion”' },
    ],
  },
};

/* ---------------- Dashboard: next steps ---------------- */

export interface NextStep { title: string; text: string; to: string; cta: string }

export const NEXT_STEPS: Record<PhaseId, Record<Role, NextStep[]>> = {
  'objective-setting': {
    employee: [
      { title: 'Understand the current phase', text: 'Objective Setting runs until 30 Nov 2026. Learn what it involves.', to: '/objective-setting', cta: 'Open Objective Setting' },
      { title: 'Prepare your objectives', text: 'Draft two to four SMART objectives with clear success levels.', to: '/learning-nuggets?nugget=smart', cta: 'Learn SMART in 4 min' },
      { title: 'Explore useful guidance', text: 'Copy a Copilot prompt to sharpen a fictional draft objective.', to: '/ai-prompts?phase=objective-setting', cta: 'Browse prompts' },
    ],
    manager: [
      { title: 'Prepare your team discussions', text: 'Clarify team priorities and schedule a conversation with each team member.', to: '/objective-setting#checklist', cta: 'Open manager checklist' },
      { title: 'Review objectives & responsibilities', text: 'Check SMART criteria, alignment and success levels, then approve in SAP.', to: '/objective-setting#steps', cta: 'See the four steps' },
      { title: 'Explore rating & leadership guidance', text: 'Understand the competencies and how the evaluation is structured.', to: '/competency-goal-guide#rating', cta: 'Open the guide' },
    ],
  },
  'mid-year': {
    employee: [
      { title: 'Reflect on progress', text: 'Look back on the first six months of the year.', to: '/mid-year#prepare', cta: 'Preparation questions' },
      { title: 'Prepare your conversation', text: 'A five-minute nugget on preparing a meaningful dialogue.', to: '/learning-nuggets?nugget=prepare', cta: 'Start the nugget' },
      { title: 'Find a reflection prompt', text: 'Use Copilot to structure your Mid-Year reflection.', to: '/ai-prompts?phase=mid-year', cta: 'Browse prompts' },
    ],
    manager: [
      { title: 'Schedule Mid-Year Dialogues', text: 'Plan a face-to-face conversation with each team member.', to: '/mid-year#checklist', cta: 'Manager checklist' },
      { title: 'Use the conversation guide', text: 'Questions from the Mid-Year Guideline for Line Managers.', to: '/mid-year#prepare', cta: 'Open the guide' },
      { title: 'Review objective changes', text: 'Understand reviewing, adjusting and confirming objectives.', to: '/mid-year#changes', cta: 'Learn more' },
    ],
  },
  'year-end': {
    employee: [
      { title: 'Prepare your self-evaluation', text: 'Collect examples for objectives and competencies.', to: '/year-end#views', cta: 'Reflection guide' },
      { title: 'Understand the competencies', text: 'Explore the four Core Competencies.', to: '/competency-goal-guide#core', cta: 'Explore competencies' },
      { title: 'Know the four steps', text: 'Self-evaluation, manager evaluation, dialogue, completion.', to: '/year-end#timeline', cta: 'See the timeline' },
    ],
    manager: [
      { title: 'Prepare evaluations', text: 'Assessment guidance and competency information.', to: '/year-end#views', cta: 'Assessment guidance' },
      { title: 'Prepare meaningful feedback', text: 'A four-minute nugget on specific, constructive feedback.', to: '/learning-nuggets?nugget=feedback', cta: 'Start the nugget' },
      { title: 'Understand the rating framework', text: 'Objectives, Core and Leadership Competencies.', to: '/competency-goal-guide#rating', cta: 'Open the guide' },
    ],
  },
};
