import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [adminKey, setAdminKey] = useState(localStorage.getItem("ADMIN_KEY") || "");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  
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

  const [projectForm, setProjectForm] = useState(initialProjectState);

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

  useEffect(() => {
    if (adminKey) {
      fetchMessages();
      fetchProjects();
    }
  }, [adminKey]);

  const saveKey = () => {
    localStorage.setItem("ADMIN_KEY", adminKey);
    setStatus("Admin Key Saved");
    setTimeout(() => setStatus(""), 2000);
    fetchMessages();
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
          <p className="text-muted text-sm mt-1">Manage your portfolio messages and projects</p>
        </div>
        <button 
          onClick={handleBackToSite}
          className="px-4 py-2 rounded-xl bg-panel border border-stroke hover:bg-panel2 transition-all text-sm font-bold"
        >
          Back to Site
        </button>
      </header>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
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
              onClick={() => {
                setEditingId(null);
                setProjectForm(initialProjectState);
                setActiveTab('add-project');
              }}
              className={`text-left px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'add-project' && !editingId ? 'bg-accent/20 border border-accent/40 text-text' : 'text-muted hover:bg-panel'}`}
            >
              + Add Project
            </button>
          </nav>
        </aside>

        <main className="bg-panel border border-stroke rounded-2xl backdrop-blur-xl overflow-hidden">
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
                        <td className="px-6 py-4 text-xs text-muted2 whitespace-nowrap">{new Date(m.createdat).toLocaleDateString()}</td>
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
          ) : (
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
