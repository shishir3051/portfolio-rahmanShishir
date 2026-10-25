// Title block for standalone pages (Blog, Uses, Privacy, Terms), matching the homepage sections:
// an eyebrow label, a large Sora title and an optional description. `eyebrow` defaults to "Page".
const PageHeader = ({ title, description, eyebrow = 'Rahman Shishir', children }) => {
  return (
    <header className="container pb-10 pt-32 md:pb-14 md:pt-40">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-balance font-heading text-[clamp(36px,5vw,64px)] font-semibold leading-[1.04] tracking-[-0.045em] text-text">{title}</h1>
      {description && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">{description}</p>}
      {children}
    </header>
  );
};

export default PageHeader;
