import { motion } from 'framer-motion';

// Capitalised alias: the project's ESLint config only recognises capitalised names used in JSX
const MotionDiv = motion.div;

/**
 * Shared wrapper for every homepage section: an "01 — About" eyebrow, a large Sora headline,
 * and optionally an intro paragraph or an action on the right. `split` puts the header in a
 * left column and the content in a right column (used by About). One subtle fade-in.
 */
const Section = ({ id, index, label, title, intro, action, split = false, children, className = '' }) => {
  const header = (
    <div className={split ? 'min-w-0 flex-[1_1_360px]' : 'min-w-0 max-w-3xl flex-[1_1_480px]'}>
      <p className="eyebrow">{index} — {label}</p>
      <h2 className="text-balance font-heading text-[clamp(32px,4.2vw,56px)] font-semibold leading-[1.06] tracking-[-0.04em] text-text">
        {title}
      </h2>
    </div>
  );

  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <MotionDiv
        className="container"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {split ? (
          <div className="flex flex-wrap gap-x-20 gap-y-10">
            {header}
            <div className="min-w-0 flex-[1.4_1_480px]">{children}</div>
          </div>
        ) : (
          <>
            <header className="mb-10 flex flex-wrap items-end justify-between gap-x-16 gap-y-6 md:mb-12">
              {header}
              {intro && <p className="max-w-[380px] flex-[0_1_380px] text-base leading-relaxed text-muted">{intro}</p>}
              {action}
            </header>
            {children}
          </>
        )}
      </MotionDiv>
    </section>
  );
};

export default Section;
