import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Terminal, Filter, MessageSquare } from 'lucide-react';
import BlogPostModal from '../components/BlogPostModal';

import { API_BASE } from '../config';

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
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6">
              <Terminal className="w-3 h-3" /> Intel & Insights
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic">
              Terminal <span className="text-accent">/ Blog</span>
            </h1>
            <p className="text-xl text-muted leading-relaxed max-w-2xl font-medium">
              Technical post-mortems, security advisories, and architectural deep-dives from the front lines of software engineering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-30 py-6 border-y border-stroke bg-bg/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-muted shrink-0" />
            <div className="flex gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === category
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'bg-panel border border-stroke text-muted hover:text-text hover:border-accent'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass p-8 h-80 animate-pulse bg-panel border-stroke"></div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 glass border-dashed border-2 border-stroke"
            >
              <MessageSquare className="w-12 h-12 text-muted mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">No logs found</h3>
              <p className="text-muted font-bold">Stay connected for future transmission updates.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass p-8 group cursor-pointer border-stroke hover:border-accent/40 transition-all duration-500"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.featured && (
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-xl shadow-lg">
                      Featured
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted2 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdat || post.CreatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {post.readtime || post.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-accent transition-colors leading-tight uppercase italic tracking-tighter">
                    {post.title}
                  </h3>
                  <p className="text-muted text-sm mb-8 leading-relaxed line-clamp-3 font-bold">
                    {post.excerpt}
                  </p>
                  <div className="pt-6 border-t border-stroke flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                      Read Log <ChevronRight className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-20">
            <button className="w-12 h-12 rounded-2xl border border-stroke flex items-center justify-center hover:border-accent hover:bg-accent/5 transition-all text-muted">
              <chevronLeft className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-accent text-white font-black shadow-lg shadow-accent/20">1</button>
            <button className="w-12 h-12 rounded-2xl border border-stroke hover:border-accent hover:bg-accent/5 transition-all font-black text-muted">2</button>
            <button className="w-12 h-12 rounded-2xl border border-stroke flex items-center justify-center hover:border-accent hover:bg-accent/5 transition-all text-muted">
              <ChevronRight className="w-5 h-5" />
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
