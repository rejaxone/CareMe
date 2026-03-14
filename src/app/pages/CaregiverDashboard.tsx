import { useState } from 'react';
import {
  Calendar, Clock, MapPin, Star, TrendingUp, DollarSign,
  CheckCircle, X, Bell, User, Award
} from 'lucide-react';
import { mockCaregiverBookings, mockCaregivers, formatIDR, getStatusLabel, getStatusColor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { RatingStars } from '../components/RatingStars';

type TabType = 'requests' | 'schedule' | 'history' | 'earnings' | 'reviews';

export function CaregiverDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [bookings, setBookings] = useState(mockCaregiverBookings);

  // Get caregiver profile (use first one as demo for 'Sari Dewi Rahayu')
  const profile = mockCaregivers.find(c => c.name === user?.name) || mockCaregivers[0];

  const handleAccept = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'accepted' as const } : b));
  };

  const handleReject = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' as const } : b));
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');

  const TABS = [
    { id: 'requests' as TabType, label: 'Permintaan', count: pendingBookings.length },
    { id: 'schedule' as TabType, label: 'Jadwal', count: acceptedBookings.length },
    { id: 'history' as TabType, label: 'Riwayat', count: null },
    { id: 'earnings' as TabType, label: 'Penghasilan', count: null },
    { id: 'reviews' as TabType, label: 'Ulasan', count: null },
  ];

  return (
    <div style={{ background: '#F7F9FC' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-14 h-14 rounded-2xl object-cover object-top flex-shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-gray-900 text-xl font-semibold mb-0.5">
              Halo, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <div className="flex items-center gap-3">
              <RatingStars rating={profile.rating} size="sm" showNumber reviewCount={profile.reviewCount} />
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Tersedia
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
              <Bell className="w-4 h-4 text-[#2E8BFF]" />
            </div>
            <div className="text-xl font-bold text-gray-900">{pendingBookings.length}</div>
            <p className="text-xs text-gray-500">Permintaan Baru</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{profile.completedJobs}</div>
            <p className="text-xs text-gray-500">Pekerjaan Selesai</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center mb-2">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{profile.rating}</div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm font-bold text-gray-900">{formatIDR(profile.totalEarnings)}</div>
            <p className="text-xs text-gray-500">Total Penghasilan</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-[#2E8BFF] text-[#2E8BFF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5">
            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h3 className="text-gray-900 font-medium mb-4">Permintaan Booking Baru</h3>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Tidak ada permintaan booking baru</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{booking.customerName}</p>
                            <p className="text-xs text-gray-500">#{booking.id}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User className="w-3.5 h-3.5 text-[#2E8BFF]" />
                            <span>Pasien: <strong>{booking.patientName}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-[#2E8BFF]" />
                            <span>{booking.bookingDate} • {booking.startTime} – {booking.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-3.5 h-3.5 text-[#2E8BFF]" />
                            <span>{booking.hospitalName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <DollarSign className="w-3.5 h-3.5 text-[#2E8BFF]" />
                            <span>Total: <strong className="text-[#2E8BFF]">{formatIDR(booking.totalPrice)}</strong> ({booking.totalHours} jam)</span>
                          </div>
                        </div>

                        {booking.specialNotes && (
                          <div className="bg-yellow-50 rounded-lg p-2.5 mb-3">
                            <p className="text-xs text-yellow-700">
                              <strong>Catatan:</strong> {booking.specialNotes}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAccept(booking.id)}
                            className="flex-1 py-2 rounded-lg text-sm text-white font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                            style={{ background: '#2E8BFF' }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Terima
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="flex-1 py-2 rounded-lg text-sm text-red-600 font-medium border border-red-200 flex items-center justify-center gap-1.5 hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                <h3 className="text-gray-900 font-medium mb-4">Jadwal Kerja</h3>
                {acceptedBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Belum ada jadwal terkonfirmasi</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {acceptedBookings.map((booking) => (
                      <div key={booking.id} className="flex items-start gap-3 p-4 border border-green-200 bg-green-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{booking.patientName}</p>
                          <p className="text-xs text-gray-500">{booking.hospitalName} • Kamar {booking.roomNumber || '-'}</p>
                          <p className="text-xs text-green-700 font-medium mt-1">
                            {booking.bookingDate} • {booking.startTime} – {booking.endTime}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-sm font-semibold text-[#2E8BFF]">{formatIDR(booking.totalPrice)}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-gray-900 font-medium mb-4">Riwayat Pekerjaan</h3>
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{booking.patientName}</p>
                        <p className="text-xs text-gray-500 truncate">{booking.hospitalName}</p>
                        <p className="text-xs text-gray-400">{booking.bookingDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatIDR(booking.totalPrice)}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-gray-900 font-medium mb-4">Ringkasan Penghasilan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                    <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-xl font-bold">{formatIDR(profile.totalEarnings)}</p>
                    <p className="text-xs opacity-80 mt-0.5">Total Penghasilan</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-5">
                    <DollarSign className="w-6 h-6 mb-2 text-green-500" />
                    <p className="text-xl font-bold text-gray-900">{formatIDR(2850000)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Bulan Ini</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-5">
                    <Award className="w-6 h-6 mb-2 text-yellow-500" />
                    <p className="text-xl font-bold text-gray-900">{profile.completedJobs}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Total Pekerjaan</p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5">
                    <p className="text-sm font-medium text-gray-700">Transaksi Terbaru</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-900">{booking.patientName}</p>
                          <p className="text-xs text-gray-500">{booking.bookingDate} • {booking.totalHours} jam</p>
                        </div>
                        <p className="text-sm font-medium text-green-600">+{formatIDR(booking.totalPrice)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-medium">Ulasan dari Pelanggan</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-900">{profile.rating}</span>
                    <span className="text-gray-400 text-sm">({profile.reviewCount} ulasan)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-gray-100 rounded-xl">
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
                          <p className="text-sm text-gray-600 mt-1.5">{review.reviewText}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
