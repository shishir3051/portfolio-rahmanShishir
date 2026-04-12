import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Admin from '../models/Admin.js';
import Project from '../models/Project.js';
import { connectDB } from '../db.js';

const projects = [
  {
    title: "Swift MT-MX Messaging Hub",
    tag: "FinTech / Banking",
    desc: "High-performance financial messaging interface for converting and validating Swift MT/MX messages.",
    projectYear: "2025",
    role: "Full Stack Engineer",
    tech: ["ExtJS", "Java", "MongoDB", "MSSQL"],
    details: [
      "Implemented ISO 20022 migration tools.",
      "Handled high-volume transaction logging with MongoDB.",
      "Built complex grid interfaces with ExtJS."
    ],
    liveUrl: "#",
    repoUrl: "#",
    sortOrder: 1,
    isActive: true
  },
  {
    title: "Modern E-Commerce Store",
    tag: "E-Commerce",
    desc: "Scalable online marketplace with inventory management and secure checkout.",
    projectYear: "2024",
    role: "Frontend Lead",
    tech: ["ReactJS", "TailwindCSS", "Java", "MSSQL"],
    details: [
      "Responsive design with TailwindCSS.",
      "Integrated secure payment gateways.",
      "Real-time inventory tracking with Java backend."
    ],
    liveUrl: "#",
    repoUrl: "#",
    sortOrder: 2,
    isActive: true
  },
  {
    title: "TaskFlow Pro",
    tag: "Productivity / SaaS",
    desc: "Real-time collaborative project management tool with Kanban boards.",
    projectYear: "2023",
    role: "Full Stack Developer",
    tech: ["Vue.js", "Node.js", "PostgreSQL", "Socket.io"],
    details: [
      "Real-time updates using Socket.io.",
      "Drag-and-drop Kanban interface.",
      "Team collaboration features."
    ],
    liveUrl: "#",
    repoUrl: "#",
    sortOrder: 3,
    isActive: true
  },
  {
    title: "AI Creative Suite",
    tag: "AI / SaaS",
    desc: "Generative AI tool for marketing copy and blog posts.",
    projectYear: "2025",
    role: "Lead Developer",
    tech: ["Python", "FastAPI", "React", "OpenAI"],
    details: [
      "Integrated OpenAI API for content generation.",
      "Built custom prompt engineering templates.",
      "FastAPI backend for high concurrency."
    ],
    liveUrl: "#",
    repoUrl: "#",
    sortOrder: 4,
    isActive: true
  }
];

async function seed() {
  console.log("Connecting database...");
  await connectDB();

  console.log("Seeding Admin account...");
  const existingAdmin = await Admin.findOne({ username: 'admin' });
  if (existingAdmin) {
    console.log("Admin account already exists.");
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("A/e43117278", salt);
    const newAdmin = new Admin({ username: 'admin', passwordHash: hash });
    await newAdmin.save();
    console.log("Successfully created admin account: admin");
  }

  console.log("Seeding Projects...");
  for (const p of projects) {
    const existingProject = await Project.findOne({ title: p.title });
    if (existingProject) {
      console.log(`Project "${p.title}" already exists. Skipping.`);
    } else {
      const newProject = new Project(p);
      await newProject.save();
      console.log(`Successfully added project: ${p.title}`);
    }
  }

  console.log("Seeding Complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
