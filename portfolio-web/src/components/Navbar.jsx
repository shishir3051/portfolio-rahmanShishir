import React, { useState } from 'react';

const Navbar = ({ onDashboardClick, theme, toggleTheme, isAdmin, onLogout, view, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'];

  return (
    <header className="sticky top-0 z-20 backdrop-blur-lg bg-white/70 dark:bg-black/40 border-b border-stroke">
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 font-extrabold tracking-tighter text-xl">
          <span className="text-text">Rahman Shishir</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const id = item.toLowerCase();
            const isActive = activeSection === id;
            return (
              <a
                key={item}
                href={view === 'dashboard' ? '#' : `#${id}`}
                onClick={view === 'dashboard' ? () => window.location.href = `/#${id}` : undefined}
                className={`px-4 py-2 rounded-xl transition-all text-sm font-bold ${
                  isActive 
                  ? 'text-accent bg-accent/10' 
                  : 'text-muted hover:text-text hover:bg-white/10 dark:hover:bg-white/5'
                }`}
              >
                {item}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-stroke bg-white/5 grid place-items-center hover:bg-white/10 transition-all text-muted hover:text-text"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Admin Dashboard (Only if isAdmin) */}
          {isAdmin && (
            <>
              <button 
                onClick={onDashboardClick}
                className={`w-10 h-10 rounded-xl border border-stroke bg-white/5 grid place-items-center hover:bg-white/10 transition-all ${view === 'dashboard' ? 'text-accent border-accent/40' : 'text-muted hover:text-text'}`}
                title="Admin Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-xl border border-red-500/20 bg-red-500/5 grid place-items-center hover:bg-red-500/10 transition-all text-red-500/70 hover:text-red-500"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          )}

          <button 
            className="md:hidden w-10 h-10 rounded-xl border border-stroke bg-white/5 grid place-items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-stroke py-4 bg-white/5 dark:bg-black/50 backdrop-blur-lg">
          {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block px-6 py-3 text-muted hover:text-text hover:bg-white/5 font-bold"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
