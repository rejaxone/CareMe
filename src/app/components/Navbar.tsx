import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Bell, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout, unreadCount, notifications, markNotificationRead, markAllRead } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'customer') return '/dashboard/customer';
    if (user.role === 'caregiver') return '/dashboard/caregiver';
    return '/dashboard/admin';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2E8BFF' }}>
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Care<span style={{ color: '#2E8BFF' }}>Me</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-[#2E8BFF]' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Beranda
            </Link>
            <Link
              to="/marketplace"
              className={`text-sm font-medium transition-colors ${isActive('/marketplace') ? 'text-[#2E8BFF]' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Marketplace
            </Link>
            <Link
              to="/cara-kerja"
              className={`text-sm font-medium transition-colors ${isActive('/cara-kerja') ? 'text-[#2E8BFF]' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Cara Kerja
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900 text-sm">Notifikasi</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-[#2E8BFF] hover:underline"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-400 text-sm">
                            Tidak ada notifikasi
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  n.type === 'success' ? 'bg-green-500' :
                                  n.type === 'warning' ? 'bg-orange-500' :
                                  n.type === 'error' ? 'bg-red-500' : 'bg-[#2E8BFF]'
                                }`} />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#2E8BFF] flex items-center justify-center text-white text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role === 'customer' ? 'Pencari Jasa' : user.role === 'caregiver' ? 'Penyedia Jasa' : 'Admin'}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profil"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profil Saya
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ background: '#2E8BFF' }}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Beranda</Link>
          <Link to="/marketplace" className="block text-sm text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Marketplace</Link>
          <Link to="/cara-kerja" className="block text-sm text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Cara Kerja</Link>
          {user ? (
            <>
              <Link to={getDashboardPath()} className="block text-sm text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left text-sm text-red-600 py-2">
                Keluar
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link
                to="/auth/signin"
                className="flex-1 text-center py-2 border border-gray-200 rounded-xl text-sm text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Masuk
              </Link>
              <Link
                to="/auth/signup"
                className="flex-1 text-center py-2 rounded-xl text-sm text-white"
                style={{ background: '#2E8BFF' }}
                onClick={() => setMobileOpen(false)}
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}