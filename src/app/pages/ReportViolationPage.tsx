import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Phone,
  AlertTriangle,
  FileText,
  User,
  Mail,
  Hash,
  MapPin,
  Calendar,
  AlignLeft,
  Paperclip,
  ChevronRight,
  CheckCircle2,
  Clock,
  Search,
  Ban,
  MessageSquare,
  Send,
  X,
  UploadCloud,
  Info,
  Flame,
} from 'lucide-react';

/* ─── types ─────────────────────────────────────────────────── */
interface FormData {
  reporterName: string;
  reporterEmail: string;
  bookingId: string;
  caregiverName: string;
  incidentType: string;
  incidentLocation: string;
  incidentDate: string;
  incidentDescription: string;
  files: File[];
  agreeTerms: boolean;
}

const VIOLATION_TYPES = [
  { value: '', label: 'Pilih jenis pelanggaran...' },
  { value: 'Kekerasan', label: '🤜 Kekerasan fisik' },
  { value: 'Pelecehan', label: '⚠️ Pelecehan seksual / verbal' },
  { value: 'Penipuan', label: '💸 Penipuan / manipulasi' },
  { value: 'Pencurian', label: '🔓 Pencurian / penggelapan' },
  { value: 'Perilaku Tidak Profesional', label: '😤 Perilaku tidak profesional' },
  { value: 'Kelalaian', label: '🏥 Kelalaian dalam penanganan pasien' },
  { value: 'Lainnya', label: '📋 Lainnya' },
];

const FLOW_STEPS = [
  { icon: Send, label: 'Laporan dikirim', desc: 'Formulir diterima sistem CareMe', color: '#2E8BFF', bg: '#EBF4FF' },
  { icon: FileText, label: 'Tiket dibuat', desc: 'ID tiket unik digenerate otomatis', color: '#8B5CF6', bg: '#F3EEFF' },
  { icon: MessageSquare, label: 'Admin notifikasi', desc: 'Tim investigasi menerima laporan', color: '#F59E0B', bg: '#FFFBEB' },
  { icon: Search, label: 'Investigasi', desc: 'Admin meninjau bukti & kronologi', color: '#06B6D4', bg: '#ECFEFF' },
  { icon: Ban, label: 'Tindakan', desc: 'Penangguhan atau pemblokiran akun', color: '#EF4444', bg: '#FEF2F2' },
  { icon: Phone, label: 'Follow-up', desc: 'Tim menghubungi pelapor jika perlu', color: '#10B981', bg: '#ECFDF5' },
];

const EMERGENCY_CONTACTS = [
  { name: 'Polisi', number: '110', color: '#2E8BFF' },
  { name: 'Ambulans / Gawat Darurat', number: '119', color: '#EF4444' },
  { name: 'Komnas HAM', number: '021-3925230', color: '#8B5CF6' },
  { name: 'Hotline KPAI', number: '1500-054', color: '#F59E0B' },
];

/* ─── success ticket component ──────────────────────────────── */
function SuccessScreen({ ticketId, onReset }: { ticketId: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-12 px-6"
    >
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">Laporan Berhasil Dikirim</h2>
      <p className="text-gray-500 max-w-md mb-6">
        Terima kasih atas laporan Anda. Tim CareMe akan segera meninjau laporan ini dan menghubungi Anda jika diperlukan dalam waktu <strong>1×24 jam</strong>.
      </p>

      {/* Ticket box */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-5 mb-8 w-full max-w-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Nomor Tiket Laporan</p>
        <p className="text-2xl font-mono font-bold text-[#2E8BFF] tracking-wider">{ticketId}</p>
        <p className="text-xs text-gray-400 mt-2">Simpan nomor ini untuk memantau status laporan Anda</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-8 w-full max-w-sm text-left">
        <p className="text-sm font-medium text-blue-800 mb-2">Langkah selanjutnya:</p>
        <ul className="space-y-1.5 text-sm text-blue-700">
          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />Cek email Anda untuk konfirmasi laporan</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />Tim investigasi akan meninjau dalam 1×24 jam</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />Kami mungkin menghubungi Anda untuk keterangan tambahan</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />Kerahasiaan identitas pelapor kami jaga sepenuhnya</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={onReset}
          className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Buat Laporan Lain
        </button>
        <Link
          to="/"
          className="flex-1 px-5 py-3 rounded-xl text-sm font-medium text-white text-center transition-colors hover:opacity-90"
          style={{ background: '#2E8BFF' }}
        >
          Kembali ke Beranda
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── main page ─────────────────────────────────────────────── */
export function ReportViolationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    reporterName: '',
    reporterEmail: '',
    bookingId: '',
    caregiverName: '',
    incidentType: '',
    incidentLocation: '',
    incidentDate: '',
    incidentDescription: '',
    files: [],
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => f.size <= 20 * 1024 * 1024);
    setForm((prev) => ({ ...prev, files: [...prev.files, ...valid].slice(0, 5) }));
  };

  const removeFile = (idx: number) => {
    setForm((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.reporterName.trim()) newErrors.reporterName = 'Nama pelapor wajib diisi';
    if (!form.reporterEmail.trim()) newErrors.reporterEmail = 'Email pelapor wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reporterEmail)) newErrors.reporterEmail = 'Format email tidak valid';
    if (!form.caregiverName.trim()) newErrors.caregiverName = 'Nama penyedia jasa wajib diisi';
    if (!form.incidentType) newErrors.incidentType = 'Jenis pelanggaran wajib dipilih';
    if (!form.incidentDescription.trim()) newErrors.incidentDescription = 'Deskripsi kejadian wajib diisi';
    else if (form.incidentDescription.trim().length < 30) newErrors.incidentDescription = 'Deskripsi minimal 30 karakter';
    if (!form.agreeTerms) newErrors.agreeTerms = 'Anda harus menyetujui pernyataan ini';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const id = `RPT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
      setTicketId(id);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setTicketId('');
    setForm({
      reporterName: '',
      reporterEmail: '',
      bookingId: '',
      caregiverName: '',
      incidentType: '',
      incidentLocation: '',
      incidentDate: '',
      incidentDescription: '',
      files: [],
      agreeTerms: false,
    });
    setErrors({});
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen" style={{ background: '#F7F9FC' }}>
      {/* ── Emergency Banner ───────────────────────── */}
      <div className="bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Flame className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold">SITUASI DARURAT?</span>
            </div>
            <p className="text-sm text-red-100">
              Jika ada ancaman nyawa atau kekerasan yang sedang terjadi —{' '}
              <strong className="text-white">hubungi 110 (Polisi) atau 119 (Ambulans) terlebih dahulu</strong> sebelum mengisi formulir ini.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Breadcrumb ────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#2E8BFF] transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700">Laporkan Pelanggaran</span>
        </nav>

        {/* ── Hero Section ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' }}>
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Laporkan Pelanggaran
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            CareMe berkomitmen penuh menjaga keamanan pasien dan pengguna. Jika Anda mengalami
            atau menyaksikan pelanggaran etik oleh penyedia jasa — seperti kekerasan, pelecehan,
            penipuan, pencurian, atau perilaku tidak profesional — segera laporkan melalui
            formulir ini. Setiap laporan akan ditindaklanjuti oleh tim investigasi kami.
          </p>
        </motion.div>

        {/* ── Emergency Contacts Box ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-l-4 border-red-500 rounded-2xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Kontak Darurat — Hubungi Dulu</h3>
              <p className="text-sm text-gray-500">
                Jika terjadi situasi berbahaya yang mengancam keselamatan, segera hubungi nomor darurat berikut
                <strong className="text-gray-700"> sebelum mengisi formulir laporan</strong>.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EMERGENCY_CONTACTS.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.number.replace(/\D/g, '')}`}
                className="flex flex-col items-center text-center p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                style={{ background: `${c.color}10` }}
              >
                <Phone className="w-4 h-4 mb-1.5" style={{ color: c.color }} />
                <span className="text-xs text-gray-500 mb-0.5 leading-tight">{c.name}</span>
                <span className="text-sm font-bold" style={{ color: c.color }}>{c.number}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── Report Process Flow ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-[#2E8BFF]" />
            <h3 className="font-semibold text-gray-900">Alur Penanganan Laporan</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FLOW_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: step.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                      style={{ background: step.color }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 leading-tight mb-0.5">{step.label}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Form Card ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* card header */}
          <div className="px-6 sm:px-8 py-5 border-b border-gray-100"
            style={{ background: 'linear-gradient(135deg, #EBF4FF 0%, #F3EEFF 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/70 rounded-xl">
                <FileText className="w-5 h-5 text-[#2E8BFF]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Formulir Pelaporan</h2>
                <p className="text-xs text-gray-500">Semua informasi bersifat rahasia dan hanya digunakan untuk keperluan investigasi</p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessScreen key="success" ticketId={ticketId} onReset={handleReset} />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="px-6 sm:px-8 py-8 space-y-8"
              >
                {/* ── Section: Data Pelapor ─────────── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#2E8BFF' }}>1</span>
                    <h3 className="font-medium text-gray-800">Data Pelapor</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Pelapor <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          name="reporterName"
                          value={form.reporterName}
                          onChange={handleChange}
                          placeholder="Nama lengkap Anda"
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]/40 transition-all ${errors.reporterName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        />
                      </div>
                      {errors.reporterName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.reporterName}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Pelapor <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="email"
                          name="reporterEmail"
                          value={form.reporterEmail}
                          onChange={handleChange}
                          placeholder="email@contoh.com"
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]/40 transition-all ${errors.reporterEmail ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        />
                      </div>
                      {errors.reporterEmail && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.reporterEmail}</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                    <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    Identitas Anda bersifat rahasia. Informasi ini hanya digunakan tim investigasi untuk tindak lanjut laporan.
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* ── Section: Data Penyedia Jasa ────── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#8B5CF6' }}>2</span>
                    <h3 className="font-medium text-gray-800">Data Penyedia Jasa yang Dilaporkan</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama Caregiver */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Penyedia Jasa <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          name="caregiverName"
                          value={form.caregiverName}
                          onChange={handleChange}
                          placeholder="Nama penyedia jasa yang dilaporkan"
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 transition-all ${errors.caregiverName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        />
                      </div>
                      {errors.caregiverName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.caregiverName}</p>}
                    </div>
                    {/* ID Booking */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        ID Booking
                        <span className="ml-1 text-xs font-normal text-gray-400">(opsional)</span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          name="bookingId"
                          value={form.bookingId}
                          onChange={handleChange}
                          placeholder="Contoh: BK001"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 hover:border-gray-300 transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Temukan ID Booking di halaman riwayat pemesanan</p>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* ── Section: Detail Kejadian ──────── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#EF4444' }}>3</span>
                    <h3 className="font-medium text-gray-800">Detail Kejadian</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Jenis Pelanggaran */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Jenis Pelanggaran <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="incidentType"
                        value={form.incidentType}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all appearance-none ${errors.incidentType ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        {VIOLATION_TYPES.map((v) => (
                          <option key={v.value} value={v.value} disabled={!v.value}>{v.label}</option>
                        ))}
                      </select>
                      {errors.incidentType && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.incidentType}</p>}
                    </div>
                    {/* Tanggal */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tanggal Kejadian
                        <span className="ml-1 text-xs font-normal text-gray-400">(opsional)</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          name="incidentDate"
                          value={form.incidentDate}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 hover:border-gray-300 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Lokasi */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Lokasi Kejadian
                      <span className="ml-1 text-xs font-normal text-gray-400">(opsional)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="incidentLocation"
                        value={form.incidentLocation}
                        onChange={handleChange}
                        placeholder="Contoh: RSUP Dr. Cipto Mangunkusumo, Jakarta"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 hover:border-gray-300 transition-all"
                      />
                    </div>
                  </div>
                  {/* Deskripsi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Deskripsi / Kronologi Kejadian <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <textarea
                        name="incidentDescription"
                        value={form.incidentDescription}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Ceritakan secara rinci apa yang terjadi — kapan, di mana, bagaimana kronologinya, dan dampak yang Anda atau pasien rasakan. Semakin detail, semakin mudah bagi tim investigasi untuk menindaklanjuti."
                        className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 resize-none transition-all ${errors.incidentDescription ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      {errors.incidentDescription
                        ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.incidentDescription}</p>
                        : <span className="text-xs text-gray-400">Minimal 30 karakter</span>
                      }
                      <span className="text-xs text-gray-400">{form.incidentDescription.length} karakter</span>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* ── Section: Unggah Bukti ─────────── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#F59E0B' }}>4</span>
                    <h3 className="font-medium text-gray-800">Unggah Bukti <span className="text-xs font-normal text-gray-400">(opsional, maks. 5 file)</span></h3>
                  </div>

                  {/* dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center text-center cursor-pointer transition-all ${
                      dragOver ? 'border-[#2E8BFF] bg-blue-50' : 'border-gray-200 hover:border-[#2E8BFF] hover:bg-blue-50/40'
                    }`}
                  >
                    <UploadCloud className={`w-8 h-8 mb-3 ${dragOver ? 'text-[#2E8BFF]' : 'text-gray-300'}`} />
                    <p className="text-sm font-medium text-gray-700 mb-1">Seret & lepas file di sini</p>
                    <p className="text-xs text-gray-400">atau klik untuk memilih file</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, MP4, PDF, MOV — maks. 20MB per file</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>

                  {/* file list */}
                  {form.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {form.files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                              <Paperclip className="w-3.5 h-3.5 text-[#2E8BFF]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-700 truncate">{file.name}</p>
                              <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <hr className="border-gray-100" />

                {/* ── Pernyataan & Submit ───────────── */}
                <section>
                  <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${errors.agreeTerms ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={form.agreeTerms}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 accent-[#2E8BFF] flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Saya menyatakan bahwa semua informasi yang saya berikan adalah <strong className="text-gray-800">benar dan akurat</strong> berdasarkan pengetahuan saya.
                      Saya memahami bahwa laporan palsu dapat dikenakan sanksi sesuai dengan kebijakan CareMe dan ketentuan hukum yang berlaku.
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.agreeTerms}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Mengirim Laporan...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Laporan Sekarang
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3">
                    Laporan Anda akan ditangani dalam waktu <strong>1×24 jam</strong> oleh tim investigasi CareMe.
                    Kerahasiaan identitas pelapor dijamin sepenuhnya.
                  </p>
                </section>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Info Footer Cards ─────────────────────── */}
        {!submitted && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
          >
            {[
              { icon: ShieldAlert, color: '#2E8BFF', bg: '#EBF4FF', title: 'Kerahasiaan Terjamin', desc: 'Identitas pelapor sepenuhnya dijaga dan tidak akan dibocorkan kepada pihak yang dilaporkan.' },
              { icon: Clock, color: '#10B981', bg: '#ECFDF5', title: 'Respons Cepat', desc: 'Tim investigasi CareMe berkomitmen meninjau setiap laporan dalam 1×24 jam kerja.' },
              { icon: Ban, color: '#EF4444', bg: '#FEF2F2', title: 'Tindakan Tegas', desc: 'Penyedia jasa terbukti melanggar dapat dikenai penangguhan sementara hingga pemblokiran permanen.' },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
                  <div className="p-2.5 rounded-xl flex-shrink-0 h-fit" style={{ background: card.bg }}>
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm mb-1">{card.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
