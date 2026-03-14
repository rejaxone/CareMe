import { useState } from 'react';
import {
  Users, Calendar, DollarSign, AlertCircle, CheckCircle, X,
  Eye, TrendingUp, Shield, Clock, BarChart2
} from 'lucide-react';
import {
  mockAdminStats, mockPendingCaregivers, mockCaregivers,
  mockCustomerBookings, mockCaregiverBookings, formatIDR,
  getStatusLabel, getStatusColor, VerificationStatus
} from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

type AdminTab = 'overview' | 'verifications' | 'users' | 'bookings' | 'payments';

const chartData = [
  { month: 'Sep', bookings: 320, revenue: 64000000 },
  { month: 'Okt', bookings: 410, revenue: 82000000 },
  { month: 'Nov', bookings: 390, revenue: 78000000 },
  { month: 'Des', bookings: 480, revenue: 96000000 },
  { month: 'Jan', bookings: 520, revenue: 104000000 },
  { month: 'Feb', bookings: 610, revenue: 122000000 },
  { month: 'Mar', bookings: 580, revenue: 116000000 },
];

const statusColors: Record<VerificationStatus, string> = {
  pending_verification: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels: Record<VerificationStatus, string> = {
  pending_verification: 'Menunggu Verifikasi',
  under_review: 'Sedang Ditinjau',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [pendingList, setPendingList] = useState(mockPendingCaregivers);

  const handleApprove = (id: string) => {
    setPendingList(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as VerificationStatus } : p));
  };

  const handleReject = (id: string) => {
    setPendingList(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as VerificationStatus } : p));
  };

  const allBookings = [...mockCustomerBookings, ...mockCaregiverBookings];

  const TABS = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: BarChart2 },
    { id: 'verifications' as AdminTab, label: 'Verifikasi', icon: Shield, badge: pendingList.filter(p => p.status === 'pending_verification' || p.status === 'under_review').length },
    { id: 'users' as AdminTab, label: 'Pengguna', icon: Users },
    { id: 'bookings' as AdminTab, label: 'Booking', icon: Calendar },
    { id: 'payments' as AdminTab, label: 'Pembayaran', icon: DollarSign },
  ];

  return (
    <div style={{ background: '#F7F9FC' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 text-2xl font-semibold mb-1">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Kelola platform CareMe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
              <nav className="space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={activeTab === tab.id ? { background: '#2E8BFF' } : {}}
                  >
                    <tab.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{tab.label}</span>
                    {'badge' in tab && tab.badge != null && tab.badge > 0 && (
                      <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center flex-shrink-0 ${
                        activeTab === tab.id ? 'bg-white text-[#2E8BFF]' : 'bg-red-500 text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Pengguna', value: mockAdminStats.totalUsers.toLocaleString(), icon: Users, color: 'bg-blue-100 text-[#2E8BFF]', trend: '+12%' },
                    { label: 'Pendamping Aktif', value: mockAdminStats.totalCaregivers.toLocaleString(), icon: Shield, color: 'bg-green-100 text-green-600', trend: '+5%' },
                    { label: 'Total Booking', value: mockAdminStats.totalBookings.toLocaleString(), icon: Calendar, color: 'bg-purple-100 text-purple-600', trend: '+18%' },
                    { label: 'Total Revenue', value: formatIDR(mockAdminStats.totalRevenue), icon: TrendingUp, color: 'bg-orange-100 text-orange-600', trend: '+22%' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color.split(' ')[0]}`}>
                        <stat.icon className={`w-4 h-4 ${stat.color.split(' ')[1]}`} />
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-0.5">{stat.value}</div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <span className="text-xs text-green-600 font-medium">{stat.trend} bulan ini</span>
                    </div>
                  ))}
                </div>

                {/* Alerts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">{mockAdminStats.pendingVerifications} Verifikasi Pending</p>
                      <p className="text-xs text-yellow-600">Perlu ditinjau</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">{mockAdminStats.activeBookings} Booking Aktif</p>
                      <p className="text-xs text-blue-600">Sedang berjalan</p>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{mockAdminStats.disputeCount} Dispute Aktif</p>
                      <p className="text-xs text-red-600">Perlu penanganan</p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-gray-900 font-medium mb-5">Tren Booking & Revenue</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(value: number, name: string) =>
                            name === 'bookings' ? [value, 'Booking'] : [formatIDR(value), 'Revenue']
                          }
                        />
                        <Bar dataKey="bookings" fill="#2E8BFF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Verifications */}
            {activeTab === 'verifications' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-gray-900 font-medium">Verifikasi Pendamping</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Tinjau dan setujui pendaftaran pendamping baru</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {pendingList.map((item) => (
                    <div key={item.id} className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.city} • Daftar: {item.submittedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[item.status]}`}>
                            {statusLabels[item.status]}
                          </span>
                          {(item.status === 'pending_verification' || item.status === 'under_review') && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white font-medium hover:opacity-90"
                                style={{ background: '#2E8BFF' }}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Setujui
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-600 font-medium border border-red-200 hover:bg-red-50 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                Tolak
                              </button>
                              <button onClick={() => toast.info('Fitur detail verifikasi sedang dalam pengembangan')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                                <Eye className="w-3.5 h-3.5" />
                                Detail
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-gray-900 font-medium">Daftar Pengguna</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Nama</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Kota</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Rating</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Tarif/Jam</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockCaregivers.map((cg) => (
                        <tr key={cg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <img src={cg.photo} alt={cg.name} className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-900">{cg.name}</p>
                                <p className="text-xs text-gray-400">{cg.gender}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600">{cg.city}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-yellow-500">★</span>
                              <span className="text-gray-900">{cg.rating}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                              cg.availabilityStatus === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {cg.availabilityStatus === 'available' ? 'Tersedia' : 'Sibuk'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-900">{formatIDR(cg.hourlyRate)}</td>
                          <td className="px-5 py-3">
                            <button onClick={() => toast.info('Fitur detail pengguna sedang dalam pengembangan')} className="text-[#2E8BFF] text-xs hover:underline">Detail</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-gray-900 font-medium">Semua Booking</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {allBookings.map((booking) => (
                    <div key={booking.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">#{booking.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <div className="text-xs text-gray-500">
                              <span className="text-gray-400">Customer: </span>
                              <span>{booking.customerName}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="text-gray-400">Pendamping: </span>
                              <span>{booking.caregiverName}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {booking.bookingDate}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.startTime} – {booking.endTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-[#2E8BFF]">{formatIDR(booking.totalPrice)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{booking.totalHours} jam</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
                    <DollarSign className="w-6 h-6 mb-3 opacity-80" />
                    <p className="text-2xl font-bold">{formatIDR(mockAdminStats.totalRevenue)}</p>
                    <p className="text-sm opacity-80 mt-1">Total Revenue</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <TrendingUp className="w-6 h-6 mb-3 text-green-500" />
                    <p className="text-2xl font-bold text-gray-900">{formatIDR(116000000)}</p>
                    <p className="text-sm text-gray-500 mt-1">Revenue Bulan Ini</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <CheckCircle className="w-6 h-6 mb-3 text-teal-500" />
                    <p className="text-2xl font-bold text-gray-900">{mockAdminStats.completedBookings.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Transaksi Sukses</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-gray-900 font-medium mb-4">Revenue Bulanan</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v/1000000}M`} />
                        <Tooltip formatter={(v: number) => [formatIDR(v), 'Revenue']} />
                        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
