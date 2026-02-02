import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, Scale, Handshake, Mail, Terminal } from 'lucide-react';

const Terms = () => {
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
              <Scale className="w-3 h-3" /> Operational Framework
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic">
              Terms <span className="text-accent">/ Service</span>
            </h1>
            <p className="text-muted font-bold uppercase tracking-widest text-xs">
              Protocol Revision: <span className="text-text">February 02, 2026</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-20">
            {[
              {
                title: "Agreement to Terms",
                icon: <Handshake className="w-6 h-6" />,
                content: [
                  "By accessing the Rahman Shishir portfolio or any associated sub-domains, you agree to be bound by these functional protocols.",
                  "If you disagree with any segment of these terms, you are authorized to terminate your session immediately.",
                  "These terms constitute a binding agreement between the end-user and the architectural office."
                ]
              },
              {
                title: "Intellectual Property",
                icon: <FileText className="w-6 h-6" />,
                content: [
                  "All codebase samples, architectural diagrams, and research papers are the exclusive property of Rahman Shishir.",
                  "Users are granted a limited, non-transferable license for personal, non-commercial transitory viewing only.",
                  "The 'look and feel'—including HSL color tokens and custom motion physics—is protected under international design copyright."
                ]
              },
              {
                title: "Usage Restrictions",
                icon: <ShieldAlert className="w-6 h-6" />,
                content: [
                  "You may not attempt to reverse-engineer any minified distribution bundles or bypass security filters.",
                  "Automated scraping, indexing, or stress-testing of the infrastructure is strictly prohibited without prior written consent.",
                  "Malicious interaction with any contact endpoints or API relays will lead to permanent IP blacklisting."
                ]
              },
              {
                title: "Professional Services",
                icon: <Terminal className="w-6 h-6" />,
                content: [
                  "Consultation requests submitted via this platform do not establish a formal client relationship until a Master Service Agreement (MSA) is executed.",
                  "Estimated timelines for security audits are subject to technical scoping and architectural stability.",
                  "All professional advisories are provided 'as-is' unless otherwise specified in a project-specific contract."
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-panel border border-stroke flex items-center justify-center text-accent">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">{section.title}</h2>
                </div>
                <div className="space-y-4 pl-16">
                  {section.content.map((para, pIdx) => (
                    <p key={pIdx} className="text-muted leading-relaxed font-bold border-l-2 border-stroke pl-6 hover:border-accent transition-colors">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass p-12 border-dashed border-2 border-accent/20"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black mb-4 uppercase italic">Legal Department</h2>
                  <p className="text-muted font-bold">For contractual clarifications or liability inquiries, reach out via the secure mailbox.</p>
                </div>
                <a
                  href="mailto:legal@rahmanshishir.com"
                  className="flex items-center gap-3 px-8 py-4 bg-text text-bg rounded-xl font-black hover:scale-[1.05] transition-all uppercase tracking-widest whitespace-nowrap"
                >
                  <Mail className="w-5 h-5" /> Inquire Protocol
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
