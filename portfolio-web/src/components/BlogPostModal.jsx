import React, { useState, useRef } from 'react';
import { X, Share2, Bookmark } from 'lucide-react';
import { formatBlogText } from '../utils/formatBlogText';
import { useDialog } from '../hooks/useDialog';

// Aurora gradient used for the lead paragraph's rule and the list bullets
const AURORA_GRADIENT = 'linear-gradient(180deg, var(--aurora-1), var(--aurora-2))';

// Bright "Featured" pill (same style as the homepage's "Core focus" badge). Also used by the blog cards.
export const FeaturedBadge = () => (
  <span className="brand-badge inline-flex h-[26px] shrink-0 items-center rounded-full px-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em]">
    Featured
  </span>
);

// Long date for the article header, e.g. "October 25, 2026". Older records may use a different casing
// for createdAt. Returns an empty string when the post has no valid date instead of inventing one.
const formatPostDate = (post) => {
  const date = new Date(post.createdAt || post.createdat || post.CreatedAt);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogPostModal = ({ post, onClose }) => {
  // Check if post is bookmarked on mount. Blog gives the modal key={post._id}, so each post gets a fresh mount.
  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (!post) return false;
    const bookmarked = JSON.parse(localStorage.getItem('bookmarked-posts') || '[]');
    // MongoDB documents are identified by _id (there is no `id` field)
    return bookmarked.some(p => p._id === post._id);
  });
  const [showCopied, setShowCopied] = useState(false);
  const closeButtonRef = useRef(null);
  const isOpen = Boolean(post);

  // Scroll lock, focus handling (incl. Tab trap) and Escape-to-close; on close the
  // previous scroll setting and the previously focused element (the post card) are restored.
  const dialogRef = useRef(null);
  useDialog(dialogRef, onClose, { enabled: isOpen, initialFocusRef: closeButtonRef });

  const handleBookmark = () => {
    const bookmarked = JSON.parse(localStorage.getItem('bookmarked-posts') || '[]');

    if (isBookmarked) {
      const filtered = bookmarked.filter(p => p._id !== post._id);
      localStorage.setItem('bookmarked-posts', JSON.stringify(filtered));
      setIsBookmarked(false);
    } else {
      bookmarked.push(post);
      localStorage.setItem('bookmarked-posts', JSON.stringify(bookmarked));
      setIsBookmarked(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${post.title}\n\n${post.excerpt}\n\n${window.location.href}`);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  if (!post) return null;

  const meta = [formatPostDate(post), post.readtime || post.readTime].filter(Boolean).join(' · ');

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-post-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      {/* Glass frame on a solid surface (--card-solid) so long-form text keeps full contrast in both themes.
          `isolate` lets the decorative glow below sit behind the content with -z-10. */}
      <article
        ref={dialogRef}
        className="glass animate-fade-in-up relative isolate flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px]"
        style={{ background: 'var(--card-solid)' }}
      >
        {/* Decorative aurora light: a hairline across the top edge and a soft glow behind the title bar */}
        <div aria-hidden="true" className="absolute inset-x-[15%] top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
        <div aria-hidden="true" className="absolute -top-36 left-1/2 -z-10 h-64 w-[70%] -translate-x-1/2 rounded-full opacity-50 blur-[70px]" style={{ background: 'var(--glow)' }} />

        {/* Title bar: category and featured marker on the left, close on the right.
            It stays visible while the post body scrolls. */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-stroke py-3 pl-6 pr-3 md:pl-10 md:pr-5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="chip h-[26px] min-w-0 text-xs font-medium">
              <span className="truncate">{post.category || 'Post'}</span>
            </span>
            {post.featured && <FeaturedBadge />}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="kbd hidden sm:inline-flex" aria-hidden="true">Esc</span>
            <button ref={closeButtonRef} type="button" onClick={onClose} className="icon-btn" aria-label="Close post">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable post body */}
        <div className="min-h-0 overflow-y-auto px-6 pb-10 pt-8 md:px-10 md:pb-12 md:pt-10">
          <h2
            id="blog-post-modal-title"
            className="text-balance font-heading text-[clamp(28px,3.6vw,42px)] font-semibold leading-[1.1] tracking-[-0.035em] text-text"
          >
            {post.title}
          </h2>
          {meta && <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-muted2">{meta}</p>}

          {/* Summary as a lead paragraph, set off by a thin aurora rule */}
          {post.excerpt && (
            <p className="relative mt-8 pl-5 text-[17px] leading-relaxed text-text/85 md:text-lg">
              <span aria-hidden="true" className="absolute inset-y-1 left-0 w-0.5 rounded-full" style={{ background: AURORA_GRADIENT }} />
              {post.excerpt}
            </p>
          )}

          {/* Full Content: each line of the editor's text becomes a heading, list item or paragraph.
              [&_mark]:text-text keeps highlighted text readable on the light theme too. */}
          <div className="mt-8 flex flex-col gap-4 border-t border-stroke pt-8 text-base leading-[1.8] text-muted md:text-[17px] [&_mark]:text-text">
            {(post.content || "").split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={i} className="h-1" aria-hidden="true" />;

              // Handle Alignment Wrappers (<div align="center">...</div>)
              let alignmentClass = "";
              let processedLine = trimmed;
              if (trimmed.includes('align="center"')) {
                alignmentClass = "text-center";
              } else if (trimmed.includes('align="right"')) {
                alignmentClass = "text-right";
              } else if (trimmed.includes('align="left"')) {
                alignmentClass = "text-left";
              } else if (trimmed.includes('align="justify"')) {
                alignmentClass = "text-justify";
              }

              // Always strip the editor's alignment wrappers; the closing </div> sits on its own line
              processedLine = trimmed.replace(/<div align="[^"]*">/g, '').replace(/<\/div>/g, '').trim();
              if (!processedLine) return null;

              // H1 Heading
              if (processedLine.startsWith('# ')) {
                return <h2 key={i} className={`mt-6 font-heading text-[clamp(22px,2.2vw,28px)] font-semibold leading-snug tracking-[-0.03em] text-text first:mt-0 ${alignmentClass}`}>{processedLine.replace('# ', '')}</h2>;
              }
              // H2 Heading
              if (processedLine.startsWith('## ')) {
                return <h3 key={i} className={`mt-5 font-heading text-xl font-semibold leading-snug tracking-[-0.025em] text-text first:mt-0 md:text-[22px] ${alignmentClass}`}>{processedLine.replace('## ', '')}</h3>;
              }
              // H3 Heading
              if (processedLine.startsWith('### ')) {
                return <h4 key={i} className={`mt-3 font-heading text-lg font-semibold tracking-[-0.02em] text-text first:mt-0 ${alignmentClass}`}>{processedLine.replace('### ', '')}</h4>;
              }
              // Universal List Detection Logic
              const listMatch = processedLine.match(/^(\s*)([ivxIVX]+[.)]|\d+[.)]|[a-zA-Z][.)]|[-■‣•*]| {4})(.*)/);

              if (listMatch) {
                const indent = listMatch[1];
                const marker = listMatch[2].trim();
                const content = listMatch[3];

                return (
                  <div key={i} className={`flex gap-3 items-start ml-2 ${alignmentClass}`} style={{ paddingLeft: `${indent.length * 8}px` }}>
                    {marker && marker !== "" ? (
                      <span className="min-w-[1.2rem] shrink-0 text-right font-mono text-[0.9em] font-medium tabular-nums text-muted2">
                        {marker.length === 1 && !/[.)]/.test(marker) ? (
                          // Bullet: a small aurora dot, centred on the first line of text
                          <span className="inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: AURORA_GRADIENT }} aria-hidden="true" />
                        ) : marker}
                      </span>
                    ) : (
                      <div className="w-[1.2rem] shrink-0" /> // Spacer for "None" style
                    )}
                    <p className="min-w-0 flex-1" dangerouslySetInnerHTML={{ __html: formatBlogText(content.trim()) }} />
                  </div>
                );
              }

              return (
                <p
                  key={i}
                  className={alignmentClass}
                  dangerouslySetInnerHTML={{ __html: formatBlogText(processedLine) }}
                />
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-t border-stroke px-6 py-4 md:px-10" style={{ background: 'var(--fill-1)' }}>
          <button type="button" onClick={handleShare} className="btn-secondary h-10 px-4">
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </button>
          <button
            type="button"
            onClick={handleBookmark}
            className={`btn-secondary h-10 px-4 ${isBookmarked
              ? 'border-accent/50 bg-accent/10 text-accent hover:border-accent/70 hover:bg-accent/15'
              : ''
              }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>

          {/* Short confirmation after copying; role="status" announces it to screen readers */}
          <p role="status" className="text-sm text-accent2">
            {showCopied && 'Link copied.'}
          </p>

          <button type="button" onClick={onClose} className="btn-primary ml-auto h-10 px-5">
            Close
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPostModal;
