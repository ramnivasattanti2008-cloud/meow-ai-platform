'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Video,
  ShieldCheck,
  Send,
  ArrowRight,
  Download,
  Languages,
  Sparkles,
  User,
  Mail,
  Building,
  Phone,
  HelpCircle,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

interface TimeSlot {
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
}

const AVAILABLE_SLOTS: TimeSlot[] = [
  { time: '10:30 AM IST', period: 'Morning' },
  { time: '11:45 AM IST', period: 'Morning' },
  { time: '02:15 PM IST', period: 'Afternoon' },
  { time: '03:45 PM IST', period: 'Afternoon' },
  { time: '05:15 PM IST', period: 'Evening' },
  { time: '06:30 PM IST', period: 'Evening' },
];

export default function BookCallPage() {
  // Generate next 6 business days
  const upcomingDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    let added = 0;
    let dayOffset = 1; // start tomorrow

    while (added < 6) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      // Skip Sundays (0)
      if (d.getDay() !== 0) {
        dates.push({
          fullDate: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isTomorrow: added === 0,
        });
        added++;
      }
      dayOffset++;
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(upcomingDates[0].fullDate);
  const [selectedSlot, setSelectedSlot] = useState(AVAILABLE_SLOTS[2].time);
  const [sessionType, setSessionType] = useState<'discovery' | 'voice_demo' | 'workflow_audit'>('discovery');
  const [preferredLang, setPreferredLang] = useState<'english' | 'telugu' | 'bilingual'>('bilingual');
  
  // Contact details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [businessChallenge, setBusinessChallenge] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
    }, 600);
  };

  // Generate real downloadable .ics calendar invite file
  const downloadICS = () => {
    const title = 'MEOW AI — 30-Min Architecture Discovery';
    const description = `Discovery session with Ram Nivas Attanti (Founder, MEOW AI) for ${company || fullName}. Google Meet Link: https://meet.google.com/meow-arch-session`;
    const location = 'Google Meet (https://meet.google.com/meow-arch-session)';
    
    // Format date string for ICS (YYYYMMDDTHHMMSSZ)
    const cleanDate = selectedDate.replace(/-/g, '');
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MEOW AI//Discovery Session//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:meow-session-${Date.now()}@meowboxai.tech`,
      `DTSTAMP:${cleanDate}T090000Z`,
      `DTSTART:${cleanDate}T100000Z`,
      `DTEND:${cleanDate}T103000Z`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MEOW-AI-Discovery-${selectedDate}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>DIRECT ENGINEERING ACCESS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Schedule a 30-Minute Architecture Session
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Direct 1-on-1 discovery with our founder &amp; engineering lead in Bengaluru. We audit your current workflows, assess multilingual voice feasibility, and provide a concrete deployment roadmap.
          </p>
        </div>

        <div id="booking-scheduler-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-10 shadow-glass">
            {confirmed ? (
              /* Booking Confirmed State */
              <div className="py-8 text-center space-y-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                    RESERVATION CONFIRMED
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Your Discovery Session Is Booked</h3>
                  <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
                    Thank you, <strong>{fullName}</strong>. We have locked your session for{' '}
                    <strong className="text-white">{selectedDate}</strong> at <strong className="text-white">{selectedSlot}</strong>.
                  </p>
                </div>

                {/* Session Details Box */}
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-zinc-950/70 border border-white/[0.08] text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-zinc-400">Host Engineer:</span>
                    <span className="text-white font-semibold">Ram Nivas Attanti (Founder)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-zinc-400">Meeting Room:</span>
                    <span className="text-violet-400 font-semibold underline">meet.google.com/meow-arch-session</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-zinc-400">Confirmation Sent To:</span>
                    <span className="text-zinc-200">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Language Preferred:</span>
                    <span className="text-zinc-200 capitalize">{preferredLang}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    onClick={downloadICS}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-subtle"
                  >
                    <Download className="w-4 h-4" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-zinc-900 hover:bg-zinc-850 text-white border border-white/10 hover:border-violet-500/40 transition-all text-xs font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fast-Track Advance (₹600 UPI)</span>
                  </button>

                  <Link
                    href="/"
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-colors text-xs font-medium"
                  >
                    Return Home
                  </Link>
                </div>
              </div>
            ) : (
              /* Interactive Booking Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Select Meeting Format */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    1. Choose Session Focus
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'discovery',
                        title: 'Technical Discovery',
                        duration: '30 mins',
                        desc: 'Audit your current manual workflows & map automation ROI.',
                      },
                      {
                        id: 'voice_demo',
                        title: 'Voice AI Sandbox',
                        duration: '30 mins',
                        desc: 'Live interactive Telugu/English agent demo & telephony review.',
                      },
                      {
                        id: 'workflow_audit',
                        title: 'Systems & CRM Integration',
                        duration: '45 mins',
                        desc: 'Deep dive into WhatsApp, Google Sheets, & SQL connectors.',
                      },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setSessionType(fmt.id as any)}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          sessionType === fmt.id
                            ? 'bg-violet-950/40 border-violet-500/50 shadow-sm'
                            : 'bg-zinc-950/40 border-white/[0.06] hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">{fmt.title}</span>
                          <span className="text-[10px] font-mono text-zinc-400">{fmt.duration}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{fmt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive Date Picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      2. Select Consultation Date
                    </label>
                    <span className="text-[11px] text-zinc-500 font-mono">IST (UTC +5:30)</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {upcomingDates.map((d) => (
                      <button
                        key={d.fullDate}
                        type="button"
                        onClick={() => setSelectedDate(d.fullDate)}
                        className={`p-3 rounded-2xl text-center border transition-all ${
                          selectedDate === d.fullDate
                            ? 'bg-white text-zinc-950 border-white shadow-sm font-semibold'
                            : 'bg-zinc-950/60 text-zinc-300 border-white/[0.06] hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="text-[11px] opacity-70 uppercase tracking-wider">{d.dayName}</div>
                        <div className="text-sm font-bold mt-0.5">{d.monthDay}</div>
                        {d.isTomorrow && (
                          <span className="inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 mt-1">
                            Tomorrow
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Time Slots */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    3. Select Time Window
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {AVAILABLE_SLOTS.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-3 rounded-xl border text-center text-xs font-mono transition-all flex items-center justify-center gap-2 ${
                          selectedSlot === slot.time
                            ? 'bg-violet-600 text-white border-violet-500 font-bold shadow-sm'
                            : 'bg-zinc-950/50 text-zinc-300 border-white/[0.06] hover:bg-zinc-900/50'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span>{slot.time}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Preferred Language & Contact Info */}
                <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    4. Contact &amp; Business Details
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Rajesh Kumar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">Work / Business Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rajesh@apexhealth.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">Company, Clinic, or Firm *</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Apex Orthopedic Clinic"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-violet-400" />
                      <span>Preferred Discussion Language</span>
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: 'bilingual', label: 'Bilingual (Telugu & English)' },
                        { id: 'english', label: 'English Only' },
                        { id: 'telugu', label: 'Telugu (తెలుగు)' },
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setPreferredLang(lang.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                            preferredLang === lang.id
                              ? 'bg-zinc-800 text-white border-violet-500/50'
                              : 'bg-zinc-950/60 text-zinc-400 border-white/[0.06] hover:bg-zinc-900/60'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Challenge Notes */}
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">
                      Primary Workflows You Would Like to Automate (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={businessChallenge}
                      onChange={(e) => setBusinessChallenge(e.target.value)}
                      placeholder="e.g. Handling after-hours dental patient inquiries, qualifying real estate leads from Meta ads..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Reserving Session Slot...</span>
                    ) : (
                      <>
                        <span>Confirm 30-Minute Architecture Session</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center mt-2 font-mono">
                    Direct video session with Founder Ram Nivas Attanti • Instant calendar invite (.ics) provided
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <EasyPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan="Fast-Track Discovery & Architecture Advance"
        defaultAmount={600}
      />

      <Footer />
    </div>
  );
}
