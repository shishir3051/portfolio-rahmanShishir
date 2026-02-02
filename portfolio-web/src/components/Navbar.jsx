import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LayoutDashboard, LogOut, Menu, X, Terminal } from 'lucide-react';

const Navbar = ({ onDashboardClick, theme, toggleTheme, isAdmin, onLogout, view, activeSection, onLogoClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}
    >
      <nav className="container mx-auto px-6">
        <div className={`mx-auto max-w-6xl transition-all duration-500 rounded-[2rem] border ${scrolled
          ? 'bg-panel/40 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-transparent'
          } px-4 py-2 flex xl:grid xl:grid-cols-[minmax(180px,1fr)_auto_minmax(180px,1fr)] justify-between gap-2 items-center`}>

          {/* Logo Section - Column 1 */}
          <div className="flex justify-start">
            <div
              className="flex items-center gap-3 group cursor-pointer flex-none"
              onClick={onLogoClick || (() => window.location.hash = '')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col flex-none">
                <span className="font-extrabold tracking-tighter text-lg leading-tight whitespace-nowrap uppercase">
                  RAHMAN <span className="text-accent">SHISHIR</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-muted2 leading-tight -mt-0.5">Portfolio</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav - Column 2 (Perfectly Centered) */}
          <div className="hidden xl:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
            {view !== 'dashboard' && navItems.map((item) => {
              const isActive = view === 'portfolio' && activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative px-4 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${isActive
                    ? (theme === 'dark' ? 'text-white' : 'text-accent')
                    : 'text-muted hover:text-text'
                    }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent2/20 border border-white/10 rounded-xl -z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Actions - Column 3 */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-muted hover:text-text group"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 group-hover:rotate-45 transition-transform" /> : <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform" />}
            </button>

            {isAdmin && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-2">
                <button
                  onClick={onDashboardClick}
                  className={`w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center transition-all ${view === 'dashboard' ? 'bg-accent text-white' : 'bg-white/5 text-muted hover:text-text'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                </button>
                {view === 'dashboard' && (
                  <button
                    onClick={onLogout}
                    className="w-10 h-10 rounded-xl border border-red-500/10 bg-red-500/5 flex items-center justify-center hover:bg-red-500/20 text-red-500/60 hover:text-red-500 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <button
              className="xl:hidden w-10 h-10 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-muted"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="md:hidden absolute top-full left-0 right-0 mx-6 mt-4 p-4 rounded-3xl bg-panel/60 backdrop-blur-3xl border border-white/10 shadow-2xl z-50"
          >
            <div className="grid gap-2">
              {view !== 'dashboard' && navItems.map((item) => {
                const isActive = view === 'portfolio' && activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-white/5'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
