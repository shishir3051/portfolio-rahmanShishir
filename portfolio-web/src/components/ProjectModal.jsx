import React, { useRef } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { useDialog } from '../hooks/useDialog';

// Placeholder links like "#" from seed data should not render as buttons
const isRealLink = (url) => typeof url === 'string' && /^https?:\/\//i.test(url);

const ProjectModal = ({ project, onClose }) => {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Scroll lock, focus handling (incl. Tab trap) and Escape-to-close
  useDialog(dialogRef, onClose, { enabled: Boolean(project), initialFocusRef: closeButtonRef });

  if (!project) return null;

  const { title, tag, year, role, desc, description, details = [], tech = [], live, repo } = project;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div ref={dialogRef} className="glass animate-fade-in-up relative max-h-[85vh] w-full max-w-xl overflow-y-auto shadow-2xl">
        {/* Terminal title bar with the close button */}
        <div className="panel-head sticky top-0 z-10 h-10 bg-panel2">
          <span className="flex items-center gap-2 truncate">
            <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
            {tag || 'Project'}
          </span>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="icon-btn -mr-2 h-8 w-8" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <h2 id="project-modal-title" className="text-xl font-semibold tracking-tight text-text">{title}</h2>
          {(year || role) && (
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-muted2">{[year, role].filter(Boolean).join(' · ')}</p>
          )}

          <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">{desc || description}</p>

          {details.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-muted">
              {details.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="font-mono text-accent" aria-hidden="true">›</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {tech.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
              {tech.map((t) => (
                <li key={t} className="chip">{t}</li>
              ))}
            </ul>
          )}

          {(isRealLink(live) || isRealLink(repo)) && (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-stroke pt-5">
              {isRealLink(live) && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> Live demo
                </a>
              )}
              {isRealLink(repo) && (
                <a href={repo} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Github className="h-4 w-4" aria-hidden="true" /> Source code
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
