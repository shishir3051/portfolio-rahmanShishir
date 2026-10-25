import { Sparkle } from 'lucide-react';
import { RIBBON } from '../data/profile';

const fadeEdges = 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)';

const RibbonList = () => (
  <ul className="flex items-center gap-10 whitespace-nowrap pr-10 font-heading text-2xl font-medium tracking-tight text-muted2">
    {RIBBON.map((item) => (
      <li key={item} className="flex items-center gap-10">
        {item}
        <Sparkle className="h-3.5 w-3.5 fill-current text-accent" aria-hidden="true" />
      </li>
    ))}
  </ul>
);

// Slowly scrolling band of technologies. Decorative (the Stack section lists the same skills),
// so it is hidden from screen readers; the list is rendered twice for a seamless loop.
const Ribbon = () => {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-stroke py-5"
      style={{ maskImage: fadeEdges, WebkitMaskImage: fadeEdges }}
    >
      <div className="animate-marquee flex w-max">
        <RibbonList />
        <RibbonList />
      </div>
    </div>
  );
};

export default Ribbon;
