// All portfolio content lives here, so components only deal with layout.
// Edit this file to update text, links, experience or skills.
import {
  Github, Linkedin, Globe, Crosshair, Network, Filter, EyeOff, Layers,
  Landmark, Server, Code2, Database, Lock, ArrowLeftRight, ShieldCheck,
} from 'lucide-react';

// First professional role (internship). Used to keep "years of experience" current automatically.
const CAREER_START = new Date(2024, 8, 1); // Sep 2024 (months are 0-based)

// Whole + half years since CAREER_START, e.g. "2+" or "2.5+".
const yearsOfExperience = () => {
  const months = (new Date() - CAREER_START) / (1000 * 60 * 60 * 24 * 30.44);
  const halfYears = Math.max(1, Math.floor(months / 6)) / 2;
  return `${halfYears}+`;
};

// Homepage sections, in order. Used by the navbar, the mobile menu and the command palette.
// Contact is reached through the "Let's talk" button on desktop.
export const NAV_SECTIONS = [
  { id: 'about', name: 'About', index: '01' },
  { id: 'skills', name: 'Stack', index: '02' },
  { id: 'experience', name: 'Experience', index: '03' },
  { id: 'projects', name: 'Work', index: '04' },
  { id: 'services', name: 'Services', index: '05' },
  { id: 'contact', name: 'Contact', index: '06' },
];

export const PROFILE = {
  name: 'Rahman Shishir',
  role: 'Java Full-Stack Engineer',
  summary:
    'Software engineer at naztech Inc, building secure banking software for the SWIFT ISO 20022 MT-to-MX migration with Java, Spring Boot, ExtJS and SQL Server. Cybersecurity background, E|HE certified.',
  summaryHighlight: 'SWIFT ISO 20022 MT-to-MX migration', // phrase in the summary shown brighter in the hero
  location: 'Dhaka, Bangladesh',
  utcOffset: 'UTC+6',
  company: { name: 'naztech Inc', href: 'https://naztech.io/' },
  email: 'gaziur.rahman4311@gmail.com',
  phone: { display: '+880 1609 277790', href: 'tel:+8801609277790' },
  photo: '/assets/profile-600.jpg', // 600 px web version of profile2.png
  availableForWork: true,
};

export const SOCIAL_LINKS = [
  { label: 'GitHub', handle: 'shishir3051', href: 'https://github.com/shishir3051', icon: Github },
  { label: 'LinkedIn', handle: 'Rahman Shishir', href: 'https://www.linkedin.com/in/rahman-shishir-442867266/', icon: Linkedin },
];

// Glass chips floating around the hero portrait
export const HERO_CHIPS = [
  { title: 'ISO 20022', caption: 'MT → MX migration', icon: ArrowLeftRight },
  { title: 'Spring Boot', caption: 'Java services', icon: Server },
  { title: 'E|HE certified', caption: 'Ethical Hacking Essentials', icon: ShieldCheck, tone: 'success' },
];

// Key figures shown under the hero
export const HIGHLIGHTS = [
  { label: 'Experience', value: yearsOfExperience(), caption: 'years, professional' },
  // Hero shows the number of work projects in the Work section here; '—' only shows while they load
  { label: 'Projects', value: '—', caption: 'work projects', countsWorkProjects: true },
  { label: 'Education', value: 'B.Sc.', caption: 'Software Engineering' },
  { label: 'Company', value: 'naztech', suffix: 'Inc', caption: 'current team, Dhaka', href: PROFILE.company.href },
];

// Scrolling ribbon of technologies between the hero and the about section
export const RIBBON = [
  'Java', 'Spring Boot', 'ISO 20022', 'ExtJS', 'SQL Server', 'SWIFT MT/MX',
  'React', 'Next.js', 'Node.js', 'Neo4j', 'Penetration testing',
];

export const ABOUT = {
  title: 'I treat security as part of the design.',
  lead: "I'm a Java full-stack engineer at naztech Inc in Dhaka. I work on enterprise banking software, mainly tooling and workflows for the SWIFT ISO 20022 MT-to-MX transition, across Spring Boot services, ExtJS interfaces and SQL Server data layers.",
  body: 'My degree is in Software Engineering with a major in Cybersecurity, and I hold the Ethical Hacking Essentials (E|HE) certification. That background shapes how I build: validate inputs, minimise exposure and treat security as part of the design.',
  principles: [
    { title: 'Validate inputs', text: 'Every boundary checks what it receives.', icon: Filter },
    { title: 'Minimise exposure', text: 'Least access, smallest surface.', icon: EyeOff },
    { title: 'Secure by design', text: 'Built in from the start, not bolted on.', icon: Layers },
  ],
};

// Stack bento: the first group is the featured "core focus" card
export const SKILL_GROUPS = [
  { name: 'Fintech', desc: 'SWIFT message migration and payment automation for banks.', items: ['SWIFT MT/MX', 'ISO 20022', 'Payment workflow automation'], icon: Landmark, featured: true },
  { name: 'Backend', desc: 'Java and Spring Boot services, with Node.js and AWS where they fit.', items: ['Java', 'Spring Boot', 'Node.js', 'AWS'], icon: Server },
  { name: 'Frontend', desc: 'ExtJS for enterprise banking screens, React and Next.js for the web.', items: ['React', 'Next.js', 'ExtJS', 'Tailwind CSS'], icon: Code2 },
  { name: 'Databases', desc: 'Relational and graph data, from SQL Server to Neo4j.', items: ['MS SQL Server', 'Neo4j', 'MongoDB'], icon: Database },
  { name: 'Security', desc: 'Offensive testing skills, backed by an E|HE certification.', items: ['Penetration testing', 'Vulnerability assessment', 'Ethical hacking (E|HE)'], icon: Lock },
];

// Work history, newest first
export const EXPERIENCE = [
  {
    title: 'Junior Software Engineer',
    entity: 'naztech Inc',
    location: 'Dhaka',
    period: 'Jan 2025 — Present',
    current: true,
    summary: 'Develop and maintain enterprise banking software in Java and JavaScript, working on SWIFT ISO 20022 MT-to-MX transition projects.',
  },
  {
    title: 'Software Engineer Trainee',
    entity: 'naztech Inc',
    location: 'Dhaka',
    period: 'Oct 2024 — Dec 2024',
    summary: 'Trained on enterprise architecture and security practices across ExtJS, Spring Boot and SQL Server, on banking and payment automation workflows.',
  },
  {
    title: 'Software Engineer Intern',
    entity: 'naztech Inc',
    location: 'Dhaka',
    period: 'Sep 2024',
    summary: 'Shadowed senior engineers and took part in code reviews.',
  },
];

export const EDUCATION = [
  { title: 'B.Sc. in Software Engineering', entity: 'Daffodil International University', period: '2020 — 2024', badge: 'Major in Cybersecurity' },
  { title: 'Higher Secondary Certificate', entity: 'Ispahani Public School and College', period: '2016 — 2018' },
  { title: 'Secondary School Certificate', entity: 'Comilla Modern High School', period: '2010 — 2016' },
];

export const CERTIFICATION = { label: 'Certification', title: 'Ethical Hacking Essentials (E|HE)' };

// Shown when the projects API is unavailable or has no professional projects yet
export const FALLBACK_PROJECTS = [
  {
    title: 'SWIFT ISO 20022 MT-MX Transition',
    tag: 'Fintech · Security',
    year: '2024',
    role: 'Junior Software Engineer',
    desc: 'A banking solution that helps banks automate workflows and stay compliant during the MT-to-MX migration.',
    details: [
      'Implemented ISO 20022 migration tools.',
      'Handled high-volume transaction logging with SQL Server.',
      'Built complex grid interfaces with ExtJS.',
    ],
    tech: ['Java', 'ExtJS', 'Spring Boot', 'MSSQL'],
    isProfessional: true,
  },
  {
    title: 'Cybersecurity Dashboard',
    tag: 'Security · Neo4j',
    year: '2024',
    role: 'Lead Developer',
    desc: 'A monitoring tool that finds and visualises security vulnerabilities in web applications, with automated scanning and graph views.',
    details: [
      'Visualised network threats using Neo4j.',
      'Automated vulnerability scanning.',
      'Designed a dark-mode security analysis UI.',
    ],
    tech: ['React', 'Node.js', 'Neo4j', 'Tailwind'],
    isProfessional: true,
  },
];

export const SERVICES = [
  {
    title: 'Secure web engineering',
    desc: 'Full-stack applications in Java, Spring Boot and React, with input validation and minimal exposure designed in.',
    icon: Globe,
  },
  {
    title: 'Security assessments',
    desc: 'Penetration testing and vulnerability assessments that show where a web application is exposed.',
    icon: Crosshair,
  },
  {
    title: 'Data architecture',
    desc: 'Data models on SQL Server and Neo4j, for relational records and connected, graph-shaped data.',
    icon: Network,
  },
];
