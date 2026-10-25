import { Helmet } from 'react-helmet-async';
import { ArrowRight, CodeXml, Cpu, Database, LayoutTemplate, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { trackSpotlight } from '../utils/spotlight';

// Tools grouped by area. Defined outside the component so the list is not rebuilt on every render.
// `title` is the readable heading of each card, `icon` the lucide icon in its tinted box,
// and `id` links each heading to its section for screen readers.
const TOOL_GROUPS = [
  {
    id: 'development',
    icon: CodeXml,
    title: 'Development & DevOps',
    items: [
      { name: 'Visual Studio Code', description: 'Primary editor, set up for Java, React and Python.' },
      { name: 'IntelliJ IDEA', description: 'IDE for Spring Boot services and large Java codebases.' },
      { name: 'Docker & Kubernetes', description: 'Containers and orchestration for deploying microservices.' },
      { name: 'GitHub Actions', description: 'CI/CD pipelines for automated builds, tests and releases.' },
    ],
  },
  {
    id: 'frontend',
    icon: LayoutTemplate,
    title: 'Frontend',
    items: [
      { name: 'React / Next.js', description: 'Interactive, SEO-friendly user interfaces.' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS for fast, consistent styling.' },
      { name: 'Framer Motion', description: 'Animations and transitions in React.' },
    ],
  },
  {
    id: 'backend',
    icon: Database,
    title: 'Backend & Data',
    items: [
      { name: 'Spring Boot', description: 'Secure, scalable REST APIs and backend services.' },
      { name: 'Neo4j', description: 'Graph database for modelling network relationships and threat data.' },
      { name: 'MS SQL Server', description: 'Relational database for high-concurrency enterprise systems.' },
    ],
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Security',
    items: [
      { name: 'Burp Suite Pro', description: 'Web application penetration testing.' },
      { name: 'Metasploit', description: 'Vulnerability analysis and exploit testing during security audits.' },
      { name: 'Wireshark', description: 'Packet capture and network traffic analysis.' },
    ],
  },
  {
    id: 'hardware',
    icon: Cpu,
    title: 'Hardware',
    items: [
      { name: 'Workstation', description: 'Ryzen 9, 64 GB RAM, RTX 4080, for heavy builds and virtual machines.' },
      { name: 'Monitors', description: 'Three 27" 4K displays for code, documentation and logs side by side.' },
      { name: 'Keyboard', description: 'Keychron Q3 mechanical keyboard with tactile switches.' },
    ],
  },
];

const TOTAL_ITEMS = TOOL_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

// 4 -> "04": fixed-width counts, matching the small mono indices on the homepage
const pad2 = (n) => String(n).padStart(2, '0');

// One group as a frosted glass card: tinted icon + Sora heading on top,
// then a clean list (tool name on the left, what I use it for on the right).
const ToolGroup = ({ group }) => {
  const { id, title, items } = group;
  // Capitalised alias so the icon can be rendered as a JSX component
  const Icon = group.icon;
  const headingId = `uses-${id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="glass lift spotlight relative overflow-hidden rounded-3xl p-6 md:p-8"
      onPointerMove={trackSpotlight}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-box h-[42px] w-[42px]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id={headingId} className="font-heading text-xl font-semibold tracking-[-0.03em] text-text">
            {title}
          </h2>
        </div>
        {/* Visual count only; screen readers already announce the list length */}
        <span className="font-mono text-xs text-muted2" aria-hidden="true">{pad2(items.length)}</span>
      </div>

      {/* Rows stack on phones and become two columns from `sm` */}
      <dl className="mt-6 divide-y divide-stroke border-t border-stroke">
        {items.map(({ name, description }) => (
          <div key={name} className="grid gap-1 py-4 last:pb-0 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="text-[15px] font-medium text-text">{name}</dt>
            <dd className="text-[15px] leading-relaxed text-muted">{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

// "Uses" page: the hardware, software and tools I work with, tiled as glass cards.
const Uses = () => {
  return (
    <>
      <Helmet>
        <title>Uses | Rahman Shishir</title>
        <meta
          name="description"
          content="The hardware, software and tools Rahman Shishir uses for software development and security work."
        />
      </Helmet>

      <PageHeader
        eyebrow="Uses"
        title={<>The <span className="gradient-text">tools</span> behind the work.</>}
        description="The hardware, software and tools I use day to day for development and security work."
      >
        <p className="mt-7 font-mono text-xs uppercase tracking-[0.12em] text-muted2">
          <span className="text-text">{pad2(TOOL_GROUPS.length)}</span> groups
          <span className="mx-2.5" aria-hidden="true">·</span>
          <span className="text-text">{pad2(TOTAL_ITEMS)}</span> items
        </p>
      </PageHeader>

      {/* One card per row on phones, two from `lg`; the closing card fills the last cell */}
      <div className="container grid gap-4 pb-20 md:pb-28 lg:grid-cols-2">
        {TOOL_GROUPS.map((group) => (
          <ToolGroup key={group.id} group={group} />
        ))}

        {/* Closing call to action: links back to the contact section on the homepage.
            Spans the full row when the groups already fill every cell. */}
        <section
          aria-labelledby="uses-feedback"
          className={`gradient-border flex ${TOOL_GROUPS.length % 2 === 0 ? 'lg:col-span-2' : ''}`}
        >
          <div className="gradient-border-inner relative flex flex-1 flex-col items-start justify-between gap-8 overflow-hidden p-6 md:p-8">
            {/* Soft aurora glow in the corner (decorative) */}
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-24 h-[260px] w-[260px] rounded-full blur-[60px]"
              style={{ background: 'var(--glow)', opacity: 'calc(0.6 * var(--orb-opacity))' }}
            />
            <div className="relative">
              <h2
                id="uses-feedback"
                className="text-balance font-heading text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.1] tracking-[-0.03em] text-text"
              >
                Suggestions <span className="gradient-text">welcome</span>.
              </h2>
              <p className="mt-3 max-w-[30em] text-[15px] leading-relaxed text-muted">
                This list changes as I try new tools. Have a recommendation, or a project in mind?
              </p>
            </div>
            <a href="#contact" className="btn-primary relative h-[48px] px-6">
              Get in touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Uses;
