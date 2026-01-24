import React, { useState, useEffect } from 'react';
import BlogPostModal from '../components/BlogPostModal';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/public/blogs`);
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

  const categories = ["All", "FinTech", "Cybersecurity", "Web Development", "Backend", "Database", "Career", "Technology"];

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 border-b border-stroke">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              Thoughts on cybersecurity, software engineering, and building secure systems. 
              Sharing insights from real-world projects and continuous learning.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-stroke relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-accent text-white'
                    : 'bg-panel border border-stroke text-muted hover:text-text hover:border-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass p-6 h-64 animate-pulse bg-panel"></div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-panel border border-stroke rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">No posts found</h3>
              <p className="text-muted">Stay tuned for more updates!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <article 
                  key={post.id} 
                  className="glass p-6 hover:border-accent transition-all group cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.featured && (
                    <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-4">
                      Featured
                    </span>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted2 mb-4">
                    <span>{new Date(post.createdat || post.CreatedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readtime || post.readTime}</span>
                    <span>•</span>
                    <span className="text-accent">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="text-accent font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination (UI Only) */}
          <div className="flex justify-center gap-2 mt-16">
            <button className="w-10 h-10 rounded-xl border border-stroke flex items-center justify-center hover:border-accent transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-xl bg-accent text-white font-bold">1</button>
            <button className="w-10 h-10 rounded-xl border border-stroke hover:border-accent transition-colors font-bold text-muted">2</button>
            <button className="w-10 h-10 rounded-xl border border-stroke hover:border-accent transition-colors font-bold text-muted">3</button>
            <button className="w-10 h-10 rounded-xl border border-stroke flex items-center justify-center hover:border-accent transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Blog Post Modal */}
      {selectedPost && (
        <BlogPostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
};

export default Blog;
