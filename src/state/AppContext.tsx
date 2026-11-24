import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../content/types';
import { read, write } from '../lib/storage';

interface Locale { language: string; country: string }

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Demo checklist state — fictional, stored only in this browser. */
  checked: Record<string, boolean>;
  toggleCheck: (id: string) => void;
  resetChecks: (ids: string[]) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  announce: (msg: string) => void;
  liveMessage: string;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => read('session', 'ddh.role', 'employee'));
  const [locale, setLocaleState] = useState<Locale>(() => read('local', 'ddh.locale', { language: 'en', country: 'global' }));
  const [checked, setChecked] = useState<Record<string, boolean>>(() => read('local', 'ddh.demo-checklists', {}));
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [liveMessage, setLive] = useState('');

  const announce = useCallback((msg: string) => {
    setLive('');
    window.setTimeout(() => setLive(msg), 40);
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    write('session', 'ddh.role', r);
    announce(`Now showing the ${r === 'manager' ? 'Manager' : 'Employee'} view.`);
  }, [announce]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    write('local', 'ddh.locale', l);
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      write('local', 'ddh.demo-checklists', next);
      return next;
    });
  }, []);

  const resetChecks = useCallback((ids: string[]) => {
    setChecked((prev) => {
      const next = { ...prev };
      ids.forEach((i) => delete next[i]);
      write('local', 'ddh.demo-checklists', next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ role, setRole, locale, setLocale, checked, toggleCheck, resetChecks, assistantOpen, setAssistantOpen, announce, liveMessage }),
    [role, setRole, locale, setLocale, checked, toggleCheck, resetChecks, assistantOpen, announce, liveMessage],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
}
