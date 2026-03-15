import { ScrollVelocity } from './ScrollVelocity';

const HOSPITALS = [
  'SILOAM HOSPITAL',
  'RS HARAPAN ANDA',
  'RS HARAPAN BUNDA',
  'KLINIK MEDIKA',
  'RS MITRA KELUARGA',
  'RS MAYAPADA',
  'RS PREMIER',
  'RS MEDISTRA',
  'RS OMNI',
  'RS HERMINA',
];

export function HospitalPartnersSection() {
  return (
    <section
      className="w-full py-20"
      style={{
        background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 50%, #f7f9fc 100%)',
      }}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm font-medium"
          style={{ background: '#EBF4FF', color: '#2E8BFF' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          Jaringan Rumah Sakit Terpercaya
        </div>

        <h2
          className="text-gray-900 mb-3"
          style={{ fontSize: '2rem', fontWeight: 700 }}
        >
          Dipercaya Oleh Rumah Sakit Ternama
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Platform pendamping pasien yang siap membantu keluarga Anda di berbagai
          rumah sakit terpercaya di seluruh Indonesia
        </p>
      </div>

      {/* Velocity scroller — fade edges with mask */}
      <div
        className="relative w-full"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <ScrollVelocity
          texts={HOSPITALS}
          velocity={100}
          damping={50}
          stiffness={400}
          velocityMapping={{ input: [0, 1000], output: [0, 5] }}
          doubleRow={true}
        />
      </div>

      {/* Bottom trust badges */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { label: '120+ Rumah Sakit', icon: '🏥' },
            { label: '45 Kota di Indonesia', icon: '📍' },
            { label: 'Operasional 24/7', icon: '🕐' },
            { label: 'Terverifikasi Resmi', icon: '✅' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm text-gray-600"
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}