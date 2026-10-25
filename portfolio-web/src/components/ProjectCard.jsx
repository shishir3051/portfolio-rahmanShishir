import { useId } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ProjectArt from './ProjectArt';

const artMask = 'radial-gradient(ellipse at center, #000 30%, transparent 80%)';

// Compact project card: a small animated illustration, title, two-line summary and a few tech tags.
// On phones it becomes a short row with a square illustration on the left, so the Work section stays easy to scroll.
// The whole card is a real <button> that opens the project details dialog (keyboard and screen-reader friendly);
// it is named by the title alone, so screen readers do not read the whole description on focus.
// `art` / `tone` come from utils/projectArt.js, which spreads the 10 illustrations across the cards.
const ProjectCard = ({ project, code, art, tone, onClick }) => {
  const { title, tag, desc, year, tech = [] } = project;
  const titleId = useId();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-labelledby={titleId}
      aria-haspopup="dialog"
      className="gradient-border lift group flex h-full w-full rounded-[22px] text-left transition-transform duration-300"
    >
      <span className="gradient-border-inner flex min-w-0 flex-1 gap-3 rounded-[21px] p-2.5 sm:flex-col sm:gap-0">
        {/* Illustration panel (stays dark in both themes): a fixed square on phones, a wide banner from sm up */}
        <span
          className="relative block h-28 w-28 shrink-0 self-center overflow-hidden rounded-2xl border border-white/[0.07] sm:h-36 sm:w-auto sm:self-stretch"
          style={{ background: 'radial-gradient(120% 90% at 50% 0%, var(--accent-soft), rgba(8,9,20,0) 60%), var(--art-bg)' }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              maskImage: artMask,
              WebkitMaskImage: artMask,
            }}
          />
          <ProjectArt variant={art} tone={tone} />
        </span>

        <span className="flex min-w-0 flex-1 flex-col py-1 pr-1 sm:px-2 sm:pb-2 sm:pt-4">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.1em] text-accent">{tag}</span>
            <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted2">
              {code && <span className="max-sm:hidden">{code}{year && ' · '}</span>}
              {year}
              {/* On phones the tech row (with its arrow) is hidden, so the "opens" arrow sits here */}
              <ArrowUpRight className="h-3.5 w-3.5 text-muted2 sm:hidden" aria-hidden="true" />
            </span>
          </span>
          <span id={titleId} className="mt-1 line-clamp-2 break-words font-heading text-base font-semibold leading-snug tracking-[-0.02em] text-text sm:mt-2 sm:text-lg">
            {title}
          </span>
          <span className="mt-1 line-clamp-2 break-words text-[13px] leading-relaxed text-muted sm:mt-1.5 sm:text-sm">{desc}</span>
          {/* Tech tags: hidden on phones to keep the row short (they are listed in the details dialog) */}
          <span className="mt-auto hidden items-end justify-between gap-3 pt-4 sm:flex">
            <span className="flex min-w-0 flex-wrap gap-1.5">
              {tech.slice(0, 3).map((t, i) => (
                <span key={`${t}-${i}`} className="chip px-2 py-0.5 font-mono text-[11px]">{t}</span>
              ))}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted2 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text" aria-hidden="true" />
          </span>
        </span>
      </span>
    </button>
  );
};

export default ProjectCard;
