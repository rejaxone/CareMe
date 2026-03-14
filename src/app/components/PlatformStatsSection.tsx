import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Users, Building2, HeartHandshake, ThumbsUp, MapPin, Star } from 'lucide-react';

/* ─── CountUp hook ──────────────────────────────────────────── */
function useCountUp(end: number, durationMs: number, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let rafId: number;
    let startTime: number | null = null;

    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutExpo for snappy feel
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [trigger, end, durationMs]);

  return count;
}

/* ─── stat item types ───────────────────────────────────────── */
interface StatConfig {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  duration: number;
  separator?: boolean; // show thousands separator
}

const STATS: StatConfig[] = [
  {
    value: 327,
    suffix: '+',
    label: 'Pendamping Terverifikasi',
    sublabel: 'Siap melayani di seluruh Indonesia',
    icon: Users,
    duration: 2000,
  },
  {
    value: 52,
    suffix: '+',
    label: 'Rumah Sakit Mitra',
    sublabel: 'RS swasta & pemerintah terkemuka',
    icon: Building2,
    duration: 1600,
  },
  {
    value: 4521,
    suffix: '+',
    label: 'Layanan Selesai',
    sublabel: 'Pendampingan berhasil diselesaikan',
    icon: HeartHandshake,
    duration: 2200,
    separator: true,
  },
  {
    value: 98,
    suffix: '%',
    label: 'Kepuasan Pengguna',
    sublabel: 'Berdasarkan ulasan terverifikasi',
    icon: ThumbsUp,
    duration: 1800,
  },
  {
    value: 35,
    suffix: '+',
    label: 'Kota Terlayani',
    sublabel: 'Dari Sabang sampai Merauke',
    icon: MapPin,
    duration: 1400,
  },
  {
    value: 4.9,
    suffix: '',
    prefix: '',
    label: 'Rating Rata-Rata',
    sublabel: 'Dari lebih dari 9.000 ulasan',
    icon: Star,
    duration: 2000,
  },
];

/* ─── single animated stat card ────────────────────────────── */
function StatCard({
  stat,
  index,
  triggered,
}: {
  stat: StatConfig;
  index: number;
  triggered: boolean;
}) {
  // For the 4.9 rating, we handle it as a special float case
  const isFloat = !Number.isInteger(stat.value);
  const intValue = isFloat ? Math.floor(stat.value * 10) : stat.value; // treat 4.9 as 49 internally
  const rawCount = useCountUp(isFloat ? intValue : stat.value, stat.duration, triggered);
  const displayValue = isFloat
    ? (rawCount / 10).toFixed(1)
    : stat.separator
    ? rawCount.toLocaleString('id-ID')
    : rawCount.toString();

  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center text-center px-6 py-8 group"
    >
      {/* icon bubble */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* number */}
      <div className="flex items-end justify-center gap-0.5 mb-2">
        {stat.prefix && (
          <span className="text-white/80 mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {stat.prefix}
          </span>
        )}
        <span
          className="text-white tabular-nums"
          style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          {displayValue}
        </span>
        {stat.suffix && (
          <span className="text-blue-200 mb-0.5" style={{ fontSize: '2rem', fontWeight: 700 }}>
            {stat.suffix}
          </span>
        )}
      </div>

      {/* label */}
      <p className="text-white mb-1" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
        {stat.label}
      </p>
      <p className="text-blue-200" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
        {stat.sublabel}
      </p>
    </motion.div>
  );
}

/* ─── main section ──────────────────────────────────────────── */
export function PlatformStatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20"
      style={{
        background: 'linear-gradient(135deg, #1353a4 0%, #2E8BFF 55%, #38bdf8 100%)',
      }}
    >
      {/* ── decorative background shapes ── */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />
      {/* subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse" />
            <span className="text-blue-100 text-sm">Terus Berkembang Setiap Harinya</span>
          </div>

          <h2
            className="text-white mb-3"
            style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2 }}
          >
            CareMe Dalam Angka
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto" style={{ fontSize: '1.05rem', lineHeight: 1.65 }}>
            Platform yang terus berkembang untuk membantu keluarga merawat orang tercinta
            di seluruh penjuru Indonesia.
          </p>
        </motion.div>

        {/* stats grid — 3 cols on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {STATS.map((stat, idx) => {
            const isLastRow = idx >= 3; // second row
            const isLastInRow3 = idx === 2;
            const isLastInRow6 = idx === 5;
            const isRightEdge = (idx + 1) % 3 === 0;
            const isBottomEdge = idx >= 3;

            return (
              <div
                key={stat.label}
                className="relative"
                style={{
                  borderRight:
                    !isRightEdge
                      ? '1px solid rgba(255,255,255,0.12)'
                      : undefined,
                  borderBottom: !isBottomEdge
                    ? '1px solid rgba(255,255,255,0.12)'
                    : undefined,
                }}
              >
                <StatCard stat={stat} index={idx} triggered={isInView} />
              </div>
            );
          })}
        </div>

        {/* bottom trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { icon: '🔒', text: 'Semua data terenkripsi & aman' },
            { icon: '✅', text: 'Verifikasi KTP & sertifikat resmi' },
            { icon: '⚡', text: 'Respons booking rata-rata < 15 menit' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2.5">
              <span className="text-lg">{item.icon}</span>
              <span className="text-blue-100 text-sm">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
