/**
 * Localisation scaffold. English is the complete base language.
 * To add a language: add a locale entry with `available: true` and a matching
 * dictionary in UI_STRINGS, then translate content files (see MAINTENANCE.md).
 * German is listed as planned; no translation is included in this version.
 */
export interface LanguageOption { code: string; label: string; nativeLabel: string; available: boolean; note?: string }

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', available: true },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', available: false, note: 'Not available yet' },
];

type Dict = Record<string, string>;
export const UI_STRINGS: Record<string, Dict> = {
  en: {
    'role.label': 'Viewing as',
    'role.employee': 'Employee',
    'role.manager': 'Manager',
    'role.demo': 'Demo view selector — not a login or permission setting.',
    'lang.label': 'Language',
    'assistant.name': 'Dialogue Guide',
    'assistant.sub': 'Your companion for a clearer dialogue.',
    'skip': 'Skip to main content',
  },
};

export const t = (key: string, lang = 'en') => UI_STRINGS[lang]?.[key] ?? UI_STRINGS.en[key] ?? key;
