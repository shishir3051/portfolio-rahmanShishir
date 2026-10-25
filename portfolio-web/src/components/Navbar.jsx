import React, { useState } from 'react';
import { Sun, Moon, LayoutDashboard, LogOut, Menu, X, Command, ArrowRight } from 'lucide-react';
import { NAV_SECTIONS, PROFILE } from '../data/profile';
import { scrollBehavior } from '../utils/scroll';

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

// Desktop shows every section except Contact, which has its own "Let's talk" button
const DESKTOP_LINKS = NAV_SECTIONS.filter((item) => item.id !== 'contact');

// Floating frosted-glass navigation bar
const Navbar = ({ onDashboardClick, theme, toggleTheme, isAdmin, onLogout, view, activeSection, onLogoClick, onOpenPalette }) => {
  const [isOpen, setIsOpen] = useState(false);
  const showLinks = view !== 'dashboard';

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onLogoClick) onLogoClick();
    else window.location.hash = '';
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <nav className="nav-glass mx-auto flex max-w-[1200px] items-center justify-between gap-3 rounded-[20px] py-2 pl-3 pr-2 sm:pl-4" aria-label="Main">
        <a href="#home" onClick={handleLogoClick} className="flex items-center gap-3" aria-label={`${PROFILE.name}, back to top`}>
          <span
            className="brand-badge grid h-[34px] w-[34px] place-items-center rounded-[10px] font-heading text-[13px] font-bold tracking-tight"
            style={{ boxShadow: '0 0 24px var(--glow)' }}
          >
            RS
          </span>
          <span className="hidden font-heading text-[15px] font-semibold tracking-tight text-text sm:inline">{PROFILE.name}</span>
        </a>

        {showLinks && (
          <ul className="hidden items-center gap-0.5 lg:flex">
            {DESKTOP_LINKS.map((item) => {
              const isActive = view === 'portfolio' && activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block rounded-[10px] px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-fill-strong text-text' : 'text-muted hover:bg-fill-strong hover:text-text'}`}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-1">
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              className="icon-btn hidden w-auto gap-2 px-2.5 md:inline-flex"
              aria-label="Open command palette"
              aria-keyshortcuts={IS_MAC ? 'Meta+K' : 'Control+K'}
            >
              <Command className="h-4 w-4" aria-hidden="true" />
              <span className="kbd">{IS_MAC ? '⌘K' : 'Ctrl K'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={onDashboardClick}
                className={`icon-btn ${view === 'dashboard' ? 'bg-fill-strong text-text' : ''}`}
                aria-label={view === 'dashboard' ? 'Back to portfolio' : 'Open dashboard'}
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
              {view === 'dashboard' && (
                <button type="button" onClick={onLogout} className="icon-btn hover:text-danger" aria-label="Log out">
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {showLinks && (
            <a href="#contact" className="btn-primary ml-1 hidden h-10 px-4 sm:inline-flex">
              Let's talk <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}

          {showLinks && (
            <button
              type="button"
              className="icon-btn lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu: same breakpoint (lg) as the toggle button above */}
      {showLinks && isOpen && (
        <div id="mobile-nav" className="nav-glass mx-auto mt-2 max-w-[1200px] rounded-[20px] p-2 lg:hidden" style={{ background: 'var(--panel)' }}>
          <ul className="grid">
            {NAV_SECTIONS.map((item) => {
              const isActive = view === 'portfolio' && activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-center gap-3 rounded-[12px] px-3 py-3 text-base font-medium transition-colors ${isActive ? 'bg-fill-strong text-text' : 'text-muted hover:bg-fill-strong hover:text-text'}`}
                  >
                    <span className="font-mono text-xs text-muted2">{item.index}</span>
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
