import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Copy, Check, Sparkles } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'AI Image Create',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 bg-white border-t border-purple-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Send className="w-3.5 h-3.5 text-purple-600 rotate-45" />
            <span>CONTACT</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Let&apos;s Work Together
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Have a project or need assistance with AI images, logo design, websites, or tools? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-7 shadow-lg">
              <h3 className="font-serif-display text-xl font-bold mb-2">
                Jannat Ara Sorna
              </h3>
              <p className="text-xs text-purple-200 mb-6">
                Available for remote freelance and creative projects.
              </p>

              <div className="space-y-3.5">
                {/* Email Box */}
                <div className="bg-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-purple-400/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-purple-600/40 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-purple-200" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-purple-300">Email</div>
                      <div className="text-xs font-mono text-white truncate">{PROFILE.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone Box */}
                <div className="bg-white/10 rounded-2xl p-3.5 flex items-center gap-3 border border-purple-400/20">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/40 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-purple-200" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-purple-300">Phone</div>
                    <div className="text-xs font-mono text-white">{PROFILE.phone}</div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white/10 rounded-2xl p-3.5 flex items-center gap-3 border border-purple-400/20">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/40 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-purple-200" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-purple-300">Location</div>
                    <div className="text-xs text-white">{PROFILE.location}</div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-6 pt-5 border-t border-purple-700/50 flex flex-wrap gap-2 text-xs">
                <a
                  href={PROFILE.socialLinks.behance}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-purple-100"
                >
                  Behance
                </a>
                <a
                  href={PROFILE.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-purple-100"
                >
                  LinkedIn
                </a>
                <a
                  href={PROFILE.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-purple-100"
                >
                  Instagram
                </a>
                <a
                  href={PROFILE.socialLinks.pinterest}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-purple-100"
                >
                  Pinterest
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-7 bg-[#FAF9FF] border border-purple-100 rounded-3xl p-6 sm:p-8">
            <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-1">
              Send a Message
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Leave your inquiry and I will reply as soon as possible.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Message Received</h4>
                <p className="text-xs text-emerald-700">
                  Thank you! You can also contact me directly via email at <span className="font-mono font-bold">{PROFILE.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs focus:ring-2 focus:ring-purple-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs focus:ring-2 focus:ring-purple-600 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Needed
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs focus:ring-2 focus:ring-purple-600 outline-hidden"
                  >
                    <option value="AI Image Create">AI Image Create</option>
                    <option value="Logo Design">Logo Design</option>
                    <option value="Website Making">Website Making</option>
                    <option value="Tool Making">Tool Making</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hello Jannat, I am looking for someone to help with..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs focus:ring-2 focus:ring-purple-600 outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5 rotate-45" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
