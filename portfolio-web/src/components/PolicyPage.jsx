import { Helmet } from 'react-helmet-async';
import { Mail } from 'lucide-react';
import PageHeader from './PageHeader';
import Panel from './Panel';
import { PROFILE } from '../data/profile';

// Shared layout for the Privacy and Terms pages. The pages only pass their copy, so both look the same.
// A calm reading column: every section gets a soft mono number ("01") before its Sora title, the
// contents list is a small glass card that stays in view on large screens, and the page ends with a
// gradient-border contact card.
//
// Props:
//   metaTitle, metaDescription  browser tab title and <meta name="description">
//   title, description          heading block at the top of the page (title may contain JSX)
//   eyebrow                     small label above the title, e.g. "Privacy"
//   lastUpdated                 ISO date ("YYYY-MM-DD") of the latest revision
//   sections                    [{ id, title, blocks }]; each block is either a string (one paragraph)
//                               or an array of strings (a bullet list)
//   contactNote                 sentence shown in the contact card at the end of the page

// Parse as UTC so the date never shifts by a day in time zones behind UTC.
const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' });

// Two-digit counters, e.g. 1 -> "01". Used for the section numbers and the contents count.
const pad = (value) => String(value).padStart(2, '0');

// Number shown before each section title, e.g. index 0 -> "01"
const sectionNumber = (index) => pad(index + 1);

// The site routes with the URL hash (e.g. #/privacy), so a normal "#section" link would leave this page.
// Scroll to the section instead, then move focus to its heading for keyboard and screen reader users.
const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
  document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
};

const PolicyBlock = ({ block }) => {
  if (Array.isArray(block)) {
    // Native disc markers tinted with the accent; list-style stays on, so list semantics are kept everywhere
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-accent">
        {block.map((item) => (
          <li key={item} className="pl-1.5">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <p>{block}</p>;
};

const PolicyPage = ({ metaTitle, metaDescription, title, description, eyebrow, lastUpdated, sections, contactNote }) => {
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <PageHeader title={title} description={description} eyebrow={eyebrow}>
        {/* Revision line: a small mono meta row under the description */}
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted2">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent2" aria-hidden="true" />
            <span>
              Last updated <time dateTime={lastUpdated} className="text-text">{formatDate(lastUpdated)}</time>
            </span>
          </span>
          <span aria-hidden="true">·</span>
          <span>{sections.length} sections</span>
        </p>
      </PageHeader>

      <div className="container pb-20 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
          {/* On-page contents: first in the DOM for screen readers, shown on the right (and sticky) on large
              screens. self-start stops the grid from stretching it, which would leave sticky no room to move;
              top-[5.5rem] keeps it below the floating navbar. */}
          <Panel
            as="nav"
            aria-label="On this page"
            title="Contents"
            meta={<span aria-hidden="true">{pad(sections.length)}</span>}
            className="hidden rounded-2xl lg:sticky lg:top-[5.5rem] lg:order-last lg:block lg:self-start"
            bodyClassName="p-2"
          >
            <ol className="grid gap-0.5">
              {sections.map(({ id, title: sectionTitle }, index) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className="group flex w-full items-baseline gap-3 rounded-xl px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-fill-strong hover:text-text"
                  >
                    <span
                      className="shrink-0 font-mono text-[11px] text-muted2 transition-colors group-hover:text-accent group-focus-visible:text-accent"
                      aria-hidden="true"
                    >
                      {sectionNumber(index)}
                    </span>
                    <span>{sectionTitle}</span>
                  </button>
                </li>
              ))}
            </ol>
          </Panel>

          <div className="max-w-3xl">
            {/* Sections divided by hairlines: the number hangs in a narrow left gutter from sm up,
                and sits above the title on phones */}
            <div className="divide-y divide-stroke">
              {sections.map(({ id, title: sectionTitle, blocks }, index) => (
                <section
                  key={id}
                  id={id}
                  aria-labelledby={`${id}-title`}
                  className="py-9 first:pt-0 md:py-10 sm:grid sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-baseline"
                >
                  <span className="mb-2 block font-mono text-[13px] font-medium text-accent sm:mb-0" aria-hidden="true">
                    {sectionNumber(index)}
                  </span>
                  <div>
                    {/* tabIndex -1 lets the contents list move focus here without adding a tab stop */}
                    <h2
                      id={`${id}-title`}
                      tabIndex={-1}
                      className="text-balance font-heading text-[clamp(22px,2.4vw,28px)] font-semibold leading-tight tracking-[-0.03em] text-text focus:outline-none"
                    >
                      {sectionTitle}
                    </h2>
                    <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted md:text-base md:leading-[1.75]">
                      {blocks.map((block, blockIndex) => (
                        <PolicyBlock key={blockIndex} block={block} />
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Contact card with a 1px gradient border and one soft, static aurora glow */}
            <div className="gradient-border mt-12 md:mt-14">
              <div className="gradient-border-inner relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-36 h-72 w-72 rounded-full blur-[40px]"
                  style={{
                    background: 'radial-gradient(circle at center, var(--aurora-1) 0%, transparent 62%)',
                    opacity: 'calc(0.3 * var(--orb-opacity))',
                  }}
                />
                <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                  <div className="min-w-0">
                    <h2 className="font-heading text-xl font-semibold tracking-[-0.03em] text-text">Contact</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{contactNote}</p>
                  </div>
                  <a href={`mailto:${PROFILE.email}`} className="btn-secondary shrink-0 self-start sm:self-auto">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyPage;
