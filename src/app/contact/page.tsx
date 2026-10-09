'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Mail,
  Building,
  Globe,
  MessageSquare,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    businessType: 'clinic_healthcare',
    serviceOfInterest: 'voice_ai',
    currentChallenge: '',
    preferredContactMethod: 'email',
    consent: false,
    honeypot: '', // anti-spam
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ message: string; deliveryMode: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.issues) {
          setFieldErrors(data.issues);
        } else {
          setErrorMsg(data.error || 'Failed to submit form. Please try again.');
        }
      } else {
        setSuccessResponse({
          message: data.message,
          deliveryMode: data.deliveryMode,
        });
      }
    } catch {
      setErrorMsg('Network error. Please check your connection or contact founder directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>DISCOVERY &amp; CONSULTATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Let’s Build Something Dependable.{' '}
            <span className="text-zinc-500">Together.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Tell us about your operations, manual communication hurdles, or desired automation pipeline. We will review your requirements and respond within 24 hours.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Information & Context */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 space-y-6">
              <h3 className="text-xl font-bold text-white">Direct Communications</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We are an engineering-driven team based in Bengaluru. Every inquiry is reviewed directly by our founder and lead technical architects.
              </p>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px]">HEADQUARTERS</div>
                    <div>Bengaluru, Karnataka, India</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px]">FOUNDER DESK</div>
                    <div className="text-white">founder@meowai.tech</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px]">SUPPORT HOURS</div>
                    <div>9:00 AM – 7:00 PM IST (Mon–Sat)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/20 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Zero Sales Spam Guarantee</span>
              </div>
              <p className="leading-relaxed">
                We never sell your email or phone number to third parties. We will only contact you regarding your specific technical inquiry.
              </p>
            </div>
          </div>

          {/* Contact Request Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-8 sm:p-10 shadow-glass text-left">
              {successResponse ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Inquiry Received</h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                    {successResponse.message}
                  </p>
                  <div className="text-xs font-mono text-zinc-500 pt-2">
                    Storage mode: {successResponse.deliveryMode}
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={() => setSuccessResponse(null)}
                      className="px-6 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Rajesh Kumar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                      {fieldErrors.name && (
                        <p className="text-[11px] text-red-400 mt-1">{fieldErrors.name[0]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Work Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                      {fieldErrors.email && (
                        <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email[0]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Company or Clinic Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Health Clinic"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                      {fieldErrors.company && (
                        <p className="text-[11px] text-red-400 mt-1">{fieldErrors.company[0]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Website (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Business Archetype <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                      >
                        <option value="clinic_healthcare">Healthcare Clinic / Medical</option>
                        <option value="real_estate">Real Estate / Builder</option>
                        <option value="education_coaching">Education &amp; Coaching</option>
                        <option value="ecommerce_retail">E-Commerce / D2C</option>
                        <option value="professional_services">Professional Services (CA / Legal)</option>
                        <option value="startup_tech">Tech Startup</option>
                        <option value="local_services">Local Services &amp; Repair</option>
                        <option value="other">Other Commercial Sector</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Primary Service of Interest <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.serviceOfInterest}
                        onChange={(e) => setFormData({ ...formData, serviceOfInterest: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                      >
                        <option value="voice_ai">MEOW Voice (Telugu/English Voice Bot)</option>
                        <option value="automation">MEOW Automate (Business Workflows)</option>
                        <option value="growth">MEOW Growth (Marketing Operations)</option>
                        <option value="custom_consulting">Custom AI Engineering &amp; Copilot</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Current Challenge &amp; Workflow Requirements <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.currentChallenge}
                      onChange={(e) => setFormData({ ...formData, currentChallenge: e.target.value })}
                      placeholder="e.g. We miss 20+ patient phone calls every evening and need an automated Telugu & English voice agent to check open slots and lock bookings."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                    />
                    {fieldErrors.currentChallenge && (
                      <p className="text-[11px] text-red-400 mt-1">{fieldErrors.currentChallenge[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Preferred Method of Contact
                    </label>
                    <div className="flex items-center gap-4 text-xs">
                      {(['email', 'whatsapp', 'phone'] as const).map((method) => (
                        <label key={method} className="flex items-center gap-2 text-zinc-300 capitalize cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContactMethod"
                            value={method}
                            checked={formData.preferredContactMethod === method}
                            onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value as any })}
                            className="text-violet-600 bg-zinc-900 border-white/20 focus:ring-0"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="rounded bg-zinc-900 border-white/20 text-violet-600 focus:ring-0 mt-0.5 shrink-0"
                      />
                      <span>
                        I consent to MEOW AI contacting me regarding this technical discovery inquiry.
                      </span>
                    </label>
                    {fieldErrors.consent && (
                      <p className="text-[11px] text-red-400 mt-1">{fieldErrors.consent[0]}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Validating &amp; Recording...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-zinc-950" />
                          <span>Submit Discovery Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

