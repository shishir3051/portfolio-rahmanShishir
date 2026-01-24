import React from 'react';

const Uses = () => {
  const categories = [
    {
      title: "Development Tools",
      items: [
        { name: "Visual Studio Code", description: "Primary code editor with extensive customization" },
        { name: "IntelliJ IDEA", description: "Java and Spring Boot development" },
        { name: "Git & GitHub", description: "Version control and collaboration" },
        { name: "Postman", description: "API development and testing" },
        { name: "Docker", description: "Containerization and deployment" }
      ]
    },
    {
      title: "Frontend Development",
      items: [
        { name: "React.js & Next.js", description: "Building modern, performant web applications" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid UI development" },
        { name: "ExtJS", description: "Enterprise-grade JavaScript framework for complex applications" },
        { name: "Figma", description: "UI/UX design and prototyping" }
      ]
    },
    {
      title: "Backend Development",
      items: [
        { name: "Java & Spring Boot", description: "Building scalable microservices and enterprise applications" },
        { name: "Node.js & Express", description: "Lightweight APIs and real-time services" },
        { name: "Microsoft SQL Server", description: "Relational database management for enterprise systems" },
        { name: "Neo4j", description: "Graph database for complex relationship modeling" }
      ]
    },
    {
      title: "Cybersecurity Tools",
      items: [
        { name: "Burp Suite", description: "Web application security testing" },
        { name: "Metasploit", description: "Penetration testing framework" },
        { name: "Wireshark", description: "Network protocol analyzer" },
        { name: "Nmap", description: "Network scanning and discovery" },
        { name: "OWASP ZAP", description: "Open-source web app security scanner" }
      ]
    },
    {
      title: "Productivity & Organization",
      items: [
        { name: "Notion", description: "Note-taking, documentation, and project management" },
        { name: "Obsidian", description: "Knowledge management and second brain" },
        { name: "Slack", description: "Team communication and collaboration" },
        { name: "Google Workspace", description: "Emails, docs, and cloud storage" }
      ]
    },
    {
      title: "Hardware",
      items: [
        { name: "Laptop", description: "High-performance development machine" },
        { name: "Dual Monitors", description: "Extended workspace for multitasking" },
        { name: "Mechanical Keyboard", description: "Comfortable typing experience for long coding sessions" },
        { name: "Ergonomic Mouse", description: "Precision and comfort during extended use" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 border-b border-stroke">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6">
              Uses
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              A comprehensive list of the tools, software, and hardware I use daily for software development, 
              cybersecurity work, and productivity. Inspired by{' '}
              <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                uses.tech
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Sections */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            {categories.map((category, index) => (
              <div key={index} className="reveal">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  {category.title}
                </h2>
                <div className="grid gap-6">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="glass p-6 hover:border-accent transition-all">
                      <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                      <p className="text-muted">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-stroke">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted mb-6">
              This list is regularly updated as I discover new tools and refine my workflow.
            </p>
            <button 
              onClick={() => {
                // Navigate to home first, then to contact section
                window.location.hash = '';
                setTimeout(() => {
                  window.location.hash = 'contact';
                }, 50);
              }}
              className="inline-block px-8 py-4 bg-gradient-to-br from-accent to-accent2 rounded-xl font-bold hover:shadow-xl hover:shadow-accent/20 transition-all cursor-pointer"
            >
              Have a Suggestion?
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Uses;
