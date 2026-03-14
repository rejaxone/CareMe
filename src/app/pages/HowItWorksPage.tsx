import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  UserPlus,
  Search,
  ClipboardList,
  CalendarDays,
  CreditCard,
  HeartHandshake,
  BadgeCheck,
  ShieldCheck,
  Bell,
  CalendarCheck,
  Star,
  FileText,
  CheckCircle2,
  ArrowRight,
  Users,
  Sparkles,
  Lock,
  ThumbsUp,
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────── */

const CUSTOMER_STEPS = [
  {
    n: 1,
    icon: UserPlus,
    title: 'Buat Akun',
    desc: 'Daftar di CareMe sebagai pencari jasa dengan mengisi nama, email, dan nomor telepon. Proses pendaftaran cepat dan mudah.',
    color: '#2E8BFF',
    bg: '#EBF4FF',
  },
  {
    n: 2,
    icon: Search,
    title: 'Cari Pendamping',
    desc: 'Gunakan fitur pencarian untuk menemukan pendamping pasien berdasarkan lokasi, rating, ketersediaan, atau preferensi lainnya.',
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
  {
    n: 3,
    icon: ClipboardList,
    title: 'Lihat Profil',
    desc: 'Periksa profil lengkap penyedia jasa — pengalaman, sertifikasi, tarif per jam, dan ulasan dari pengguna sebelumnya.',
    color: '#8B5CF6',
    bg: '#F3EEFF',
  },
  {
    n: 4,
    icon: CalendarDays,
    title: 'Lakukan Booking',
    desc: 'Pilih tanggal dan jam layanan, kemudian isi informasi pasien serta kebutuhan pendampingan yang diinginkan.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    n: 5,
    icon: CreditCard,
    title: 'Konfirmasi & Pembayaran',
    desc: 'Setelah penyedia jasa menerima permintaan Anda, lakukan pembayaran aman melalui Mayar — gateway terpercaya.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    n: 6,
    icon: HeartHandshake,
    title: 'Pendampingan Dimulai',
    desc: 'Pendamping akan tiba sesuai jadwal dan memberikan layanan terbaik menemani pasien di rumah sakit.',
    color: '#EF4444',
    bg: '#FEF2F2',
  },
];

const CAREGIVER_STEPS = [
  {
    n: 1,
    icon: UserPlus,
    title: 'Daftar Sebagai Penyedia Jasa',
    desc: 'Pilih opsi "Penyedia Jasa" saat pendaftaran akun CareMe dan isi data diri dasar Anda.',
    color: '#2E8BFF',
    bg: '#EBF4FF',
  },
  {
    n: 2,
    icon: FileText,
    title: 'Lengkapi Profil',
    desc: 'Isi informasi pribadi, pengalaman kerja, keahlian, serta unggah dokumen identitas untuk proses verifikasi.',
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
  {
    n: 3,
    icon: ShieldCheck,
    title: 'Verifikasi Admin',
    desc: 'Tim CareMe akan memverifikasi data dan identitas Anda sebelum akun aktif dan siap menerima pesanan.',
    color: '#8B5CF6',
    bg: '#F3EEFF',
  },
  {
    n: 4,
    icon: Bell,
    title: 'Terima Permintaan Booking',
    desc: 'Anda mendapat notifikasi real-time ketika ada pelanggan yang ingin memesan layanan pendampingan Anda.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    n: 5,
    icon: CalendarCheck,
    title: 'Konfirmasi Jadwal',
    desc: 'Tinjau detail booking — tanggal, jam, lokasi rumah sakit — kemudian setujui atau tolak sesuai ketersediaan.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    n: 6,
    icon: Star,
    title: 'Selesaikan Layanan',
    desc: 'Datang ke rumah sakit tepat waktu dan berikan layanan pendampingan terbaik. Dapatkan ulasan positif dan tingkatkan reputasi Anda.',
    color: '#EF4444',
    bg: '#FEF2F2',
  },
];

const TRUST_POINTS = [
  {
    icon: BadgeCheck,
    title: 'Penyedia Terverifikasi',
    desc: 'Setiap caregiver melewati proses verifikasi identitas ketat sebelum dapat menerima pesanan.',
    color: '#2E8BFF',
    bg: '#EBF4FF',
  },
  {
    icon: ThumbsUp,
    title: 'Rating & Ulasan Nyata',
    desc: 'Sistem ulasan transparan dari pelanggan yang telah menggunakan layanan agar Anda bisa memilih dengan bijak.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: Lock,
    title: 'Pembayaran Aman',
    desc: 'Transaksi diproses melalui Mayar — payment gateway terpercaya dengan enkripsi berlapis.',
    color: '#8B5CF6',
    bg: '#F3EEFF',
  },
  {
    icon: Users,
    title: 'Komunitas Luas',
    desc: 'Ribuan caregiver berpengalaman tersebar di 45+ kota di seluruh Indonesia, siap membantu kapan saja.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
];

/* ─── animation variants ───────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── sub-components ────────────────────────────────────────── */

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof CUSTOMER_STEPS)[0];
  index: number;
  isLast: boolean;
}) {
  const Icon = step.icon;
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      className="relative flex flex-col"
    >
      {/* Connector line (desktop: right side of card, hidden for last) */}
      {!isLast && (
        <div
          className="hidden lg:block absolute top-10 left-full w-full h-0.5 z-0"
          style={{
            background: `linear-gradient(to right, ${step.color}40, transparent)`,
            width: 'calc(100% - 5rem)',
            left: 'calc(50% + 2.5rem)',
            top: '2.5rem',
          }}
        />
      )}

      <div className="relative z-10 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-4 h-full">
        {/* Number badge */}
        <div className="flex items-start justify-between">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: step.bg }}
          >
            <Icon className="w-6 h-6" style={{ color: step.color }} />
          </div>
          <span
            className="text-4xl select-none"
            style={{ color: step.color, opacity: 0.15, fontWeight: 800, lineHeight: 1 }}
          >
            {String(step.n).padStart(2, '0')}
          </span>
        </div>

        {/* Step number pill */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: step.color }}
          >
            {step.n}
          </span>
          <h3 className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 700 }}>
            {step.title}
          </h3>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed flex-1">{step.desc}</p>

        {/* Bottom accent */}
        <div className="h-0.5 rounded-full" style={{ background: `${step.color}30` }} />
      </div>
    </motion.div>
  );
}

/* ─── main page ─────────────────────────────────────────────── */

export function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'customer' | 'caregiver'>('customer');

  const steps = activeTab === 'customer' ? CUSTOMER_STEPS : CAREGIVER_STEPS;

  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F4C8C 0%, #1A6FD4 40%, #2E8BFF 70%, #5BA8FF 100%)',
          paddingTop: '90px',
          paddingBottom: '90px',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)' }}
        />
        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${10 + i * 6}px`,
              height: `${10 + i * 6}px`,
              top: `${15 + i * 12}%`,
              left: `${5 + i * 15}%`,
            }}
          />
        ))}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium text-white"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <Sparkles className="w-4 h-4" />
            Platform Pendamping Pasien #1 Indonesia
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.15 }}
          >
            Cara Kerja{' '}
            <span
              className="relative"
              style={{
                background: 'linear-gradient(135deg, #93C5FD, #FFFFFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CareMe
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-blue-100 mx-auto"
            style={{ fontSize: '1.125rem', maxWidth: '600px', lineHeight: 1.7 }}
          >
            Temukan pendamping terpercaya untuk menemani orang tercinta Anda di rumah sakit
            — cepat, mudah, dan aman hanya dalam beberapa langkah sederhana.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10"
          >
            {[
              { v: '5.000+', l: 'Pengguna Aktif' },
              { v: '1.200+', l: 'Caregiver Terverifikasi' },
              { v: '45+', l: 'Kota di Indonesia' },
              { v: '4.9★', l: 'Rating Rata-rata' },
            ].map((s) => (
              <div key={s.l} className="text-center px-4">
                <div
                  className="text-white"
                  style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}
                >
                  {s.v}
                </div>
                <div className="text-blue-200 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TAB SWITCHER ─────────────────────────────────────── */}
      <section className="w-full" style={{ background: '#F7F9FC' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab pills — sticky just below nav */}
          <div className="flex justify-center pt-12 pb-2">
            <div
              className="inline-flex rounded-2xl p-1.5"
              style={{ background: '#E8EFF8', gap: '4px' }}
            >
              {(['customer', 'caregiver'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{
                    color: activeTab === tab ? '#fff' : '#6B7280',
                    background: activeTab === tab ? '#2E8BFF' : 'transparent',
                    boxShadow: activeTab === tab ? '0 4px 14px rgba(46,139,255,0.35)' : 'none',
                  }}
                >
                  {tab === 'customer' ? (
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Pencari Jasa
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4" />
                      Penyedia Jasa
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section header */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center mt-10 mb-12"
          >
            <h2
              className="text-gray-900 mb-3"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800 }}
            >
              {activeTab === 'customer'
                ? 'Langkah Mudah Menemukan Pendamping'
                : 'Bergabung Sebagai Penyedia Jasa'}
            </h2>
            <p className="text-gray-500 mx-auto" style={{ maxWidth: '540px', lineHeight: 1.7 }}>
              {activeTab === 'customer'
                ? 'Ikuti 6 langkah berikut untuk mendapatkan pendamping pasien yang tepat dan terpercaya.'
                : 'Daftar, lengkapi profil, dan mulai terima pesanan layanan pendampingan dari pelanggan di sekitar Anda.'}
            </p>
          </motion.div>

          {/* Step cards grid */}
          <motion.div
            key={`grid-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16"
          >
            {steps.map((step, i) => (
              <StepCard key={step.n} step={step} index={i} isLast={i === steps.length - 1} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FULL FLOW VISUAL (timeline) ────────────────────── */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="text-gray-900 mb-3"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800 }}
            >
              Alur Lengkap Platform CareMe
            </h2>
            <p className="text-gray-500" style={{ lineHeight: 1.7 }}>
              Bagaimana ekosistem CareMe bekerja menghubungkan pencari jasa dan penyedia jasa.
            </p>
          </motion.div>

          {/* Two columns connected timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer side */}
            <div>
              <div
                className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl"
                style={{ background: '#EBF4FF' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#2E8BFF' }}
                >
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900" style={{ fontWeight: 700 }}>Pencari Jasa</span>
              </div>

              <div className="relative pl-8">
                {/* Vertical line */}
                <div
                  className="absolute left-3.5 top-0 bottom-0 w-0.5"
                  style={{ background: 'linear-gradient(to bottom, #2E8BFF, #BFD9FF)' }}
                />
                {CUSTOMER_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.n}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      className="relative flex gap-4 mb-7 last:mb-0"
                    >
                      {/* Dot */}
                      <div
                        className="absolute -left-8 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: s.color }}
                      >
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>
                          {s.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Caregiver side */}
            <div>
              <div
                className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl"
                style={{ background: '#ECFDF5' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#10B981' }}
                >
                  <HeartHandshake className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900" style={{ fontWeight: 700 }}>Penyedia Jasa</span>
              </div>

              <div className="relative pl-8">
                <div
                  className="absolute left-3.5 top-0 bottom-0 w-0.5"
                  style={{ background: 'linear-gradient(to bottom, #10B981, #A7F3D0)' }}
                />
                {CAREGIVER_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.n}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      className="relative flex gap-4 mb-7 last:mb-0"
                    >
                      <div
                        className="absolute -left-8 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: s.color }}
                      >
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>
                          {s.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CAREME ─────────────────────────────────────── */}
      <section className="w-full py-20" style={{ background: '#F7F9FC' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm font-medium"
              style={{ background: '#EBF4FF', color: '#2E8BFF' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Keunggulan Platform
            </div>
            <h2
              className="text-gray-900 mb-3"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800 }}
            >
              Mengapa Memilih CareMe?
            </h2>
            <p className="text-gray-500 mx-auto" style={{ maxWidth: '480px', lineHeight: 1.7 }}>
              Kami hadir untuk memastikan setiap pasien mendapatkan pendampingan terbaik dengan
              standar keamanan dan kenyamanan tertinggi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: p.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: p.color }} />
                  </div>
                  <div>
                    <h3
                      className="text-gray-900 mb-1.5"
                      style={{ fontSize: '0.975rem', fontWeight: 700 }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ MINI ─────────────────────────────────────────── */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2
              className="text-gray-900 mb-2"
              style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800 }}
            >
              Pertanyaan Umum
            </h2>
          </motion.div>
          <div className="space-y-4">
            {[
              {
                q: 'Apakah CareMe tersedia di seluruh Indonesia?',
                a: 'Saat ini CareMe beroperasi di 45+ kota besar di Indonesia dan terus berkembang ke lebih banyak kota.',
              },
              {
                q: 'Bagaimana cara memastikan keamanan penyedia jasa?',
                a: 'Setiap caregiver wajib melewati verifikasi KTP dan latar belakang oleh tim admin CareMe sebelum akun diaktifkan.',
              },
              {
                q: 'Apa metode pembayaran yang didukung?',
                a: 'Pembayaran diproses melalui Mayar yang mendukung transfer bank, virtual account, e-wallet, dan kartu kredit.',
              },
              {
                q: 'Apakah bisa membatalkan booking?',
                a: 'Ya, pembatalan dapat dilakukan sesuai dengan kebijakan pembatalan yang tertera saat proses booking.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: '#2E8BFF' }}
                  >
                    ?
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{faq.q}</p>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F4C8C 0%, #1A6FD4 50%, #2E8BFF 100%)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        {/* Decorative */}
        <div
          className="absolute -top-10 -right-10 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)' }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium text-white"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Sparkles className="w-4 h-4" />
              Mulai Sekarang
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.2 }}
            >
              Siap Memberikan Pendampingan Terbaik?
            </h2>
            <p className="text-blue-100 mb-10" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              Temukan pendamping terpercaya untuk orang tercinta Anda, atau bergabung sebagai
              penyedia jasa dan mulai penghasilan tambahan hari ini.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-[#1A6FD4] transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: '#FFFFFF' }}
              >
                <Search className="w-4 h-4" />
                Cari Pendamping Sekarang
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/caregiver/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white border-2 border-white/50 transition-all hover:bg-white/10 hover:border-white hover:scale-105"
              >
                <HeartHandshake className="w-4 h-4" />
                Daftar Sebagai Pendamping
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust note */}
            <p className="text-blue-200 text-xs mt-8">
              Gratis mendaftar · Tanpa biaya langganan · Mulai menerima pesanan dalam 24 jam
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
