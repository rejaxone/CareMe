import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar, Clock, MapPin, Star, CheckCircle,
  AlertCircle, CreditCard, X, ArrowRight, Search, ExternalLink,
  Loader2, RefreshCw
} from 'lucide-react';
import { mockCustomerBookings, formatIDR, getStatusLabel, getStatusColor, BookingStatus } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
];

interface RealBooking {
  id: string;
  customerId: string;
  customerName: string;
  caregiverId: string;
  caregiverName: string;
  caregiverPhoto: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  patientName: string;
  hospitalName: string;
  status: BookingStatus;
  paymentStatus: string;
  paymentUrl: string | null;
  paymentId: string | null;
  createdAt: string;
  paidAt?: string;
}

export function CustomerDashboard() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState<string[]>([]);

  // Real bookings from backend
  const [realBookings, setRealBookings] = useState<RealBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Fetch real bookings from backend
  const fetchBookings = useCallback(async () => {
    if (!accessToken) {
      setLoadingBookings(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.bookings) {
        setRealBookings(data.bookings);
      }
    } catch (err) {
      console.log('[CustomerDashboard] Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Combine mock + real bookings
  const allBookings = [
    ...realBookings.map(b => ({
      ...b,
      isReal: true as const,
    })),
    ...mockCustomerBookings.map(b => ({
      ...b,
      isReal: false as const,
      paymentStatus: b.status === 'paid' ? 'paid' : b.status === 'awaiting_payment' ? 'pending' : 'none',
      paymentUrl: null as string | null,
      paymentId: null as string | null,
    })),
  ];

  const filteredBookings = allBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'accepted', 'awaiting_payment', 'paid'].includes(b.status);
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return ['rejected', 'cancelled'].includes(b.status);
    return true;
  });

  const stats = {
    total: allBookings.length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    active: allBookings.filter(b => ['pending', 'accepted', 'awaiting_payment', 'paid'].includes(b.status)).length,
  };

  // Handle pay for real booking
  const handlePayBooking = async (booking: typeof allBookings[0]) => {
    if (!booking.isReal || !accessToken) {
      toast.success('Simulasi pembayaran berhasil (Mode Demo)');
      return;
    }

    // If already has a payment URL, open it
    if (booking.paymentUrl) {
      window.open(booking.paymentUrl, '_blank');
      return;
    }

    setPayingBookingId(booking.id);
    try {
      const res = await fetch(`${API_BASE}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      let data;
      const textResponse = await res.clone().text(); // Simpan salinan teks jika gagal di-*parse*
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('[CustomerDashboard] Backend response bukan JSON valid:', textResponse);
        toast.error('Gagal terhubung ke sistem pembayaran (Respon server tidak valid)');
        setPayingBookingId(null);
        return;
      }

      if (res.ok && data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        fetchBookings();
      } else {
        console.log('[CustomerDashboard] Payment create error:', data);
        toast.error(data.error || 'Terjadi kesalahan pada sistem pembayaran Mayar');
      }
    } catch (err) {
      console.log('[CustomerDashboard] Payment network error:', err);
    } finally {
      setPayingBookingId(null);
    }
  };

  const handleSubmitReview = () => {
    if (reviewBookingId) {
      setReviewSubmitted(prev => [...prev, reviewBookingId]);
      setReviewBookingId(null);
      setRating(0);
      setReviewText('');
    }
  };

  return (
    <div style={{ background: '#F7F9FC' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 text-2xl font-semibold mb-1">
            Halo, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm">Kelola booking pendamping pasien Anda</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-[#2E8BFF]" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-0.5">Total Booking</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            <p className="text-xs text-gray-500 mt-0.5">Selesai</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
            <p className="text-xs text-gray-500 mt-0.5">Aktif</p>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-gray-900 font-semibold">Riwayat Booking</h2>
                {accessToken && (
                  <button
                    onClick={() => { setLoadingBookings(true); fetchBookings(); }}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingBookings ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
              <button
                onClick={() => navigate('/marketplace')}
                className="flex items-center gap-1 text-sm text-[#2E8BFF] font-medium hover:underline"
              >
                <Search className="w-4 h-4" />
                Cari Pendamping
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.value
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={activeTab === tab.value ? { background: '#2E8BFF' } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loadingBookings && realBookings.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#2E8BFF]" />
                <p className="text-gray-400 text-sm">Memuat booking...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Belum ada booking</p>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="mt-3 text-sm text-[#2E8BFF] hover:underline flex items-center gap-1 mx-auto"
                >
                  Cari pendamping sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Caregiver Photo */}
                    <img
                      src={booking.caregiverPhoto}
                      alt={booking.caregiverName}
                      className="w-12 h-12 rounded-xl object-cover object-top flex-shrink-0 cursor-pointer hover:opacity-80"
                      onClick={() => navigate(`/caregiver/${booking.caregiverId}`)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-gray-900 text-sm">{booking.caregiverName}</span>
                            <span className="text-gray-300 text-xs">|</span>
                            <span className="text-xs text-gray-500">#{booking.id}</span>
                            {booking.isReal && (
                              <span className="px-1.5 py-0.5 bg-blue-50 text-[#2E8BFF] text-[9px] font-medium rounded-full">LIVE</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                            {booking.isReal && booking.paymentStatus === 'paid' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                                <CheckCircle className="w-2.5 h-2.5" />
                                Dibayar
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-[#2E8BFF] text-sm flex-shrink-0">{formatIDR(booking.totalPrice)}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>{booking.bookingDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 col-span-2">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.hospitalName}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {booking.status === 'awaiting_payment' && (
                          <button
                            onClick={() => handlePayBooking(booking)}
                            disabled={payingBookingId === booking.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white font-medium hover:opacity-90 disabled:opacity-60"
                            style={{ background: '#2E8BFF' }}
                          >
                            {payingBookingId === booking.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-3 h-3" />
                                Bayar Sekarang
                                <ExternalLink className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                        {booking.status === 'completed' && !reviewSubmitted.includes(booking.id) && (
                          <button
                            onClick={() => setReviewBookingId(booking.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#2E8BFF] font-medium bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <Star className="w-3 h-3" />
                            Beri Ulasan
                          </button>
                        )}
                        {booking.status === 'completed' && reviewSubmitted.includes(booking.id) && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Ulasan Diberikan
                          </span>
                        )}
                        {booking.status === 'pending' && (
                          <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                            <AlertCircle className="w-3 h-3" />
                            Menunggu konfirmasi pendamping
                          </span>
                        )}
                        {booking.status === 'paid' && booking.isReal && (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <CheckCircle className="w-3 h-3" />
                            Pembayaran berhasil - menunggu jadwal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-semibold">Beri Ulasan</h3>
              <button onClick={() => setReviewBookingId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">Bagaimana pengalaman Anda dengan pendamping ini?</p>

            {/* Star Rating */}
            <div className="flex gap-2 justify-center mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star
                    className={`w-8 h-8 transition-colors ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Ceritakan pengalaman Anda..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setReviewBookingId(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={rating === 0}
                className={`flex-1 py-2.5 rounded-xl text-sm text-white font-medium transition-opacity ${rating > 0 ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
                style={{ background: '#2E8BFF' }}
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
