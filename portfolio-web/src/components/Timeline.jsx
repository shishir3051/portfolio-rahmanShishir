// Work history as a glowing vertical timeline. The current role gets a lit dot and a "Current" badge.
// Each item: { title, entity, location, period, summary, current? }
const Timeline = ({ items }) => {
  return (
    <ol>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={`${item.title}-${item.period}`} className={`relative grid grid-cols-[16px_minmax(0,1fr)] gap-5 ${isLast ? '' : 'pb-9'}`}>
            {/* Rail to the next entry */}
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-[7px] top-[26px] w-0.5"
                style={{ background: item.current ? 'linear-gradient(180deg, var(--aurora-1), var(--stroke))' : 'var(--stroke)' }}
              />
            )}
            {item.current ? (
              <span aria-hidden="true" className="relative mt-[5px] h-4 w-4 rounded-full" style={{ background: 'var(--aurora-1)', boxShadow: '0 0 0 5px var(--accent-soft), 0 0 24px var(--glow)' }} />
            ) : (
              <span aria-hidden="true" className="relative mt-[5px] h-4 w-4 rounded-full border-2 border-stroke-strong bg-bg" />
            )}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
                <h3 className="font-heading text-[clamp(18px,1.8vw,22px)] font-semibold tracking-tight text-text">{item.title}</h3>
                <p className="font-mono text-[13px] text-muted2">{item.period}</p>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-2.5 text-sm text-muted2">
                {[item.entity, item.location].filter(Boolean).join(' · ')}
                {item.current && (
                  <span className="rounded-full border border-accent2/30 bg-accent2/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-accent2">Current</span>
                )}
              </p>
              <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">{item.summary}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;
