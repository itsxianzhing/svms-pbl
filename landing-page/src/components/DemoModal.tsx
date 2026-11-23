import {useEffect, useState, type FormEvent} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {X, CheckCircle2, ArrowRight, Info} from 'lucide-react';
import {VENUE_TYPE_OPTIONS} from '../constants/svmsData';

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  venueName: string;
  venueType: string;
  courtCount: string;
  whatsapp: string;
  notes: string;
}

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  venueName: '',
  venueType: 'Badminton',
  courtCount: '',
  whatsapp: '',
  notes: '',
};

export function DemoModal({open, onClose}: DemoModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submittedData, setSubmittedData] = useState<FormState | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Nama lengkap wajib diisi.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nextErrors.email = 'Alamat email wajib diisi.';
    } else if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Format alamat email belum valid.';
    }
    if (!form.venueName.trim()) {
      nextErrors.venueName = 'Nama venue atau bisnis wajib diisi.';
    }
    if (!form.venueType.trim()) {
      nextErrors.venueType = 'Pilih jenis venue.';
    }
    const parsedCourts = Number(form.courtCount);
    if (!form.courtCount.trim() || !Number.isFinite(parsedCourts) || parsedCourts < 1) {
      nextErrors.courtCount = 'Masukkan jumlah lapangan minimal 1.';
    }
    const digitsOnly = form.whatsapp.replace(/\D/g, '');
    if (!form.whatsapp.trim()) {
      nextErrors.whatsapp = 'Nomor WhatsApp wajib diisi.';
    } else if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      nextErrors.whatsapp = 'Nomor WhatsApp harus terdiri dari 9–15 digit.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmittedData({...form});
  };

  const handleResetAndClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmittedData(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/55 dark:bg-slate-950/75 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{opacity: 0, scale: 0.96, y: 12}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.96, y: 12}}
            transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
            className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#182235] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  Permintaan Demonstrasi Produk
                </p>
                <h2
                  id="demo-modal-title"
                  className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-2xl"
                >
                  Book a Demo SVMS
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup formulir Book a Demo"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-slate-800 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {submittedData ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-500/15 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-display text-sm font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-base">
                        Pengajuan Demo Tercatat
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                        Terima kasih telah mengajukan demo SVMS. Tim kami akan menghubungi Anda melalui email untuk menentukan jadwal demonstrasi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submitted Summary */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/70 bg-[#F6F7FB] dark:bg-[#111827] p-4 text-xs text-slate-700 dark:text-slate-200 space-y-1.5">
                  <p className="font-semibold text-slate-900 dark:text-[#F8FAFC]">Ringkasan Data yang Anda Isi:</p>
                  <p>
                    <span className="text-slate-500 dark:text-slate-400">Nama:</span> {submittedData.fullName}
                  </p>
                  <p>
                    <span className="text-slate-500 dark:text-slate-400">Email:</span> {submittedData.email}
                  </p>
                  <p>
                    <span className="text-slate-500 dark:text-slate-400">Venue:</span> {submittedData.venueName} (
                    {submittedData.venueType} · {submittedData.courtCount} lapangan)
                  </p>
                  <p>
                    <span className="text-slate-500 dark:text-slate-400">WhatsApp:</span> {submittedData.whatsapp}
                  </p>
                </div>

                {/* Transparent Prototype Notice */}
                <div className="flex items-start gap-2.5 rounded-xl border border-indigo-200/80 dark:border-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-500/15 p-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  <span>
                    Catatan pratinjau: Formulir ini berjalan sebagai simulasi antarmuka frontend (tanpa koneksi server pengiriman email langsung).
                  </span>
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData(null);
                      setForm(INITIAL_FORM);
                    }}
                    className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1E293B] px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#253149] transition-colors"
                  >
                    Isi Ulang Formulir
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Lengkapi informasi venue Anda agar tim kami dapat menyiapkan sesi demonstrasi yang relevan.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="demo-full-name"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      Nama Lengkap <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="demo-full-name"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => {
                        setForm((prev) => ({...prev, fullName: e.target.value}));
                        if (errors.fullName) setErrors((prev) => ({...prev, fullName: undefined}));
                      }}
                      placeholder="Contoh: Hendra Wijaya"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="demo-email"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      Alamat Email <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="demo-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => {
                        setForm((prev) => ({...prev, email: e.target.value}));
                        if (errors.email) setErrors((prev) => ({...prev, email: undefined}));
                      }}
                      placeholder="nama@venueanda.com"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="demo-venue-name"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      Nama Venue / Bisnis <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="demo-venue-name"
                      type="text"
                      required
                      value={form.venueName}
                      onChange={(e) => {
                        setForm((prev) => ({...prev, venueName: e.target.value}));
                        if (errors.venueName) setErrors((prev) => ({...prev, venueName: undefined}));
                      }}
                      placeholder="Contoh: GOR Nusantara"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                    {errors.venueName && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.venueName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="demo-venue-type"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      Jenis Venue <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <select
                      id="demo-venue-type"
                      required
                      value={form.venueType}
                      onChange={(e) => {
                        setForm((prev) => ({...prev, venueType: e.target.value}));
                        if (errors.venueType) setErrors((prev) => ({...prev, venueType: undefined}));
                      }}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    >
                      {VENUE_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="dark:bg-[#111827] dark:text-[#F8FAFC]">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.venueType && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.venueType}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="demo-court-count"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      Jumlah Lapangan / Meja <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="demo-court-count"
                      type="number"
                      min={1}
                      required
                      value={form.courtCount}
                      onChange={(e) => {
                        setForm((prev) => ({...prev, courtCount: e.target.value}));
                        if (errors.courtCount) setErrors((prev) => ({...prev, courtCount: undefined}));
                      }}
                      placeholder="Contoh: 6"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 tabular-nums"
                    />
                    {errors.courtCount && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.courtCount}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="demo-whatsapp"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      Nomor WhatsApp <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="demo-whatsapp"
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => {
                        setForm((prev) => ({...prev, whatsapp: e.target.value}));
                        if (errors.whatsapp) setErrors((prev) => ({...prev, whatsapp: undefined}));
                      }}
                      placeholder="Contoh: 081234567890"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                    {errors.whatsapp && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.whatsapp}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="demo-notes"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                  >
                    Kebutuhan Bisnis atau Pertanyaan <span className="text-slate-400 dark:text-slate-500">(Opsional)</span>
                  </label>
                  <textarea
                    id="demo-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({...prev, notes: e.target.value}))}
                    placeholder="Ceritakan singkat tantangan pencatatan atau hal yang ingin didiskusikan saat demo..."
                    className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="text-rose-600 dark:text-rose-400">*</span> Wajib diisi
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#182235]"
                  >
                    <span>Kirim Permintaan Demo</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
