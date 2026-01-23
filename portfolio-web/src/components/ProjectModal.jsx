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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-[#12121c] border border-stroke rounded-[24px] overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-panel border border-stroke hover:bg-panel2 text-muted hover:text-text transition-all z-10"
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

            <footer className="pt-6 flex flex-wrap gap-4">
              {project.live && (
                <a 
                  href={project.live} 
                  target="_blank" 
                  rel="noopener"
                  className="px-8 py-4 rounded-xl bg-[#1c1c2b] border border-accent/30 font-bold text-white hover:bg-accent/20 transition-all flex items-center gap-2"
                >
                  Live Demo
                </a>
              )}
              {project.repo && (
                <a 
                  href={project.repo} 
                  target="_blank" 
                  rel="noopener"
                  className="px-8 py-4 rounded-xl bg-[#1c1c2b] border border-[#2a2a3e] font-bold text-[#e1e1e6] hover:bg-[#2a2a3e] transition-all flex items-center gap-2"
                >
                  Source Code
                </a>
              )}
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
