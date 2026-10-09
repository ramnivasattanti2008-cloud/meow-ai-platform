import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Compass,
  Code2,
  Workflow,
  Bot,
  FileText,
  BookOpen,
  Boxes,
  Globe,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { AutomationSuiteConfigurator } from '@/components/services/AutomationSuiteConfigurator';

export const metadata = {
  title: 'AI Services & Bespoke Engineering | MEOW AI',
  description:
    'End-to-end AI consulting, bespoke application engineering, document intelligence, and software integrations for growing businesses.',
};

export default function AiServicesPage() {
  const services = [
    {
      id: 'strategy',
      title: 'AI Strategy & Technical Roadmapping',
      icon: Compass,
      problem: 'Businesses rush into disconnected AI tools without clear ROI or security architectures.',
      solution: 'We conduct a systematic feasibility assessment to identify viable automation opportunities with measurable impact.',
      workflow: 'Discovery Interview → Data Audit → Architecture Design → ROI Model & Phased Implementation Plan.',
      clientProvides: 'Overview of operational software, high-frequency manual bottlenecks, and team workflow descriptions.',
      engagementIncludes: 'Executive technical blueprint, security compliance matrix, and vendor evaluation report.',
    },
    {
      id: 'custom-apps',
      title: 'Custom AI Applications & Copilots',
      icon: Code2,
      problem: 'Off-the-shelf software fails to match unique internal domain logic, resulting in spreadsheet sprawl.',
      solution: 'Full-stack bespoke web and mobile applications incorporating reasoning models, custom databases, and tailored UI.',
      workflow: 'Scope Definition → Interactive Figma Prototyping → Next.js / TypeScript Build → Model Integration & QA.',
      clientProvides: 'User stories, branding guidelines, and domain-specific validation requirements.',
      engagementIncludes: 'Production codebase, automated test suite, Docker container setup, and deployment to your cloud.',
    },
    {
      id: 'automation',
      title: 'Business Process Automation',
      icon: Workflow,
      problem: 'Employees spend up to 15 hours weekly manually copying data across forms, CRMs, email, and spreadsheets.',
      solution: 'Event-driven, resilient automation pipelines that ingest, parse, validate, and synchronize operational data.',
      workflow: 'Trigger Mapping → Webhook Setup → Data Transformation Engine → Error Handling & Supervisor Alerting.',
      clientProvides: 'API access or credentials to relevant business software (CRM, ERP, WhatsApp, billing).',
      engagementIncludes: 'Deterministic workflow runner, logging dashboards, and automated failure recovery routines.',
    },
    {
      id: 'agents',
      title: 'Autonomous AI Agents & Copilots',
      icon: Bot,
      problem: 'Static chatbots provide canned answers but cannot check databases, trigger bookings, or perform work.',
      solution: 'Autonomous agents equipped with explicit tool-calling capabilities and deterministic guardrails.',
      workflow: 'System Instruction Design → Function Schema Definition → Sandbox Validation → Production Guardrails.',
      clientProvides: 'Documentation of permitted system actions and human escalation thresholds.',
      engagementIncludes: 'Tool integration adapters, dialogue turn logging, and human-in-the-loop escalation dashboard.',
    },
    {
      id: 'document-intel',
      title: 'Document Intelligence & Extraction',
      icon: FileText,
      problem: 'PDF invoices, medical prescriptions, and contracts arrive in unstructured formats requiring manual entry.',
      solution: 'Vision and multimodal extraction pipelines converting messy scans into structured, validated JSON records.',
      workflow: 'Document Intake → OCR & Multimodal Parsing → Schema Validation → Human Review Gate → CRM/DB Write.',
      clientProvides: '20–50 representative sample documents (anonymized) to benchmark extraction accuracy.',
      engagementIncludes: 'Validated extraction parser, confidence score engine, and CSV/Database export pipelines.',
    },
    {
      id: 'rag-knowledge',
      title: 'Knowledge Assistants & Internal RAG',
      icon: BookOpen,
      problem: 'Company policies, technical manuals, and product knowledge are buried in dense files that staff struggle to search.',
      solution: 'Private Retrieval-Augmented Generation (RAG) copilots that cite exact source pages with zero external data leaks.',
      workflow: 'Document Chunking → Vector Embedding → Hybrid Keyword/Semantic Search → Hallucination-Guarded Response.',
      clientProvides: 'Internal documentation, SOPs, FAQs, and product catalogs in PDF/Notion/Markdown formats.',
      engagementIncludes: 'Vector database configuration, semantic retrieval pipeline, and Slack/Teams/Web search interface.',
    },
    {
      id: 'integrations',
      title: 'CRM & Business Software Integrations',
      icon: Boxes,
      problem: 'Customer records sit fragmented across WhatsApp, Google Calendar, HubSpot, Zoho, and billing gateways.',
      solution: 'Unified two-way webhooks and background workers that keep customer records, statuses, and tags synchronized.',
      workflow: 'Schema Normalization → Bi-directional Sync Service → Deduplication Engine → Conflict Resolution Logic.',
      clientProvides: 'API tokens, webhook endpoints, and data field mapping preferences.',
      engagementIncludes: 'Microservice sync engine, retry queues, and automated sync discrepancy health checks.',
    },
    {
      id: 'web-dev',
      title: 'Website & Application Development',
      icon: Globe,
      problem: 'Marketing websites built on outdated page builders load slowly on Indian mobile networks and convert poorly.',
      solution: 'High-performance, Apple-grade modern web applications built on Next.js, React, and TypeScript with edge SEO.',
      workflow: 'Information Architecture → Responsive UX Design → Strict TypeScript Build → Performance & Accessibility Audit.',
      clientProvides: 'Copy drafts, company imagery, brand colors, and desired domain name.',
      engagementIncludes: 'Clean GitHub repository, Vercel/Cloudflare deployment, sub-second Core Web Vitals, and SSL setup.',
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
            <span>FULL-LIFECYCLE ENGINEERING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Custom AI Engineering.{' '}
            <span className="text-zinc-500">Built for Production.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We partner with founders and operations leaders to design, build, and deploy genuine intelligent systems that solve measurable commercial problems.
          </p>
        </div>

        {/* Interactive Automation Suite Architecture Configurator */}
        <section id="automation-configurator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">
          <AutomationSuiteConfigurator />
        </section>

        {/* Services Detail List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 sm:p-10 space-y-6 text-left hover:border-white/15 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-zinc-500">SERVICE CATEGORY #{idx + 1}</div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{svc.title}</h3>
                    </div>
                  </div>

                  <Link
                    href={`/contact?service=${svc.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-1.5"
                  >
                    <span>Inquire About This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <div className="font-mono text-zinc-400 text-xs">THE BUSINESS PROBLEM</div>
                    <p className="text-zinc-300 leading-relaxed">{svc.problem}</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-mono text-zinc-400 text-xs">THE MEOW SOLUTION</div>
                    <p className="text-zinc-300 leading-relaxed">{svc.solution}</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-mono text-zinc-400 text-xs">EXPECTED WORKFLOW</div>
                    <p className="text-zinc-300 leading-relaxed font-mono text-xs">{svc.workflow}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06] text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
                    <span className="font-mono text-zinc-400 block mb-1">WHAT YOU PROVIDE</span>
                    <span className="text-zinc-300">{svc.clientProvides}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
                    <span className="font-mono text-zinc-400 block mb-1">DELIVERABLES INCLUDED</span>
                    <span className="text-zinc-300">{svc.engagementIncludes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsible Boundaries Section */}
        <section className="mt-20 max-w-4xl mx-auto px-4 text-left">
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-violet-400" />
              <h4 className="text-lg font-bold text-white">Our Engineering Principles &amp; Realistic Scope</h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We do not guarantee vague 10x ROI or claim models operate with 100% autonomous infallibility. Real enterprise automation requires careful prompt design, continuous testing, deterministic fallback routines, and clear human oversight. Every project we deliver includes explicit boundary guidelines and monitoring tools.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-20 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to explore an engineering partnership?
          </h3>
          <p className="text-zinc-400 text-sm mb-8">
            Tell us about your technical roadmap and current operational challenges.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all"
            >
              Start Technical Scoping
            </Link>
            <Link
              href="/book"
              className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium text-xs hover:bg-zinc-700 border border-white/10 transition-all"
            >
              Book 30-Min Call
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

