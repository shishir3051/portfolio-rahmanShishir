import React, { useEffect } from 'react';

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-[#12121c] border border-stroke rounded-[24px] overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-panel border border-stroke hover:border-red-500 hover:bg-red-500/10 hover:text-red-500 text-muted transition-all z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-10 overflow-y-auto max-h-[90vh]">
          <header className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight mb-2">{project.title}</h2>
            <div className="text-[#88889a] font-semibold text-[0.95rem] flex gap-2 items-center">
              <span>{project.year || (project.projectyear)}</span>
              <span>•</span>
              <span>{project.role || "Full Stack Engineer"}</span>
            </div>
          </header>

          <div className="space-y-6">
            <section>
              <p className="text-[#a1a1b5] text-[1.05rem] leading-relaxed">
                {project.desc || project.description}
              </p>
            </section>

            {project.details && project.details.length > 0 && (
              <section>
                <ul className="space-y-4">
                  {project.details.map((point, i) => (
                    <li key={i} className="flex gap-4 text-[#a1a1b5] text-[1.05rem] leading-relaxed">
                      <span className="text-[#88889a] text-xl leading-none mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <div className="flex flex-wrap gap-2.5">
                {project.tech && project.tech.map((t, i) => (
                  <span key={i} className="px-5 py-2 rounded-full bg-[#1c1c2b] border border-[#2a2a3e] text-[0.9rem] font-bold text-[#e1e1e6]">
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* Footer Actions - Links and Close Action */}
            <div className="pt-6 border-t border-stroke flex flex-wrap items-center justify-between gap-4">
              {/* Project Links */}
              <div className="flex flex-wrap gap-4">
                {project.live && (
                  <a 
                    href={project.live} 
                    target="_blank" 
                    rel="noopener"
                    className="px-6 py-3 rounded-xl bg-[#1c1c2b] border border-accent/30 font-bold text-white hover:bg-accent/20 transition-all flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Live Demo
                  </a>
                )}
                {project.repo && (
                  <a 
                    href={project.repo} 
                    target="_blank" 
                    rel="noopener"
                    className="px-6 py-3 rounded-xl bg-[#1c1c2b] border border-[#2a2a3e] font-bold text-[#e1e1e6] hover:bg-[#2a2a3e] transition-all flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Source Code
                  </a>
                )}
              </div>

              <button 
                onClick={onClose}
                className="px-6 py-2 bg-accent rounded-xl font-bold hover:shadow-lg hover:shadow-accent/20 transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
