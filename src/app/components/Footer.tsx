import { Link } from 'react-router';
import { Heart, Phone, Mail, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2E8BFF' }}>
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-semibold text-white">
                Care<span style={{ color: '#2E8BFF' }}>Me</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Platform terpercaya yang menghubungkan keluarga dengan pendamping pasien profesional di seluruh Indonesia.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Temukan Pendamping</Link></li>
              <li><Link to="/auth/signup" className="hover:text-white transition-colors">Daftar sebagai Pendamping</Link></li>
              <li><Link to="/cara-kerja" className="hover:text-white transition-colors">Cara Kerja</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Harga & Tarif</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><Link to="/laporan-pelanggaran" className="hover:text-white transition-colors text-red-400 hover:text-red-300">Laporkan Pelanggaran</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2E8BFF] flex-shrink-0" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2E8BFF] flex-shrink-0" />
                <span>halo@careme.id</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2E8BFF] flex-shrink-0 mt-0.5" />
                <span>Jl. Sudirman No. 55, Jakarta Selatan, DKI Jakarta 12190</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2026 CareMe. Hak cipta dilindungi.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Kode Etik</a>
          </div>
        </div>
      </div>
    </footer>
  );
}