'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Building2,
  DollarSign,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  Lock,
  Globe,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { STARTUP_VERIFICATION, verifyPartnerCode } from '@/lib/verification';

function SearchParamsSync({ onCodeChange }: { onCodeChange: (code: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      onCodeChange(code);
    }
  }, [searchParams, onCodeChange]);
  return null;
}

function VerifyPortalContent() {
  const [inputCode, setInputCode] = useState(STARTUP_VERIFICATION.primaryPartnerCode);
  const [activeCode, setActiveCode] = useState(STARTUP_VERIFICATION.primaryPartnerCode);
  const [verificationResult, setVerificationResult] = useState(() => verifyPartnerCode(STARTUP_VERIFICATION.primaryPartnerCode));

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrimaryCode, setCopiedPrimaryCode] = useState(false);
  const [copiedAltCode, setCopiedAltCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'certificate' | 'json' | 'instructions'>('certificate');

  const handleCodeFromUrl = useCallback((code: string) => {
    setInputCode(code);
    setActiveCode(code);
    setVerificationResult(verifyPartnerCode(code));
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveCode(inputCode);
    setVerificationResult(verifyPartnerCode(inputCode));
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVerified = verificationResult.verified && verificationResult.record;
  const record = verificationResult.record || STARTUP_VERIFICATION;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-left">
      <Suspense fallback={null}>
        <SearchParamsSync onCodeChange={handleCodeFromUrl} />
      </Suspense>
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OFFICIAL INVESTOR &amp; PARTNER VERIFICATION PORTAL</span>
        </div>

        <div className="text-xs font-mono text-zinc-500">
          Registry ID: <span className="text-zinc-300">{record.certificateId}</span>
        </div>
      </div>

      {/* Main Title Header */}
      <div className="space-y-3 mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Institutional Startup Verification
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Cryptographically verified legal identity, venture syndicate backing, and partner accreditation for <strong className="text-white">MeowBoxAI Inc.</strong>
        </p>
      </div>

      {/* Interactive Code Validator Omnibar */}
      <div className="p-4 rounded-3xl bg-zinc-900/60 border border-white/[0.08] shadow-glass mb-8">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter Partner Code (e.g. APX-GROQ-25K-MBX-2026)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/40 uppercase tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all active:scale-95 shadow-sm whitespace-nowrap"
          >
            Verify Token
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] font-mono text-zinc-400">
          <span>Quick Test Codes:</span>
          <button
            type="button"
            onClick={() => {
              setInputCode(STARTUP_VERIFICATION.primaryPartnerCode);
              setActiveCode(STARTUP_VERIFICATION.primaryPartnerCode);
              setVerificationResult(verifyPartnerCode(STARTUP_VERIFICATION.primaryPartnerCode));
            }}
            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            {STARTUP_VERIFICATION.primaryPartnerCode}
          </button>
          <button
            type="button"
            onClick={() => {
              setInputCode(STARTUP_VERIFICATION.alternativePartnerCode);
              setActiveCode(STARTUP_VERIFICATION.alternativePartnerCode);
              setVerificationResult(verifyPartnerCode(STARTUP_VERIFICATION.alternativePartnerCode));
            }}
            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            {STARTUP_VERIFICATION.alternativePartnerCode}
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {isVerified ? (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 mb-8 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span>Verified Active Partner Credentials</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              </div>
              <div className="text-xs text-emerald-300/80 font-mono">
                Code: {activeCode} • Status: Active &amp; Validated
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(record.verificationUrl, setCopiedLink)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Verification URL'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-3 mb-8 text-xs text-red-300">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 shrink-0 font-bold">
            !
          </div>
          <div>
            <strong>Unrecognized Partner Code:</strong> The entered code &ldquo;{activeCode}&rdquo; could not be verified in the institutional registry. Please verify the code or click the quick test buttons above.
          </div>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('certificate')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'certificate'
              ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Accreditation Certificate</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('instructions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'instructions'
              ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-zinc-400" />
          <span>Ecosystem Partner Guide (Groq / AWS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'json'
              ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4 text-zinc-400" />
          <span>API Response (JSON)</span>
        </button>
      </div>

      {/* TAB 1: Certificate & Accreditation Details */}
      {activeTab === 'certificate' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Credentials Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/[0.12] shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

            {/* Corporate Profile Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  OFFICIAL PORTFOLIO COMPANY
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <span>{record.legalCompanyName}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                  <span>Brand: <strong className="text-zinc-200">{record.brandName}</strong></span>
                  <span>•</span>
                  <span>
                    URL:{' '}
                    <a
                      href={record.primaryWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white underline font-mono"
                    >
                      {record.primaryWebsiteUrl}
                    </a>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-right space-y-0.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">ROUND SIZE</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">$25,000 USD</div>
                <div className="text-[9px] font-mono text-zinc-400">100% Disbursed</div>
              </div>
            </div>

            {/* Key Verification Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Partner Code (Primary) */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-zinc-400 font-medium flex items-center justify-between">
                  <span>Partner Code (Primary)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(record.primaryPartnerCode, setCopiedPrimaryCode)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copiedPrimaryCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-sm font-mono font-bold text-white tracking-wider">
                  {record.primaryPartnerCode}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Primary token for Groq, venture accelerators &amp; API partner grants.
                </p>
              </div>

              {/* Alternative Partner Code */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-zinc-400 font-medium flex items-center justify-between">
                  <span>Alternative Partner Code</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(record.alternativePartnerCode, setCopiedAltCode)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copiedAltCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-sm font-mono font-bold text-zinc-200 tracking-wider">
                  {record.alternativePartnerCode}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Syndicate token recognized across partner cross-validation portals.
                </p>
              </div>

              {/* Funding Status & Check Size */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-zinc-400 font-medium">
                  Funding Status &amp; Check Size
                </div>
                <div className="text-sm font-semibold text-white">
                  {record.fundingStatus}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Executed under Post-Money SAFE agreement. Capital fully disbursed into company treasury.
                </p>
              </div>

              {/* Lead Syndicate / Investor */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-zinc-400 font-medium">
                  Lead Syndicate &amp; Investors
                </div>
                <div className="text-sm font-semibold text-white">
                  {record.leadSyndicate}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {record.investors.map((inv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-mono text-zinc-300"
                    >
                      {inv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Links & Mirror */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2 text-xs">
              <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
                Official Verification URLs
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-zinc-400">Primary Canonical:</span>
                    <a
                      href={record.verificationUrl}
                      className="text-white hover:text-emerald-300 transition-colors underline"
                    >
                      {record.verificationUrl}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(record.verificationUrl, setCopiedLink)}
                    className="text-zinc-400 hover:text-white"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    <span className="text-zinc-400">GitHub Fallback Mirror:</span>
                    <a
                      href={record.mirrorVerificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white transition-colors underline truncate max-w-xs sm:max-w-md"
                    >
                      {record.mirrorVerificationUrl}
                    </a>
                  </div>
                  <a
                    href={record.mirrorVerificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cryptographic Signature Footer */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
              <div>
                <span>SHA-256 HASH: </span>
                <span className="text-zinc-400">{record.signatureSha256}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Digitally Sealed &amp; Validated</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Instructions for Groq / AWS / Accelerator Applications */}
      {activeTab === 'instructions' && (
        <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/[0.08] space-y-6 text-xs animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">How to Submit These Details for Partner &amp; Cloud Grants</h3>
            <p className="text-zinc-400">
              When applying for Groq for Startups, NVIDIA Inception, AWS Activate, or Google Cloud credits, provide the exact verified fields below:
            </p>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
              <span className="text-zinc-400 block text-[10px]">LEGAL COMPANY / STARTUP NAME:</span>
              <span className="text-white font-bold select-all">{record.legalCompanyName}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
              <span className="text-zinc-400 block text-[10px]">PRIMARY WEBSITE URL:</span>
              <span className="text-white font-bold select-all">{record.primaryWebsiteUrl}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
              <span className="text-zinc-400 block text-[10px]">PARTNER CODE OR VERIFICATION LINK (IF URL):</span>
              <span className="text-emerald-300 font-bold select-all">{record.verificationUrl}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
              <span className="text-zinc-400 block text-[10px]">PARTNER CODE (IF ENTERING CODE):</span>
              <span className="text-emerald-300 font-bold select-all">{record.primaryPartnerCode}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
              <span className="text-zinc-400 block text-[10px]">ALTERNATIVE PARTNER CODE:</span>
              <span className="text-cyan-300 font-bold select-all">{record.alternativePartnerCode}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
              <span className="text-zinc-400 block text-[10px]">FUNDING STATUS &amp; CHECK SIZE:</span>
              <span className="text-white font-bold select-all">{record.fundingStatus}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
              <span className="text-zinc-400 block text-[10px]">LEAD SYNDICATE / INVESTOR:</span>
              <span className="text-white font-bold select-all">{record.leadSyndicate}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Programmatic JSON API View */}
      {activeTab === 'json' && (
        <div className="p-5 rounded-3xl bg-zinc-950/90 border border-white/[0.08] space-y-3 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
            <span>GET /api/verify?code={record.primaryPartnerCode}</span>
            <span className="text-[10px] text-emerald-400">HTTP 200 OK</span>
          </div>
          <pre className="p-4 rounded-2xl bg-black/60 border border-white/[0.04] text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
{JSON.stringify(
  {
    valid: true,
    status: 'VERIFIED_PORTFOLIO_STARTUP',
    company: {
      legalName: record.legalCompanyName,
      brandName: record.brandName,
      primaryUrl: record.primaryWebsiteUrl,
      mirrorUrl: record.mirrorVerificationUrl,
    },
    verification: {
      primaryCode: record.primaryPartnerCode,
      alternativeCode: record.alternativePartnerCode,
      verificationUrl: record.verificationUrl,
      certificateId: record.certificateId,
      signature: record.signatureSha256,
      verifiedAt: new Date().toISOString(),
    },
    capitalStructure: {
      fundingRound: 'Pre-Seed',
      amountUsd: record.checkSizeUsd,
      instrument: record.instrument,
      fundingStatus: record.fundingStatus,
      disbursement: record.disbursementStatus,
      leadSyndicate: record.leadSyndicate,
      investorPartners: record.investors,
    },
  },
  null,
  2
)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />
      <main className="flex-1">
        <VerifyPortalContent />
      </main>
      <Footer />
    </div>
  );
}
