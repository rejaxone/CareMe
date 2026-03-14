import { Link } from 'react-router';
import { Heart, Home, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F9FC' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#EBF4FF' }}>
          <Heart className="w-10 h-10" style={{ color: '#2E8BFF' }} />
        </div>
        <h1 className="text-gray-900 mb-3" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1 }}>404</h1>
        <h2 className="text-gray-700 text-xl mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-8">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium hover:opacity-90"
            style={{ background: '#2E8BFF' }}
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            Cari Pendamping
          </Link>
        </div>
      </div>
    </div>
  );
}
