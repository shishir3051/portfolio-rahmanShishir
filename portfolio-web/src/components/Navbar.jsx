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

  const navItems = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'
        }`}
    >
      <nav className="container mx-auto px-6">
        <div className={`mx-auto max-w-6xl transition-all duration-300 rounded-3xl border ${scrolled
          ? 'bg-panel/70 backdrop-blur-2xl border-stroke shadow-2xl'
          : 'bg-transparent border-transparent'
          } px-6 h-16 flex items-center justify-between`}>

          <div className="flex items-center gap-2 group cursor-pointer" onClick={onLogoClick || (() => window.location.hash = '')}>
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent transition-all">
              <Terminal className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
            </div>
            <span className="font-extrabold tracking-tighter text-xl hidden sm:block">
              RAHMAN <span className="text-accent">SHISHIR</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {view !== 'dashboard' && navItems.map((item) => {
              const id = item.toLowerCase();
              const isActive = view === 'portfolio' && activeSection === id;
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'text-accent' : 'text-muted hover:text-text'
                    }`}
                >
                  {item}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-accent/10 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-stroke bg-panel/30 flex items-center justify-center hover:bg-panel transition-all text-muted hover:text-text"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAdmin && (
              <div className="flex items-center gap-2 border-l border-stroke pl-3">
                <button
                  onClick={onDashboardClick}
                  className={`w-10 h-10 rounded-xl border border-stroke flex items-center justify-center transition-all ${view === 'dashboard' ? 'bg-accent text-white border-accent' : 'bg-panel/30 text-muted hover:text-text'}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>
                <button
                  onClick={onLogout}
                  className="w-10 h-10 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-center hover:bg-red-500/20 text-red-500/70 hover:text-red-500 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            <button
              className="md:hidden w-10 h-10 rounded-xl border border-stroke bg-panel/30 flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 mx-6 mt-4 p-6 rounded-3xl bg-panel/90 backdrop-blur-3xl border border-stroke shadow-2xl z-50"
          >
            <div className="grid gap-4">
              {view !== 'dashboard' && navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-bold text-muted hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
