import { Mail, ArrowUp } from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '../data/profile';
import { scrollBehavior } from '../utils/scroll';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
  { label: 'Blog', href: '#/blog' },
  { label: 'Uses', href: '#/uses' },
  { label: 'Privacy', href: '#/privacy' },
  { label: 'Terms', href: '#/terms' },
];

// Footer: brand, links, socials, and a giant faded "Shishir" wordmark
const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-stroke">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-60 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-[40px]" style={{ background: 'radial-gradient(closest-side, var(--glow), transparent)' }} />

      <div className="container relative">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-12">
          <div className="flex items-center gap-3.5">
            <span aria-hidden="true" className="brand-badge grid h-10 w-10 place-items-center rounded-xl font-heading text-sm font-bold">RS</span>
            <div>
              <p className="font-heading text-base font-semibold text-text">{PROFILE.name}</p>
              <p className="text-[13px] text-muted2">{PROFILE.role} · {PROFILE.location}</p>
            </div>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted transition-colors hover:text-text">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-2.5">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-secondary h-[42px] w-[42px] px-0" aria-label={`${link.label} profile`}>
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              );
            })}
            <a href={`mailto:${PROFILE.email}`} className="btn-secondary h-[42px] w-[42px] px-0" aria-label="Send an email">
              <Mail className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke pt-5 text-[13px] text-muted2">
          <p>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-text"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <p
          aria-hidden="true"
          className="select-none pt-7 text-center font-heading text-[clamp(88px,20vw,288px)] font-bold leading-[0.8] tracking-[-0.06em] text-transparent"
          style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--text) 18%, transparent) 0%, transparent 88%)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
        >
          Shishir
        </p>
      </div>
    </footer>
  );
};

export default Footer;
