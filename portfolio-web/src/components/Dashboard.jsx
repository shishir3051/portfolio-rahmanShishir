import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [adminKey, setAdminKey] = useState(localStorage.getItem("ADMIN_KEY") || "");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  
  const initialProjectState = {
    title: "",
    tag: "",
    desc: "",
    year: new Date().getFullYear().toString(),
    role: "Lead Developer",
    tech: "",
    details: "", // Bullet points separated by new lines
    live: "",
    repo: "",
    sortOrder: 0
  };

  const initialBlogState = {
    title: "",
    excerpt: "",
    content: "",
    category: "Technology",
    readTime: "5 min read",
    featured: false
  };

  const [projectForm, setProjectForm] = useState(initialProjectState);
  const [blogForm, setBlogForm] = useState(initialBlogState);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
      else setStatus("Error fetching messages: " + (data.error || "Unauthorized"));
    } catch (err) {
      setStatus("Failed to connect to backend");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/public/projects`);
      const data = await res.json();
      if (data.ok) setProjects(data.projects || []);
      else setStatus("Error fetching projects");
    } catch (err) {
      setStatus("Failed to connect to backend");
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blogs`, {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await res.json();
      if (res.ok) setBlogs(data.blogs || []);
      else setStatus("Error fetching blogs");
    } catch (err) {
      setStatus("Failed to connect to backend");
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchMessages();
      fetchProjects();
      fetchBlogs();
    }
  }, [adminKey]);

  const saveKey = () => {
    localStorage.setItem("ADMIN_KEY", adminKey);
    setStatus("Admin Key Saved");
    setTimeout(() => setStatus(""), 2000);
    fetchMessages();
    fetchBlogs();
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: { 'x-admin-key': adminKey }
      });
      if (res.ok) {
        setStatus("Project Deleted");
        fetchProjects();
      }
    } catch (err) {
      setStatus("Delete failed");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { 'x-admin-key': adminKey }
      });
      if (res.ok) {
        setStatus("Blog Deleted");
        fetchBlogs();
      }
    } catch (err) {
      setStatus("Delete failed");
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setProjectForm({
      title: p.title || "",
      tag: p.tag || "",
      desc: p.desc || p.description || "",
      year: p.year || p.projectyear || "",
      role: p.role || "",
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : (p.techcsv || ""),
      details: Array.isArray(p.details) ? p.details.join("\n") : (typeof p.detailsjson === 'string' ? JSON.parse(p.detailsjson).join("\n") : ""),
      live: p.live || p.liveurl || "",
      repo: p.repo || p.repourl || "",
      sortOrder: p.sortOrder || p.sortorder || 0
    });
    setActiveTab('add-project');
  };

  const startEditBlog = (b) => {
    setEditingBlogId(b.id);
    setBlogForm({
      title: b.title || "",
      excerpt: b.excerpt || "",
      content: b.content || "",
      category: b.category || "Technology",
      readTime: b.readtime || b.readTime || "5 min read",
      featured: !!b.featured
    });
    setActiveTab('add-blog');
  };

  const saveProject = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    setStatus(isEdit ? "Updating project..." : "Adding project...");
    
    try {
      const url = isEdit ? `${API_BASE}/api/projects/${editingId}` : `${API_BASE}/api/projects`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminKey 
        },
        body: JSON.stringify({
          ...projectForm,
          tech: projectForm.tech.split(",").map(s => s.trim()).filter(Boolean),
          details: projectForm.details.split("\n").map(s => s.trim()).filter(Boolean)
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        setStatus(isEdit ? "Project Updated!" : "Project Added!");
        setProjectForm(initialProjectState);
        setEditingId(null);
        setActiveTab('projects');
        fetchProjects();
      } else {
        setStatus("Error: " + (data.error || "Failed to save project"));
      }
    } catch (err) {
      setStatus("Failed to connect to backend");
    }
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    const isEdit = !!editingBlogId;
    setStatus(isEdit ? "Updating blog..." : "Adding blog...");
    
    try {
      const url = isEdit ? `${API_BASE}/api/blogs/${editingBlogId}` : `${API_BASE}/api/blogs`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminKey 
        },
        body: JSON.stringify(blogForm)
      });
      
      const data = await res.json();
      if (data.ok) {
        setStatus(isEdit ? "Blog Updated!" : "Blog Added!");
        setBlogForm(initialBlogState);
        setEditingBlogId(null);
        setActiveTab('blogs');
        fetchBlogs();
      } else {
        setStatus("Error: " + (data.error || "Failed to save blog"));
      }
    } catch (err) {
      setStatus("Failed to connect to backend");
    }
  };

  const insertFormat = (before, after = '') => {
    const el = document.getElementById('blog-content-area');
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setBlogForm(prev => ({ ...prev, content: newText }));

    // Focus back and set cursor
    setTimeout(() => {
      el.focus();
      const cursorOffset = before.length;
      el.setSelectionRange(start + cursorOffset, start + cursorOffset + selectedText.length);
    }, 0);
  };

  const toggleList = (type) => {
    const el = document.getElementById('blog-content-area');
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);
    
    const lines = selectedText.split('\n');
    const formattedLines = lines.map((line, i) => {
      let prefix = '';
      switch(type) {
        case 'number': prefix = `${i + 1}. `; break;
        case 'number-paren': prefix = `${i + 1}) `; break;
        case 'alpha': prefix = `${String.fromCharCode(97 + (i % 26))}. `; break;
        case 'roman': {
          const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
          prefix = `${romans[i % 10]}. `; 
          break;
        }
        case 'bullet-square': prefix = '■ '; break;
        case 'bullet-triangle': prefix = '‣ '; break;
        case 'none': prefix = '    '; break; // Just indentation
        default: prefix = '- ';
      }
      return prefix + line;
    });
    
    const newText = text.substring(0, start) + formattedLines.join('\n') + text.substring(end);
    setBlogForm(prev => ({ ...prev, content: newText }));

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + formattedLines.join('\n').length);
    }, 0);
  };

  const handleBackToSite = () => {
    localStorage.removeItem("ADMIN_KEY");
    localStorage.removeItem("isAdmin");
    window.history.pushState({}, "", "/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6 md:p-12">
      <header className="mb-12 flex justify-between items-end border-b border-stroke pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Manage your portfolio messages, projects, and blog</p>
        </div>
        <button 
          onClick={handleBackToSite}
          className="px-4 py-2 rounded-xl bg-panel border border-stroke hover:bg-panel2 transition-all text-sm font-bold"
        >
          Back to Site
        </button>
      </header>

      <div className="grid md:grid-cols-[1fr_2.5fr] gap-8">
        <aside className="space-y-6">
          <div className="p-6 bg-panel border border-stroke rounded-2xl backdrop-blur-xl">
            <h3 className="font-bold mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted font-bold uppercase tracking-wider mb-2">Admin Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="flex-1 bg-panel border border-stroke rounded-lg px-3 py-2 text-sm focus:border-accent outline-none"
                    placeholder="Enter Key..."
                  />
                  <button onClick={saveKey} className="bg-accent px-3 py-2 rounded-lg text-sm font-bold">Save</button>
                </div>
              </div>
              {status && <p className="text-accent2 text-xs font-bold">{status}</p>}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('messages')}
              className={`text-left px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'messages' ? 'bg-accent/20 border border-accent/40 text-text' : 'text-muted hover:bg-panel'}`}
            >
              Messages ({messages.length})
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`text-left px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'projects' ? 'bg-accent/20 border border-accent/40 text-text' : 'text-muted hover:bg-panel'}`}
            >
              Projects ({projects.length})
            </button>
            <button 
              onClick={() => setActiveTab('blogs')}
              className={`text-left px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'blogs' ? 'bg-accent/20 border border-accent/40 text-text' : 'text-muted hover:bg-panel'}`}
            >
              Blogs ({blogs.length})
            </button>
            <div className="pt-4 space-y-2">
              <button 
                onClick={() => {
                  setEditingId(null);
                  setProjectForm(initialProjectState);
                  setActiveTab('add-project');
                }}
                className={`w-full text-left px-6 py-3 rounded-xl border border-stroke/50 text-sm font-bold transition-all ${activeTab === 'add-project' && !editingId ? 'bg-accent text-white border-accent' : 'text-muted hover:bg-panel'}`}
              >
                + Add Project
              </button>
              <button 
                onClick={() => {
                  setEditingBlogId(null);
                  setBlogForm(initialBlogState);
                  setActiveTab('add-blog');
                }}
                className={`w-full text-left px-6 py-3 rounded-xl border border-stroke/50 text-sm font-bold transition-all ${activeTab === 'add-blog' && !editingBlogId ? 'bg-accent text-white border-accent' : 'text-muted hover:bg-panel'}`}
              >
                + Write Blog
              </button>
            </div>
          </nav>
        </aside>

        <main className="bg-panel border border-stroke rounded-2xl backdrop-blur-xl overflow-hidden min-h-[600px]">
          {activeTab === 'messages' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stroke bg-panel">
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke">
                  {messages.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-12 text-center text-muted italic">No messages found or unauthorized</td></tr>
                  ) : (
                    messages.map((m, i) => (
                      <tr key={i} className="hover:bg-panel transition-all">
                        <td className="px-6 py-4">
                          <div className="font-bold">{m.fullname}</div>
                          <div className="text-xs text-muted2">{m.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted line-clamp-2 max-w-xs">{m.message}</td>
                        <td className="px-6 py-4 text-xs text-muted2 whitespace-nowrap">{new Date(m.createdat || m.CreatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'projects' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stroke bg-panel">
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Tag</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke">
                  {projects.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-12 text-center text-muted italic">No projects found</td></tr>
                  ) : (
                    projects.map((p, i) => (
                      <tr key={i} className="hover:bg-panel transition-all">
                        <td className="px-6 py-4">
                          <div className="font-bold">{p.title}</div>
                          <div className="text-xs text-muted2">{p.year || p.projectyear}</div>
                        </td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-panel border border-stroke text-[10px] uppercase font-bold">{p.tag}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => startEdit(p)}
                              className="bg-accent/20 text-accent hover:bg-accent/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteProject(p.id)}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'blogs' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stroke bg-panel">
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke">
                  {blogs.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-muted italic">No blog posts found</td></tr>
                  ) : (
                    blogs.map((b, i) => (
                      <tr key={i} className="hover:bg-panel transition-all">
                        <td className="px-6 py-4">
                          <div className="font-bold">{b.title}</div>
                          <div className="text-xs text-muted2">{new Date(b.createdat || b.CreatedAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-panel border border-stroke text-[10px] uppercase font-bold">{b.category}</span></td>
                        <td className="px-6 py-4 text-xs">{b.isactive !== false ? '✅ Active' : '❌ Hidden'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => startEditBlog(b)}
                              className="bg-accent/20 text-accent hover:bg-accent/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteBlog(b.id)}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'add-project' ? (
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Project' : 'Create New Project'}</h2>
              <form onSubmit={saveProject} className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Project Title</label>
                  <input 
                    type="text" required
                    value={projectForm.title}
                    onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="E.g. AI Portfolio"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Tag / Category</label>
                  <input 
                    type="text"
                    value={projectForm.tag}
                    onChange={e => setProjectForm({...projectForm, tag: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="E.g. Full-stack / AI"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted uppercase">Description</label>
                  <textarea 
                    value={projectForm.desc}
                    onChange={e => setProjectForm({...projectForm, desc: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent min-h-[80px] resize-none"
                    placeholder="Short description..."
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Year</label>
                  <input 
                    type="text"
                    value={projectForm.year}
                    onChange={e => setProjectForm({...projectForm, year: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Role</label>
                  <input 
                    type="text"
                    value={projectForm.role}
                    onChange={e => setProjectForm({...projectForm, role: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="E.g. Lead Developer"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted uppercase">Tech Stack (comma separated)</label>
                  <input 
                    type="text"
                    value={projectForm.tech}
                    onChange={e => setProjectForm({...projectForm, tech: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="React, Node.js, SQL"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted uppercase">Key Points (one per line)</label>
                  <textarea 
                    value={projectForm.details}
                    onChange={e => setProjectForm({...projectForm, details: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent min-h-[100px] resize-none"
                    placeholder="Implemented ISO 20022 migration tools...&#10;Handled high-volume transactions..."
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Live URL</label>
                  <input 
                    type="url"
                    value={projectForm.live}
                    onChange={e => setProjectForm({...projectForm, live: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Repo URL</label>
                  <input 
                    type="url"
                    value={projectForm.repo}
                    onChange={e => setProjectForm({...projectForm, repo: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="https://github.com/..."
                  />
                </div>
                <button type="submit" className="md:col-span-2 bg-accent hover:bg-accent/80 transition-all py-4 rounded-xl font-bold shadow-lg shadow-accent/20">
                  {editingId ? 'Update Project' : 'Save Project'}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6">{editingBlogId ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
              <form onSubmit={saveBlog} className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted uppercase">Blog Title</label>
                  <input 
                    type="text" required
                    value={blogForm.title}
                    onChange={e => setBlogForm({...blogForm, title: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="E.g. Implementing ISO 20022"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted uppercase">Excerpt</label>
                  <textarea 
                    required
                    value={blogForm.excerpt}
                    onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent min-h-[80px] resize-none"
                    placeholder="Short summary for the card..."
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-muted uppercase tracking-wider">Editor Ribbon</label>
                    <span className="text-[10px] text-accent/50 font-black uppercase tracking-widest">Full Suite 1.0</span>
                  </div>
                  
                  {/* Refined Microsoft Word Style Ribbon */}
                  <div className="bg-[#f8f9fa] dark:bg-[#1a1a1f] border border-stroke rounded-t-2xl p-2 flex flex-wrap items-stretch gap-1.5 shadow-inner min-h-[100px]">
                    
                    {/* Clipboard Group */}
                    <div className="flex flex-col border-r border-stroke pr-3 mr-1">
                      <div className="flex-1 flex items-center gap-1">
                        <div className="flex flex-col items-center px-1">
                          <button type="button" onClick={() => insertFormat('clipboard')} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-muted hover:text-accent transition-all group" title="Paste">
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          </button>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <button type="button" onClick={() => {}} className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-[10px] text-muted flex items-center gap-2 font-bold uppercase tracking-tighter">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
                            Copy
                          </button>
                          <button type="button" onClick={() => {}} className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-[10px] text-muted flex items-center gap-2 font-bold uppercase tracking-tighter">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" /></svg>
                            Cut
                          </button>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-muted2 uppercase tracking-widest text-center mt-auto pt-1">Clipboard</span>
                    </div>

                    {/* Font Group */}
                    <div className="flex flex-col border-r border-stroke pr-3 mr-1">
                      <div className="flex-1 grid grid-cols-4 items-center gap-0.5">
                        <button type="button" onClick={() => insertFormat('**', '**')} className="w-8 h-8 font-serif font-black hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-sm group relative flex items-center justify-center" title="Bold">B</button>
                        <button type="button" onClick={() => insertFormat('*', '*')} className="w-8 h-8 font-serif italic hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-sm flex items-center justify-center" title="Italic">I</button>
                        <button type="button" onClick={() => insertFormat('<u>', '</u>')} className="w-8 h-8 underline hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-sm decoration-2 flex items-center justify-center" title="Underline">U</button>
                        <button type="button" onClick={() => insertFormat('~~', '~~')} className="w-8 h-8 line-through hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-xs flex items-center justify-center opacity-70" title="Strikethrough">abc</button>
                        
                        <button type="button" onClick={() => insertFormat('<sub>', '</sub>')} className="w-8 h-8 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-[10px] flex items-end justify-center pb-1.5" title="Subscript">x<sub className="mb-0.5 scale-75">2</sub></button>
                        <button type="button" onClick={() => insertFormat('<sup>', '</sup>')} className="w-8 h-8 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-[10px] flex items-start justify-center pt-1.5" title="Superscript">x<sup className="mt-0.5 scale-75">2</sup></button>
                        <button type="button" onClick={() => insertFormat('<mark>', '</mark>')} className="w-8 h-8 hover:bg-black/5 dark:hover:bg-white/5 rounded-md flex flex-col items-center justify-center gap-0" title="Highlight">
                          <span className="text-[10px] font-black leading-none">ab</span>
                          <div className="w-4 h-1.5 bg-yellow-400 mt-0.5"></div>
                        </button>
                        <button type="button" onClick={() => insertFormat('<span style="color:var(--accent)">', '</span>')} className="w-8 h-8 hover:bg-black/5 dark:hover:bg-white/5 rounded-md flex flex-col items-center justify-center gap-0" title="Font Color">
                          <span className="text-sm font-black text-accent leading-none">A</span>
                          <div className="w-4 h-1 bg-accent mt-0.5"></div>
                        </button>
                      </div>
                      <span className="text-[9px] font-black text-muted2 uppercase tracking-widest text-center mt-auto pt-1">Font</span>
                    </div>

                    {/* Paragraph Group with List Library */}
                    <div className="flex flex-col border-r border-stroke pr-3 mr-1">
                      <div className="flex-1 flex flex-col justify-center gap-1.5">
                        <div className="flex items-center gap-1">
                          {/* List Library Dropdown Button */}
                          <div className="relative group">
                            <button type="button" className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-muted hover:text-accent transition-all flex items-center gap-0.5" title="List Library">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </button>
                            
                            {/* Library Menu */}
                            <div className="absolute top-full left-0 mt-1 w-[220px] bg-panel border border-stroke rounded-xl p-3 shadow-2xl z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                              <h4 className="text-[10px] font-black uppercase text-accent mb-2 tracking-widest">Numbering Library</h4>
                              <div className="grid grid-cols-3 gap-2 mb-3">
                                <button type="button" onClick={() => toggleList('number')} className="p-2 border border-stroke rounded-lg hover:border-accent bg-bg/50 text-[10px] text-left leading-tight">1.<br/>2.<br/>3.</button>
                                <button type="button" onClick={() => toggleList('number-paren')} className="p-2 border border-stroke rounded-lg hover:border-accent bg-bg/50 text-[10px] text-left leading-tight">1)<br/>2)<br/>3)</button>
                                <button type="button" onClick={() => toggleList('roman')} className="p-2 border border-stroke rounded-lg hover:border-accent bg-bg/50 text-[10px] text-left leading-tight">i.<br/>ii.<br/>iii.</button>
                              </div>
                              <h4 className="text-[10px] font-black uppercase text-accent mb-2 tracking-widest">Bullet & Others</h4>
                              <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => toggleList('bullet')} className="p-2 border border-stroke rounded-lg hover:border-accent bg-bg/50 text-[10px] text-left leading-tight">•<br/>•<br/>•</button>
                                <button type="button" onClick={() => toggleList('bullet-square')} className="p-2 border border-stroke rounded-lg hover:border-accent bg-bg/50 text-[10px] text-left leading-tight">■<br/>■<br/>■</button>
                                <button type="button" onClick={() => toggleList('none')} className="p-2 border border-stroke rounded-lg border-dashed hover:border-accent bg-bg/50 text-[10px] text-center flex flex-col justify-center gap-1 font-bold">
                                  <span>None</span>
                                  <div className="w-full border-t border-stroke h-1"></div>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <button type="button" onClick={() => insertFormat('<div align="left">\n', '\n</div>')} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-accent" title="Align Left">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" /></svg>
                          </button>
                          <button type="button" onClick={() => insertFormat('<div align="center">\n', '\n</div>')} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-muted hover:text-accent transition-all" title="Center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 10h10M4 14h16M7 18h10" /></svg>
                          </button>
                          <button type="button" onClick={() => insertFormat('<div align="right">\n', '\n</div>')} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-muted hover:text-accent transition-all" title="Align Right">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 10h10M4 14h16M10 18h10" /></svg>
                          </button>
                          <button type="button" onClick={() => insertFormat('<div align="justify">\n', '\n</div>')} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-muted hover:text-accent transition-all" title="Justify">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                          </button>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-muted2 uppercase tracking-widest text-center mt-auto pt-1">Paragraph</span>
                    </div>

                    {/* Styles Group */}
                    <div className="flex flex-col pl-2">
                       <div className="flex-1 flex items-center gap-1.5">
                         <button type="button" onClick={() => insertFormat('# ', '')} className="px-4 h-[60px] bg-white dark:bg-bg border border-stroke rounded-xl flex flex-col justify-center items-center hover:border-accent transition-all group shadow-sm">
                           <span className="text-xl font-black text-text leading-none group-hover:text-accent transition-colors italic">AaBb</span>
                           <span className="text-[8px] font-bold text-muted uppercase mt-1 tracking-tighter">Heading 1</span>
                         </button>
                         <button type="button" onClick={() => insertFormat('## ', '')} className="px-4 h-[60px] bg-white dark:bg-bg border border-stroke rounded-xl flex flex-col justify-center items-center hover:border-accent transition-all group shadow-sm">
                           <span className="text-lg font-bold text-muted leading-none group-hover:text-accent transition-colors italic">AaBb</span>
                           <span className="text-[8px] font-bold text-muted uppercase mt-1 tracking-tighter">Heading 2</span>
                         </button>
                         <button type="button" onClick={() => insertFormat('### ', '')} className="px-4 h-[60px] bg-white dark:bg-bg border border-stroke rounded-xl flex flex-col justify-center items-center hover:border-accent transition-all group shadow-sm">
                           <span className="text-base font-medium text-muted2 leading-none group-hover:text-accent transition-colors italic">AaBb</span>
                           <span className="text-[8px] font-bold text-muted uppercase mt-1 tracking-tighter">Heading 3</span>
                         </button>
                       </div>
                       <span className="text-[9px] font-black text-muted2 uppercase tracking-widest text-center mt-auto pt-1">Styles</span>
                    </div>

                  </div>

                  <textarea 
                    id="blog-content-area"
                    required
                    value={blogForm.content}
                    onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                    className="bg-panel border-x border-b border-stroke rounded-b-2xl px-6 py-8 outline-none focus:border-accent min-h-[450px] resize-none font-mono text-[0.95rem] leading-relaxed block w-full"
                    placeholder="Describe your breakthrough..."
                  />
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted2 uppercase tracking-widest mt-2 px-2">
                    <span>Markdown + HTML Subsets Supported</span>
                    <span>Characters: {blogForm.content.length}</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Category</label>
                  <select 
                    value={blogForm.category}
                    onChange={e => setBlogForm({...blogForm, category: e.target.value})}
                    className="bg-[#1c1c2b] border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent text-text w-full appearance-none cursor-pointer"
                  >
                    {["FinTech", "Cybersecurity", "Web Development", "Backend", "Database", "Career", "Technology"].map(c => (
                      <option key={c} value={c} className="bg-[#1c1c2b] text-text">{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-muted uppercase">Read Time</label>
                  <input 
                    type="text"
                    value={blogForm.readTime}
                    onChange={e => setBlogForm({...blogForm, readTime: e.target.value})}
                    className="bg-panel border border-stroke rounded-xl px-4 py-3 outline-none focus:border-accent"
                    placeholder="E.g. 5 min read"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="featured"
                    checked={blogForm.featured}
                    onChange={e => setBlogForm({...blogForm, featured: e.target.checked})}
                    className="w-5 h-5 accent-accent"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-text cursor-pointer">Mark as Featured</label>
                </div>
                <button type="submit" className="md:col-span-2 bg-accent hover:bg-accent/80 transition-all py-4 rounded-xl font-bold shadow-lg shadow-accent/20">
                  {editingBlogId ? 'Update Blog Post' : 'Post Blog'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
