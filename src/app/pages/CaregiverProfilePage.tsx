import { useParams, useNavigate } from 'react-router';
import {
  MapPin, Clock, Star, CheckCircle, Calendar,
  Languages, Award, Heart, ArrowLeft, Shield, ChevronRight
} from 'lucide-react';
import { mockCaregivers, formatIDR } from '../data/mockData';
import { RatingStars } from '../components/RatingStars';
import { useAuth } from '../context/AuthContext';

const DAY_ABBR: Record<string, string> = {
  'Senin': 'Sen', 'Selasa': 'Sel', 'Rabu': 'Rab', 'Kamis': 'Kam',
  'Jumat': 'Jum', 'Sabtu': 'Sab', 'Minggu': 'Min',
};

const ALL_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function CaregiverProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const caregiver = mockCaregivers.find((c) => c.id === id);

  if (!caregiver) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FC' }}>
        <div className="text-center">
          <h2 className="text-gray-900 mb-2">Pendamping tidak ditemukan</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-[#2E8BFF] text-sm hover:underline"
          >
            Kembali ke Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    if (!user) {
      navigate('/auth/signin');
    } else if (user.role === 'caregiver') {
      alert('Anda terdaftar sebagai penyedia jasa. Silakan login sebagai pelanggan untuk melakukan booking.');
    } else {
      navigate(`/booking/${caregiver.id}`);
    }
  };

  return (
    <div style={{ background: '#F7F9FC' }} className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-56 sm:h-72">
                <img
                  src={caregiver.photo}
                  alt={caregiver.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h1 className="text-white text-xl font-semibold">{caregiver.name}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          caregiver.gender === 'Perempuan' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {caregiver.gender}
                        </span>
                        <span className="text-white text-sm">{caregiver.age} tahun</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      caregiver.availabilityStatus === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        caregiver.availabilityStatus === 'available' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {caregiver.availabilityStatus === 'available' ? 'Tersedia' : 'Sedang Sibuk'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-900">{caregiver.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{caregiver.reviewCount} ulasan</p>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <div className="font-semibold text-gray-900 mb-1">{caregiver.completedJobs}</div>
                    <p className="text-xs text-gray-500">Pekerjaan selesai</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-1">{caregiver.experience.split(' ')[0]}</div>
                    <p className="text-xs text-gray-500">tahun pengalaman</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-[#2E8BFF]" />
                  <span>{caregiver.city}</span>
                  <span className="text-gray-300">•</span>
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 text-xs">Identitas Terverifikasi</span>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm leading-relaxed">{caregiver.bio}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2E8BFF]" />
                Keahlian
              </h3>
              <div className="flex flex-wrap gap-2">
                {caregiver.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-[#2E8BFF] rounded-lg text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Personality & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#2E8BFF]" />
                  Kepribadian
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caregiver.personality.map((p) => (
                    <span key={p} className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-sm">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-[#2E8BFF]" />
                  Bahasa
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caregiver.languages.map((lang) => (
                    <span key={lang} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2E8BFF]" />
                Jadwal Ketersediaan
              </h3>
              <div className="flex gap-2 flex-wrap mb-3">
                {ALL_DAYS.map((day) => {
                  const isAvailable = caregiver.availability.days.includes(day);
                  return (
                    <div
                      key={day}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${
                        isAvailable
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {DAY_ABBR[day]}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-[#2E8BFF]" />
                <span>{caregiver.availability.startTime} – {caregiver.availability.endTime}</span>
                <span className="text-gray-400">•</span>
                <span>Maks {caregiver.maxHoursPerDay} jam/hari</span>
              </div>
            </div>

            {/* Service Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2E8BFF]" />
                Area Layanan
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Kota</span>
                  <span className="text-gray-900 font-medium">{caregiver.serviceArea.city}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jarak maksimal</span>
                  <span className="text-gray-900 font-medium">{caregiver.serviceArea.maxDistance} km</span>
                </div>
                {caregiver.serviceArea.hospitalPreferences.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">RS Pilihan:</p>
                    <ul className="space-y-1">
                      {caregiver.serviceArea.hospitalPreferences.map((h) => (
                        <li key={h} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  Ulasan ({caregiver.reviewCount})
                </h3>
                <div className="flex items-center gap-2">
                  <RatingStars rating={caregiver.rating} size="sm" showNumber reviewCount={caregiver.reviewCount} />
                </div>
              </div>

              <div className="space-y-4">
                {caregiver.reviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.customerPhoto}
                        alt={review.customerName}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 text-sm">{review.customerName}</span>
                          <span className="text-xs text-gray-400">{review.createdAt}</span>
                        </div>
                        <RatingStars rating={review.rating} size="sm" />
                        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{review.reviewText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card (sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <div className="text-center mb-5 pb-5 border-b border-gray-100">
                <div className="text-3xl font-bold text-[#2E8BFF] mb-1">{formatIDR(caregiver.hourlyRate)}</div>
                <p className="text-gray-500 text-sm">per jam</p>
              </div>

              {/* Quick info */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Maks jam/hari</span>
                  <span className="text-gray-900 font-medium">{caregiver.maxHoursPerDay} jam</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Kota layanan</span>
                  <span className="text-gray-900 font-medium">{caregiver.serviceArea.city}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Respons biasanya</span>
                  <span className="text-gray-900 font-medium">&lt; 2 jam</span>
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={caregiver.availabilityStatus === 'busy'}
                className={`w-full py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                  caregiver.availabilityStatus === 'available'
                    ? 'hover:opacity-90'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ background: caregiver.availabilityStatus === 'available' ? '#2E8BFF' : '#9CA3AF' }}
              >
                {caregiver.availabilityStatus === 'available' ? 'Book Sekarang' : 'Sedang Tidak Tersedia'}
                {caregiver.availabilityStatus === 'available' && <ChevronRight className="w-4 h-4" />}
              </button>

              {caregiver.availabilityStatus === 'available' && !user && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  Anda perlu masuk untuk melakukan booking
                </p>
              )}

              <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-700">
                  Pendamping ini telah terverifikasi identitasnya oleh tim CareMe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
