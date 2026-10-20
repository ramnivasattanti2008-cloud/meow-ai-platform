'use client';

import React, { useState, useEffect } from 'react';
import {
  Webhook,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { WebhookConfig, WebhookDeliveryLog, WebhookEventType } from '@/lib/types';

export const WebhookIntegrationHub: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>([
    'appointment.created',
    'lead.qualified',
  ]);

  // Test Ping State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchWebhooksAndLogs = async () => {
    try {
      const res = await fetch('/api/webhooks?logs=true');
      const data = await res.json();
      setWebhooks(data.webhooks || []);
      setLogs(data.logs || []);
    } catch (e) {
      console.error('Error fetching webhooks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooksAndLogs();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name) return;

    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          url,
          secret,
          events: selectedEvents,
        }),
      });

      if (res.ok) {
        setName('');
        setUrl('');
        setSecret('');
        setIsAdding(false);
        fetchWebhooksAndLogs();
      }
    } catch (e) {
      console.error('Error adding webhook:', e);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/webhooks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchWebhooksAndLogs();
      }
    } catch (e) {
      console.error('Error deleting webhook:', e);
    }
  };

  const handleToggleEnabled = async (wh: WebhookConfig) => {
    try {
      const res = await fetch('/api/webhooks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: wh.id,
          enabled: !wh.enabled,
        }),
      });
      if (res.ok) {
        fetchWebhooksAndLogs();
      }
    } catch (e) {
      console.error('Error updating webhook:', e);
    }
  };

  const handleTriggerTestPing = async (event: WebhookEventType = 'appointment.created') => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
      const data = await res.json();
      setTestResult(data);
      fetchWebhooksAndLogs();
    } catch (e) {
      console.error('Test webhook error:', e);
    } finally {
      setIsTesting(false);
    }
  };

  const allAvailableEvents: { id: WebhookEventType; label: string; desc: string }[] = [
    {
      id: 'appointment.created',
      label: 'Appointment Created',
      desc: 'Dispatched when Sara confirms a clinic/service consultation slot.',
    },
    {
      id: 'lead.qualified',
      label: 'Lead Qualified',
      desc: 'Fired when a prospect submits discovery details or finishes triage.',
    },
    {
      id: 'payment.settled',
      label: 'Payment Settled',
      desc: 'Fired when UPI or card invoice transaction confirms successfully.',
    },
    {
      id: 'call.completed',
      label: 'Call Summary Completed',
      desc: 'Dispatched when an inbound phone/voice call ends with CRM transcript.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/60 border border-white/[0.08] shadow-glass">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Webhook className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">External Webhooks & CRM Dispatcher</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20">
              HMAC SHA-256 Verified
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Automatically dispatch signed real-time JSON payloads to Zapier, Google Sheets, Make, WhatsApp Cloud API, or your internal CRM whenever Sara takes an action.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleTriggerTestPing('appointment.created')}
            disabled={isTesting}
            className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-white/10 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 text-violet-400 ${isTesting ? 'animate-bounce' : ''}`} />
            <span>{isTesting ? 'Firing Ping...' : 'Send Test Event'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Webhook</span>
          </button>
        </div>
      </div>

      {/* Test Ping Live Inspector Banner */}
      {testResult && (
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 text-xs text-left space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Test Webhook Ping Delivered Successfully</span>
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="text-zinc-500 hover:text-zinc-300 text-[11px]"
            >
              Dismiss
            </button>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Dispatched to {testResult.result?.dispatchedCount || 0} endpoint(s).
          </div>
          <pre className="p-2.5 rounded-xl bg-zinc-900/80 text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-36">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Add Webhook Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateWebhook}
          className="p-5 rounded-2xl bg-zinc-950/90 border border-violet-500/30 space-y-4 text-left animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h4 className="text-sm font-semibold text-white">Register New External Webhook</h4>
            <span className="text-[10px] font-mono text-zinc-500">Supports POST requests</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">Integration Name</label>
              <input
                type="text"
                placeholder="e.g. Clinic Google Sheets / Zapier Lead Intake"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">Destination URL</label>
              <input
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/... or https://your-domain.com/webhook"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-300 font-medium">Secret Key (Optional, for HMAC Signature)</label>
            <input
              type="text"
              placeholder="Leave empty to auto-generate a cryptographically secure key"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-300 font-medium">Subscribed Events</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allAvailableEvents.map((evt) => {
                const checked = selectedEvents.includes(evt.id);
                return (
                  <label
                    key={evt.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      checked
                        ? 'bg-violet-950/30 border-violet-500/40 text-white'
                        : 'bg-zinc-900/40 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedEvents((prev) =>
                          prev.includes(evt.id)
                            ? prev.filter((x) => x !== evt.id)
                            : [...prev, evt.id]
                        );
                      }}
                      className="mt-0.5 rounded border-zinc-700 text-violet-600 focus:ring-0"
                    />
                    <div>
                      <div className="font-medium text-xs text-zinc-200">{evt.label}</div>
                      <div className="text-[10px] text-zinc-500">{evt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Save Webhook
            </button>
          </div>
        </form>
      )}

      {/* Webhooks Registered List */}
      <div className="space-y-3 text-left">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Active Endpoints ({webhooks.length})</h4>
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading configured webhooks...</div>
        ) : webhooks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-center space-y-2">
            <p className="text-xs text-zinc-400">No external webhooks configured yet.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-violet-400 hover:underline font-mono"
            >
              + Register your first webhook (Zapier, Google Sheets, WhatsApp)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shadow-subtle hover:border-white/15 transition-all"
              >
                <div className="space-y-1.5 min-w-[260px] flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        wh.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                      }`}
                    />
                    <span className="font-semibold text-xs text-white">{wh.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded-md bg-white/[0.04]">
                      {wh.enabled ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="truncate max-w-md">{wh.url}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(wh.url)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Copy Webhook URL"
                    >
                      {copiedUrl === wh.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {wh.events.map((evt) => (
                      <span
                        key={evt}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-950/50 text-violet-300 border border-violet-500/20"
                      >
                        {evt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(wh)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      wh.enabled
                        ? 'bg-zinc-900 text-zinc-300 border-white/10 hover:text-white'
                        : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {wh.enabled ? 'Pause' : 'Enable'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteWebhook(wh.id)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Webhook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Delivery Logs */}
      <div className="space-y-3 text-left pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Real-Time Delivery Logs (Last 20 Dispatches)
          </h4>
          <button
            onClick={fetchWebhooksAndLogs}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-center text-xs text-zinc-500 font-mono">
            No delivery events logged yet. Click &quot;Send Test Event&quot; to test.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-zinc-950/70">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase text-zinc-500 bg-zinc-900/50">
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Event</th>
                  <th className="py-2.5 px-4">Destination</th>
                  <th className="py-2.5 px-4">Latency</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          log.status === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        HTTP {log.statusCode}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-violet-300">
                      {log.event}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-zinc-400 truncate max-w-xs">
                      {log.targetUrl}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[10px] text-zinc-500">
                      {log.latencyMs}ms
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[10px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
