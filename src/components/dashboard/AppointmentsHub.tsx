'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  Search,
  Filter,
  User,
  ExternalLink,
  X,
  Languages,
  Check,
} from 'lucide-react';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot: string;
  sessionType: string;
  language: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

export const AppointmentsHub: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'rescheduled' | 'cancelled'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedForPayment, setSelectedForPayment] = useState<Appointment | null>(null);

  // New appointment form state
  const [newAppt, setNewAppt] = useState({
    name: '',
    phone: '',
    email: '',
    date: 'Tomorrow',
    timeSlot: '05:30 PM IST',
    sessionType: 'Doctor Consultation',
    language: 'telugu',
    status: 'confirmed' as Appointment['status'],
  });

  const loadAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.name || !newAppt.phone) {
      alert('Please provide patient name and phone number');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppt),
      });
      const data = await res.json();
      if (res.ok && data.appointment) {
        setAppointments((prev) => [data.appointment, ...prev]);
        setModalOpen(false);
        setNewAppt({
          name: '',
          phone: '',
          email: '',
          date: 'Tomorrow',
          timeSlot: '05:30 PM IST',
          sessionType: 'Doctor Consultation',
          language: 'telugu',
          status: 'confirmed',
        });
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel and delete this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Patient Name', 'Phone', 'Date', 'Time Slot', 'Type', 'Language', 'Status'];
    const rows = appointments.map((a) => [
      a.id,
      `"${a.name}"`,
      `"${a.phone}"`,
      `"${a.date}"`,
      `"${a.timeSlot}"`,
      `"${a.sessionType}"`,
      a.language,
      a.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendWhatsAppReminder = (appt: Appointment) => {
    const cleanPhone = appt.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${appt.name}! This is Sara from Dr. Rao Orthopedic Care. Confirming your appointment on ${appt.date} at ${appt.timeSlot}. Clinic Location: Road No. 36, Jubilee Hills (Metro Pillar 1420), Hyderabad. For valet parking or directions, reply here or call back.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search) ||
      a.sessionType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-8 space-y-6 text-left">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              <span>Appointments &amp; Patient CRM</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20">
              {appointments.length} Total
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time appointment schedule synchronized with Sara Voice AI and WhatsApp Cloud tokens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, phone, or service..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          {(['all', 'confirmed', 'rescheduled', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] capitalize transition-all ${
                statusFilter === st
                  ? 'bg-zinc-800 text-white border-white/20 font-semibold'
                  : 'bg-zinc-950/60 text-zinc-400 border-white/[0.04] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-950/40 border border-white/[0.04] text-center text-xs text-zinc-400">
            No appointments matching your search. Click "New Appointment" to book a patient slot.
          </div>
        ) : (
          filtered.map((appt) => (
            <div
              key={appt.id}
              className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.06] hover:border-white/15 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              {/* Patient Info */}
              <div className="space-y-1 min-w-[220px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{appt.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                    {appt.language}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                      appt.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : appt.status === 'rescheduled'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    }`}
                  >
                    {appt.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-zinc-400 font-mono text-[11px] flex items-center gap-3">
                  <span>{appt.phone}</span>
                  <span>•</span>
                  <span className="text-zinc-300">{appt.sessionType}</span>
                </div>
              </div>

              {/* Time & Slot */}
              <div className="space-y-0.5 font-mono text-xs sm:text-right">
                <div className="text-white font-semibold flex items-center sm:justify-end gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-violet-400" />
                  <span>{appt.date}</span>
                </div>
                <div className="text-zinc-400 text-[11px] flex items-center sm:justify-end gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{appt.timeSlot}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04] w-full sm:w-auto justify-end">
                {/* Send WhatsApp Reminder */}
                <button
                  type="button"
                  onClick={() => sendWhatsAppReminder(appt)}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-emerald-300 hover:text-emerald-200 text-xs font-mono flex items-center gap-1 transition-all"
                  title="Send WhatsApp confirmation token"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                {/* Collect Fee */}
                <button
                  type="button"
                  onClick={() => setSelectedForPayment(appt)}
                  className="px-2.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-200 text-xs font-medium flex items-center gap-1 transition-all"
                  title="Collect Consultation Fee"
                >
                  <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                  <span>Collect ₹600</span>
                </button>

                {/* Status Toggle */}
                {appt.status !== 'confirmed' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(appt.id, 'confirmed')}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-white/5"
                    title="Mark Confirmed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(appt.id, 'rescheduled')}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-white/5"
                    title="Mark Rescheduled"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(appt.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5"
                  title="Cancel & Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Appointment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 space-y-5 text-left text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span>Book New Appointment</span>
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAppt.name}
                  onChange={(e) => setNewAppt({ ...newAppt, name: e.target.value })}
                  placeholder="e.g. Sravani Reddy"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newAppt.phone}
                    onChange={(e) => setNewAppt({ ...newAppt, phone: e.target.value })}
                    placeholder="+91 98480 •••••"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Service / Speciality</label>
                  <input
                    type="text"
                    value={newAppt.sessionType}
                    onChange={(e) => setNewAppt({ ...newAppt, sessionType: e.target.value })}
                    placeholder="Orthopedic Care"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Date</label>
                  <input
                    type="text"
                    value={newAppt.date}
                    onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                    placeholder="Tomorrow or Oct 12"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Time Slot (IST)</label>
                  <input
                    type="text"
                    value={newAppt.timeSlot}
                    onChange={(e) => setNewAppt({ ...newAppt, timeSlot: e.target.value })}
                    placeholder="05:30 PM IST"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Language Preference</label>
                <select
                  value={newAppt.language}
                  onChange={(e) => setNewAppt({ ...newAppt, language: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="telugu">Telugu (తెలుగు)</option>
                  <option value="hindi">Hindi (हिन्दी)</option>
                  <option value="english">Indian English</option>
                  <option value="tamil">Tamil (தமிழ்)</option>
                  <option value="kannada">Kannada (ಕನ್ನಡ)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm"
                >
                  Confirm &amp; Sync to Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {selectedForPayment && (
        <EasyPaymentModal
          isOpen={!!selectedForPayment}
          onClose={() => setSelectedForPayment(null)}
          defaultPlan={`Consultation Fee — ${selectedForPayment.name}`}
          defaultAmount={600}
        />
      )}
    </div>
  );
};
