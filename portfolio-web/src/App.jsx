import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/Section';
import { ArrowUpRight, GraduationCap, ShieldCheck } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import ContactSection from './components/ContactSection';
import Dashboard from './components/Dashboard';
import ProjectModal from './components/ProjectModal';
import Footer from './components/Footer';
import Blog from './pages/Blog';
import Uses from './pages/Uses';
import Legal from './pages/Legal';
import Terms from './pages/Terms';
import Timeline from './components/Timeline';
import Login from './components/Login';
import Ribbon from './components/Ribbon';
import AuroraBackground from './components/AuroraBackground';
import CommandPalette from './components/CommandPalette';
import { trackSpotlight } from './utils/spotlight';
import { assignArtVariants, ART_TONES } from './utils/projectArt';
import { scrollBehavior } from './utils/scroll';

import { API_BASE } from './config';
import {
  PROFILE, SOCIAL_LINKS, NAV_SECTIONS, ABOUT, SKILL_GROUPS, EXPERIENCE, EDUCATION, CERTIFICATION, FALLBACK_PROJECTS, SERVICES,
} from './data/profile';

// Work grids: one compact row per project on phones, then 2 / 3 / 4 cards per row as the screen widens.
// 4 columns start at 1264px, the page container's widest step (tailwind.config.js), not Tailwind's default xl (1280px).
const PROJECT_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 min-[1264px]:grid-cols-4';

// Shared page frame: drifting aurora light at the top, and no horizontal overflow (clip keeps `position: sticky` working)
const Shell = ({ children }) => (
  <div className="relative min-h-screen overflow-x-clip">
    <AuroraBackground />
    <div className="relative">{children}</div>
  </div>
);

function App() {
  const [view, setView] = useState('portfolio');
  const [page, setPage] = useState('home'); // For Blog, Uses, Privacy, Terms
  const [projects, setProjects] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false); // true once the projects request has finished (ok or not)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true' && !!localStorage.getItem('adminToken'));
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('home');

  // Declared before the effects below, which call it when a stored session is no longer valid
  const handleLogout = () => {
    setIsAdmin(false);
    setAdminToken('');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('ADMIN_KEY'); // Clear legacy key if exists

    setView('portfolio');
    setPage('home');
    window.history.pushState({}, '', '/');
    window.location.hash = '';
  };

  // Handle hash changes and routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (hash.startsWith('/')) {
        const route = hash.slice(1);
        if (['blog', 'uses', 'privacy', 'terms'].includes(route)) {
          setPage(route);
          setView('page');
          window.scrollTo(0, 0); // Always scroll to top on new page
        } else {
          setPage('home');
          setView('portfolio');
        }
      } else if (hash === 'admin' || window.location.pathname === '/admin') {
        setView('dashboard');
      } else {
        setPage('home');
        setView('portfolio');
      }
    };


    const verifySession = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.ok) {
            setIsAdmin(true);
            setAdminToken(token);
            localStorage.setItem('isAdmin', 'true');
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error("Session verification failed:", err);
        }
      }
    };

    handleHashChange();
    verifySession();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll detection for active section
  useEffect(() => {
    if (view !== 'portfolio' || page !== 'home') return;

    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // More generous margin for stability
      threshold: [0, 0.1, 0.5] // Multiple thresholds for smoother detection
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const scrollPos = window.scrollY;
        const isAtBottom = window.innerHeight + scrollPos >= document.documentElement.scrollHeight - 100;

        if (scrollPos < 100) {
          setActiveSection('home');
        } else if (isAtBottom) {
          setActiveSection('contact');
        } else if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    // Also add a scroll listener for extra stability at extremes
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const isAtBottom = window.innerHeight + scrollPos >= document.documentElement.scrollHeight - 100;
      if (scrollPos < 100) {
        setActiveSection('home');
      } else if (isAtBottom) {
        setActiveSection('contact');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'services', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [view, page]);

  // Professional scroll-to-section effect
  useEffect(() => {
    if (view === 'portfolio' && page === 'home') {
      const hash = window.location.hash.slice(1);
      if (hash && !hash.startsWith('/')) {
        const timer = setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: scrollBehavior() });
          } else if (hash === 'home') {
            window.scrollTo({ top: 0, behavior: scrollBehavior() });
          }
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [view, page]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
        const data = await res.json();
        if (data.ok) setProjects(data.projects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setProjectsLoaded(true);
      }
    };
    fetchProjects();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Stable reference so the modal's keyboard/scroll-lock effect does not re-run on every render
  const closeProject = useCallback(() => setSelectedProject(null), []);

  // Command palette, toggled with Ctrl/⌘ + K from anywhere
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = useMemo(() => {
    // Setting the hash also switches back to the homepage when a page (e.g. the blog) is open
    const goToSection = (id) => () => {
      window.location.hash = id;
      document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });
    };
    const openExternal = (url) => () => window.open(url, '_blank', 'noopener,noreferrer');

    return [
      ...NAV_SECTIONS.map((s) => ({ id: `go-${s.id}`, label: `Go to ${s.name}`, group: `Section ${s.index}`, run: goToSection(s.id) })),
      { id: 'page-blog', label: 'Read the blog', group: 'Page', run: () => { window.location.hash = '/blog'; } },
      { id: 'page-uses', label: 'Tools I use', group: 'Page', run: () => { window.location.hash = '/uses'; } },
      { id: 'theme', label: 'Toggle light / dark theme', group: 'Action', run: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) },
      { id: 'copy-email', label: `Copy email address (${PROFILE.email})`, group: 'Action', run: () => navigator.clipboard?.writeText(PROFILE.email) },
      { id: 'write-email', label: 'Write an email', group: 'Action', run: () => { window.location.href = `mailto:${PROFILE.email}`; } },
      ...SOCIAL_LINKS.map((l) => ({ id: `link-${l.label}`, label: `Open ${l.label}`, group: 'Link', run: openExternal(l.href) })),
    ];
  }, []);

  const palette = <CommandPalette open={paletteOpen} onClose={closePalette} commands={commands} />;

  const navigateToHome = () => {
    window.location.hash = '';
    setPage('home');
    setView('portfolio');
  };

  // Render pages (Blog, Uses, Privacy, Terms)
  if (view === 'page') {
    return (
      <Shell>
        <Navbar
          onDashboardClick={() => setView('dashboard')}
          theme={theme}
          toggleTheme={toggleTheme}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          view={view}
          activeSection={activeSection}
          onLogoClick={navigateToHome}
          onOpenPalette={openPalette}
        />
        <main>
          {page === 'blog' && <Blog />}
          {page === 'uses' && <Uses />}
          {page === 'privacy' && <Legal />}
          {page === 'terms' && <Terms />}
        </main>
        <Footer />
        {palette}
      </Shell>
    );
  }

  if (view === 'dashboard') {
    if (!isAdmin) {
      return (
        <Shell>
          <Navbar
            onDashboardClick={() => setView('dashboard')}
            theme={theme}
            toggleTheme={toggleTheme}
            isAdmin={false}
            view={view}
            onLogoClick={navigateToHome}
            onOpenPalette={openPalette}
          />
          <main>
            <Login onLoginSuccess={() => {
              const token = localStorage.getItem('adminToken');
              setAdminToken(token);
              setIsAdmin(true);
              setView('dashboard');
            }} />
          </main>
          {palette}
        </Shell>
      );
    }

    return (
      <Shell>
        <Navbar
          onDashboardClick={() => setView('portfolio')}
          theme={theme}
          toggleTheme={toggleTheme}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          view={view}
          onLogoClick={navigateToHome}
          onOpenPalette={openPalette}
        />
        <Dashboard tokenProp={adminToken} />
        {palette}
      </Shell>
    );
  }

  // Projects come from the API; fall back to built-in examples when none are available
  const professionalProjects = projects.filter(p => p.isProfessional);
  const featuredProjects = professionalProjects.length > 0 ? professionalProjects : FALLBACK_PROJECTS;
  const personalProjects = projects.filter(p => !p.isProfessional);

  // An illustration and colour pair per card, across both project grids (no illustration repeats within each group of 10 cards)
  const allWorkProjects = [...featuredProjects, ...personalProjects];
  const artVariants = assignArtVariants(allWorkProjects);
  const cardArt = (index) => ({ art: artVariants[index], tone: ART_TONES[index % ART_TONES.length] });

  return (
    <Shell>
      <Helmet>
        <title>Rahman Shishir | Java Full-Stack Engineer</title>
        <meta name="description" content="Rahman Shishir is a Java full-stack engineer building secure banking software (SWIFT ISO 20022) with Java, Spring Boot and ExtJS." />
      </Helmet>
      <Navbar
        onDashboardClick={() => setView('dashboard')}
        theme={theme}
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        view={view}
        activeSection={activeSection}
        onOpenPalette={openPalette}
      />

      <main>
        {/* The count waits for the API, so it never flashes the fallback projects' number first */}
        <Hero projectCount={projectsLoaded ? allWorkProjects.length : undefined} />
        <Ribbon />

        <Section id="about" index="01" label="About" title={ABOUT.title} split>
          <p className="mb-5 text-[clamp(17px,1.5vw,20px)] leading-relaxed text-text/85">{ABOUT.lead}</p>
          <p className="text-[17px] leading-relaxed text-muted">{ABOUT.body}</p>
          <ul className="mt-9 grid gap-3 sm:grid-cols-3">
            {ABOUT.principles.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="glass rounded-[18px] p-5">
                  <span className="icon-box h-[34px] w-[34px] rounded-[10px]"><Icon className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                  <p className="mt-3.5 font-heading text-base font-semibold text-text">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted2">{item.text}</p>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          id="skills"
          index="02"
          label="Stack"
          title="From banking back-ends to security tooling."
          intro="Java and Spring Boot at the core, React and ExtJS on the front, and SQL Server, Neo4j and MongoDB underneath."
        >
          {/* Bento: two wide cards on top (featured Fintech + Backend), three below */}
          <div className="grid gap-4 md:grid-cols-6">
            {SKILL_GROUPS.map((group, i) => {
              const Icon = group.icon;
              return (
                <article
                  key={group.name}
                  className={`glass lift relative overflow-hidden rounded-3xl p-7 ${i < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}
                  style={group.featured ? { background: 'linear-gradient(135deg, var(--accent-soft), transparent 60%), var(--glass-bg)' } : undefined}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <span className="icon-box h-[42px] w-[42px]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <h3 className="font-heading text-xl font-semibold tracking-tight text-text">{group.name}</h3>
                    </div>
                    {group.featured ? (
                      <span className="brand-badge rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em]">Core focus</span>
                    ) : (
                      <span className="font-mono text-xs text-muted2" aria-hidden="true">{String(group.items.length).padStart(2, '0')}</span>
                    )}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted">{group.desc}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="chip">{item}</li>
                    ))}
                  </ul>
                  {group.featured && (
                    <div aria-hidden="true" className="mt-7 flex items-center gap-3 font-mono text-xs text-text/85">
                      <span className="rounded-lg border border-stroke-strong px-2.5 py-1.5" style={{ background: 'var(--fill-1)' }}>MT</span>
                      <span className="h-px flex-1" style={{ background: 'repeating-linear-gradient(90deg, var(--accent) 0 6px, transparent 6px 12px)' }} />
                      <span className="rounded-lg border border-accent px-2.5 py-1.5 text-text" style={{ background: 'var(--accent-soft)' }}>MX · ISO 20022</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="experience" index="03" label="Experience" title="Building banking software at naztech Inc.">
          <div className="flex flex-wrap items-stretch gap-4">
            <div className="glass min-w-0 flex-[1.5_1_560px] rounded-[28px] p-6 md:p-10">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <h3 className="subhead mb-0">Work history</h3>
                <a href={PROFILE.company.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-text/85 hover:text-text">
                  naztech.io <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
              <Timeline items={EXPERIENCE} />
            </div>

            <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
              <div id="education" className="glass flex-1 rounded-[28px] p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="icon-box h-9 w-9 rounded-[10px]"><GraduationCap className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                  <h3 className="subhead mb-0">Education</h3>
                </div>
                <ol className="mt-5">
                  {EDUCATION.map((item) => (
                    <li key={item.title} className="border-t border-stroke py-4 last:pb-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h4 className="font-heading text-[17px] font-semibold tracking-tight text-text">{item.title}</h4>
                        <span className="font-mono text-xs text-muted2">{item.period}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted2">{item.entity}</p>
                      {item.badge && (
                        <p className="mt-2.5 inline-block rounded-full border border-stroke-strong px-2.5 py-1 text-xs font-medium text-text" style={{ background: 'var(--accent-soft)' }}>{item.badge}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="glass flex items-center gap-4 rounded-3xl px-6 py-5" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.10), transparent 70%), var(--glass-bg)' }}>
                <span aria-hidden="true" className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[14px] border border-stroke text-accent2" style={{ background: 'rgba(52,211,153,0.14)' }}>
                  <ShieldCheck className="h-[22px] w-[22px]" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted2">{CERTIFICATION.label}</p>
                  <p className="mt-1 font-heading text-base font-semibold text-text">{CERTIFICATION.title}</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="projects"
          index="04"
          label="Selected work"
          title="Software that moves money, and software that finds weak spots."
          action={
            <a href={SOCIAL_LINKS[0].href} target="_blank" rel="noopener noreferrer" className="btn-secondary h-[46px] font-medium">
              More on GitHub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          }
        >
          {/* Compact cards: 1 per row on phones, 2 on tablets, 3 on laptops, 4 on wide screens */}
          <div className={PROJECT_GRID}>
            {featuredProjects.map((p, i) => (
              <ProjectCard key={p.id || p.title} project={p} code={`P/${String(i + 1).padStart(2, '0')}`} {...cardArt(i)} onClick={() => setSelectedProject(p)} />
            ))}
          </div>

          <div id="personal-projects" className="mt-12">
            <h3 className="subhead">Personal & open source</h3>
            {personalProjects.length > 0 ? (
              <div className={PROJECT_GRID}>
                {personalProjects.map((p, i) => (
                  <ProjectCard key={p.id || p.title} project={p} code={`OSS/${String(i + 1).padStart(2, '0')}`} {...cardArt(featuredProjects.length + i)} onClick={() => setSelectedProject(p)} />
                ))}
              </div>
            ) : (
              <p className="glass rounded-2xl px-6 py-5 text-sm text-muted">More personal projects coming soon.</p>
            )}
          </div>
        </Section>

        <Section id="services" index="05" label="Services" title="Where I can help.">
          <div className="grid gap-4 md:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="glass lift spotlight relative overflow-hidden rounded-3xl px-7 py-8" onPointerMove={trackSpotlight}>
                  <div aria-hidden="true" className="absolute -right-16 -top-20 h-[200px] w-[200px] rounded-full opacity-45 blur-[60px]" style={{ background: 'var(--glow)' }} />
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="icon-box h-12 w-12 rounded-[14px]"><Icon className="h-[22px] w-[22px]" aria-hidden="true" /></span>
                    <span className="font-mono text-xs text-muted2" aria-hidden="true">S/{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="relative mt-7 font-heading text-[22px] font-semibold tracking-tight text-text">{service.title}</h3>
                  <p className="relative mt-2.5 text-[15px] leading-relaxed text-muted">{service.desc}</p>
                </article>
              );
            })}
          </div>
        </Section>

        <ContactSection />
      </main>

      <Footer />
      {palette}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeProject} />
      )}
    </Shell>
  );
}

export default App;
