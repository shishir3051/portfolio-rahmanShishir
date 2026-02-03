import React, { useState, useEffect } from 'react';

const BlogPostModal = ({ post, onClose }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Check if post is bookmarked on mount
  useEffect(() => {
    if (post) {
      const bookmarked = JSON.parse(localStorage.getItem('bookmarked-posts') || '[]');
      setIsBookmarked(bookmarked.some(p => p.id === post.id));
    }
  }, [post]);

  const handleBookmark = () => {
    const bookmarked = JSON.parse(localStorage.getItem('bookmarked-posts') || '[]');

    if (isBookmarked) {
      const filtered = bookmarked.filter(p => p.id !== post.id);
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

  const parseFormatting = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/~~(.*?)~~/g, '<del class="opacity-50 line-through">$1</del>')
      .replace(/<sub>(.*?)<\/sub>/g, '<sub class="text-xs mr-0.5">$1</sub>')
      .replace(/<sup>(.*?)<\/sup>/g, '<sup class="text-xs ml-0.5">$1</sup>')
      .replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-yellow-400/30 text-yellow-200 px-1 rounded-sm">$1</mark>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="decoration-accent/40 underline-offset-8 decoration-2 font-medium">$1</u>')
      .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '<span style="color:$1">$2</span>');
  };

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-bg border border-stroke rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-bg/80 backdrop-blur-md border-b border-stroke px-8 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {post.featured && (
              <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest shadow-sm">
                Featured
              </span>
            )}
            <span className="px-4 py-1.5 rounded-full bg-panel border border-stroke text-[10px] text-muted font-black uppercase tracking-widest shadow-sm">
              {post.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl border border-stroke hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-500 transition-all grid place-items-center group shadow-sm bg-panel"
            aria-label="Close"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-10 md:p-14">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-[11px] font-black text-muted2 mb-8 uppercase tracking-[0.2em]">
            <span>{new Date(post.createdat || post.CreatedAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="opacity-30">•</span>
            <span>{post.readtime || post.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8 leading-[1.2] text-text font-heading">
            {post.title}
          </h1>

          {/* Excerpt */}
          <div className="relative mb-10">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent to-accent/20 rounded-full"></div>
            <p className="text-lg md:text-xl text-muted leading-relaxed pl-8 py-1 font-medium italic opacity-90">
              {post.excerpt}
            </p>
          </div>

          {/* Full Content */}
          <div className="max-w-none">
            <div className="text-muted leading-relaxed text-base md:text-lg space-y-6">
              {(post.content || "").split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-4" />;

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

                if (alignmentClass !== "") {
                  processedLine = trimmed.replace(/<div align="(.*?)">/g, '').replace(/<\/div>/g, '');
                }

                // H1 Heading
                if (processedLine.startsWith('# ')) {
                  return <h2 key={i} className={`text-text font-black text-2xl md:text-3xl mt-10 mb-4 border-b border-stroke pb-2 ${alignmentClass}`}>{processedLine.replace('# ', '')}</h2>;
                }
                // H2 Heading
                if (processedLine.startsWith('## ')) {
                  return <h3 key={i} className={`text-text font-bold text-xl md:text-2xl mt-8 mb-3 ${alignmentClass}`}>{processedLine.replace('## ', '')}</h3>;
                }
                // H3 Heading
                if (processedLine.startsWith('### ')) {
                  return <h4 key={i} className={`text-text font-bold text-lg md:text-xl mt-6 mb-2 ${alignmentClass}`}>{processedLine.replace('### ', '')}</h4>;
                }
                // Universal List Detection Logic
                const listMatch = processedLine.match(/^(\s*)([ivxIVX]+[\.\)]|\d+[\.\)]|[a-zA-Z][\.\)]|[\-■‣•\*]| {4})(.*)/);

                if (listMatch) {
                  const indent = listMatch[1];
                  const marker = listMatch[2].trim();
                  const content = listMatch[3];

                  return (
                    <div key={i} className={`flex gap-3 items-start ml-2 ${alignmentClass}`} style={{ paddingLeft: `${indent.length * 8}px` }}>
                      {marker && marker !== "" ? (
                        <span className="text-accent font-black text-sm mt-0.5 shrink-0 min-w-[1.2rem] text-right">
                          {marker.length === 1 && !/[\.\)]/.test(marker) ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 block mx-auto"></span>
                          ) : marker}
                        </span>
                      ) : (
                        <div className="w-[1.2rem] shrink-0" /> // Spacer for "None" style
                      )}
                      <p className="text-muted text-base md:text-lg" dangerouslySetInnerHTML={{ __html: parseFormatting(content.trim()) }} />
                    </div>
                  );
                }

                return (
                  <p
                    key={i}
                    className={`transition-colors hover:text-text cursor-default leading-relaxed ${alignmentClass} text-muted text-base md:text-lg`}
                    dangerouslySetInnerHTML={{ __html: parseFormatting(processedLine) }}
                  />
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-16 pt-10 border-t border-stroke flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="relative h-12 px-6 rounded-2xl border border-stroke hover:border-accent hover:text-accent transition-all text-xs font-black uppercase tracking-widest flex items-center gap-3 bg-panel shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
                {showCopied && (
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl animate-bounce">
                    Link copied!
                  </span>
                )}
              </button>
              <button
                onClick={handleBookmark}
                className={`h-12 px-6 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-sm ${isBookmarked
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-stroke text-muted hover:border-accent hover:text-accent bg-panel'
                  }`}
              >
                <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
            </div>
            <button
              onClick={onClose}
              className="h-12 px-10 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-[0_20px_40px_-10px_rgba(127,90,240,0.4)] hover:-translate-y-1 transition-all w-full sm:w-auto"
            >
              Close Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostModal;


