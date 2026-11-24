# Maintenance guide

All text lives in `src/content/` as plain TypeScript data. You can edit it without touching layout code.
After any change run `npm run build` and upload the new `dist/` folder.

| What you want to change | File |
|---|---|
| Phase dates, confirmed/indicative status, SAP & Copilot links, support e-mail | `src/content/config.ts` |
| Phase cards, process steps, checklists, Mid-Year questions, dashboard “next steps” | `src/content/phases.ts` |
| FAQs and Knowledge Center articles (search and filters pick them up automatically) | `src/content/knowledge.ts` |
| The six Copilot prompts, categories and the privacy note | `src/content/prompts.ts` |
| The three Learning Nuggets | `src/content/nuggets.ts` |
| Competencies, rating scale and weighting | `src/content/competencies.ts` |
| Dialogue Guide answers, keywords and quick actions | `src/content/assistant.ts` |
| Navigation and breadcrumbs | `src/content/navigation.ts` |
| Languages, countries, UI labels | `src/content/i18n.ts` |
| Photos, icons, logos | `public/media/` |

## Every new cycle
1. Update `PHASE_WINDOWS` in `config.ts` (dates, `display` text, `status: 'confirmed'` once HR has approved).
   The dashboard’s “Current phase” marker is calculated from these dates — it is calendar orientation, never a personal SAP status.
2. Update `CYCLE.label` and `CYCLE.scopeNote`.
3. Review rating weighting/scale in `competencies.ts` (`RATING.status` text says it is subject to confirmation).

## Links that are deliberately empty
`LINKS.sapSuccessFactors.url` and `LINKS.microsoftCopilot.url` are empty, so the site shows a labelled
placeholder. Paste the official, verified URL to activate them.

## Competency video
`COMPETENCY_VIDEO` in `src/pages/CompetencyGuide.tsx`. With an empty `src` the section is hidden.
Add `src`, a `.vtt` captions file and/or a transcript to show it (no autoplay).

## Adding a language
1. Translate the content files (e.g. copy to `src/content/de/`) and add a `UI_STRINGS.de` dictionary.
2. Set `available: true` for the language in `LANGUAGES`.
3. Load the matching content set based on `locale.language` from `useApp()`.
German is listed as “planned” and contains no translation in this version.

## Dialogue Guide (assistant)
Rule-based and fully local (`src/lib/assistantEngine.ts`): keywords → approved answer + links, with a safe fallback.
Nothing typed is sent anywhere. To connect an approved enterprise AI service later, replace `answer()` with a call to an
approved backend after IT and data-protection sign-off. Never put API keys in client code.

## Stored data
Only in the user’s browser: the demo role (session) and demo checklist ticks (`localStorage`, resettable).
No personal or performance data is collected.

## Sources used
#DOUGLASDialogue Booklet · Mid-Year Guideline for Line Managers (Apr 2025) · FY 2026/27 Objective Setting
communication · DOUGLAS Competency slides · DOUGLAS Brandbook 2023. Content marked “indicative” or
“confirm with local HR” still needs HR approval.
