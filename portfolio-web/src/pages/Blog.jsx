import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import BlogPostModal, { FeaturedBadge } from '../components/BlogPostModal';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import { trackSpotlight } from '../utils/spotlight';

import { API_BASE } from '../config';

const PAGE_DESCRIPTION = 'Articles on fintech, application security and backend engineering from my day-to-day work.';

// Filter options shown above the posts. "All" shows every post.
const CATEGORIES = ["All", "FinTech", "Cybersecurity", "Web Development", "Backend", "Database", "Career", "Technology"];

// Number of placeholder cards shown while posts are loading
const SKELETON_COUNT = 3;

// Featured posts get a faint violet wash over the glass (same treatment as the featured skill card on the homepage)
const FEATURED_SURFACE = { background: 'linear-gradient(135deg, var(--accent-soft), transparent 60%), var(--glass-bg)' };

// Short date for a card, e.g. "Oct 25, 2026". Older records may use a different casing for createdAt.
// Returns an empty string when the post has no valid date, so we never show "Invalid Date".
const formatCardDate = (post) => {
  const date = new Date(post.createdAt || post.createdat || post.CreatedAt);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// One clickable post summary on a frosted-glass card with a cursor spotlight.
// It is a real <button>, so it works with the keyboard and screen readers
// (only phrasing elements like <span> are allowed inside a button, hence no <h3>/<p>).
const PostCard = ({ post, onSelect }) => {
  const meta = [formatCardDate(post), post.readtime || post.readTime].filter(Boolean).join(' · ');

  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerMove={trackSpotlight}
      className="glass lift spotlight group relative flex h-full w-full flex-col overflow-hidden rounded-3xl p-6 text-left md:p-7"
      style={post.featured ? FEATURED_SURFACE : undefined}
    >
      {/* Soft glow in the corner of featured posts; -z-10 keeps it behind the text */}
      {post.featured && (
        <span
          aria-hidden="true"
          className="absolute -right-16 -top-20 -z-10 h-[200px] w-[200px] rounded-full opacity-45 blur-[60px]"
          style={{ background: 'var(--glow)' }}
        />
      )}

      {(post.category || post.featured) && (
        <span className="mb-5 flex flex-wrap items-center gap-2">
          {post.category && <span className="chip h-[26px] text-xs font-medium">{post.category}</span>}
          {post.featured && <FeaturedBadge />}
        </span>
      )}

      <span className="font-heading text-[clamp(19px,1.7vw,22px)] font-semibold leading-snug tracking-[-0.025em] text-text">
        {post.title}
      </span>
      <span className="mt-3 line-clamp-3 flex-grow text-[15px] leading-relaxed text-muted">{post.excerpt}</span>

      {/* Footer row: date · read time on the left, "Read" on the right */}
      <span className="mt-6 flex items-center gap-3 border-t border-stroke pt-4">
        {meta && <span className="min-w-0 truncate font-mono text-xs text-muted2">{meta}</span>}
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-medium text-text">
          Read
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
};

// Glass placeholder with the same shape as a PostCard (skeleton loaders may pulse)
const PostCardSkeleton = () => (
  <div className="glass animate-pulse rounded-3xl p-6 md:p-7" aria-hidden="true">
    <div className="h-[26px] w-24 rounded-full bg-fill-strong" />
    <div className="mt-5 h-5 w-4/5 rounded-full bg-fill-strong" />
    <div className="mt-2.5 h-5 w-1/2 rounded-full bg-fill-strong" />
    <div className="mt-5 space-y-2.5">
      <div className="h-3 rounded-full bg-fill" />
      <div className="h-3 rounded-full bg-fill" />
      <div className="h-3 w-2/3 rounded-full bg-fill" />
    </div>
    <div className="mt-6 border-t border-stroke pt-4">
      <div className="h-3 w-32 rounded-full bg-fill-strong" />
    </div>
  </div>
);

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blogs`);
      const data = await res.json();
      if (data.ok) {
        setBlogPosts(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Stable reference so the modal's keyboard/scroll-lock effect does not re-run on every render
  const closePost = useCallback(() => setSelectedPost(null), []);

  // Number of posts per category, shown next to each filter tab
  const categoryCounts = useMemo(() => {
    const counts = { All: blogPosts.length };
    blogPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [blogPosts]);

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const isFiltered = selectedCategory !== "All";
  const postCountLabel = `${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'}`;

  return (
    <div className="pb-20 md:pb-28">
      <Helmet>
        <title>Blog | Rahman Shishir</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
      </Helmet>

      <PageHeader
        eyebrow="Blog"
        title={<>Field notes on <span className="gradient-text">secure</span> engineering.</>}
        description={PAGE_DESCRIPTION}
      />

      {/* Category filter: a frosted pill bar that sticks just below the floating navbar (top-[5.5rem] = 88px)
          and scrolls sideways on small screens */}
      <div className="sticky top-[5.5rem] z-30">
        <div className="container">
          <div className="nav-glass flex items-center gap-2 rounded-[22px] p-0.5">
            {/* p-1 leaves room for the focus ring, which the scroll container would otherwise clip */}
            <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto p-1" role="group" aria-label="Filter posts by category">
              {CATEGORIES.map(category => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={isActive}
                    className={`flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-colors focus-visible:outline-offset-0 ${isActive
                      ? 'bg-text text-bg shadow-[0_8px_24px_-10px_var(--glow)]'
                      : 'text-muted hover:bg-fill-strong hover:text-text'
                      }`}
                  >
                    {category}
                    {!loading && (
                      <span className={`font-mono text-[11px] ${isActive ? 'text-bg/70' : 'text-muted2'}`}>{categoryCounts[category] || 0}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <span className="hidden shrink-0 border-l border-stroke py-1 pl-4 pr-4 font-mono text-xs text-muted2 md:block">
              {loading ? 'Loading…' : postCountLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container pt-8 md:pt-10">
        {loading ? (
          <>
            <p className="sr-only" role="status">Loading posts…</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : filteredPosts.length === 0 ? (
          <Panel className="animate-fade-in-up rounded-3xl" bodyClassName="flex flex-col items-center px-6 py-14 text-center md:py-20">
            <span className="icon-box h-12 w-12 rounded-[14px]">
              <BookOpen className="h-[22px] w-[22px]" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-heading text-2xl font-semibold tracking-[-0.03em] text-text">
              {isFiltered ? `No posts in ${selectedCategory} yet` : 'No posts yet'}
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
              {isFiltered ? 'Try another category, or check back soon.' : 'New articles are on the way. Check back soon.'}
            </p>
            {isFiltered && (
              <button type="button" onClick={() => setSelectedCategory("All")} className="btn-secondary mt-7">
                Show all posts
              </button>
            )}
          </Panel>
        ) : (
          <>
            <h2 className="sr-only">{isFiltered ? `${selectedCategory} posts` : 'All posts'}</h2>
            <ul className="animate-fade-in-up grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map(post => (
                <li key={post._id}>
                  <PostCard post={post} onSelect={() => setSelectedPost(post)} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Blog Post Modal (keyed by post so its saved/bookmark state is read fresh for each post) */}
      {selectedPost && (
        <BlogPostModal
          key={selectedPost._id}
          post={selectedPost}
          onClose={closePost}
        />
      )}
    </div>
  );
};

export default Blog;
