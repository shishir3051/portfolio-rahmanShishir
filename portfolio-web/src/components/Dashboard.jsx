import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Pencil, Trash2, Reply, Plus, Inbox, FolderGit2, FileText, Settings,
  AlignLeft, AlignCenter, AlignRight,
} from 'lucide-react';

import { API_BASE } from '../config';
import Panel from './Panel';

const BLOG_CATEGORIES = ["FinTech", "Cybersecurity", "Web Development", "Backend", "Database", "Career", "Technology"];

const TABS = [
  { id: 'messages', label: 'Inbox', icon: Inbox },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'blogs', label: 'Posts', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Short date like "15 Mar 2025"; "—" when the record has no valid date
const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

// "1–10 of 23" for paginated lists, otherwise "3 total"
const rangeLabel = (pagination, count) => {
  if (!pagination) return `${count} total`;
  const { page, limit, total } = pagination;
  if (!total) return '0 total';
  return `${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`;
};

// Status messages are plain strings; anything that reads like a failure is shown as an error
const isErrorStatus = (text) => /error|fail|not match|unauthori/i.test(text);

const PaginationControls = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-2 font-mono text-xs text-muted2">
      <button
        type="button"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="icon-btn h-8 w-8 rounded-[10px] disabled:pointer-events-none disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span>{pagination.page} / {pagination.totalPages}</span>
      <button
        type="button"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.totalPages}
        className="icon-btn h-8 w-8 rounded-[10px] disabled:pointer-events-none disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

// ---- Small building blocks for dense tables and forms ----

// Shared classes so every table looks the same: soft header strip, hairline rows, glass hover
const TABLE_HEAD = 'border-b border-stroke bg-fill';
const TABLE_ROW = 'transition-colors hover:bg-fill-strong';
const ROW_ACTION_BTN = 'icon-btn h-8 w-8 rounded-[10px]';
const TABLE_CHIP = 'chip px-2.5 py-0.5 text-xs'; // pill tag, slightly smaller to keep rows dense
const INLINE_CODE = 'rounded-md bg-fill px-1.5 py-0.5 font-mono text-xs text-accent';

const Th = ({ children, className = '' }) => (
  <th scope="col" className={`px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted2 ${className}`}>
    {children}
  </th>
);

const EmptyRow = ({ colSpan, children }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-muted2">{children}</td>
  </tr>
);

const RowActions = ({ label, onEdit, onDelete }) => (
  <div className="flex justify-end gap-1">
    <button type="button" onClick={onEdit} className={`${ROW_ACTION_BTN} hover:text-accent`} aria-label={`Edit ${label}`} title="Edit">
      <Pencil className="h-3.5 w-3.5" />
    </button>
    <button type="button" onClick={onDelete} className={`${ROW_ACTION_BTN} hover:text-danger`} aria-label={`Delete ${label}`} title="Delete">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </div>
);

// Label + control; `span` sets the grid column span (forms use a 6-column grid on md+)
const Field = ({ id, label, span = 'md:col-span-6', children }) => (
  <div className={span}>
    <label htmlFor={id} className="label">{label}</label>
    {children}
  </div>
);

// Save / cancel bar at the bottom of each form panel
const FormActions = ({ submitLabel, onCancel }) => (
  <div className="flex justify-end gap-2 border-t border-stroke bg-fill px-4 py-3 md:px-5">
    {onCancel && <button type="button" onClick={onCancel} className="btn-secondary h-9 px-4">Cancel</button>}
    <button type="submit" className="btn-primary h-9 px-4">{submitLabel}</button>
  </div>
);

// Bordered checkbox row used in the project and post forms
const CHECK_ROW = 'flex cursor-pointer gap-3 rounded-xl border border-stroke bg-fill px-3.5 py-3 transition-colors hover:border-stroke-strong';

// One-row formatting toolbar for the blog editor (inserts the markup that BlogPostModal renders)
const ToolButton = ({ label, onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-[13px] text-muted transition-colors hover:bg-fill-strong hover:text-text ${className}`}
    aria-label={label}
    title={label}
  >
    {children}
  </button>
);
const ToolDivider = () => <span className="mx-1 h-5 w-px bg-stroke" aria-hidden="true" />;

// Frosted strip that sits flush on top of the content textarea
const EditorToolbar = ({ onFormat, onList }) => (
  <div
    className="flex flex-wrap items-center gap-0.5 rounded-t-[12px] border border-b-0 border-stroke p-1.5 backdrop-blur-md"
    style={{ background: 'var(--fill-1)' }}
    role="toolbar"
    aria-label="Formatting"
  >
    <ToolButton label="Bold" onClick={() => onFormat('**', '**')} className="font-bold">B</ToolButton>
    <ToolButton label="Italic" onClick={() => onFormat('*', '*')} className="italic">I</ToolButton>
    <ToolButton label="Underline" onClick={() => onFormat('<u>', '</u>')} className="underline">U</ToolButton>
    <ToolButton label="Strikethrough" onClick={() => onFormat('~~', '~~')} className="line-through">S</ToolButton>
    <ToolButton label="Subscript" onClick={() => onFormat('<sub>', '</sub>')}>x₂</ToolButton>
    <ToolButton label="Superscript" onClick={() => onFormat('<sup>', '</sup>')}>x²</ToolButton>
    <ToolButton label="Highlight" onClick={() => onFormat('<mark>', '</mark>')}>
      <span className="bg-yellow-400/40 px-0.5 text-text">ab</span>
    </ToolButton>
    <ToolButton label="Accent colour" onClick={() => onFormat('<span style="color:var(--accent)">', '</span>')}>
      <span className="font-bold text-accent">A</span>
    </ToolButton>
    <ToolDivider />
    <ToolButton label="Bulleted list" onClick={() => onList('bullet')}>•</ToolButton>
    <ToolButton label="Square bullets" onClick={() => onList('bullet-square')}>■</ToolButton>
    <ToolButton label="Numbered list" onClick={() => onList('number')}>1.</ToolButton>
    <ToolButton label="Numbered list with parentheses" onClick={() => onList('number-paren')}>1)</ToolButton>
    <ToolButton label="Roman numerals" onClick={() => onList('roman')}>i.</ToolButton>
    <ToolButton label="Indent without marker" onClick={() => onList('none')}>⇥</ToolButton>
    <ToolDivider />
    <ToolButton label="Align left" onClick={() => onFormat('<div align="left">\n', '\n</div>')}><AlignLeft className="h-3.5 w-3.5" /></ToolButton>
    <ToolButton label="Align centre" onClick={() => onFormat('<div align="center">\n', '\n</div>')}><AlignCenter className="h-3.5 w-3.5" /></ToolButton>
    <ToolButton label="Align right" onClick={() => onFormat('<div align="right">\n', '\n</div>')}><AlignRight className="h-3.5 w-3.5" /></ToolButton>
    <ToolDivider />
    <ToolButton label="Heading 1" onClick={() => onFormat('# ', '')}>H1</ToolButton>
    <ToolButton label="Heading 2" onClick={() => onFormat('## ', '')}>H2</ToolButton>
    <ToolButton label="Heading 3" onClick={() => onFormat('### ', '')}>H3</ToolButton>
  </div>
);

const Dashboard = ({ tokenProp }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [expandedMessage, setExpandedMessage] = useState(null);

  const [messagesPagination, setMessagesPagination] = useState(null);
  const [projectsPagination, setProjectsPagination] = useState(null);
  const [blogsPagination, setBlogsPagination] = useState(null);

  // The session token comes from App (after login) or from the stored session
  const adminToken = tokenProp || localStorage.getItem("adminToken") || "";

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
    sortOrder: 0,
    isProfessional: false
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
  const [profileForm, setProfileForm] = useState({ username: "", password: "", confirmPassword: "" });

  // GET a list endpoint and resolve to { res, data }. State is only updated in the .then callbacks
  // below (never synchronously), so these loaders are safe to start from an effect.
  const getJson = useCallback((path, withAuth) =>
    fetch(`${API_BASE}${path}`, withAuth ? { headers: { 'Authorization': `Bearer ${adminToken}` } } : undefined)
      .then(async (res) => ({ res, data: await res.json() })),
  [adminToken]);

  const reportConnectionError = (what) => (err) => {
    console.error(`[Dashboard] Failed to fetch ${what}:`, err);
    setStatus("Failed to connect to backend");
  };

  const fetchMessages = useCallback((page = 1) =>
    getJson(`/api/messages?page=${page}&limit=10`, true)
      .then(({ res, data }) => {
        if (res.ok) {
          setMessages(data.messages || []);
          setMessagesPagination(data.pagination);
        }
        else setStatus("Error fetching messages: " + (data.error || "Unauthorized"));
      })
      .catch(reportConnectionError('messages')),
  [getJson]);

  const fetchProjects = useCallback((page = 1) =>
    getJson(`/api/projects?page=${page}&limit=10`, false)
      .then(({ data }) => {
        if (data.ok) {
          setProjects(data.projects || []);
          setProjectsPagination(data.pagination);
        }
        else setStatus("Error fetching projects");
      })
      .catch(reportConnectionError('projects')),
  [getJson]);

  const fetchBlogs = useCallback((page = 1) =>
    getJson(`/api/blogs?page=${page}&limit=10`, true)
      .then(({ res, data }) => {
        if (res.ok) {
          setBlogs(data.blogs || []);
          setBlogsPagination(data.pagination);
        }
        else setStatus("Error fetching blogs");
      })
      .catch(reportConnectionError('blogs')),
  [getJson]);

  // Load everything once a session token is available
  useEffect(() => {
    if (!adminToken) return;
    fetchMessages();
    fetchProjects();
    fetchBlogs();
  }, [adminToken, fetchMessages, fetchProjects, fetchBlogs]);


  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setStatus("Project Deleted");
        fetchProjects(projectsPagination?.page || 1);
      }
    } catch (err) {
      console.error("[Dashboard] Project delete failed:", err);
      setStatus("Delete failed");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setStatus("Blog Deleted");
        fetchBlogs(blogsPagination?.page || 1);
      }
    } catch (err) {
      console.error("[Dashboard] Blog delete failed:", err);
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
      sortOrder: p.sortOrder || p.sortorder || 0,
      isProfessional: !!p.isProfessional
    });
    setActiveTab('add-project');
  };

  const startEditBlog = (b) => {
    setEditingBlogId(b._id || b.id);
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

  // Open an empty form ("+ Project" / "+ Post")
  const newProject = () => {
    setEditingId(null);
    setProjectForm(initialProjectState);
    setActiveTab('add-project');
  };
  const newBlog = () => {
    setEditingBlogId(null);
    setBlogForm(initialBlogState);
    setActiveTab('add-blog');
  };

  // Leave a form without saving
  const cancelProject = () => {
    setEditingId(null);
    setProjectForm(initialProjectState);
    setActiveTab('projects');
  };
  const cancelBlog = () => {
    setEditingBlogId(null);
    setBlogForm(initialBlogState);
    setActiveTab('blogs');
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/update-profile`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          username: profileForm.username,
          password: profileForm.password
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("Profile Updated Successfully");
        setProfileForm({ username: "", password: "", confirmPassword: "" });
      } else {
        setStatus("Update Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("[Dashboard] Profile update failed:", err);
      setStatus("Update failed: connection error");
    }
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
          'Authorization': `Bearer ${adminToken}`
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
        fetchProjects(projectsPagination?.page || 1);
      } else {
        setStatus("Error: " + (data.error || "Failed to save project"));
      }
    } catch (err) {
      console.error("[Dashboard] Project save failed:", err);
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
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(blogForm)
      });

      const data = await res.json();
      if (data.ok) {
        setStatus(isEdit ? "Blog Updated!" : "Blog Added!");
        setBlogForm(initialBlogState);
        setEditingBlogId(null);
        setActiveTab('blogs');
        fetchBlogs(blogsPagination?.page || 1);
      } else {
        setStatus("Error: " + (data.error || "Failed to save blog"));
      }
    } catch (err) {
      console.error("[Dashboard] Blog save failed:", err);
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
      switch (type) {
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

  // Tab counts use the server totals when available
  const counts = {
    messages: messagesPagination?.total ?? messages.length,
    projects: projectsPagination?.total ?? projects.length,
    blogs: blogsPagination?.total ?? blogs.length,
  };
  // The add/edit forms belong to the Projects / Posts tabs
  const currentTab = activeTab === 'add-project' ? 'projects' : activeTab === 'add-blog' ? 'blogs' : activeTab;

  // pt-28 keeps the header clear of the floating glass navbar (~76px tall incl. its top gap)
  return (
    <main className="container pb-16 pt-28">
      {/* Header: one tight row with the title, session state and quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-[28px] font-semibold leading-tight tracking-[-0.03em] text-text">Dashboard</h1>
          <span className="nav-glass inline-flex items-center gap-2 rounded-full py-1 pl-2.5 pr-3 text-xs font-medium text-accent2">
            <span className="animate-pulse-ring h-1.5 w-1.5 rounded-full bg-accent2" aria-hidden="true" /> Session active
          </span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={newProject} className="btn-secondary h-9 px-4">
            <Plus className="h-4 w-4" aria-hidden="true" /> Project
          </button>
          <button type="button" onClick={newBlog} className="btn-primary h-9 px-4">
            <Plus className="h-4 w-4" aria-hidden="true" /> Post
          </button>
        </div>
      </div>

      {/* Frosted pill tab bar with counts, plus the latest status message */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <nav className="nav-glass no-scrollbar flex max-w-full gap-0.5 overflow-x-auto rounded-2xl p-1" aria-label="Dashboard sections">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors ${isActive ? 'bg-fill-strong text-text' : 'text-muted hover:bg-fill-strong hover:text-text'}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
                {tab.id in counts && (
                  <span className={`rounded-full px-1.5 font-mono text-[11px] ${isActive ? 'bg-accent-soft text-accent' : 'bg-fill text-muted2'}`}>
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <p
          role="status"
          aria-live="polite"
          className={`ml-auto text-sm ${isErrorStatus(status) ? 'text-danger' : 'text-accent2'}`}
        >
          {status}
        </p>
      </div>

      <div className="mt-5">
        {activeTab === 'messages' ? (
          <Panel title="Messages" meta={rangeLabel(messagesPagination, messages.length)}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className={TABLE_HEAD}>
                  <tr>
                    <Th className="w-44">From</Th>
                    <Th>Message</Th>
                    <Th className="w-28">Received</Th>
                    <Th className="w-12"><span className="sr-only">Actions</span></Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke">
                  {messages.length === 0 ? (
                    <EmptyRow colSpan={4}>No messages found or unauthorized</EmptyRow>
                  ) : (
                    messages.map((m, i) => {
                      const id = m._id || i;
                      const expanded = expandedMessage === id;
                      const isLong = (m.message || '').length > 140;
                      return (
                        <tr key={id} className={`align-top ${TABLE_ROW}`}>
                          <td className="px-4 py-2.5">
                            <div className="font-medium text-text">{m.fullName}</div>
                            <a href={`mailto:${m.email}`} className="font-mono text-xs text-muted2 hover:text-accent">{m.email}</a>
                          </td>
                          <td className="px-4 py-2.5 text-muted">
                            <p className={expanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}>{m.message}</p>
                            {isLong && (
                              <button
                                type="button"
                                onClick={() => setExpandedMessage(expanded ? null : id)}
                                className="mt-1 text-xs font-medium text-accent hover:underline"
                                aria-expanded={expanded}
                              >
                                {expanded ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted2">
                            {formatDate(m.createdAt || m.createdat || m.CreatedAt)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <a
                              href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}
                              className={`${ROW_ACTION_BTN} hover:text-accent`}
                              aria-label={`Reply to ${m.fullName}`}
                              title="Reply"
                            >
                              <Reply className="h-3.5 w-3.5" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls pagination={messagesPagination} onPageChange={fetchMessages} />
          </Panel>
        ) : activeTab === 'projects' ? (
          <Panel title="Projects" meta={rangeLabel(projectsPagination, projects.length)}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-left text-sm">
                <thead className={TABLE_HEAD}>
                  <tr>
                    <Th>Title</Th>
                    <Th className="w-48">Tag</Th>
                    <Th className="w-20 text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke">
                  {projects.length === 0 ? (
                    <EmptyRow colSpan={3}>No projects found</EmptyRow>
                  ) : (
                    projects.map((p, i) => (
                      <tr key={p.id || i} className={TABLE_ROW}>
                        <td className="px-4 py-2.5">
                          <div className="font-medium text-text">{p.title}</div>
                          <div className="font-mono text-xs text-muted2">{[p.year || p.projectyear, p.role].filter(Boolean).join(' · ')}</div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1.5">
                            {p.tag && <span className={TABLE_CHIP}>{p.tag}</span>}
                            {p.isProfessional ? (
                              <span className={`${TABLE_CHIP} border-accent/40 text-accent`}>Professional</span>
                            ) : (
                              <span className={`${TABLE_CHIP} border-accent2/40 text-accent2`}>Personal</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <RowActions label={p.title} onEdit={() => startEdit(p)} onDelete={() => deleteProject(p.id)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls pagination={projectsPagination} onPageChange={fetchProjects} />
          </Panel>
        ) : activeTab === 'blogs' ? (
          <Panel title="Blog posts" meta={rangeLabel(blogsPagination, blogs.length)}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-left text-sm">
                <thead className={TABLE_HEAD}>
                  <tr>
                    <Th>Title</Th>
                    <Th className="w-32">Category</Th>
                    <Th className="w-24">Status</Th>
                    <Th className="w-20 text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke">
                  {blogs.length === 0 ? (
                    <EmptyRow colSpan={4}>No blog posts found</EmptyRow>
                  ) : (
                    blogs.map((b, i) => (
                      <tr key={b._id || b.id || i} className={TABLE_ROW}>
                        <td className="px-4 py-2.5">
                          <div className="font-medium text-text">{b.title}</div>
                          <div className="font-mono text-xs text-muted2">
                            {formatDate(b.createdAt || b.createdat || b.CreatedAt)}
                            {b.featured && <span className="ml-2 text-accent"><span aria-hidden="true">★</span> Featured</span>}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">{b.category && <span className={TABLE_CHIP}>{b.category}</span>}</td>
                        <td className="px-4 py-2.5 text-xs font-medium">
                          {b.isActive !== false ? (
                            <span className="inline-flex items-center gap-1.5 text-accent2">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent2" aria-hidden="true" /> Active
                            </span>
                          ) : (
                            <span className="text-muted2">Hidden</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <RowActions label={b.title} onEdit={() => startEditBlog(b)} onDelete={() => deleteBlog(b._id || b.id)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls pagination={blogsPagination} onPageChange={fetchBlogs} />
          </Panel>
        ) : activeTab === 'add-project' ? (
          <Panel title={editingId ? 'Edit project' : 'New project'} meta={editingId ? 'Editing' : 'Draft'}>
            <form onSubmit={saveProject}>
              <div className="grid gap-4 p-4 md:grid-cols-6 md:p-5">
                <Field id="project-title" label="Title" span="md:col-span-4">
                  <input
                    id="project-title"
                    type="text" required
                    value={projectForm.title}
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="input"
                    placeholder="E.g. AI Portfolio"
                  />
                </Field>
                <Field id="project-tag" label="Tag / category" span="md:col-span-2">
                  <input
                    id="project-tag"
                    type="text"
                    value={projectForm.tag}
                    onChange={e => setProjectForm({ ...projectForm, tag: e.target.value })}
                    className="input"
                    placeholder="E.g. Full-stack / AI"
                  />
                </Field>
                <Field id="project-year" label="Year" span="md:col-span-2">
                  <input
                    id="project-year"
                    type="text"
                    value={projectForm.year}
                    onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field id="project-role" label="Role" span="md:col-span-2">
                  <input
                    id="project-role"
                    type="text"
                    value={projectForm.role}
                    onChange={e => setProjectForm({ ...projectForm, role: e.target.value })}
                    className="input"
                    placeholder="E.g. Lead Developer"
                  />
                </Field>
                <Field id="project-sort" label="Sort order" span="md:col-span-2">
                  <input
                    id="project-sort"
                    type="number"
                    value={projectForm.sortOrder}
                    onChange={e => setProjectForm({ ...projectForm, sortOrder: Number(e.target.value) || 0 })}
                    className="input"
                  />
                </Field>
                <Field id="project-desc" label="Description">
                  <textarea
                    id="project-desc"
                    rows={2}
                    value={projectForm.desc}
                    onChange={e => setProjectForm({ ...projectForm, desc: e.target.value })}
                    className="input resize-y"
                    placeholder="Short description..."
                  />
                </Field>
                <Field id="project-tech" label="Tech stack (comma separated)">
                  <input
                    id="project-tech"
                    type="text"
                    value={projectForm.tech}
                    onChange={e => setProjectForm({ ...projectForm, tech: e.target.value })}
                    className="input"
                    placeholder="React, Node.js, SQL"
                  />
                </Field>
                <Field id="project-details" label="Key points (one per line)">
                  <textarea
                    id="project-details"
                    rows={4}
                    value={projectForm.details}
                    onChange={e => setProjectForm({ ...projectForm, details: e.target.value })}
                    className="input resize-y"
                    placeholder={"Implemented ISO 20022 migration tools...\nHandled high-volume transactions..."}
                  />
                </Field>
                <Field id="project-live" label="Live URL" span="md:col-span-3">
                  <input
                    id="project-live"
                    type="url"
                    value={projectForm.live}
                    onChange={e => setProjectForm({ ...projectForm, live: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </Field>
                <Field id="project-repo" label="Repo URL" span="md:col-span-3">
                  <input
                    id="project-repo"
                    type="url"
                    value={projectForm.repo}
                    onChange={e => setProjectForm({ ...projectForm, repo: e.target.value })}
                    className="input"
                    placeholder="https://github.com/..."
                  />
                </Field>
                <label className={`${CHECK_ROW} items-start md:col-span-6`}>
                  <input
                    type="checkbox"
                    checked={projectForm.isProfessional}
                    onChange={e => setProjectForm({ ...projectForm, isProfessional: e.target.checked })}
                    className="mt-0.5 h-4 w-4 accent-accent"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-text">Professional / featured project</span>
                    <span className="block text-xs text-muted2">If unchecked, it appears under "Personal & open source".</span>
                  </span>
                </label>
              </div>
              <FormActions submitLabel={editingId ? 'Update project' : 'Save project'} onCancel={cancelProject} />
            </form>
          </Panel>
        ) : activeTab === 'add-blog' ? (
          <Panel title={editingBlogId ? 'Edit post' : 'New post'} meta={`${blogForm.content.length} chars`}>
            <form onSubmit={saveBlog}>
              <div className="grid gap-4 p-4 md:grid-cols-6 md:p-5">
                <Field id="blog-title" label="Title">
                  <input
                    id="blog-title"
                    type="text" required
                    value={blogForm.title}
                    onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="input"
                    placeholder="E.g. Implementing ISO 20022"
                  />
                </Field>
                <Field id="blog-excerpt" label="Excerpt">
                  <textarea
                    id="blog-excerpt"
                    required
                    rows={2}
                    value={blogForm.excerpt}
                    onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="input resize-y"
                    placeholder="Short summary for the card..."
                  />
                </Field>
                <Field id="blog-category" label="Category" span="md:col-span-2">
                  <select
                    id="blog-category"
                    value={blogForm.category}
                    onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="input cursor-pointer"
                  >
                    {BLOG_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field id="blog-readtime" label="Read time" span="md:col-span-2">
                  <input
                    id="blog-readtime"
                    type="text"
                    value={blogForm.readTime}
                    onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    className="input"
                    placeholder="E.g. 5 min read"
                  />
                </Field>
                <label htmlFor="featured" className={`${CHECK_ROW} items-center self-end text-sm font-medium text-text md:col-span-2`}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={blogForm.featured}
                    onChange={e => setBlogForm({ ...blogForm, featured: e.target.checked })}
                    className="h-4 w-4 accent-accent"
                  />
                  Mark as featured
                </label>

                <div className="md:col-span-6">
                  <label htmlFor="blog-content-area" className="label">Content</label>
                  <EditorToolbar onFormat={insertFormat} onList={toggleList} />
                  <textarea
                    id="blog-content-area"
                    required
                    value={blogForm.content}
                    onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="input block min-h-[320px] resize-y rounded-t-none leading-relaxed"
                    placeholder="Write the post..."
                  />
                  <p className="mt-2 text-xs text-muted2">
                    Markdown subset: <span className="font-mono">**bold**</span>, <span className="font-mono">*italic*</span>, <span className="font-mono"># headings</span>, lists. Select text, then use the toolbar.
                  </p>
                </div>
              </div>
              <FormActions submitLabel={editingBlogId ? 'Update post' : 'Publish post'} onCancel={cancelBlog} />
            </form>
          </Panel>
        ) : activeTab === 'settings' ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,28rem)_1fr] lg:items-start">
            <Panel title="Account security" meta="Admin">
              <form onSubmit={updateProfile}>
                <div className="space-y-4 p-4 md:p-5">
                  <Field id="settings-username" label="New username">
                    <input
                      id="settings-username"
                      type="text"
                      autoComplete="username"
                      value={profileForm.username}
                      onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="input"
                      placeholder="Leave blank to keep current"
                    />
                  </Field>
                  <Field id="settings-password" label="New password">
                    <input
                      id="settings-password"
                      type="password"
                      autoComplete="new-password"
                      value={profileForm.password}
                      onChange={e => setProfileForm({ ...profileForm, password: e.target.value })}
                      className="input"
                      placeholder="••••••••"
                    />
                  </Field>
                  <Field id="settings-confirm" label="Confirm new password">
                    <input
                      id="settings-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={profileForm.confirmPassword}
                      onChange={e => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                      className="input"
                      placeholder="••••••••"
                    />
                  </Field>
                </div>
                <FormActions submitLabel="Save changes" />
              </form>
            </Panel>

            <Panel title="Recovery" meta={<span className="text-danger">Manual</span>} bodyClassName="space-y-2 p-4 text-sm leading-relaxed text-muted">
              <p>There is no self-service password reset yet.</p>
              <p>If you lose access, update the admin user directly in MongoDB, or remove it and create a new one with <code className={INLINE_CODE}>scripts/seed_mongo.js</code> and <code className={INLINE_CODE}>SEED_ADMIN_PASSWORD</code>.</p>
            </Panel>
          </div>
        ) : (
          <Panel title="Dashboard" bodyClassName="p-6 text-center text-sm text-muted2">
            Select a section above to get started.
          </Panel>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
