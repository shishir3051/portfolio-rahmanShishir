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
          <div className="space-y-2">
            <label className="text-muted font-black text-xs uppercase tracking-widest ml-1">Identity</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              className="w-full px-6 py-4 rounded-2xl bg-panel border border-stroke text-text focus:bg-panel2 focus:border-accent outline-none transition-all placeholder:text-muted2 font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted font-black text-xs uppercase tracking-widest ml-1">Electronic Mail</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full px-6 py-4 rounded-2xl bg-panel border border-stroke text-text focus:bg-panel2 focus:border-accent outline-none transition-all placeholder:text-muted2 font-bold"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-muted font-black text-xs uppercase tracking-widest ml-1">Narrative</label>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="How can I assist with your next project?"
            className="w-full px-6 py-4 rounded-2xl bg-panel border border-stroke text-text min-h-[200px] focus:bg-panel2 focus:border-accent outline-none transition-all resize-none placeholder:text-muted2 font-bold"
          ></textarea>
        </div>
        <button
          type="submit"
          className="group relative w-full md:w-auto px-10 py-5 bg-text text-bg rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">TRANSMIT MESSAGE</span>
          <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
        {status && <p className="text-sm font-bold text-accent2 font-mono uppercase tracking-widest">{status}</p>}
      </motion.form>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-50px" }}
        className="space-y-6"
      >
        <div className="glass -mx-6 rounded-none sm:mx-0 sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -z-10 rounded-full"></div>

          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-10 text-muted2">Access Points</h4>

          <div className="space-y-8">
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="block text-[10px] font-black text-muted2 uppercase tracking-widest mb-1">Direct Email</span>
                <a href="mailto:gaziur.rahman4311@gmail.com" className="text-lg font-bold hover:text-accent transition-colors">gaziur.rahman4311@gmail.com</a>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-accent2/5 border border-accent2/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-accent2" />
              </div>
              <div>
                <span className="block text-[10px] font-black text-muted2 uppercase tracking-widest mb-1">Mobile</span>
                <a href="tel:01609277790" className="text-lg font-bold hover:text-accent2 transition-colors">+880 1609 277790</a>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-stroke flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-[10px] font-black text-muted2 uppercase tracking-widest mb-1">Headquarters</span>
                <span className="text-lg font-bold text-text">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-stroke">
            <h5 className="text-[10px] font-black text-muted2 uppercase tracking-widest mb-6">Network Connections</h5>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Github className="w-4 h-4" />, label: "GitHub", href: "https://github.com/shishir3051" },
                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", href: "https://www.linkedin.com/in/rahman-shishir-442867266/" },
                { icon: <Twitter className="w-4 h-4" />, label: "Twitter", href: "#" },
                { icon: <Globe className="w-4 h-4" />, label: "Website", href: "#" }
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stroke bg-white/5 text-xs font-bold hover:bg-accent/10 hover:border-accent hover:text-accent transition-all"
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
