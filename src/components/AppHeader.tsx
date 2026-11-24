import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MAIN_NAV } from '../content/navigation';
import { LANGUAGES, t } from '../content/i18n';
import { SearchPanel, SearchTrigger } from './SearchPanel';
import { useApp } from '../state/AppContext';
import { useEscape, useFocusTrap, useOutside } from '../lib/hooks';
import { media } from '../lib/base';
import { Icon } from './Icon';
import type { Role } from '../content/types';

/* ---------------- Role switcher ---------------- */

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, setRole } = useApp();
  const id = useId();
  const roles: Role[] = ['employee', 'manager'];
  return (
    <div className={`role-switch ${compact ? 'role-switch--compact' : ''}`}>
      <span className="role-switch__label" id={id}>
        {t('role.label')} <span className="role-switch__demo" title={t('role.demo')}>Demo</span>
      </span>
      <div className="role-switch__track" role="radiogroup" aria-labelledby={id} aria-describedby={`${id}-d`} data-role={role}>
        <span className="role-switch__thumb" aria-hidden="true" />
        {roles.map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={role === r}
            className={role === r ? 'is-active' : ''}
            onClick={() => setRole(r)}
            onKeyDown={(e) => {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                const next = r === 'employee' ? 'manager' : 'employee';
                setRole(next);
                (e.currentTarget.parentElement?.querySelector(`[data-r="${next}"]`) as HTMLElement | null)?.focus();
              }
            }}
            data-r={r}
            tabIndex={role === r ? 0 : -1}
          >
            {t(`role.${r}`)}
          </button>
        ))}
      </div>
      <span id={`${id}-d`} className="sr-only">{t('role.demo')}</span>
    </div>
  );
}

/* ---------------- Language (EN available, DE planned) ---------------- */

export function LanguageSelector({ inline = false }: { inline?: boolean }) {
  const { locale, setLocale, announce } = useApp();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const close = useCallback(() => setOpen(false), []);
  const ref = useOutside<HTMLDivElement>(open && !inline, close);
  useEscape(open, close);
  const lang = LANGUAGES.find((l) => l.code === locale.language) ?? LANGUAGES[0];

  const panel = (
    <div className={`lang-panel ${inline ? 'lang-panel--inline' : ''}`} role="group" aria-label="Language">
      <p className="eyebrow">Language</p>
      <ul>
        {LANGUAGES.map((l) => (
          <li key={l.code}>
            <button
              type="button"
              className={`lang-option ${locale.language === l.code ? 'is-selected' : ''}`}
              aria-pressed={locale.language === l.code}
              aria-disabled={!l.available}
              onClick={() => {
                if (!l.available) {
                  const msg = `${l.nativeLabel} is not available yet. The hub is shown in English.`;
                  setNotice(msg);
                  announce(msg);
                  return;
                }
                setLocale({ ...locale, language: l.code });
                setNotice('');
              }}
            >
              <span className="lang-option__name"><b>{l.code.toUpperCase()}</b>{l.nativeLabel}</span>
              {l.available ? (locale.language === l.code && <Icon name="check" size={16} />) : <span className="tag tag--muted">{l.note}</span>}
            </button>
          </li>
        ))}
      </ul>
      {notice && <p className="lang-panel__notice" role="status"><Icon name="info" size={16} /> {notice}</p>}
      <p className="lang-panel__foot">English is the complete base version. German will follow in a later phase.</p>
    </div>
  );

  if (inline) return panel;

  return (
    <div className="lang" ref={ref}>
      <button type="button" className="lang__btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">{lang.code.toUpperCase()}</span>
        <span className="sr-only">Language: {lang.label}. Change language</span>
        <Icon name="chevron" size={12} className={`chev ${open ? 'is-open' : ''}`} />
      </button>
      {open && <div className="popover popover--right">{panel}</div>}
    </div>
  );
}

/* ---------------- Header ---------------- */

export function AppHeader() {
  const location = useLocation();
  const [dropdown, setDropdown] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeDrop = useCallback(() => setDropdown(false), []);
  const dropRef = useOutside<HTMLLIElement>(dropdown, closeDrop);
  useEscape(dropdown, closeDrop);
  const closeMobile = useCallback(() => setMobile(false), []);
  useEscape(mobile, closeMobile);
  const trapRef = useFocusTrap<HTMLDivElement>(mobile);

  useEffect(() => {
    setDropdown(false);
    setMobile(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobile);
  }, [mobile]);

  const phaseActive = ['/objective-setting', '/mid-year', '/year-end'].includes(location.pathname);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <div className="site-header__top">
        <Link to="/" className="brand" aria-label="#DOUGLASDialogue Hub — go to Dashboard">
          <img src={media('brand/douglas-group-logo-black.svg')} alt="DOUGLAS Group" className="brand__logo" width="96" height="32" />
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__product">#DOUGLASDialogue <em>Hub</em></span>
        </Link>

        <SearchTrigger onOpen={() => setSearch(true)} />

        <div className="header-tools">
          <RoleSwitcher />
          <LanguageSelector />
        </div>

        <button type="button" className="search-icon-btn" aria-label="Search the hub" onClick={() => setSearch(true)}>
          <Icon name="search" size={22} />
        </button>
        <button type="button" className="menu-btn" aria-expanded={mobile} aria-controls="mobile-nav" aria-label={mobile ? 'Close menu' : 'Open menu'} onClick={() => setMobile((m) => !m)}>
          <Icon name={mobile ? 'close' : 'menu'} size={24} />
        </button>
        </div>

        <nav className="main-nav" aria-label="Main">
          <ul>
            {MAIN_NAV.map((item) =>
              item.children ? (
                <li key={item.label} className="main-nav__drop" ref={dropRef}>
                  <button
                    type="button"
                    className={`main-nav__link ${phaseActive ? 'is-active' : ''}`}
                    aria-expanded={dropdown}
                    aria-controls="phase-menu"
                    onClick={() => setDropdown((d) => !d)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setDropdown(true);
                        window.setTimeout(() => document.querySelector<HTMLElement>('#phase-menu a')?.focus(), 20);
                      }
                    }}
                  >
                    {item.label} <Icon name="chevron" size={14} className={`chev ${dropdown ? 'is-open' : ''}`} />
                  </button>
                  <div id="phase-menu" className={`dropdown ${dropdown ? 'is-open' : ''}`} hidden={!dropdown}>
                    <ul>
                      {item.children.map((c, i) => (
                        <li key={c.to}>
                          <NavLink
                            to={c.to}
                            className={({ isActive }) => `dropdown__item ${isActive ? 'is-active' : ''}`}
                            onKeyDown={(e) => {
                              const links = Array.from(document.querySelectorAll<HTMLElement>('#phase-menu a'));
                              if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length]?.focus(); }
                              if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length]?.focus(); }
                            }}
                          >
                            <span className="dropdown__num">0{i + 1}</span>
                            <span>
                              <strong>{c.label}</strong>
                              <small>{c.description}</small>
                            </span>
                            <Icon name="arrow" size={16} className="arrow-move" />
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => `main-nav__link ${isActive ? 'is-active' : ''}`}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

      </div>

      {/* Mobile drawer — portalled to <body> because the blurred header would otherwise become its containing block. */}
      {createPortal(<div className={`mobile-nav ${mobile ? 'is-open' : ''}`} id="mobile-nav" aria-hidden={!mobile}>
        <div className="mobile-nav__backdrop" onClick={closeMobile} />
        <div className="mobile-nav__panel" ref={trapRef} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-nav__head">
            <span className="brand__product">#DOUGLASDialogue <em>Hub</em></span>
            <button type="button" className="icon-btn" aria-label="Close menu" onClick={closeMobile}><Icon name="close" /></button>
          </div>
          <RoleSwitcher compact />
          <nav aria-label="Mobile">
            <ul className="mobile-nav__list">
              {MAIN_NAV.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <details open={phaseActive}>
                      <summary>{item.label} <Icon name="chevron" size={16} className="chev" /></summary>
                      <ul>
                        {item.children.map((c) => (
                          <li key={c.to}><NavLink to={c.to} tabIndex={mobile ? 0 : -1}>{c.label}</NavLink></li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.to}><NavLink to={item.to} end={item.to === '/'} tabIndex={mobile ? 0 : -1}>{item.label}</NavLink></li>
                ),
              )}
            </ul>
          </nav>
          <details className="mobile-nav__lang">
            <summary><Icon name="globe" size={18} /> Language · {'EN'} <Icon name="chevron" size={16} className="chev" /></summary>
            <LanguageSelector inline />
          </details>
        </div>
      </div>, document.body)}
      {createPortal(<SearchPanel open={search} onClose={() => setSearch(false)} />, document.body)}
    </header>
  );
}
