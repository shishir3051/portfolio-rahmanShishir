import { Mail, Phone, ArrowUpRight } from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '../data/profile';
import ContactForm from './ContactForm';

// One frosted link row (email, phone, socials)
const ContactLink = ({ href, icon, label, value, external = false, tinted = true }) => {
  const Icon = icon;
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="glass lift flex items-center gap-4 rounded-2xl py-3.5 pl-3.5 pr-4"
    >
      <span
        aria-hidden="true"
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-stroke ${tinted ? 'text-accent' : 'text-text'}`}
        style={{ background: tinted ? 'var(--accent-soft)' : 'var(--fill-1)' }}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted2">{label}</span>
        {/* overflow-wrap:anywhere lets long values (the email) wrap on narrow phones */}
        <span className="mt-0.5 block text-base font-medium text-text [overflow-wrap:anywhere]">{value}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted2" aria-hidden="true" />
    </a>
  );
};

// Final call to action: a glowing panel with its own drifting light, contact links and the form
const ContactSection = () => {
  return (
    <section id="contact" className="pb-20 pt-16 md:pb-32 md:pt-24">
      <div className="container">
        <div className="gradient-border rounded-[32px]">
          <div className="gradient-border-inner relative overflow-hidden rounded-[31px] p-6 sm:p-10 lg:p-16">
            <div aria-hidden="true" className="animate-drift-b absolute -right-40 -top-56 h-[560px] w-[560px] rounded-full blur-[40px]" style={{ background: 'radial-gradient(circle at center, var(--aurora-1) 0%, transparent 62%)', opacity: 'calc(0.42 * var(--orb-opacity))' }} />
            <div aria-hidden="true" className="animate-drift-a absolute -bottom-64 -left-44 h-[520px] w-[520px] rounded-full blur-[40px]" style={{ background: 'radial-gradient(circle at center, var(--aurora-2) 0%, transparent 62%)', opacity: 'calc(0.26 * var(--orb-opacity))' }} />

            <div className="relative flex flex-wrap gap-x-16 gap-y-12">
              <div className="min-w-0 flex-[1_1_440px]">
                <p className="eyebrow">06 — Contact</p>
                <h2 className="text-balance font-heading text-[clamp(36px,5vw,64px)] font-semibold leading-[1.02] tracking-[-0.045em] text-text">
                  Have a project in mind? <span className="gradient-text">Let's talk.</span>
                </h2>
                <p className="mt-5 max-w-[30em] text-[17px] leading-relaxed text-muted">
                  I'm available for new opportunities. Email is the quickest way to reach me.
                </p>
                <ul className="mt-8 grid gap-2.5">
                  <li className="min-w-0"><ContactLink href={`mailto:${PROFILE.email}`} icon={Mail} label="Email" value={PROFILE.email} /></li>
                  <li className="min-w-0"><ContactLink href={PROFILE.phone.href} icon={Phone} label="Phone" value={PROFILE.phone.display} /></li>
                  <li className="grid min-w-0 gap-2.5 sm:grid-cols-2">
                    {SOCIAL_LINKS.map((link) => (
                      <ContactLink key={link.label} href={link.href} icon={link.icon} label={link.label} value={link.handle} external tinted={false} />
                    ))}
                  </li>
                </ul>
              </div>
              <div className="grid min-w-0 flex-[1_1_380px]">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
