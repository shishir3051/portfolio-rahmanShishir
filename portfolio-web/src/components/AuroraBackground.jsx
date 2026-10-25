// Drifting aurora light behind the top of every page: three blurred colour orbs,
// a faint dot grid, and a fade into the page colour. Purely decorative.
const ORBS = [
  { className: 'animate-drift-a -left-[200px] -top-[240px] h-[760px] w-[760px]', color: 'var(--aurora-1)', opacity: 0.55 },
  { className: 'animate-drift-b -right-[220px] top-5 h-[680px] w-[680px]', color: 'var(--aurora-2)', opacity: 0.36 },
  { className: 'animate-drift-c left-[36%] top-[640px] h-[560px] w-[560px]', color: 'var(--aurora-3)', opacity: 0.24 },
];

const fadeMask = 'radial-gradient(ellipse 70% 55% at 50% 30%, #000 0%, transparent 75%)';

const AuroraBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[1500px] max-h-full overflow-hidden">
      {ORBS.map((orb) => (
        <div
          key={orb.color}
          className={`absolute rounded-full blur-[40px] ${orb.className}`}
          style={{
            background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 62%)`,
            opacity: `calc(${orb.opacity} * var(--orb-opacity))`,
          }}
        />
      ))}
      <div className="dot-grid absolute inset-0" style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }} />
      <div className="absolute inset-x-0 bottom-0 h-[420px]" style={{ background: 'linear-gradient(180deg, transparent, var(--bg))' }} />
    </div>
  );
};

export default AuroraBackground;
