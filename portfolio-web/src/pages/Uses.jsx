import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, Shield, Layout, Settings } from 'lucide-react';

const Uses = () => {
  const categories = [
    {
      title: "Core Stack",
      icon: <Code className="w-6 h-6" />,
      items: [
        { name: "Visual Studio Code", description: "Primary code editor with high-performance extensions for Java, React, and Python." },
        { name: "IntelliJ IDEA", description: "The definitive IDE for enterprise Spring Boot and monolithic Java systems." },
        { name: "Docker & Kubernetes", description: "Container orchestration for scalable microservices deployment." },
        { name: "GitHub Actions", description: "Automated CI/CD pipelines for secure software delivery." }
      ]
    },
    {
      title: "Frontend Engineering",
      icon: <Layout className="w-6 h-6" />,
      items: [
        { name: "React / Next.js", description: "High-performance framework for building SEO-optimized, interactive UIs." },
        { name: "Tailwind CSS", description: "Utility-first styling system for rapid industrial-grade design." },
        { name: "Framer Motion", description: "Advanced physics-based animation engine for immersive web experiences." }
      ]
    },
    {
      title: "Data & Systems",
      icon: <Cpu className="w-6 h-6" />,
      items: [
        { name: "Spring Boot", description: "Robust backend infrastructure for secure, scalable enterprise APIs." },
        { name: "Neo4j Graph DB", description: "Visualizing complex network relationships and threat intelligence." },
        { name: "MS SQL Server", description: "Enterprise relational data management for high-concurrency systems." }
      ]
    },
    {
      title: "Security & Auditing",
      icon: <Shield className="w-6 h-6" />,
      items: [
        { name: "Burp Suite Pro", description: "Industry-standard toolkit for web application penetration testing." },
        { name: "Metasploit", description: "Vulnerability analysis and exploit development for cybersecurity audits." },
        { name: "Wireshark", description: "Deep packet inspection for network-level threat detection." }
      ]
    },
    {
      title: "Hardware Lab",
      icon: <Settings className="w-6 h-6" />,
      items: [
        { name: "Workstation", description: "Rizen 9 / 64GB RAM / RTX 4080 — Built for intensive compilation and virtualization." },
        { name: "Triple Monitor Setup", description: "3x 27\" 4K displays for real-time monitoring and multi-IDE workflows." },
        { name: "Custom Mechanical KB", description: "Keychron Q3 with tactile switches for high-speed, reliable engineering sessions." }
      ]
    }
  ];

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
              <Terminal className="w-3 h-3" /> System Components
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic">
              Uses <span className="text-accent">/ Tech Stack</span>
            </h1>
            <p className="text-xl text-muted leading-relaxed max-w-2xl font-medium">
              A curated inventory of the hardware, software, and development protocols I leverage to engineer secure and high-performance digital environments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-panel border border-stroke flex items-center justify-center text-accent">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">{category.title}</h2>
                    <div className="h-px w-24 bg-accent mt-1"></div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5, scale: 1.01 }}
                      className="glass p-8 group border-stroke hover:border-accent/40 transition-all duration-300"
                    >
                      <h3 className="text-lg font-black mb-3 group-hover:text-accent transition-colors">{item.name}</h3>
                      <p className="text-sm text-muted leading-relaxed font-bold">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-32">
        <div className="container mx-auto px-6">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            className="glass p-12 text-center max-w-3xl mx-auto border-dashed border-2 border-accent/20"
          >
            <h2 className="text-3xl font-black mb-4 uppercase">Refining the Stack</h2>
            <p className="text-muted mb-10 font-bold">
              My toolchain is constantly evolving as new security protocols and engineering paradigms emerge.
            </p>
            <button
              onClick={() => {
                window.location.hash = 'contact';
              }}
              className="px-8 py-4 bg-text text-bg rounded-xl font-black hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest"
            >
              Propose an Upgrade
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Uses;
