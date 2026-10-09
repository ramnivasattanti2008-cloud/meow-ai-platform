import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Stethoscope,
  Building2,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Store,
  Rocket,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Industry Solutions & AI Use Cases | MEOW AI',
  description:
    'Explore pragmatic automation, multilingual voice agents, and lead workflows tailored for clinics, real estate, education, and SMBs.',
};

export default function SolutionsPage() {
  const industries = [
    {
      id: 'clinics',
      title: 'Healthcare Clinics & Diagnostic Centers',
      icon: Stethoscope,
      summary:
        'Eliminate missed patient calls, automate appointment slot booking in Telugu and English, and triage emergency requests to duty nurses.',
      sampleWorkflow:
        'Inbound Caller → Telugu/English AI Frontdesk → Doctor Schedule Query → Calendar Lock → WhatsApp Confirmation & Google Maps Pin.',
      integrations: ['Google Calendar', 'Practo / Custom Clinic EMR', 'WhatsApp Business API', 'Local SIP Trunk'],
      considerations: 'Doctor schedules change frequently; clinic must maintain active Google Calendar sync.',
      oversight: 'Immediate human nurse transfer on acute symptom keywords (chest pain, severe bleeding, trauma).',
    },
    {
      id: 'real-estate',
      title: 'Real Estate Builders & Brokerages',
      icon: Building2,
      summary:
        'Instantly qualify inbound property inquiries, verify buyer budget and timeline, and route high-value leads to senior relationship managers.',
      sampleWorkflow:
        'Meta Ad Lead Submit → Outbound Voice Verification within 2 mins → Budget/Timeline Qualification → CRM Lead Update → Site Tour Booking.',
      integrations: ['HubSpot / Salesforce', 'WhatsApp API', 'Google Calendar', 'Telephony Gateway'],
      considerations: 'Strict compliance with RERA disclosures and project pricing verification.',
      oversight: 'Budget inquiries exceeding ₹2.5 Cr routed exclusively to senior human brokers.',
    },
    {
      id: 'education',
      title: 'Coaching Institutes & EdTech Academies',
      icon: GraduationCap,
      summary:
        'Handle admissions inquiries, answer syllabus and fee questions, and schedule campus diagnostic tests for students.',
      sampleWorkflow:
        'Parent Website Enquiry → Admissions Copilot Dialogue → Program & Grade Eligibility Check → Diagnostic Slot Reserved.',
      integrations: ['Zoho CRM', 'Student Management System', 'SMS Gateway', 'Google Sheets'],
      considerations: 'Frequent seasonal admissions spikes requiring high concurrent call scaling.',
      oversight: 'Fee concession and scholarship requests require human Admissions Director approval.',
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce & D2C Retail Brands',
      icon: ShoppingBag,
      summary:
        'Resolve order tracking inquiries, process automated return eligibility checks, and automate WhatsApp re-order prompts.',
      sampleWorkflow:
        'Customer WhatsApp Message → Shopify Order API Lookup → Status & Tracking Dispatch → Automated Feedback Collection.',
      integrations: ['Shopify', 'Shiprocket', 'WhatsApp Cloud API', 'Stripe / Razorpay'],
      considerations: 'Courier tracking API latency and return policy windows.',
      oversight: 'Refund approvals above ₹2,000 flagged for customer service supervisor authorization.',
    },
    {
      id: 'professional-services',
      title: 'CA Firms, Legal Consultants & Agencies',
      icon: Briefcase,
      summary:
        'Automate client document collection, verify tax filing checklists, and book introductory advisory consultations.',
      sampleWorkflow:
        'Discovery Form → Document Intake Checklist Dispatched → Automatic Follow-up Reminder → Partner Calendar Synced.',
      integrations: ['Google Drive', 'Notion', 'Calendly', 'QuickBooks / Tally'],
      considerations: 'High sensitivity of client tax records and financial disclosures.',
      oversight: 'All tax and legal advisory opinions require licensed human professional review.',
    },
    {
      id: 'local-services',
      title: 'Local Service & Repair Providers',
      icon: Store,
      summary:
        'Never lose a customer call during busy service hours. Dispatch automated technician booking in local language.',
      sampleWorkflow:
        'Missed Customer Call → Instant Callback Voice Bot → Service Category & Pincode Recorded → Technician Alerted.',
      integrations: ['Twilio / Exotel', 'Google Sheets', 'WhatsApp Notification', 'SMS'],
      considerations: 'Geographic service coverage boundaries and technician dispatch availability.',
      oversight: 'Emergency service requests dispatched immediately to field manager.',
    },
    {
      id: 'startups',
      title: 'High-Growth Tech Startups',
      icon: Rocket,
      summary:
        'Custom AI copilots, automated product onboarding, internal document intelligence, and user interview summarization.',
      sampleWorkflow:
        'App Webhook → Anthropic Claude Reasoning Adapter → JSON Payload Formatted → Internal Slack / DB Synced.',
      integrations: ['PostgreSQL', 'Slack', 'Anthropic Claude API', 'Next.js Backend'],
      considerations: 'Rapid iteration cycles and API cost optimization.',
      oversight: 'All data retention adheres to strict privacy controls without public training leaks.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>COMMERCIAL USE CASES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Engineered for Your Industry’s{' '}
            <span className="text-zinc-500">Day-to-Day Realities.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every business sector has specific operational workflows, software ecosystems, and compliance requirements. Here is how MEOW adapts to each.
          </p>
        </div>

        {/* Industry Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                id={ind.id}
                key={ind.id}
                className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 sm:p-10 space-y-6 text-left hover:border-white/15 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{ind.title}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{ind.summary}</p>
                    </div>
                  </div>

                  <Link
                    href={`/contact?industry=${ind.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-1.5"
                  >
                    <span>Inquire for {ind.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <span className="font-mono text-zinc-400 text-xs">SAMPLE AUTOMATION BLUEPRINT</span>
                    <p className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/[0.06] text-zinc-200 font-mono text-xs leading-relaxed">
                      {ind.sampleWorkflow}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-zinc-400 text-xs">LIKELY SYSTEM INTEGRATIONS</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ind.integrations.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06] text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-white/[0.04]">
                    <span className="font-mono text-zinc-400 block mb-1">KEY TECHNICAL CONSIDERATIONS</span>
                    <span className="text-zinc-300">{ind.considerations}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20">
                    <span className="font-mono text-violet-300 block mb-1">HUMAN OVERSIGHT &amp; SAFETY BOUNDARY</span>
                    <span className="text-zinc-300">{ind.oversight}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <section className="pt-20 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Do not see your exact business model listed?
          </h3>
          <p className="text-zinc-400 text-sm mb-8">
            MEOW’s engine is modular. We can map custom workflows to virtually any business operation with repeatable tasks.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all"
            >
              Discuss Custom Architecture
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
