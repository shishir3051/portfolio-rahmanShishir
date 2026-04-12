// Native fetch is available in Node 18+ (User has v20)
// If node-fetch isn't available, we'll use native fetch (Node 18+) or http module. 
// Assuming Node 18+ for this environment which supports global fetch.

const API_URL = 'http://localhost:4000/api/projects';
const ADMIN_KEY = 'A/e43117278';

const projects = [
  {
    title: "Swift MT-MX Messaging Hub",
    tag: "FinTech / Banking",
    desc: "High-performance financial messaging interface for converting and validating Swift MT/MX messages.",
    year: "2025",
    role: "Full Stack Engineer",
    tech: ["ExtJS", "Java", "MongoDB", "MSSQL"],
    details: [
      "Implemented ISO 20022 migration tools.",
      "Handled high-volume transaction logging with MongoDB.",
      "Built complex grid interfaces with ExtJS."
    ],
    live: "#",
    repo: "#",
    sortOrder: 1
  },
  {
    title: "Modern E-Commerce Store",
    tag: "E-Commerce",
    desc: "Scalable online marketplace with inventory management and secure checkout.",
    year: "2024",
    role: "Frontend Lead",
    tech: ["ReactJS", "TailwindCSS", "Java", "MSSQL"],
    details: [
      "Responsive design with TailwindCSS.",
      "Integrated secure payment gateways.",
      "Real-time inventory tracking with Java backend."
    ],
    live: "#",
    repo: "#",
    sortOrder: 2
  },
  {
    title: "TaskFlow Pro",
    tag: "Productivity / SaaS",
    desc: "Real-time collaborative project management tool with Kanban boards.",
    year: "2023",
    role: "Full Stack Developer",
    tech: ["Vue.js", "Node.js", "PostgreSQL", "Socket.io"],
    details: [
      "Real-time updates using Socket.io.",
      "Drag-and-drop Kanban interface.",
      "Team collaboration features."
    ],
    live: "#",
    repo: "#",
    sortOrder: 3
  },
  {
    title: "AI Creative Suite",
    tag: "AI / SaaS",
    desc: "Generative AI tool for marketing copy and blog posts.",
    year: "2025",
    role: "Lead Developer",
    tech: ["Python", "FastAPI", "React", "OpenAI"],
    details: [
      "Integrated OpenAI API for content generation.",
      "Built custom prompt engineering templates.",
      "FastAPI backend for high concurrency."
    ],
    live: "#",
    repo: "#",
    sortOrder: 4
  }
];

async function addProjects() {
  console.log("Adding sample projects...");
  
  for (const p of projects) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY
        },
        body: JSON.stringify(p)
      });
      
      const data = await res.json();
      if (data.ok) {
        console.log(`✅ Added: ${p.title}`);
      } else {
        console.error(`❌ Failed: ${p.title} - ${data.error}`);
      }
    } catch (err) {
      console.error(`❌ Network Error for ${p.title}:`, err.message);
    }
  }
  console.log("Done.");
}

addProjects();
