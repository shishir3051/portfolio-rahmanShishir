import React, { useState } from 'react';
import { Send } from 'lucide-react';

import { API_BASE } from '../config';

// Glass message form. Posts to /api/contact and reports success or the real error.
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [statusMessage, setStatusMessage] = useState('');

  const updateField = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return; // Ignore double submits
    setStatus('submitting');
    setStatusMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      // Some failures (e.g. the rate limiter's 429) return plain text, not JSON
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus('success');
        setStatusMessage("Thanks! Your message has been sent.");
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(
          data?.error ||
          (res.status === 429
            ? "Too many messages. Please try again in a few minutes."
            : "Could not send your message. Please email me directly.")
        );
      }
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus('error');
      setStatusMessage("Network error. Please check your connection or email me directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Contact form" className="glass grid min-w-0 gap-4 self-start p-5 md:p-8">
      <p className="font-heading text-xl font-semibold tracking-tight text-text">Send a message</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">Name</label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={formData.name}
            onChange={updateField('name')}
            placeholder="Your name"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="label">Email</label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={formData.email}
            onChange={updateField('email')}
            placeholder="you@company.com"
            className="input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="label">Message</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={5000}
          value={formData.message}
          onChange={updateField('message')}
          placeholder="Tell me about the role or project"
          className="input min-h-[140px] resize-y leading-relaxed"
        />
      </div>

      <button type="submit" disabled={status === 'submitting'} className="btn-primary h-[52px] text-[15px]">
        {status === 'submitting' ? 'Sending…' : 'Send message'}
        <Send className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
      {/* aria-live announces the result to screen-reader users */}
      <p aria-live="polite" className={`min-h-[1.25rem] text-sm ${status === 'error' ? 'text-danger' : 'text-accent2'}`}>
        {statusMessage}
      </p>
    </form>
  );
};

export default ContactForm;
