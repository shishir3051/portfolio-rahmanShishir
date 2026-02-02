import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail, Terminal } from 'lucide-react';

const Legal = () => {
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
              <Shield className="w-3 h-3" /> Compliance Archive
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic">
              Privacy <span className="text-accent">/ Protocol</span>
            </h1>
            <p className="text-muted font-bold uppercase tracking-widest text-xs">
              Last Hash Update: <span className="text-text">February 02, 2026</span>
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
                title: "Information Collection",
                icon: <Eye className="w-6 h-6" />,
                content: [
                  "We collect personally identifiable information that you voluntarily provide when you submit a contact form or request architectural audits.",
                  "Automatically collected data includes IP addresses, browser fingerprints, and system telemetry to monitor and optimize site security.",
                  "All data collection is performed under strict encryption and is necessary for providing requested professional services."
                ]
              },
              {
                title: "Data Utilization",
                icon: <Lock className="w-6 h-6" />,
                content: [
                  "Your information is primarily used to respond to inquiries, send technical advisories, and maintain the integrity of our digital environment.",
                  "We analyze usage patterns exclusively to detect and prevent unauthorized access or system vulnerabilities.",
                  "We do not sell or monetize user data under any circumstances."
                ]
              },
              {
                title: "Security Measures",
                icon: <Shield className="w-6 h-6" />,
                content: [
                  "We implement enterprise-grade technical and organizational security measures to protect your personal information against unauthorized disclosure.",
                  "Secure connections (TLS/SSL) are mandated for all data transmissions.",
                  "Note: No electronic transmission or persistent storage technology can be guaranteed to be 100% impenetrable."
                ]
              },
              {
                title: "Your Rights (GDPR/APAA)",
                icon: <FileText className="w-6 h-6" />,
                content: [
                  "Right to Access: You may request copies of any personal datasets we hold.",
                  "Right to Erasure: You have the right to request the permanent deletion of your data from our active systems.",
                  "Right to Object: You may object to our processing of your personal data at any point."
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
                  <h2 className="text-3xl font-black mb-4 uppercase italic">Legal Inquiry</h2>
                  <p className="text-muted font-bold">For transparency requests or privacy concerns, contact the security office directly.</p>
                </div>
                <a
                  href="mailto:privacy@rahmanshishir.com"
                  className="flex items-center gap-3 px-8 py-4 bg-text text-bg rounded-xl font-black hover:scale-[1.05] transition-all uppercase tracking-widest whitespace-nowrap"
                >
                  <Mail className="w-5 h-5" /> Secure Channel
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Legal;
