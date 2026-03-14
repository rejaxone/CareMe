import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Briefcase, Calendar, MapPin, Shield, FileText,
  CheckCircle, ArrowLeft, ArrowRight, Upload, Plus, X
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Data Diri', icon: User },
  { id: 2, label: 'Profesional', icon: Briefcase },
  { id: 3, label: 'Jadwal & Tarif', icon: Calendar },
  { id: 4, label: 'Area Layanan', icon: MapPin },
  { id: 5, label: 'Verifikasi', icon: Shield },
  { id: 6, label: 'Pernyataan', icon: FileText },
];

const ALL_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SKILLS_OPTIONS = [
  'Membantu makan & minum', 'Menemani ngobrol', 'Membantu mobilitas',
  'Perawatan luka ringan', 'Monitoring kondisi', 'First Aid bersertifikat',
  'Pendampingan lansia', 'Pendampingan anak', 'Manajemen obat', 'Terapi fisik ringan'
];
const PERSONALITY_OPTIONS = ['Ramah', 'Sabar', 'Teliti', 'Komunikatif', 'Empati', 'Tenang', 'Sigap', 'Profesional', 'Energik', 'Penyayang'];

interface FormData {
  profilePhoto: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  ktpNumber: string;
  bio: string;
  experience: string;
  skills: string[];
  languages: string;
  personality: string[];
  hourlyRate: string;
  maxHours: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  serviceCity: string;
  hospitalPreferences: string;
  maxDistance: string;
  bankAccount: string;
  emergencyContact: string;
  agreeStatement: boolean;
  agreeTerms: boolean;
  signature: string;
}

export function CaregiverRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    profilePhoto: '',
    gender: '',
    dob: '',
    address: '',
    city: '',
    ktpNumber: '',
    bio: '',
    experience: '',
    skills: [],
    languages: '',
    personality: [],
    hourlyRate: '',
    maxHours: '8',
    availableDays: [],
    startTime: '08:00',
    endTime: '17:00',
    serviceCity: '',
    hospitalPreferences: '',
    maxDistance: '20',
    bankAccount: '',
    emergencyContact: '',
    agreeStatement: false,
    agreeTerms: false,
    signature: '',
  });

  const update = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const togglePersonality = (trait: string) => {
    setForm(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(p => p !== trait)
        : [...prev.personality, trait],
    }));
  };

  const toggleDay = (day: string) => {
    setForm(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: '#F7F9FC' }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-gray-900 text-xl font-semibold mb-2">Pendaftaran Dikirim!</h2>
          <p className="text-gray-500 text-sm mb-4">
            Data pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi oleh tim CareMe.
          </p>
          <div className="space-y-2 text-left mb-6">
            {[
              { label: 'Status', value: 'Pending Verification', color: 'text-yellow-600' },
              { label: 'Estimasi', value: '1-3 hari kerja', color: 'text-gray-900' },
              { label: 'Notifikasi', value: 'Email & WhatsApp', color: 'text-gray-900' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className={`font-medium ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/dashboard/caregiver')}
            className="w-full py-3 rounded-xl font-medium text-white hover:opacity-90"
            style={{ background: '#2E8BFF' }}
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F7F9FC' }} className="min-h-screen pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-xl font-semibold mb-1">Pendaftaran Penyedia Jasa</h1>
          <p className="text-gray-500 text-sm">Lengkapi profil Anda untuk mulai menerima booking</p>
        </div>

        {/* Steps */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-0 justify-center">
            {STEPS.map((s, i) => {
              const isDone = step > s.id;
              const isActive = step === s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isDone ? 'bg-green-500' : isActive ? '' : 'bg-gray-200'
                    }`} style={isActive ? { background: '#2E8BFF' } : {}}>
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <s.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`text-[10px] mt-1 whitespace-nowrap ${isActive ? 'text-[#2E8BFF] font-medium' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-10 h-0.5 mx-1 mb-4 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Step 1: Personal Data */}
          {step === 1 && (
            <div>
              <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-[#2E8BFF]" />
                Data Diri
              </h3>

              {/* Photo Upload */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                  {form.profilePhoto ? (
                    <img src={form.profilePhoto} alt="" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Foto Profil</p>
                  <button className="text-xs text-[#2E8BFF] border border-[#2E8BFF] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                    Upload Foto
                  </button>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG. Maks 2MB</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    {['Perempuan', 'Laki-laki'].map((g) => (
                      <button
                        key={g}
                        onClick={() => update('gender', g)}
                        className={`flex-1 py-2.5 border rounded-xl text-sm transition-colors ${
                          form.gender === g ? 'border-[#2E8BFF] bg-blue-50 text-[#2E8BFF]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Lahir <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => update('dob', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Lengkap <span className="text-red-500">*</span></label>
                  <textarea
                    rows={2}
                    placeholder="Alamat lengkap sesuai KTP"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kota Domisili <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor KTP <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="16 digit nomor KTP"
                    value={form.ktpNumber}
                    onChange={(e) => update('ktpNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                    maxLength={16}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Foto KTP <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#2E8BFF] transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk upload foto KTP</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG. Maks 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional */}
          {step === 2 && (
            <div>
              <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#2E8BFF]" />
                Informasi Profesional
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Diri <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    placeholder="Ceritakan tentang diri Anda, latar belakang, dan motivasi menjadi pendamping pasien..."
                    value={form.bio}
                    onChange={(e) => update('bio', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pengalaman <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    placeholder="Ceritakan pengalaman Anda dalam merawat atau mendampingi pasien..."
                    value={form.experience}
                    onChange={(e) => update('experience', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keahlian <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          form.skills.includes(skill)
                            ? 'bg-[#2E8BFF] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bahasa yang Dikuasai</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bahasa Indonesia, Bahasa Jawa, Bahasa Inggris"
                    value={form.languages}
                    onChange={(e) => update('languages', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kepribadian</label>
                  <div className="flex flex-wrap gap-2">
                    {PERSONALITY_OPTIONS.map((trait) => (
                      <button
                        key={trait}
                        onClick={() => togglePersonality(trait)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          form.personality.includes(trait)
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {trait}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Rate */}
          {step === 3 && (
            <div>
              <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2E8BFF]" />
                Jadwal & Tarif
              </h3>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarif per Jam (IDR) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      placeholder="Contoh: 75000"
                      value={form.hourlyRate}
                      onChange={(e) => update('hourlyRate', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Maks Jam/Hari</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={form.maxHours}
                      onChange={(e) => update('maxHours', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hari Tersedia <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          form.availableDays.includes(day)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={form.availableDays.includes(day) ? { background: '#2E8BFF' } : {}}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Jam Mulai</label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => update('startTime', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Jam Selesai</label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => update('endTime', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Service Area */}
          {step === 4 && (
            <div>
              <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2E8BFF]" />
                Area Layanan
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kota Layanan <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Kota di mana Anda bersedia memberikan layanan"
                    value={form.serviceCity}
                    onChange={(e) => update('serviceCity', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferensi Rumah Sakit (Opsional)</label>
                  <textarea
                    rows={3}
                    placeholder="Sebutkan rumah sakit pilihan jika ada (pisahkan dengan koma)"
                    value={form.hospitalPreferences}
                    onChange={(e) => update('hospitalPreferences', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Jarak Maksimal Layanan: <span className="text-[#2E8BFF]">{form.maxDistance} km</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={form.maxDistance}
                    onChange={(e) => update('maxDistance', e.target.value)}
                    className="w-full accent-[#2E8BFF]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>5 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Identity Verification */}
          {step === 5 && (
            <div>
              <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2E8BFF]" />
                Verifikasi Identitas
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Selfie dengan KTP <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#2E8BFF] transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload foto selfie sambil memegang KTP</p>
                    <p className="text-xs text-gray-400 mt-1">Wajah dan teks KTP harus terlihat jelas</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Rekening Bank <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: BCA - 1234567890 - Nama Lengkap"
                    value={form.bankAccount}
                    onChange={(e) => update('bankAccount', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                  <p className="text-xs text-gray-400 mt-1">Rekening untuk menerima pembayaran dari platform</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kontak Darurat <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: 08123456789 - Budi (Kakak)"
                    value={form.emergencyContact}
                    onChange={(e) => update('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Statement & Terms */}
          {step === 6 && (
            <div>
              <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2E8BFF]" />
                Surat Pernyataan
              </h3>

              {/* Statement Letter */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-5">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-gray-900">SURAT PERNYATAAN PENYEDIA JASA</p>
                  <p className="text-xs text-gray-500 mt-1">Platform CareMe</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed text-justify">
                  Saya menyatakan bahwa semua data yang saya berikan adalah benar dan dapat dipertanggungjawabkan.
                  Saya bersedia menjalankan tugas sebagai pendamping pasien dengan penuh tanggung jawab, menjaga
                  etika, tidak melakukan tindakan melanggar hukum, serta menjaga privasi pasien dan keluarga pasien.
                  Saya memahami bahwa pelanggaran terhadap pernyataan ini dapat mengakibatkan pembekuan atau
                  penghapusan akun saya dari platform CareMe.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tanda Tangan Digital <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik nama lengkap Anda sebagai tanda tangan digital"
                    value={form.signature}
                    onChange={(e) => update('signature', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.agreeStatement}
                    onChange={(e) => update('agreeStatement', e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#2E8BFF] focus:ring-[#2E8BFF]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Saya menyetujui dan berkomitmen untuk mematuhi seluruh isi surat pernyataan di atas.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => update('agreeTerms', e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#2E8BFF] focus:ring-[#2E8BFF]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Saya menyetujui{' '}
                    <a href="#" className="text-[#2E8BFF] hover:underline">Syarat & Ketentuan</a> dan{' '}
                    <a href="#" className="text-[#2E8BFF] hover:underline">Kode Etik Penyedia Jasa</a> platform CareMe.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? 'Batal' : 'Sebelumnya'}
            </button>

            {step < 6 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-5 py-2 text-sm text-white rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: '#2E8BFF' }}
              >
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.agreeStatement || !form.agreeTerms || !form.signature || isSubmitting}
                className={`flex items-center gap-2 px-5 py-2 text-sm text-white rounded-xl transition-opacity ${
                  form.agreeStatement && form.agreeTerms && form.signature && !isSubmitting
                    ? 'hover:opacity-90'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ background: '#2E8BFF' }}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                {!isSubmitting && <CheckCircle className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Langkah {step} dari {STEPS.length}</span>
            <span>{Math.round((step / STEPS.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / STEPS.length) * 100}%`, background: '#2E8BFF' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
