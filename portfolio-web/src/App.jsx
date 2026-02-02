import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Code, Database, Bug, Cpu, Cloud, Lock, Globe, Layers, Server } from 'lucide-react';
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
import Scene3D from './components/Scene3D';
import Timeline from './components/Timeline';

function App() {
  const [view, setView] = useState('portfolio');
  const [page, setPage] = useState('home'); // For Blog, Uses, Privacy, Terms
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('home');

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

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll detection for active section
  useEffect(() => {
    if (view !== 'portfolio' || page !== 'home') return;

    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when section is in middle of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    const sections = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'services', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [view, page]);

  // Professional scroll-to-section effect
  useEffect(() => {
    if (view === 'portfolio' && page === 'home') {
      const hash = window.location.hash.slice(1);
      if (hash && !hash.startsWith('/')) {
        const timer = setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (hash === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
    { name: "Next.js & React.js", level: "92%", icon: <Globe />, category: "Front-End" },
    { name: "Java & Spring Boot", level: "90%", icon: <Server />, category: "Back-End" },
    { name: "MS SQL Server", level: "88%", icon: <Database />, category: "Database" },
    { name: "Cybersecurity", level: "94%", icon: <Shield />, category: "Security" },
    { name: "Penetration Testing", level: "90%", icon: <Bug />, category: "Security" },
    { name: "ExtJs Development", level: "86%", icon: <Layers />, category: "Enterprise" },
    { name: "Neo4j Graph DB", level: "83%", icon: <Cpu />, category: "Database" },
    { name: "Full-stack Engineering", level: "90%", icon: <Code />, category: "Engineering" },
  ];

  const experienceData = [
    {
      title: "Junior Software Engineer",
      location: "naztech Inc • Dhaka, Bangladesh",
      date: "Jan 2025 — Present",
      tasks: [
        "Full-time role focused on developing and maintaining software solutions.",
        "Contributing to enterprise-grade engineering projects with Java and JavaScript.",
        "Collaborating with the team on SWIFT ISO 20022 MT-MX transition projects."
      ]
    },
    {
      title: "Software Engineer Trainee",
      location: "naztech Inc • Dhaka, Bangladesh",
      date: "Oct 2024 — Dec 2024",
      tasks: [
        "Intensive training period focused on enterprise architecture and security.",
        "Gained hands-on experience with ExtJs, Spring Boot, and SMSS.",
        "Collaborated on banking and payment system automation workflows."
      ]
    },
    {
      title: "Software Engineer Internship",
      location: "naztech Inc • Dhaka, Bangladesh",
      date: "Sep 2024",
      tasks: [
        "Initial exposure to the software development lifecycle in a professional setting.",
        "Shadowed senior engineers and participated in code reviews."
      ]
    }
  ];

  const educationData = [
    {
      title: "Bachelor of Software Engineering",
      location: "Daffodil International University-DIU",
      year: "2020 — 2024",
      desc: "Major in Cybersecurity. Focused on secure software development, network security, and cryptography."
    },
    {
      title: "Secondary & Higher Secondary",
      location: "Ispahani Public School and College",
      year: "2016 — 2018",
      desc: "Science background with a focus on mathematics and information technology."
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
      <div className="min-h-screen relative overflow-hidden">
        <Scene3D />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {page === 'blog' && <Blog />}
          {page === 'uses' && <Uses />}
          {page === 'privacy' && <Legal />}
          {page === 'terms' && <Terms />}
        </motion.div>
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
    <div className="min-h-screen relative overflow-hidden">
      <Scene3D />
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

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <section id="home">
          <Hero
            name="Rahman Shishir"
            headline="B.Sc in SWE (Major in Cybersecurity) | Software Engineer | Ethical Hacker Essential (E|HE) | Java Full-Stack Developer"
          />
        </section>

        <Section id="about" title="About" subtitle="I combine technical rigour from ethical hacking with creative software engineering to build secure, scalable digital experiences. My approach prioritizes security, user satisfaction, and architectural excellence.">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="glass p-8 col-span-1 lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="text-accent" /> Professional Approach
              </h3>
              <p className="text-muted text-lg leading-relaxed">
                I'm a versatile professional skilled in both ethical hacking and front-end development. With expertise in cybersecurity and creating engaging user experiences, I deliver high-quality results prioritizing security and user satisfaction.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="glass p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="text-accent2" /> Core Ethics
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">Dedicated to uncovering vulnerabilities and crafting intuitive, secure interfaces.</p>
              <div className="flex flex-wrap gap-2">
                {['Security-first', 'E|HE Certified', 'Full-stack'].map(chip => (
                  <span key={chip} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-bold uppercase">{chip}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>

        <Section id="skills" title="Skills" subtitle="A multi-disciplinary toolkit focused on enterprise reliability and robust security protocols.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass p-6 group flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-panel border border-stroke flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  {React.cloneElement(skill.icon, { className: "w-6 h-6" })}
                </div>
                <h4 className="font-bold text-lg mb-1">{skill.name}</h4>
                <span className="text-xs text-accent font-mono mb-4 uppercase tracking-widest">{skill.category}</span>
                <div className="w-full h-1.5 bg-panel rounded-full overflow-hidden border border-stroke">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: skill.level }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-accent to-accent2"
                  />
                </div>
                <span className="text-xs text-muted mt-2 font-bold">{skill.level}</span>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Professional Experience" subtitle="Building enterprise fintech solutions and contributing to critical banking infrastructure at naztech Inc.">
          <Timeline items={experienceData} type="experience" />
        </Section>

        <Section id="education" title="Education" subtitle="Fundamental academic training in Software Engineering and foundational schooling.">
          <Timeline items={educationData} type="education" />
        </Section>

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

        <Section id="services" title="Services" subtitle="Strategizing and delivering high-performance digital solutions with a security-first philosophy.">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Secure Web Engineering",
                desc: "Enterprise-grade web applications built with Next.js and Spring Boot, hardened against modern threats.",
                icon: <Code className="text-accent" />
              },
              {
                title: "Cybersecurity Auditing",
                desc: "Comprehensive penetration testing and vulnerability assessments to secure your digital infrastructure.",
                icon: <Shield className="text-accent2" />
              },
              {
                title: "Architectural Consulting",
                desc: "Designing scalable, efficient data structures using SQL Server and Neo4j for complex business needs.",
                icon: <Database className="text-white" />
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass p-8 group hover:border-accent/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-panel border border-stroke flex items-center justify-center mb-6 group-hover:bg-accent transition-all duration-500">
                  {React.cloneElement(service.icon, { className: "w-7 h-7 group-hover:text-white transition-colors" })}
                </div>
                <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          id="contact"
          title="Contact"
          subtitle="Ready to build something secure and extraordinary? Let's connect."
        >
          <ContactForm />
        </Section>
      </motion.main>

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
