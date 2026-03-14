import { Link, useNavigate } from 'react-router';
import {
  Search, Star, Shield, Clock, CheckCircle, Heart,
  ArrowRight, Award, ChevronRight,
} from 'lucide-react';
import { mockCaregivers } from '../data/mockData';
import { CaregiverCard } from '../components/CaregiverCard';
import { HospitalPartnersSection } from '../components/HospitalPartnersSection';
import { PlatformStatsSection } from '../components/PlatformStatsSection';
import RotatingText from '../components/RotatingText';


const HERO_IMAGE = 'https://images.unsplash.com/photo-1623657935970-9d5e1ce1a037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';
const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1758691462482-2b6ccbaefa6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600';

const howItWorks = [
  {
    step: '01',
    title: 'Cari Pendamping',
    desc: 'Temukan pendamping pasien yang sesuai berdasarkan lokasi, jadwal, dan kebutuhan Anda melalui marketplace kami.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Pilih & Booking',
    desc: 'Lihat profil lengkap, baca ulasan, lalu lakukan pemesanan dengan mengisi informasi pasien dan jadwal.',
    icon: CheckCircle,
  },
  {
    step: '03',
    title: 'Bayar dengan Aman',
    desc: 'Proses pembayaran aman melalui QRIS, Virtual Account, E-Wallet, atau Kartu Kredit via Mayar.',
    icon: Shield,
  },
  {
    step: '04',
    title: 'Pendamping Hadir',
    desc: 'Pendamping profesional hadir tepat waktu di rumah sakit. Pantau kondisi pasien dari mana saja.',
    icon: Heart,
  },
];

const whyUs = [
  {
    icon: Shield,
    title: 'Terverifikasi & Terpercaya',
    desc: 'Semua pendamping telah melalui verifikasi identitas KTP, selfie, dan wawancara admin.',
  },
  {
    icon: Clock,
    title: 'Mudah & Cepat',
    desc: 'Proses booking hanya membutuhkan beberapa menit. Tersedia 24/7 untuk kebutuhan mendadak.',
  },
  {
    icon: Star,
    title: 'Ulasan Nyata',
    desc: 'Baca ulasan dari keluarga pasien yang pernah menggunakan jasa sebelumnya.',
  },
  {
    icon: Award,
    title: 'Jaminan Kualitas',
    desc: 'Kami berkomitmen pada standar pelayanan tertinggi. Tidak puas? Hubungi tim kami.',
  },
];

const testimonials = [
  {
    name: 'Ibu Ratna Sari',
    city: 'Jakarta',
    avatar: 'R',
    avatarColor: 'bg-purple-500',
    rating: 5,
    text: 'Saya tidak bisa tinggalkan kantor saat ibu dirawat. CareMe menghubungkan saya dengan Sari Dewi yang sangat profesional. Ibu saya merasa tidak sendirian. Luar biasa!',
  },
  {
    name: 'Bapak Hendra K.',
    city: 'Surabaya',
    avatar: 'H',
    avatarColor: 'bg-green-500',
    rating: 5,
    text: 'Ahmad Fauzi menemani ayah saya pasca operasi dengan sangat baik. Beliau selalu mengirim update kondisi setiap 2 jam. Sangat tenang rasanya meski jauh.',
  },
  {
    name: 'Ibu Dewi Anggi',
    city: 'Bandung',
    avatar: 'D',
    avatarColor: 'bg-orange-500',
    rating: 5,
    text: 'Pertama kali menggunakan CareMe dan langsung terkesan. Mudah booking, harga transparan, dan pendampingnya ramah sekali. Sudah pakai 3x dan akan terus pakai!',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="bg-white" style={{ borderBottom: '1px solid #F0F4F8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Left col: text & CTA ── */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#2E8BFF] rounded-full text-sm mb-7">
                <Heart className="w-3.5 h-3.5 fill-[#2E8BFF]" />
                <span>Platform Pendamping Pasien #1 di Indonesia</span>
              </div>

              {/* Animated heading */}
              <h1 className="text-gray-900 mb-6 leading-tight" style={{ fontWeight: 700 }}>
                {/* Static line */}
                <span
                  className="block"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
                >
                  Care
                </span>

                {/* Rotating line */}
                <span
                  className="flex items-center gap-3"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
                >
                  <RotatingText
                    texts={['Your Family', 'Your Love', 'Your Time', 'Your Energy']}
                    mainClassName="px-3 py-1 rounded-xl overflow-hidden text-white"
                    style={{ background: '#2E8BFF', display: 'inline-flex' }}
                    staggerFrom="last"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-120%' }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5"
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    rotationInterval={2200}
                    splitBy="characters"
                  />
                </span>
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
                CareMe menghubungkan keluarga yang sibuk dengan pendamping pasien profesional dan terverifikasi. Pastikan orang tersayang tidak sendirian di rumah sakit.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ background: '#2E8BFF' }}
                >
                  Cari Pendamping
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/auth/signup')}
                  className="px-6 py-3 rounded-xl text-gray-700 font-medium border border-gray-200 hover:border-gray-300 bg-white transition-colors flex items-center justify-center gap-2"
                >
                  Daftar sebagai Pendamping
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Right col: image ── */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="Pendamping pasien"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating booking card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Booking Berhasil!</p>
                    <p className="text-[10px] text-gray-500">2 menit yang lalu</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Sari Dewi akan hadir besok pukul 09:00</p>
              </div>

              {/* Floating rating card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-xs text-gray-600">4.8 dari 4.500+ ulasan</p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Hospital Partners — scroll-velocity marquee */}
      <HospitalPartnersSection />

      {/* Platform Statistics — animated CountUp */}
      <PlatformStatsSection />

      {/* How It Works */}
      <section id="cara-kerja" className="py-16 lg:py-24" style={{ background: '#F7F9FC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-3" style={{ fontSize: '2rem', fontWeight: 700 }}>
              Cara Kerja CareMe
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Proses mudah dalam 4 langkah untuk mendapatkan pendamping pasien terpercaya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold text-blue-50" style={{ lineHeight: 1 }}>{item.step}</span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EBF4FF' }}>
                      <item.icon className="w-5 h-5" style={{ color: '#2E8BFF' }} />
                    </div>
                  </div>
                  <h3 className="text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {idx < howItWorks.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 w-6 h-6 items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-[#2E8BFF]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Caregivers */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
                Pendamping Unggulan
              </h2>
              <p className="text-gray-500">Pendamping terverifikasi dengan rating terbaik</p>
            </div>
            <Link
              to="/marketplace"
              className="hidden sm:flex items-center gap-1 text-sm text-[#2E8BFF] font-medium hover:underline"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCaregivers.slice(0, 4).map((caregiver) => (
              <CaregiverCard key={caregiver.id} caregiver={caregiver} />
            ))}
          </div>

          <div className="sm:hidden text-center mt-6">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-sm text-[#2E8BFF] font-medium"
            >
              Lihat Semua Pendamping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why CareMe */}
      <section className="py-16 lg:py-24" style={{ background: '#F7F9FC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-gray-900 mb-4" style={{ fontSize: '2rem', fontWeight: 700 }}>
                Mengapa Memilih CareMe?
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Kami memahami betapa pentingnya menemani orang tersayang di saat mereka membutuhkan. CareMe hadir sebagai solusi terpercaya untuk keluarga Indonesia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {whyUs.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EBF4FF' }}>
                      <item.icon className="w-5 h-5" style={{ color: '#2E8BFF' }} />
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img src={ABOUT_IMAGE} alt="Family care" className="w-full h-[400px] object-cover" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2E8BFF] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">100% Terverifikasi</p>
                    <p className="text-xs text-gray-500">Semua pendamping telah melewati proses verifikasi ketat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-3" style={{ fontSize: '2rem', fontWeight: 700 }}>
              Kata Mereka tentang CareMe
            </h2>
            <p className="text-gray-500 text-lg">Ribuan keluarga sudah mempercayakan CareMe untuk orang tersayang</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm ${t.avatarColor}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16" style={{ background: '#2E8BFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-3" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Siap Menjaga Orang Tersayang?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan keluarga Indonesia yang telah mempercayai CareMe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-3 bg-white text-[#2E8BFF] rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              Cari Pendamping Sekarang
            </button>
            <button
              onClick={() => navigate('/auth/signup')}
              className="px-8 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors border border-white/30"
            >
              Daftar sebagai Pendamping
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
