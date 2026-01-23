import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus("Error: " + (data.error || "Failed to send"));
      }
    } catch (err) {
      setStatus("Failed to connect to server");
    }
  };

  return (
    <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 mt-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-muted font-bold text-sm">Your Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="John Doe" 
            className="w-full px-4 py-3.5 rounded-xl bg-panel border border-stroke text-text focus:bg-panel2 focus:border-accent/40 outline-none transition-all"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-muted font-bold text-sm">Email Address</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="john@example.com" 
            className="w-full px-4 py-3.5 rounded-xl bg-panel border border-stroke text-text focus:bg-panel2 focus:border-accent/40 outline-none transition-all"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-muted font-bold text-sm">Message</label>
          <textarea 
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Tell me about your project..." 
            className="w-full px-4 py-3.5 rounded-xl bg-panel border border-stroke text-text min-h-[140px] focus:bg-panel2 focus:border-accent/40 outline-none transition-all resize-none"
          ></textarea>
        </div>
        <button type="submit" className="px-8 py-4 bg-gradient-to-br from-accent to-accent2 rounded-xl font-bold shadow-xl shadow-accent/20 hover:shadow-accent/40 active:translate-y-px transition-all mt-2">
          Send Message
        </button>
        {status && <p className="text-sm font-bold text-accent2 mt-2">{status}</p>}
      </form>

      <div className="flex flex-col gap-4">
        <div className="p-8 rounded-[20px] bg-panel border border-stroke backdrop-blur-xl">
          <h4 className="font-bold mb-6 text-xl tracking-tight">Details</h4>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📧</span>
              <div>
                <b className="block text-text">Email</b>
                <a href="mailto:gaziur.rahman4311@gmail.com" className="text-muted hover:text-accent transition-colors">gaziur.rahman4311@gmail.com</a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📞</span>
              <div>
                <b className="block text-text">Phone</b>
                <a href="tel:01609277790" className="text-muted hover:text-accent transition-colors">01609277790</a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📍</span>
              <div>
                <b className="block text-text">Location</b>
                <span className="text-muted">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-stroke">
            <h5 className="text-xs font-bold text-muted2 uppercase tracking-widest mb-4">Social</h5>
            <div className="flex flex-wrap gap-2">
              <a href="https://github.com/shishir3051" target="_blank" rel="noopener" className="px-5 py-2 rounded-full border border-stroke bg-panel text-xs font-bold hover:bg-panel2 hover:border-accent/40 transition-all text-text">
                Github
              </a>
              <a href="https://www.linkedin.com/in/rahman-shishir-442867266/" target="_blank" rel="noopener" className="px-5 py-2 rounded-full border border-stroke bg-panel text-xs font-bold hover:bg-panel2 hover:border-accent/40 transition-all text-text">
                LinkedIn
              </a>
              <button disabled className="px-5 py-2 rounded-full border border-stroke bg-panel text-xs font-bold opacity-50 cursor-not-allowed">
                Twitter
              </button>
              <button disabled className="px-5 py-2 rounded-full border border-stroke bg-panel text-xs font-bold opacity-50 cursor-not-allowed">
                Dribbble
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
