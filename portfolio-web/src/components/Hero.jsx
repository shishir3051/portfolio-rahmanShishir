import React, { useEffect, useRef } from 'react';
import { Code, Briefcase, GraduationCap, Globe } from 'lucide-react';
import { gsap } from 'gsap';

// ── Tech orbit badge data ─────────────────────────────────────────────────────
const TECH_BADGES = [
  { label: 'React',  style: { top: '8%',  left: '48%' } },
  { label: 'Java',   style: { top: '28%', left: '82%' } },
  { label: 'Spring', style: { top: '58%', left: '88%' } },
  { label: 'Neo4j',  style: { top: '82%', left: '52%' } },
  { label: 'Sec',    style: { top: '60%', left: '8%'  } },
  { label: 'AWS',    style: { top: '22%', left: '12%' } },
];

// ── Snapshot stat items ───────────────────────────────────────────────────────
const SNAPSHOT_ITEMS = [
  { label: 'Experience', value: '1.5+ Years', icon: <Briefcase className="w-4 h-4" />, color: 'text-accent' },
  { label: 'Projects',   value: '10+ Total',  icon: <Code className="w-4 h-4" />,      color: 'text-accent2' },
  { label: 'Education',  value: 'B.Sc SWE',   icon: <GraduationCap className="w-4 h-4" />, color: 'text-white' },
  {
    label: 'Company', value: 'naztech Inc',
    icon: <Globe className="w-4 h-4" />, color: 'text-accent',
    link: 'https://naztech.io/',
  },
];

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = ({ name, headline }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Targets inside the hero
    const greet   = el.querySelector('.hero-greet');
    const title   = el.querySelector('.hero-title');
    const sub     = el.querySelector('.hero-sub');
    const tag     = el.querySelector('.hero-tag');
    const cta     = el.querySelector('.hero-cta');
    const stats   = el.querySelector('.hero-stats');
    const orbit   = el.querySelector('.tech-orbit');
    const scrollI = el.querySelector('.scroll-ind');
    const bubbles = el.querySelectorAll('.tech-bubble');

    // Hide everything immediately (before loader fades)
    gsap.set([greet, title, sub, tag, cta, stats, orbit, scrollI], { opacity: 0, y: 30 });
    gsap.set(bubbles, { opacity: 0, scale: 0 });

    // Staggered entrance after loader (1.8 s)
    const tl = gsap.timeline({ delay: 1.9 });

    tl.to(greet,   { opacity: 1, y: 0, duration: 0.9 })
      .to(title,   { opacity: 1, y: 0, duration: 1   }, '-=0.6')
      .to(sub,     { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to(tag,     { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to(cta,     { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
      .to(stats,   { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .to(scrollI, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to(orbit,   { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
      .to(bubbles, {
        opacity: 1, scale: 1, duration: 0.7,
        stagger: 0.12, ease: 'back.out(2)',
      }, '-=0.5');

    return () => tl.kill();
  }, []);

  const firstName = name ? name.split(' ')[0] : 'Rahman';
  const lastName  = name ? name.split(' ').slice(1).join(' ') : 'Shishir';

  return (
    <section
      id="home"
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{ paddingTop: '100px' }}
    >
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">

        {/* ── LEFT: Text content ─────────────────────────────── */}
        <div className="relative" style={{ zIndex: 2 }}>

          {/* Greeting */}
          <div className="hero-greet mb-6">
            Hi there, my name is
          </div>

          {/* Name */}
          <div className="hero-title mb-6">
            <h1
              className="font-black tracking-tighter leading-none"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(48px, 7vw, 100px)' }}
            >
              <span className="hero-name-first">{firstName}.</span>
              <span className="hero-name-last">{lastName}.</span>
            </h1>
          </div>


          {/* Sub headline */}
          <div className="hero-sub mb-4">
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', fontWeight: 300 }}>
              I'm a{' '}
              <b style={{ color: 'var(--cyan)', fontWeight: 600 }}>
                Java Full-Stack Engineer.
              </b>
            </p>
          </div>

          {/* Tag line */}
          <div className="hero-tag mb-10">
            <p style={{ fontSize: '16px', color: 'var(--text-dim)', lineHeight: 1.75, maxWidth: '520px' }}>
              {headline || 'Building secure, scalable systems with a security-first mindset. Specializing in FinTech, Spring Boot & modern web engineering.'}
            </p>
          </div>

          {/* CTA buttons */}
          <div className="hero-cta flex flex-wrap gap-4 mb-16">
            <a
              href="#projects"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 32px', borderRadius: '999px',
                fontWeight: 600, fontSize: '15px',
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                color: '#08081a',
                boxShadow: '0 8px 30px rgba(0,240,255,0.35)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 14px 40px rgba(177,74,255,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,240,255,0.35)';
              }}
            >
              View My Work →
            </a>
            <a
              href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 32px', borderRadius: '999px',
                fontWeight: 600, fontSize: '15px',
                background: 'transparent', color: 'var(--text)',
                border: '1px solid var(--glass-border)',
                transition: 'transform 0.3s, border-color 0.3s, color 0.3s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--cyan)';
                e.currentTarget.style.color = 'var(--cyan)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              Contact Me
            </a>
          </div>

          {/* Snapshot stats */}
          <div
            className="hero-stats hidden lg:grid grid-cols-4 gap-8 border-t pt-8"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            {SNAPSHOT_ITEMS.map((item, i) => {
              const content = (
                <div className="flex flex-col gap-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '11px',
                      color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px',
                    }}
                  >
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 font-bold text-white text-lg">
                    {item.value}
                    {React.cloneElement(item.icon, { className: `w-4 h-4 ${item.color} opacity-80` })}
                  </div>
                </div>
              );
              return item.link
                ? <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">{content}</a>
                : <div key={i}>{content}</div>;
            })}
          </div>
        </div>

        {/* ── RIGHT: Profile photo inside tech orbit ──────────── */}
        <div className="relative flex items-center justify-center mt-12 lg:mt-0 w-full" style={{ zIndex: 2 }}>
          <div className="tech-orbit" style={{ position: 'relative', width: '100%', height: 'min(520px, 100vw)' }}>

            {/* Glow behind photo */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(340px, 65vw)', height: 'min(340px, 65vw)', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, rgba(177,74,255,0.14) 50%, transparent 70%)',
              filter: 'blur(28px)',
            }} />

            {/* Orbit ring 1 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(380px, 73vw)', height: 'min(380px, 73vw)', borderRadius: '50%',
              border: '1px dashed rgba(0,240,255,0.22)',
            }} />

            {/* Orbit ring 2 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(490px, 94vw)', height: 'min(490px, 94vw)', borderRadius: '50%',
              border: '1px dashed rgba(177,74,255,0.15)',
            }} />

            {/* Profile photo — centred in the orbit */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(300px, 58vw)', height: 'min(300px, 58vw)', borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid rgba(0,240,255,0.4)',
              boxShadow: '0 0 40px rgba(0,240,255,0.25), 0 0 80px rgba(177,74,255,0.15)',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 3,
            }}>
              <img
                src="/assets/profile2.png"
                alt="Rahman Shishir"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'top center',
                  filter: 'grayscale(20%)',
                  transition: 'filter 0.5s ease, transform 0.5s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'grayscale(0%)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'grayscale(20%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </div>

            {/* Badge bubbles */}
            {TECH_BADGES.map((badge, i) => (
              <div key={i} className="tech-bubble" style={badge.style}>
                {badge.label}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div
        className="scroll-ind absolute"
        style={{ bottom: '36px', left: '50%', transform: 'translateX(-50%)' }}
      >
        Scroll
      </div>
    </section>
  );
};

export default Hero;
