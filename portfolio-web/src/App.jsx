import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import ContactForm from './components/ContactForm';
import Dashboard from './components/Dashboard';
import ProjectModal from './components/ProjectModal';
import Footer from './components/Footer';
import Blog from './pages/Blog';
import Uses from './pages/Uses';
import Legal from './pages/Legal';
import Terms from './pages/Terms';

function App() {
  const [view, setView] = useState('portfolio');
  const [page, setPage] = useState('home'); // For Blog, Uses, Privacy, Terms
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('home');

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      
      // Check if it's a page route (/blog, /uses, etc.)
      if (hash.startsWith('/')) {
        const route = hash.slice(1); // Remove /
        if(['blog', 'uses', 'privacy', 'terms'].includes(route)) {
          setPage(route);
          setView('page');
        } else {
          setPage('home');
          setView('portfolio');
        }
      } 
      // Check for admin route
      else if (hash === 'admin' || window.location.pathname === '/admin') {
        setView('dashboard');
      }
      // Regular section hash or home
      else {
        setPage('home');
        setView('portfolio');
      }
    };

    handleHashChange(); // Handle initial load
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('dashboard');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Reveal Animations Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => revealObserver.observe(el));

    // Scroll Spy Observer
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(el => spyObserver.observe(el));

    return () => {
      reveals.forEach(el => revealObserver.unobserve(el));
      sections.forEach(el => spyObserver.unobserve(el));
    };
  }, [view, page]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/projects`);
        const data = await res.json();
        if (data.ok) setProjects(data.projects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const skills = [
    { name: "Next.js & React.js", level: "92%" },
    { name: "Java & Spring Boot", level: "90%" },
    { name: "Microsoft SQL Server", level: "88%" },
    { name: "Cybersecurity & Ethical Hacking", level: "94%" },
    { name: "Penetration Testing", level: "90%" },
    { name: "Front-End Development (ExtJs)", level: "86%" },
    { name: "Neo4j Graph Database", level: "82%" },
    { name: "Full-stack Engineering", level: "90%" },
  ];

  const experience = [
    {
      title: "Junior Software Engineer — naztech Inc",
      location: "Banani, Dhaka, Bangladesh • Jan 2025 — Present",
      tasks: [
        "Full-time role focused on developing and maintaining software solutions.",
        "Contributing to enterprise-grade engineering projects with Java and JavaScript.",
        "Collaborating with the team on SWIFT ISO 20022 MT-MX transition projects."
      ]
    },
    {
      title: "Software Engineer Trainee — naztech Inc",
      location: "Banani, Dhaka, Bangladesh • Oct 2024 — Dec 2024",
      tasks: [
        "Intensive training period focused on enterprise architecture and security.",
        "Gained hands-on experience with ExtJs, Spring Boot, and SMSS.",
        "Collaborated on banking and payment system automation workflows."
      ]
    },
    {
      title: "Software Engineer Internship — naztech Inc",
      location: "Banani, Dhaka, Bangladesh • Sep 2024",
      tasks: [
        "Initial exposure to the software development lifecycle in a professional setting.",
        "Shadowed senior engineers and participated in code reviews.",
        "Worked on foundational modules for internal tools."
      ]
    }
  ];

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('ADMIN_KEY');
    setView('portfolio');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setPage('home');
    setView('portfolio');
  };

  // Render pages (Blog, Uses, Privacy, Terms)
  if (view === 'page') {
    return (
      <div className="min-h-screen">
        <div className="bg-glow"></div>
        <Navbar 
          onDashboardClick={() => setView('dashboard')} 
          theme={theme} 
          toggleTheme={toggleTheme}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          view={view}
          activeSection={activeSection}
          onLogoClick={navigateToHome}
        />
        {page === 'blog' && <Blog />}
        {page === 'uses' && <Uses />}
        {page === 'privacy' && <Legal />}
        {page === 'terms' && <Terms />}
        <Footer />
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen">
        <Navbar 
          onDashboardClick={() => setView('portfolio')} 
          theme={theme} 
          toggleTheme={toggleTheme}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          view={view}
        />
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-glow"></div>
      <Navbar 
        onDashboardClick={() => setView('dashboard')} 
        theme={theme} 
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        view={view}
        activeSection={activeSection}
      />
      
      <main>
        <section id="home">
          <Hero 
            name="Rahman Shishir" 
            headline="B.Sc in SWE (Major in Cybersecurity) | Software Engineer | Ethical Hacker Essential (E|HE) | Java Full-Stack Developer"
          />
        </section>

        <div className="reveal">
          <Section id="about" title="About" subtitle="I'm a versatile professional skilled in both ethical hacking and front-end development. With expertise in cybersecurity and creating engaging user experiences, I deliver high-quality results prioritizing security and user satisfaction. Whether uncovering vulnerabilities or crafting intuitive interfaces, I'm dedicated to excellence in all aspects of my work.">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-8">
                <h3 className="text-xl font-bold mb-4">What I do</h3>
                <p className="text-muted mb-6">I design and build secure web apps with modern UI patterns, scalable architecture, and a strong focus on cybersecurity.</p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'Spring Boot', 'Cybersecurity', 'Java'].map(chip => (
                    <span key={chip} className="px-3 py-1 rounded-full bg-panel border border-stroke text-xs text-muted font-bold">{chip}</span>
                  ))}
                </div>
              </div>
              <div className="glass p-8">
                <h3 className="text-xl font-bold mb-4">How I work</h3>
                <p className="text-muted mb-6">Combining technical rigour from ethical hacking with creative front-end execution. I'm dedicated to uncovering vulnerabilities and crafting intuitive, secure interfaces.</p>
                <div className="flex flex-wrap gap-2">
                  {['Security-first', 'E|HE Certified', 'Full-stack', 'Graph DB'].map(chip => (
                    <span key={chip} className="px-3 py-1 rounded-full bg-panel border border-stroke text-xs text-muted font-bold">{chip}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="reveal">
          <Section 
            id="skills" 
            title="Skills" 
            subtitle="Expertise spanning across Java full-stack development, modern web frameworks, and advanced cybersecurity."
          >
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {skills.map(skill => (
                <div key={skill.name} className="grid gap-2">
                  <div className="flex justify-between font-semibold text-muted">
                    <span>{skill.name}</span>
                    <span>{skill.level}</span>
                  </div>
                  <div className="h-2 bg-panel rounded-full overflow-hidden border border-stroke">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-accent2 transition-all duration-1000"
                      style={{ width: skill.level }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="reveal">
          <Section id="experience" title="Experience" subtitle="My professional journey at naztech Inc, transitioning from Intern to Junior Software Engineer.">
            <div className="space-y-6">
              {experience.map((job, idx) => (
                <div key={idx} className="glass p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold">{job.title}</h4>
                      <p className="text-sm text-muted2">{job.location}</p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-muted">
                    {job.tasks.map((task, i) => <li key={i}>{task}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="reveal">
          <Section id="education" title="Education" subtitle="Academic background in Software Engineering and foundational schooling.">
            <div className="space-y-6">
              <div className="glass p-8">
                <h4 className="text-lg font-bold">Daffodil International University-DIU</h4>
                <p className="text-sm text-muted2">Bachelor of Software Engineering (Major in Cybersecurity) • 2020 — 2024</p>
              </div>
              <div className="glass p-8">
                <h4 className="text-lg font-bold">Ispahani Public School and College</h4>
                <p className="text-sm text-muted2">Secondary & Higher Secondary Education • 2016 — 2018</p>
              </div>
            </div>
          </Section>
        </div>

        <div className="reveal">
          <Section 
            id="projects" 
            title="Featured Projects" 
            subtitle="Selected professional and independent work with a focus on security and efficiency."
          >
            <div className="grid md:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((p, i) => (
                  <ProjectCard 
                    key={i} 
                    title={p.title}
                    description={p.desc}
                    tag={p.tag}
                    date={p.year}
                    role={p.role}
                    onClick={() => setSelectedProject(p)}
                  />
                ))
              ) : (
                <>
                  <ProjectCard 
                    title="Efficient SWIFT ISO 20022 MT-MX Transition"
                    description="A mission-critical banking solution helping banks automate workflows and ensure compliance during the MT-MX transition. Built with a focus on security and high performance."
                    tag="FinTech / Security"
                    date="2024"
                    role="Junior Software Engineer"
                    onClick={() => setSelectedProject({
                      title: "Efficient SWIFT ISO 20022 MT-MX Transition",
                      year: "2024",
                      role: "Junior Software Engineer",
                      desc: "A mission-critical banking solution helping banks automate workflows and ensure compliance during the MT-MX transition.",
                      details: [
                        "Implemented ISO 20022 migration tools.",
                        "Handled high-volume transaction logging with SQL Server.",
                        "Built complex grid interfaces with ExtJS."
                      ],
                      tech: ["Java", "ExtJS", "Spring Boot", "MSSQL"]
                    })}
                  />
                  <ProjectCard 
                    title="Cybersecurity Dashboard"
                    description="Real-time monitoring tool for identifying and visualizing security vulnerabilities in web applications. Features automated scanning and graph visualization."
                    tag="Cybersecurity / Neo4j"
                    date="2024"
                    role="Lead Developer"
                    onClick={() => setSelectedProject({
                      title: "Cybersecurity Dashboard",
                      year: "2024",
                      role: "Lead Developer",
                      desc: "Real-time monitoring tool for identifying and visualizing security vulnerabilities in web applications.",
                      details: [
                        "Visualized network threats using Neo4j.",
                        "Automated vulnerability scanning.",
                        "Created dark-mode security analysis UI."
                      ],
                      tech: ["React", "Node.js", "Neo4j", "Tailwind"]
                    })}
                  />
                </>
              )}
            </div>
          </Section>
        </div>

        <div className="reveal">
          <Section id="services" title="Services" subtitle="Leveraging my expertise to build secure and scalable digital solutions.">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass p-6">
                <h4 className="font-bold mb-2">Secure Web Dev</h4>
                <p className="text-sm text-muted">Building robust and secure web applications using Next.js, React, and Spring Boot.</p>
              </div>
              <div className="glass p-6">
                <h4 className="font-bold mb-2">Penetration Testing</h4>
                <p className="text-sm text-muted">Identifying system vulnerabilities through ethical hacking and advanced testing techniques.</p>
              </div>
              <div className="glass p-6">
                <h4 className="font-bold mb-2">Database Optimization</h4>
                <p className="text-sm text-muted">Designing and managing complex data structures with Neo4j and Microsoft SQL Server.</p>
              </div>
            </div>
          </Section>
        </div>

        <div className="reveal">
          <Section 
            id="contact" 
            title="Contact" 
            subtitle="Ready to build something secure and extraordinary? Let's connect."
          >
            <ContactForm />
          </Section>
        </div>
      </main>
      
      <Footer />

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}

export default App;
