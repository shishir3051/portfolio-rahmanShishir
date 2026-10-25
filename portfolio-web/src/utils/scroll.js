// Smooth scrolling, except for visitors who asked their system for reduced motion.
export const scrollBehavior = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
