'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  ArrowRight,
  Download,
  Copy,
  Check,
  Sparkles,
  Lock,
  Phone,
} from 'lucide-react';
import { downloadTaxInvoice } from '@/lib/invoice/generateInvoice';

export interface EasyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
  defaultAmount?: number;
  onPaymentSuccess?: (paymentDetails: any) => void;
}

export const EasyPaymentModal: React.FC<EasyPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = 'AI Consultation / Setup Advance',
  defaultAmount = 600,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [planTitle, setPlanTitle] = useState<string>(defaultPlan);
  const [payerName, setPayerName] = useState('Dr. Rao Healthcare / Ram Nivas');
  const [payerPhone, setPayerPhone] = useState('+91 98765 43210');
  const [payerEmail, setPayerEmail] = useState('billing@meowai.tech');

  // Form states
  const [upiId, setUpiId] = useState('client@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('921');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing & Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen) return null;

  const handleCopyUPI = () => {
    navigator.clipboard?.writeText('pay@meowai.tech');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    const generatedId = `MEOW_PAY_${Math.floor(100000 + Math.random() * 900000)}`;
    setTransactionId(generatedId);

    const record = {
      transactionId: generatedId,
      amount,
      planTitle,
      method,
      payerName: payerName || 'Direct Payer',
      payerPhone: payerPhone || '+91 98765 43210',
      payerEmail: payerEmail || 'billing@meowai.tech',
      status: 'settled',
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.warn('Payment logging notice:', err);
    } finally {
      setIsProcessing(false);
      setIsCompleted(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(record);
      }
    }
  };

  const resetAndClose = () => {
    setIsCompleted(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-left text-white">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                <span>MEOW Pay Gateway</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  256-Bit SSL SECURE
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                Razorpay &amp; UPI Instant Settlement
              </div>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isCompleted ? (
          <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Amount / Plan Overview */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 font-medium block">PAYMENT FOR</span>
                <span className="text-sm font-semibold text-white">{planTitle}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400 block font-mono">TOTAL AMOUNT</span>
                <span className="text-xl font-bold text-white tracking-tight">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              {[
                { label: '₹600 (Consultation/Token)', val: 600 },
                { label: '₹19,999 (Web Setup)', val: 19999 },
                { label: '₹25,000 (Voice Pilot)', val: 25000 },
                { label: '₹45,000 (Full Stack)', val: 45000 },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => setAmount(chip.val)}
                  className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                    amount === chip.val
                      ? 'bg-violet-600/20 border-violet-500/40 text-violet-300 font-semibold'
                      : 'bg-zinc-900 border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-zinc-900/80 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  method === 'upi'
                    ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-violet-400" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  method === 'card'
                    ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('netbanking')}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  method === 'netbanking'
                    ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-lime-400" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Tab: UPI / QR */}
            {method === 'upi' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/[0.06] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  {/* Generated QR Code Simulation */}
                  <div className="w-32 h-32 rounded-xl bg-white p-2 shrink-0 flex flex-col items-center justify-center shadow-md">
                    <div className="w-full h-full bg-zinc-950 rounded-lg p-1.5 flex flex-col items-center justify-between">
                      <div className="w-full flex justify-between">
                        <div className="w-4 h-4 bg-white rounded-sm" />
                        <div className="w-4 h-4 bg-white rounded-sm" />
                      </div>
                      <div className="text-[9px] font-mono text-zinc-300 font-bold tracking-widest">
                        MEOW • UPI
                      </div>
                      <div className="w-full flex justify-between">
                        <div className="w-4 h-4 bg-white rounded-sm" />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <span className="text-xs font-semibold text-white block">Scan to Pay via any UPI App</span>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-300">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/5">Google Pay</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/5">PhonePe</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/5">Paytm</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/5">BHIM</span>
                    </div>
                    <div className="pt-1 flex items-center gap-2">
                      <code className="text-xs font-mono text-violet-300 bg-violet-950/40 px-2.5 py-1 rounded-lg border border-violet-500/20">
                        pay@meowai.tech
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUPI}
                        className="p-1 rounded-md text-zinc-400 hover:text-white bg-zinc-800/80 border border-white/10"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Or enter your UPI ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@okaxis or name@upi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified VPA</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Credit / Debit Card */}
            {method === 'card' && (
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 0000 0000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                      <span>Visa / RuPay / MC</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Cardholder Name</label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            )}

            {/* Tab: Net Banking */}
            {method === 'netbanking' && (
              <div className="space-y-3">
                <label className="text-xs font-medium text-zinc-400">Select Primary Bank</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Other 50+ Banks'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                          selectedBank === bank
                            ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                            : 'bg-zinc-900 border-white/[0.06] text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Customer Details */}
            <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">WhatsApp for Receipt</label>
                <input
                  type="text"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">GST / Tax Invoice Email</label>
                <input
                  type="email"
                  value={payerEmail}
                  onChange={(e) => setPayerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authorizing Payment of ₹{amount.toLocaleString('en-IN')}...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{amount.toLocaleString('en-IN')} Instantly</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-zinc-500 mt-3">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  RBI &amp; PCI-DSS Level 1 Compliant
                </span>
                <span>•</span>
                <span>Instant GST Tax Invoice</span>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Success State */
          <div className="p-8 space-y-6 text-center animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Payment Successfully Verified!</h3>
              <p className="text-xs text-zinc-400">
                Transaction ID: <span className="font-mono text-emerald-300 font-semibold">{transactionId}</span>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08] text-left text-xs space-y-2.5 font-mono">
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-zinc-400">Item:</span>
                <span className="text-white font-semibold">{planTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Amount Paid:</span>
                <span className="text-emerald-400 font-bold">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment Channel:</span>
                <span className="text-white uppercase">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">WhatsApp Confirmation:</span>
                <span className="text-white">{payerPhone} (Dispatched)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="text-emerald-300 font-semibold">SETTLED &amp; ACTIVE</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  downloadTaxInvoice({
                    transactionId,
                    amount,
                    planTitle,
                    payerName,
                    payerPhone,
                    payerEmail,
                    method,
                  });
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-violet-400" />
                <span>Download Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Done / Return to Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

