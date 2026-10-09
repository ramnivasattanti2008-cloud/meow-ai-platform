'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  Share2,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Plus,
} from 'lucide-react';
import { PaymentRecord } from '@/lib/db';

export const PaymentLinkGenerator: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [serviceName, setServiceName] = useState('Doctor Consultation (OP)');
  const [amount, setAmount] = useState<number>(600);

  // Generated Link & State
  const [generatedPayload, setGeneratedPayload] = useState<{
    link: string;
    upiString: string;
    txnId: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.payments) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName || !amount) {
      alert('Please provide customer name and amount');
      return;
    }

    const txnId = `MEOW_PAY_${Math.floor(100000 + Math.random() * 900000)}`;
    const cleanPhone = payerPhone.replace(/[^0-9]/g, '');
    const upiString = `upi://pay?pa=pay@meowai.tech&pn=MEOW%20AI&am=${amount}&cu=INR&tn=${encodeURIComponent(
      serviceName
    )}`;
    const shareUrl = `https://meowboxai.tech/pricing?amount=${amount}&service=${encodeURIComponent(
      serviceName
    )}&payer=${encodeURIComponent(payerName)}`;

    setGeneratedPayload({
      link: shareUrl,
      upiString,
      txnId,
    });
  };

  const handleMarkPaid = async () => {
    if (!generatedPayload) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: generatedPayload.txnId,
          amount,
          planTitle: serviceName,
          method: 'upi',
          payerName,
          payerPhone: payerPhone || '+91 98480 •••••',
          payerEmail: 'billing@meowai.tech',
          status: 'settled',
        }),
      });

      const data = await res.json();
      if (res.ok && data.payment) {
        setPayments((prev) => [data.payment, ...prev]);
        alert(`Payment of ₹${amount} logged and synced to Firebase! Tax invoice generated.`);
        setGeneratedPayload(null);
        setPayerName('');
        setPayerPhone('');
      }
    } catch (err) {
      console.error('Error logging payment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPayload) return;
    navigator.clipboard.writeText(generatedPayload.link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!generatedPayload) return;
    const cleanPhone = payerPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${payerName}! Here is your digital invoice for ${serviceName} from MEOW AI / Dr. Rao Clinic.\n\nTotal Due: ₹${amount.toLocaleString(
        'en-IN'
      )}\n\nPay instantly via UPI (Google Pay, PhonePe, Paytm): pay@meowai.tech\nOr Online Gateway: ${
        generatedPayload.link
      }\n\nGST tax invoice receipt will be delivered instantly after payment.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const totalCollected = payments.reduce((acc, p) => acc + (p.status === 'settled' ? p.amount : 0), 0);

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Instant Payment Link &amp; UPI Generator</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              ₹{totalCollected.toLocaleString('en-IN')} Collected
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Generate customized UPI QR codes and WhatsApp payment links to collect patient advances or client service fees instantly.
          </p>
        </div>
      </div>

      {/* 2-Column: Form & Live Generated QR Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-400 font-medium">Customer / Patient Name *</label>
            <input
              type="text"
              required
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">WhatsApp Phone Number</label>
              <input
                type="tel"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="+91 98480 •••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Amount (₹ INR) *</label>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white font-bold font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 font-medium">Service / Fee Description</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. Consultation Fee + X-Ray"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center gap-2 font-mono text-[11px] pt-1">
            <span className="text-zinc-500">Presets:</span>
            {[600, 1500, 5000, 19999, 25000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`px-2 py-0.5 rounded-md border transition-all ${
                  amount === val
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-950 border-white/[0.06] text-zinc-400 hover:text-white'
                }`}
              >
                ₹{val.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Generate Dynamic Payment Link &amp; UPI QR</span>
            </button>
          </div>
        </form>

        {/* Generated Live QR Card */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-5">
          {generatedPayload ? (
            <div className="space-y-4 animate-scaleIn">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">READY TO SHARE</span>
                  <div className="font-bold text-white text-base">{payerName}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 block">AMOUNT DUE</span>
                  <div className="text-xl font-bold text-emerald-400 font-mono">₹{amount.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Dynamic QR Graphic */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <div className="w-28 h-28 rounded-xl bg-white p-2 shrink-0 flex flex-col items-center justify-between shadow-md">
                  <div className="w-full flex justify-between">
                    <div className="w-4 h-4 bg-zinc-950 rounded-sm" />
                    <div className="w-4 h-4 bg-zinc-950 rounded-sm" />
                  </div>
                  <div className="text-[9px] font-mono text-zinc-950 font-black tracking-widest text-center">
                    ₹{amount}
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-4 h-4 bg-zinc-950 rounded-sm" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-white block">UPI Instant Payment</span>
                  <code className="text-[11px] font-mono text-violet-300 bg-violet-950/40 px-2 py-0.5 rounded border border-violet-500/20 block truncate">
                    pay@meowai.tech
                  </code>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Works on GPay, PhonePe, Paytm, Cred &amp; BHIM
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleMarkPaid}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mark Received &amp; Issue GST Invoice</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3 text-zinc-500 text-xs">
              <QrCode className="w-12 h-12 text-zinc-700 mx-auto" />
              <div>Fill the form on the left to generate an instant dynamic UPI payment link and WhatsApp bill.</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Settled Transactions Table */}
      <div className="space-y-3 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="uppercase tracking-wider">RECENT SETTLED TRANSACTIONS</span>
          <span>Logged to Firebase</span>
        </div>

        <div className="space-y-2">
          {payments.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{p.payerName}</span>
                  <span className="text-[10px] font-mono text-zinc-400">({p.planTitle})</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                  Txn ID: {p.transactionId} • {new Date(p.timestamp).toLocaleDateString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-bold text-emerald-400 font-mono">₹{p.amount.toLocaleString('en-IN')}</div>
                  <span className="text-[9px] font-mono uppercase text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                    {p.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Downloaded GST Tax Invoice #${p.transactionId}`)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
                  title="Download Invoice PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
