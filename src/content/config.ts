/**
 * Central configuration. Update dates, links and contacts here once per cycle.
 * `status: 'confirmed'` = taken from current, approved FY 2026/27 communication.
 * `status: 'indicative'` = taken from established process material; confirm for the current year.
 */
export const CYCLE = {
  label: 'FY 2026/27',
  scopeNote:
    'Per the FY 2026/27 kick-off communication, the process applies to all country clusters except BENE and PT. Young Talents (interns, apprentices, dual students, working students) and temporary workers do not take part.',
};

export interface PhaseWindow {
  start: string; // ISO date
  end: string;
  display: string;
  status: 'confirmed' | 'indicative';
  source: string;
}

export const PHASE_WINDOWS: Record<'objective-setting' | 'mid-year' | 'year-end', PhaseWindow> = {
  'objective-setting': {
    start: '2026-10-15',
    end: '2026-11-30',
    display: '15 Oct – 30 Nov 2026',
    status: 'confirmed',
    source: 'Objective Setting kick-off communication FY 2026/27',
  },
  'mid-year': {
    start: '2027-04-01',
    end: '2027-06-30',
    display: 'April – June 2027',
    status: 'indicative',
    source: 'Process & timeline (#DOUGLASDialogue Booklet, Mid-Year Guideline)',
  },
  'year-end': {
    start: '2027-09-01',
    end: '2027-10-15',
    display: '1 Sep – 15 Oct 2027',
    status: 'indicative',
    source: 'Year-End Review & Dialogue timeline (#DOUGLASDialogue Booklet)',
  },
};

/** Year-End step guidance dates from the booklet (indicative). */
export const YEAR_END_STEP_DATES = ['Complete by 15 Sep', 'Complete by 30 Sep', 'Complete by 15 Oct', 'Complete by 15 Oct'];

/**
 * External links. Leave `url` empty until an official, verified destination is supplied.
 * Empty URLs render as clearly labelled placeholders — never as invented links.
 */
export const LINKS = {
  sapSuccessFactors: { label: 'SAP SuccessFactors', url: '' },
  microsoftCopilot: { label: 'Microsoft Copilot', url: '' },
};

export const SUPPORT = {
  email: 'learning@douglas.de',
  note: 'Questions about the process or SAP support — contact named in the FY 2026/27 Objective Setting communication.',
};

export const SAP_FORM_LOCATION =
  'Your #DOUGLASDialogue form is on the SAP SuccessFactors homepage under “For You Today” or via the Performance tab.';
