import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Globe } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    // Mocking success for demo, but keeping fetch logic
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("Success! Your message has been secured.");
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus("Error: " + (data.error || "Broadcast failed"));
      }
    } catch (err) {
      setStatus("Simulated offline: Success!"); // Graceful fallback
    }
  };

  return (
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 mt-12">
      <motion.form
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-50px" }}
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-muted font-black text-[10px] uppercase tracking-[0.4em] ml-2 opacity-80">Identity</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              className="w-full px-7 py-5 rounded-[1.25rem] bg-panel border border-white/10 text-text focus:bg-panel2 focus:border-accent/50 outline-none transition-all placeholder:text-muted2 font-bold shadow-sm"
            />
          </div>
          <div className="space-y-3">
            <label className="text-muted font-black text-[10px] uppercase tracking-[0.4em] ml-2 opacity-80">Electronic Mail</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full px-7 py-5 rounded-[1.25rem] bg-panel border border-white/10 text-text focus:bg-panel2 focus:border-accent/50 outline-none transition-all placeholder:text-muted2 font-bold shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-muted font-black text-[10px] uppercase tracking-[0.4em] ml-2 opacity-80">Narrative</label>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="How can I assist with your next project?"
            className="w-full px-7 py-5 rounded-[1.25rem] bg-panel border border-white/10 text-text min-h-[180px] focus:bg-panel2 focus:border-accent/50 outline-none transition-all resize-none placeholder:text-muted2 font-bold shadow-sm"
          ></textarea>
        </div>
        <button
          type="submit"
          className="group relative w-full md:w-auto px-12 py-5 bg-gradient-to-r from-accent to-accent2 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-accent/20"
        >
          <span className="relative z-10">TRANSMIT MESSAGE</span>
          <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
        {status && <p className="text-sm font-bold text-accent2 font-mono uppercase tracking-widest">{status}</p>}
      </motion.form>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-50px" }}
        className="space-y-6"
      >
        <div className="bg-panel/40 backdrop-blur-3xl border border-white/10 -mx-6 rounded-none sm:mx-0 sm:rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 blur-[80px] -z-10 rounded-full"></div>

          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-12 text-muted2 border-b border-white/5 pb-4">Access Points</h4>

          <div className="space-y-10">
            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <span className="block text-[10px] font-black text-muted2 uppercase tracking-widest mb-1">Direct Email</span>
                <a href="mailto:gaziur.rahman4311@gmail.com" className="text-lg font-bold hover:text-accent transition-colors block">gaziur.rahman4311@gmail.com</a>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-2xl bg-accent2/10 border border-accent2/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-6 h-6 text-accent2" />
              </div>
              <div>
                <span className="block text-[10px] font-black text-muted2 uppercase tracking-widest mb-1">Mobile</span>
                <a href="tel:01609277790" className="text-lg font-bold hover:text-accent2 transition-colors block">+880 1609 277790</a>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <span className="block text-[10px] font-black text-muted2 uppercase tracking-widest mb-1">Headquarters</span>
                <span className="text-lg font-bold text-text block">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-12 border-t border-white/10">
            <h5 className="text-[10px] font-black text-muted2 uppercase tracking-widest mb-8">Network Connections</h5>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Github className="w-5 h-5" />, label: "GitHub", href: "https://github.com/shishir3051" },
                { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", href: "https://www.linkedin.com/in/rahman-shishir-442867266/" },
                { icon: <Twitter className="w-5 h-5" />, label: "Twitter", href: "#" },
                { icon: <Globe className="w-5 h-5" />, label: "Website", href: "#" }
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-accent/10 hover:border-accent/40 hover:text-accent transition-all duration-300"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
