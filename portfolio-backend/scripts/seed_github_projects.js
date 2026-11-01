// Adds personal GitHub projects to the portfolio database.
// Safe to re-run: a project is only added when no project with the same repoUrl (or title) exists,
// so edits made later in the admin dashboard are never overwritten.
//
// Usage (from portfolio-backend, with MONGODB_URI in .env):  npm run seed:github
import 'dotenv/config';
import mongoose from 'mongoose';

import Project from '../models/Project.js';
import { connectDB } from '../db.js';

// Field names follow models/Project.js (description, projectYear, liveUrl, repoUrl).
// Text is taken from each repository's README and description on GitHub.
const projects = [
  {
    title: 'LedgerFlow',
    tag: 'FinTech / Banking',
    description: 'Double-entry wallet and payment engine in Java and Spring Boot 3, with idempotent transfers, deadlock-free locking and ISO 20022 (pacs.008) settlement XML.',
    projectYear: '2026',
    role: 'Full-Stack Developer',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'ISO 20022', 'Next.js', 'TypeScript'],
    details: [
      'Immutable double-entry journal: every transaction must balance (debits equal credits) before it commits.',
      'Merchant payments split a 1.5% MDR fee into a revenue ledger inside the same ACID transaction.',
      'Deadlock-free concurrency: accounts are locked in a fixed order (SELECT ... FOR UPDATE), verified by a 25-thread integration test.',
      'Stripe-style Idempotency-Key with SHA-256 payload fingerprints: retries are safe and tampered replays get HTTP 409.',
      'Exports pacs.008.001.08 settlement XML and signs merchant webhooks with HMAC-SHA256.',
    ],
    liveUrl: '',
    repoUrl: 'https://github.com/shishir3051/LedgerFlow',
    sortOrder: 1,
  },
  {
    title: 'HireReady',
    tag: 'Full-stack / EdTech',
    description: 'Interview-preparation platform for new graduates and junior engineers, with model answers, solutions in JavaScript, Python and Java, and interactive visual walkthroughs of each algorithm.',
    projectYear: '2026',
    role: 'Full-Stack Developer',
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
    details: [
      'Visual walkthroughs with play/pause, step scrubbing, a variable watch box and the code line that runs at each step.',
      'Covers data structures and algorithms, CS fundamentals, web development, system design and behavioural questions.',
      'Practice mode, topic quizzes, timed mock interviews and a 30-day roadmap.',
      'Progress dashboard with streaks, an activity heatmap, bookmarks and notes.',
      'Express 5 and Mongoose API with zod validation and JWT sessions in an httpOnly cookie.',
    ],
    liveUrl: 'https://hire-ready-bd.vercel.app/',
    repoUrl: 'https://github.com/shishir3051/HireReady',
    sortOrder: 3,
  },
  {
    title: 'DocFlow',
    tag: 'Full-stack / SaaS',
    description: 'Multi-tenant document verification and approval platform: request documents, verify them automatically, route them through review and approval, and keep a full audit trail.',
    projectYear: '2026',
    role: 'Full-Stack Developer',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
    details: [
      'Customers upload through one expiring link, straight to storage through short-lived signed URLs.',
      'Verification engine checks file integrity, signatures, expiry dates, name matches and duplicates, then auto-passes, routes to a reviewer or rejects.',
      'AI extraction fills in fields from scans and compressed PDFs, as advisory input only.',
      'Versioned approval workflows with conditions, SLAs and escalation.',
      'Role-based access control, tenant isolation and an append-only audit log.',
    ],
    liveUrl: 'https://doc-flow-neon.vercel.app',
    repoUrl: 'https://github.com/shishir3051/DocFlow',
    sortOrder: 5,
  },
  {
    title: 'AI Doc Chat',
    tag: 'AI / Full-stack',
    description: 'Chat with your PDFs: upload documents and ask questions, with answers grounded in the most relevant passages and a choice of LLM providers.',
    projectYear: '2026',
    role: 'Full-Stack Developer',
    tech: ['Next.js', 'React', 'Vercel AI SDK', 'MongoDB', 'Tailwind CSS'],
    details: [
      'Extracts text from uploaded PDFs, including PDFs attached inside a PDF, and splits it into searchable chunks.',
      'BM25 keyword retrieval picks the passages for each question, so short codes such as SWIFT field tags (32A, 60F) stay searchable.',
      'One provider table covers Claude, Gemini, Groq, OpenRouter and other OpenAI-compatible APIs.',
      'Chats and their documents are saved in MongoDB; answers render as Markdown with code highlighting.',
    ],
    liveUrl: '',
    repoUrl: 'https://github.com/shishir3051/ai-doc-chat',
    sortOrder: 6,
  },
];

async function seed() {
  await connectDB();

  for (const project of projects) {
    const existing = await Project.findOne({ $or: [{ repoUrl: project.repoUrl }, { title: project.title }] });
    if (existing) {
      console.log(`Skipped "${project.title}": already in the database.`);
      continue;
    }
    await Project.create({ ...project, isActive: true, isProfessional: false });
    console.log(`Added "${project.title}".`);
  }
}

seed()
  .catch((err) => {
    console.error('Seed error:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
