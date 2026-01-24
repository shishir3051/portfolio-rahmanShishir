import React from 'react';

const Footer = () => {
  // Handle navigation from page view to portfolio sections
  const handleSectionNav = (e, sectionId) => {
    const currentHash = window.location.hash;
    
    // Check if we're on a page view (Blog, Uses, etc.)
    if (currentHash.startsWith('#/')) {
      e.preventDefault();
      // First navigate to home, then to the section
      window.location.hash = '';
      setTimeout(() => {
        window.location.hash = sectionId;
      }, 50);
    }
    // If already on portfolio view, let default anchor behavior work
  };

  return (
    <footer className="relative bg-bg pt-20 pb-10 overflow-hidden border-t-2 border-transparent">
      {/* Top Glow Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80 blur-[2px]"></div>
      
      {/* Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-20">
        <h1 className="text-[12vw] font-black leading-none footer-title-bg whitespace-nowrap">
          RAHMAN SHISHIR
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              RS.
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Building secure, scalable, and exceptional digital experiences for the modern web.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a href="https://github.com/shishir3051" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-panel border border-stroke flex items-center justify-center text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/rahman-shishir-442867266/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-panel border border-stroke flex items-center justify-center text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-text">Navigation</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#home" onClick={(e) => handleSectionNav(e, 'home')} className="hover:text-accent transition-colors duration-300">Home</a></li>
              <li><a href="#about" onClick={(e) => handleSectionNav(e, 'about')} className="hover:text-accent transition-colors duration-300">About</a></li>
              <li><a href="#skills" onClick={(e) => handleSectionNav(e, 'skills')} className="hover:text-accent transition-colors duration-300">Skills</a></li>
              <li><a href="#experience" onClick={(e) => handleSectionNav(e, 'experience')} className="hover:text-accent transition-colors duration-300">Experience</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-text">Resources</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#projects" onClick={(e) => handleSectionNav(e, 'projects')} className="hover:text-accent transition-colors duration-300">Projects</a></li>
              <li><a href="#services" onClick={(e) => handleSectionNav(e, 'services')} className="hover:text-accent transition-colors duration-300">Services</a></li>
              <li><a href="#/blog" className="hover:text-accent transition-colors duration-300">Blog</a></li>
              <li><a href="#/uses" className="hover:text-accent transition-colors duration-300">Uses</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-text">Legal</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#/privacy" className="hover:text-accent transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#/terms" className="hover:text-accent transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stroke py-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted2">
          <p>© {new Date().getFullYear()} Rahman Shishir. All rights reserved.</p>
          <div className="mt-2 md:mt-0">
             Designed & Built active.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
