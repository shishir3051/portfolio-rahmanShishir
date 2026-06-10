import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ChevronRight, Terminal } from 'lucide-react';

const Footer = () => {
  const handleSectionNav = (e, sectionId) => {
    const currentHash = window.location.hash;
    if (currentHash.startsWith('#/')) {
      e.preventDefault();
      window.location.hash = '';
      setTimeout(() => {
        window.location.hash = sectionId;
      }, 50);
    }
  };

  return (
    <footer className="relative bg-bg pt-32 pb-12 overflow-hidden border-t border-stroke">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 group cursor-default">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent transition-all">
                <Terminal className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
              </div>
              <span className="font-extrabold tracking-tighter text-xl uppercase">
                Rahman <span className="text-accent">Shishir</span>
              </span>
            </div>
            <p className="text-muted text-base leading-relaxed mb-8 max-w-sm">
              Architecting secure, enterprise-grade software solutions with a focus on deep-tech cybersecurity and high-performance engineering.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Github />, href: "https://github.com/shishir3051" },
                { icon: <Linkedin />, href: "https://www.linkedin.com/in/rahman-shishir-442867266/" },
                { icon: <Twitter />, href: "#" },
                { icon: <Mail />, href: "mailto:contact@rahmanshishir.com" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -3 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-panel border border-stroke flex items-center justify-center text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all font-bold"
                >
                  {React.cloneElement(social.icon, { className: "w-5 h-5" })}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 text-text">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Skills', 'Experience'].map(item => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => handleSectionNav(e, item.toLowerCase())}
                    className="text-muted hover:text-accent transition-all duration-300 text-sm flex items-center gap-2 group font-bold"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 text-text">Work</h4>
            <ul className="space-y-4">
              {['Projects', 'Services', 'Blog', 'Uses'].map(item => (
                <li key={item}>
                  <a
                    href={item === 'Blog' || item === 'Uses' ? `#/${item.toLowerCase()}` : `#${item.toLowerCase()}`}
                    onClick={(e) => item !== 'Blog' && item !== 'Uses' && handleSectionNav(e, item.toLowerCase())}
                    className="text-muted hover:text-accent transition-all duration-300 text-sm flex items-center gap-2 group font-bold"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 text-text">Stay Secure</h4>
            <div className="glass p-6 rounded-2xl border border-stroke">
              <p className="text-xs text-muted mb-4 leading-relaxed font-bold">
                Interested in cybersecurity audits or enterprise software consulting? Let's build something unhackable.
              </p>
              <a href="mailto:contact@rahmanshishir.com" className="inline-flex items-center gap-2 text-sm font-black text-accent hover:text-accent2 transition-colors">
                Get in Touch <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stroke pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright + Legal links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs font-bold text-muted2 uppercase tracking-widest text-center md:text-left">
            <p>© {new Date().getFullYear()} Rahman Shishir</p>
            <span className="hidden sm:inline text-stroke">·</span>
            <div className="flex gap-6">
              <a href="#/privacy" className="hover:text-text transition-colors">Privacy</a>
              <a href="#/terms" className="hover:text-text transition-colors">Terms</a>
            </div>
          </div>

          {/* Right side: Availability badge + tech attribution */}
          <div className="flex items-center gap-4 flex-wrap justify-center">

            {/* Open to Work badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
              style={{
                borderColor: 'rgba(34,197,94,0.3)',
                background: 'rgba(34,197,94,0.06)',
                color: '#22c55e',
              }}
            >
              <span
                style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                  boxShadow: '0 0 0 0 rgba(34,197,94,0.6)',
                  animation: 'footerPulse 2s infinite',
                }}
              />
              Available for Opportunities
            </div>

            {/* Tech attribution */}
            <div
              className="text-xs font-mono"
              style={{ color: 'var(--text-dim)', letterSpacing: '0.05em' }}
            >
              Built with{' '}
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>React</span>
              {' & '}
              <span style={{ color: 'var(--purple)', fontWeight: 600 }}>Spring Boot</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
