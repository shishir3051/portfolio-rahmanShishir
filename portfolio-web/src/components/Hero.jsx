import { ArrowRight, MapPin, Building2, ShieldCheck } from 'lucide-react';
import { PROFILE, HERO_CHIPS, HIGHLIGHTS } from '../data/profile';

// Where each floating chip sits around the portrait (the third one hides on small phones)
const CHIP_POSITIONS = [
  'left-3 -top-4 sm:-left-14 sm:top-16',
  'hidden sm:flex sm:-right-11 sm:top-[300px] [animation-delay:-2.5s]',
  'left-3 bottom-24 sm:-left-10 [animation-delay:-5s]',
];

// A frosted chip floating next to the portrait
const FloatingChip = ({ chip, position }) => {
  const Icon = chip.icon;
  const success = chip.tone === 'success';
  return (
    <div className={`nav-glass animate-float absolute z-[3] flex items-center gap-2.5 rounded-2xl py-2.5 pl-2.5 pr-4 ${position}`}>
      <span
        aria-hidden="true"
        className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] border border-stroke ${success ? 'text-accent2' : 'text-accent'}`}
        style={{ background: success ? 'rgba(52, 211, 153, 0.14)' : 'var(--accent-soft)' }}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span>
        <span className="block font-heading text-sm font-semibold text-text">{chip.title}</span>
        <span className="block text-xs text-muted">{chip.caption}</span>
      </span>
    </div>
  );
};

// Portrait inside a glass frame whose border carries a slowly rotating ring of aurora light
const Portrait = () => (
  <div className="relative mx-auto w-full max-w-[400px] flex-[0_1_400px]">
    <div aria-hidden="true" className="absolute inset-x-0 -bottom-5 top-10 rounded-full blur-[30px]" style={{ background: 'radial-gradient(closest-side, var(--glow), transparent)' }} />
    <div className="relative z-[1] isolate overflow-hidden rounded-[34px] p-[1.5px]" style={{ boxShadow: '0 50px 110px -40px rgba(0, 0, 0, 0.9)' }}>
      <div
        aria-hidden="true"
        className="animate-spin-slow absolute -inset-[60%] -z-10"
        style={{ background: 'conic-gradient(from 0deg, rgba(255,255,255,0.10) 0deg, rgba(255,255,255,0.10) 190deg, var(--aurora-1) 260deg, var(--aurora-2) 315deg, rgba(255,255,255,0.10) 360deg)' }}
      />
      <div className="rounded-[33px] p-3 backdrop-blur-xl" style={{ background: 'var(--card-solid)' }}>
        <div className="relative overflow-hidden rounded-3xl bg-panel">
          <img
            src={PROFILE.photo}
            alt={`Portrait of ${PROFILE.name}`}
            width="600"
            height="800"
            fetchPriority="high"
            className="block aspect-[3/4] w-full object-cover object-top"
          />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,6,15,0) 52%, rgba(5,6,15,0.94) 100%)' }} />
          <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-heading text-[19px] font-semibold tracking-tight text-white">{PROFILE.name}</p>
              <p className="text-[13px] text-[#c9ccdc]">{PROFILE.location}</p>
            </div>
            <p className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-[#e6e8f5]">
              {PROFILE.utcOffset}
            </p>
          </div>
        </div>
      </div>
    </div>
    {HERO_CHIPS.map((chip, i) => (
      <FloatingChip key={chip.title} chip={chip} position={CHIP_POSITIONS[i]} />
    ))}
  </div>
);

// Glowing glass tile for one key figure
const StatTile = ({ item }) => (
  <div className="glass lift relative overflow-hidden px-5 pb-6 pt-6 md:px-7">
    <div aria-hidden="true" className="absolute inset-x-[18%] top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
    <div aria-hidden="true" className="absolute -bottom-[90px] left-1/2 h-[140px] w-[220px] -translate-x-1/2 rounded-full opacity-70 blur-[40px]" style={{ background: 'var(--glow)' }} />
    <dt className="relative font-mono text-xs uppercase tracking-[0.12em] text-muted2">{item.label}</dt>
    <dd className="relative mt-3.5 font-heading text-[clamp(30px,3.4vw,46px)] font-semibold leading-none tracking-[-0.04em] text-text">
      {item.href ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
          {item.value}
          {item.suffix && <span className="ml-1.5 text-[0.42em] tracking-normal text-muted">{item.suffix}</span>}
        </a>
      ) : (
        item.value
      )}
    </dd>
    <dd className="relative mt-2.5 text-sm text-muted">{item.caption}</dd>
  </div>
);

// Summary text from data/profile.js, with PROFILE.summaryHighlight shown brighter
const Summary = () => {
  const { summary, summaryHighlight } = PROFILE;
  const start = summaryHighlight ? summary.indexOf(summaryHighlight) : -1;
  if (start === -1) return summary; // no highlight phrase found: plain text
  const end = start + summaryHighlight.length;
  return (
    <>
      {summary.slice(0, start)}
      <span className="text-text">{summaryHighlight}</span>
      {summary.slice(end)}
    </>
  );
};

// Homepage intro: availability, headline, summary, calls to action, portrait and key figures.
// projectCount: number of work projects in the Work section, or undefined while they are loading.
const Hero = ({ projectCount }) => {
  const highlights = HIGHLIGHTS.map((item) =>
    item.countsWorkProjects && projectCount !== undefined ? { ...item, value: String(projectCount) } : item
  );

  return (
    <section id="home" className="pb-12 pt-32 md:pb-16 md:pt-40">
      <div className="container">
        <div className="flex flex-wrap items-center gap-14">
          <div className="min-w-0 flex-[1_1_460px]">
            {PROFILE.availableForWork && (
              <p className="nav-glass mb-7 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-3.5 text-[13px] font-medium text-muted">
                <span aria-hidden="true" className="animate-pulse-ring h-2 w-2 rounded-full bg-accent2" />
                Available for new opportunities
              </p>
            )}
            <p className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-heading">
              <span className="text-[clamp(18px,1.6vw,22px)] font-semibold tracking-tight text-text">{PROFILE.name}</span>
              <span className="text-[clamp(15px,1.3vw,18px)] text-muted2">{PROFILE.role}</span>
            </p>
            <h1 className="text-balance font-heading text-[clamp(44px,5.6vw,80px)] font-semibold leading-none tracking-[-0.05em] text-text">
              <span className="gradient-text">Secure</span> software for modern banking.
            </h1>
            <p className="mt-7 max-w-[34em] text-[clamp(16px,1.35vw,19px)] leading-relaxed text-muted">
              <Summary />
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary h-[52px] px-6 text-[15px]">
                View selected work <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
              <a href="#contact" className="btn-secondary h-[52px] px-6 text-[15px] font-medium">Get in touch</a>
            </div>
            <ul className="mt-11 flex flex-wrap gap-x-7 gap-y-3 border-t border-stroke pt-6 text-sm text-muted">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" /> {PROFILE.location}</li>
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <a href={PROFILE.company.href} target="_blank" rel="noopener noreferrer" className="text-text/85 hover:text-text">{PROFILE.company.name}</a>
              </li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> E|HE certified</li>
            </ul>
          </div>

          <Portrait />
        </div>

        <h2 className="sr-only">Key figures</h2>
        <dl className="mt-16 grid grid-cols-2 gap-4 md:mt-20 lg:grid-cols-4">
          {highlights.map((item) => (
            <StatTile key={item.label} item={item} />
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Hero;
