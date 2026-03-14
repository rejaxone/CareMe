import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, ArrowRight, CheckCircle, Calendar,
  Clock, MapPin, User, Phone, FileText, AlertCircle,
  CreditCard, ExternalLink, Loader2
} from 'lucide-react';
import { mockCaregivers, formatIDR } from '../data/mockData';
import { RatingStars } from '../components/RatingStars';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';

interface BookingForm {
  bookingDate: string;
  startTime: string;
  endTime: string;
  patientName: string;
  hospitalName: string;
  hospitalAddress: string;
  roomNumber: string;
  purpose: string;
  specialNotes: string;
  emergencyContact: string;
}

const STEP_LABELS = ['Pilih Waktu', 'Info Pasien', 'Konfirmasi'];

export function BookingPage() {
  const { caregiverId } = useParams<{ caregiverId: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [step, setStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  const caregiver = mockCaregivers.find((c) => c.id === caregiverId);

  const [form, setForm] = useState<BookingForm>({
    bookingDate: '',
    startTime: '09:00',
    endTime: '17:00',
    patientName: '',
    hospitalName: '',
    hospitalAddress: '',
    roomNumber: '',
    purpose: '',
    specialNotes: '',
    emergencyContact: '',
  });

  if (!caregiver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Pendamping tidak ditemukan</p>
      </div>
    );
  }

  if (!user) {
    navigate('/auth/signin');
    return null;
  }

  const calcTotalHours = () => {
    if (!form.startTime || !form.endTime) return 0;
    const [sh, sm] = form.startTime.split(':').map(Number);
    const [eh, em] = form.endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return Math.max(0, diff / 60);
  };

  const totalHours = calcTotalHours();
  const totalPrice = totalHours * caregiver.hourlyRate;

  const update = (field: keyof BookingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError('');
  };

  const validateStep1 = () => {
    const newErrors: Partial<BookingForm> = {};
    if (!form.bookingDate) newErrors.bookingDate = 'Tanggal wajib diisi';
    if (!form.startTime) newErrors.startTime = 'Jam mulai wajib diisi';
    if (!form.endTime) newErrors.endTime = 'Jam selesai wajib diisi';
    if (totalHours <= 0) newErrors.endTime = 'Jam selesai harus setelah jam mulai';
    if (totalHours > caregiver.maxHoursPerDay) newErrors.endTime = `Maksimal ${caregiver.maxHoursPerDay} jam/hari`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<BookingForm> = {};
    if (!form.patientName) newErrors.patientName = 'Nama pasien wajib diisi';
    if (!form.hospitalName) newErrors.hospitalName = 'Nama rumah sakit wajib diisi';
    if (!form.hospitalAddress) newErrors.hospitalAddress = 'Alamat rumah sakit wajib diisi';
    if (!form.purpose) newErrors.purpose = 'Tujuan pendampingan wajib diisi';
    if (!form.emergencyContact) newErrors.emergencyContact = 'Kontak darurat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep(step + 1);
  };

  // ── Submit booking to backend ─────────────────────────────────────────────
  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const authHeader = accessToken || publicAnonKey;

      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authHeader}`,
        },
        body: JSON.stringify({
          caregiverId: caregiver.id,
          caregiverName: caregiver.name,
          caregiverPhoto: caregiver.photo,
          bookingDate: form.bookingDate,
          startTime: form.startTime,
          endTime: form.endTime,
          totalHours,
          totalPrice,
          patientName: form.patientName,
          hospitalName: form.hospitalName,
          hospitalAddress: form.hospitalAddress,
          roomNumber: form.roomNumber,
          purpose: form.purpose,
          specialNotes: form.specialNotes,
          emergencyContact: form.emergencyContact,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log('[CareMe Booking] Create booking error:', data);
        setSubmitError(data.error || 'Gagal membuat booking. Coba lagi.');
        setIsSubmitting(false);
        return;
      }

      console.log('[CareMe Booking] Booking created:', data.booking.id);
      setCreatedBooking(data.booking);
      setBookingSuccess(true);
    } catch (err) {
      console.log('[CareMe Booking] Network error:', err);
      setSubmitError(`Network error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Create payment and redirect ───────────────────────────────────────────
  const handlePayNow = async () => {
    if (!createdBooking) return;
    setIsCreatingPayment(true);
    setSubmitError('');

    try {
      const authHeader = accessToken || publicAnonKey;

      const res = await fetch(`${API_BASE}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authHeader}`,
        },
        body: JSON.stringify({ bookingId: createdBooking.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log('[CareMe Payment] Create payment error:', data);
        setSubmitError(data.error || 'Gagal membuat link pembayaran.');
        setIsCreatingPayment(false);
        return;
      }

      console.log('[CareMe Payment] Payment link:', data.paymentUrl);

      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      }
    } catch (err) {
      console.log('[CareMe Payment] Network error:', err);
      setSubmitError(`Network error: ${err}`);
    } finally {
      setIsCreatingPayment(false);
    }
  };

  // ── Booking success screen ────────────────────────────────────────────────
  if (bookingSuccess && createdBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FC' }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-gray-900 text-xl font-semibold mb-2">Booking Berhasil Dibuat!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Permintaan booking Anda telah dikirim ke <strong>{caregiver.name}</strong>. Silakan lanjutkan pembayaran.
          </p>
          <div className="bg-blue-50 rounded-xl p-3 mb-4 text-left">
            <p className="text-sm text-[#2E8BFF] font-medium mb-1">
              Nomor Booking: {createdBooking.id}
            </p>
            <p className="text-xs text-gray-500">Status: Menunggu Pembayaran</p>
          </div>

          {/* Price summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Tanggal</span>
              <span className="text-gray-900">{createdBooking.bookingDate}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Waktu</span>
              <span className="text-gray-900">{createdBooking.startTime} - {createdBooking.endTime}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Pasien</span>
              <span className="text-gray-900">{createdBooking.patientName}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Rumah Sakit</span>
              <span className="text-gray-900">{createdBooking.hospitalName}</span>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
              <span className="text-gray-900 text-sm">Total Bayar</span>
              <span className="text-sm" style={{ color: '#2E8BFF' }}>{formatIDR(createdBooking.totalPrice)}</span>
            </div>
          </div>

          {submitError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handlePayNow}
              disabled={isCreatingPayment}
              className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              style={{ background: '#2E8BFF' }}
            >
              {isCreatingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Membuat Link Pembayaran...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Bayar Sekarang via Mayar
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/dashboard/customer')}
              className="w-full py-3 rounded-xl font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Lihat di Dashboard
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Pembayaran diproses melalui Mayar Payment Gateway. Status akan otomatis diperbarui setelah pembayaran berhasil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F7F9FC' }} className="min-h-screen pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <h1 className="text-gray-900 text-xl font-semibold mb-6">Buat Booking</h1>

        {/* Steps Indicator */}
        <div className="flex items-center mb-8">
          {STEP_LABELS.map((label, i) => {
            const num = i + 1;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isDone ? 'bg-green-500 text-white' :
                    isActive ? 'text-white' : 'bg-gray-200 text-gray-500'
                  }`} style={isActive ? { background: '#2E8BFF' } : {}}>
                    {isDone ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  <span className={`text-sm hidden sm:block ${isActive ? 'text-[#2E8BFF] font-medium' : 'text-gray-500'}`}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-[#2E8BFF] transition-all"
                      style={{ width: step > num ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div>
                  <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2E8BFF]" />
                    Pilih Tanggal & Waktu
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tanggal Booking <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.bookingDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => update('bookingDate', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${
                          errors.bookingDate ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      {errors.bookingDate && <p className="text-xs text-red-500 mt-1">{errors.bookingDate}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Jam Mulai <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={form.startTime}
                          onChange={(e) => update('startTime', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Jam Selesai <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={form.endTime}
                          onChange={(e) => update('endTime', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${
                            errors.endTime ? 'border-red-300' : 'border-gray-200'
                          }`}
                        />
                        {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>}
                      </div>
                    </div>

                    {totalHours > 0 && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#2E8BFF]" />
                          <span className="text-sm text-[#2E8BFF] font-medium">
                            Total: {totalHours} jam = {formatIDR(totalPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          {formatIDR(caregiver.hourlyRate)}/jam x {totalHours} jam
                        </p>
                      </div>
                    )}

                    {/* Available Days info */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1.5">Hari tersedia:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {caregiver.availability.days.map((d) => (
                          <span key={d} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs">{d}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        Jam kerja: {caregiver.availability.startTime} - {caregiver.availability.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Patient Info */}
              {step === 2 && (
                <div>
                  <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#2E8BFF]" />
                    Informasi Pasien
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Pasien <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nama lengkap pasien"
                        value={form.patientName}
                        onChange={(e) => update('patientName', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${
                          errors.patientName ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      {errors.patientName && <p className="text-xs text-red-500 mt-1">{errors.patientName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Rumah Sakit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: RS Siloam Semanggi"
                        value={form.hospitalName}
                        onChange={(e) => update('hospitalName', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${
                          errors.hospitalName ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      {errors.hospitalName && <p className="text-xs text-red-500 mt-1">{errors.hospitalName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Alamat Rumah Sakit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Alamat lengkap RS"
                        value={form.hospitalAddress}
                        onChange={(e) => update('hospitalAddress', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${
                          errors.hospitalAddress ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      {errors.hospitalAddress && <p className="text-xs text-red-500 mt-1">{errors.hospitalAddress}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Kamar</label>
                      <input
                        type="text"
                        placeholder="Contoh: A-205"
                        value={form.roomNumber}
                        onChange={(e) => update('roomNumber', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tujuan Pendampingan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Jelaskan kondisi pasien dan kebutuhan pendampingan"
                        value={form.purpose}
                        onChange={(e) => update('purpose', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] resize-none ${
                          errors.purpose ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Instruksi Khusus</label>
                      <textarea
                        rows={2}
                        placeholder="Pantangan, alergi, atau hal khusus yang perlu diperhatikan"
                        value={form.specialNotes}
                        onChange={(e) => update('specialNotes', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Kontak Darurat Keluarga <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 08123456789 - Budi (Anak)"
                        value={form.emergencyContact}
                        onChange={(e) => update('emergencyContact', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${
                          errors.emergencyContact ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      {errors.emergencyContact && <p className="text-xs text-red-500 mt-1">{errors.emergencyContact}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div>
                  <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#2E8BFF]" />
                    Review Booking
                  </h3>

                  <div className="space-y-4">
                    {/* Caregiver info */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <img src={caregiver.photo} alt={caregiver.name} className="w-12 h-12 rounded-full object-cover object-top" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{caregiver.name}</p>
                        <RatingStars rating={caregiver.rating} size="sm" showNumber reviewCount={caregiver.reviewCount} />
                      </div>
                    </div>

                    {/* Booking summary */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2.5">
                        <p className="text-sm font-medium text-gray-700">Ringkasan Booking</p>
                      </div>
                      <div className="p-4 space-y-3">
                        {[
                          { label: 'Tanggal', value: form.bookingDate, icon: Calendar },
                          { label: 'Waktu', value: `${form.startTime} - ${form.endTime}`, icon: Clock },
                          { label: 'Total Jam', value: `${totalHours} jam`, icon: Clock },
                          { label: 'Nama Pasien', value: form.patientName, icon: User },
                          { label: 'Rumah Sakit', value: form.hospitalName, icon: MapPin },
                          { label: 'Kamar', value: form.roomNumber || '-', icon: MapPin },
                          { label: 'Kontak Darurat', value: form.emergencyContact, icon: Phone },
                        ].map(({ label, value, icon: Icon }) => (
                          <div key={label} className="flex items-start gap-2 text-sm">
                            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
                            <span className="text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2.5">
                        <p className="text-sm font-medium text-gray-700">Rincian Harga</p>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{formatIDR(caregiver.hourlyRate)} x {totalHours} jam</span>
                          <span className="text-gray-900">{formatIDR(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Biaya layanan platform</span>
                          <span className="text-gray-900">{formatIDR(0)}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span style={{ color: '#2E8BFF' }}>{formatIDR(totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                      <CreditCard className="w-4 h-4 text-[#2E8BFF] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-[#2E8BFF]">
                        Pembayaran akan diproses melalui <strong>Mayar Payment Gateway</strong>. Anda akan diarahkan ke halaman pembayaran setelah konfirmasi booking.
                      </p>
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {step === 1 ? 'Batal' : 'Sebelumnya'}
                </button>

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2 text-sm text-white rounded-xl hover:opacity-90 transition-opacity"
                    style={{ background: '#2E8BFF' }}
                  >
                    Selanjutnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 text-sm text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ background: '#2E8BFF' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Konfirmasi Booking
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <img
                src={caregiver.photo}
                alt={caregiver.name}
                className="w-full h-32 object-cover object-top rounded-xl mb-3"
              />
              <h4 className="text-gray-900 font-medium mb-1">{caregiver.name}</h4>
              <RatingStars rating={caregiver.rating} size="sm" showNumber reviewCount={caregiver.reviewCount} />
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Tarif/jam</span>
                  <span className="text-gray-900">{formatIDR(caregiver.hourlyRate)}</span>
                </div>
                {totalHours > 0 && (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Total jam</span>
                      <span className="text-gray-900">{totalHours} jam</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span style={{ color: '#2E8BFF' }}>{formatIDR(totalPrice)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Payment method badge */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pembayaran via Mayar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
