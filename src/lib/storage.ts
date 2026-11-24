/** Safe wrappers — storage may be unavailable (private mode, blocked site data). */
export function read<T>(store: 'local' | 'session', key: string, fallback: T): T {
  try {
    const s = store === 'local' ? window.localStorage : window.sessionStorage;
    const raw = s.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function write(store: 'local' | 'session', key: string, value: unknown) {
  try {
    const s = store === 'local' ? window.localStorage : window.sessionStorage;
    s.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
