import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, Eye, EyeOff, User, Briefcase, Settings, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// ─── Google SVG icon ──────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function SignInPage() {
  const navigate = useNavigate();
  const { login, signInWithEmail, signInWithGoogle, user, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── If already authenticated, redirect to dashboard immediately ───────────────
  useEffect(() => {
    if (!isLoading && user) {
      const path = user.role === 'caregiver' ? '/dashboard/caregiver'
        : user.role === 'admin' ? '/dashboard/admin'
        : '/dashboard/customer';
      console.log('%c[CareMe Auth] Redirecting to dashboard', 'color:#22c55e;font-weight:bold', path);
      navigate(path, { replace: true });
    }
  }, [user, isLoading, navigate]);

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Browser redirects away to Google — no further code runs here
    } catch (err: any) {
      const msg = err.message || 'Login Google gagal.';
      setError(
        msg +
        '\n\nPastikan URL https://invite-patch-27950517.figma.site sudah ditambahkan ke:\nSupabase → Auth → URL Configuration → Redirect URLs'
      );
      setGoogleLoading(false);
    }
  };

  // ── Email / password ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Silakan isi email dan password');
      return;
    }
    setIsSubmitting(true);
    setError('');

    // Demo accounts
    if (email === 'customer@demo.com') {
      login({ id: 'cust-1', name: 'Andi Pratama', email, phone: '08123456789', role: 'customer' });
      navigate('/dashboard/customer');
      return;
    } else if (email === 'caregiver@demo.com') {
      login({ id: 'cg-1', name: 'Sari Dewi Rahayu', email, phone: '08987654321', role: 'caregiver' });
      navigate('/dashboard/caregiver');
      return;
    } else if (email === 'admin@careme.id') {
      login({ id: 'admin-1', name: 'Admin CareMe', email, phone: '02112345678', role: 'admin' });
      navigate('/dashboard/admin');
      return;
    }

    // Real Supabase auth — onAuthStateChange (SIGNED_IN) will set the user in context,
    // and the useEffect above will redirect to dashboard automatically.
    const { error: authError } = await signInWithEmail(email, password);
    setIsSubmitting(false);
    if (authError) {
      setError(authError);
    }
    // No explicit navigate() needed — the user redirect useEffect handles it.
  };

  // ── Demo shortcuts ────────────────────────────────────────────────────────
  const handleDemoLogin = (role: 'customer' | 'caregiver' | 'admin') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'customer') {
        login({ id: 'cust-1', name: 'Andi Pratama', email: 'customer@demo.com', phone: '08123456789', role: 'customer' });
        navigate('/dashboard/customer');
      } else if (role === 'caregiver') {
        login({ id: 'cg-1', name: 'Sari Dewi Rahayu', email: 'caregiver@demo.com', phone: '08987654321', role: 'caregiver' });
        navigate('/dashboard/caregiver');
      } else {
        login({ id: 'admin-1', name: 'Admin CareMe', email: 'admin@careme.id', phone: '02112345678', role: 'admin' });
        navigate('/dashboard/admin');
      }
    }, 500);
  };

  // Show loading skeleton while checking initial session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FC' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#2E8BFF' }}>
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="w-5 h-5 border-2 border-[#2E8BFF] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: '#F7F9FC' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#2E8BFF' }}>
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              Care<span style={{ color: '#2E8BFF' }}>Me</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-gray-900 text-xl font-semibold mb-1">Masuk ke CareMe</h1>
            <p className="text-gray-500 text-sm">Selamat datang kembali!</p>
          </div>

          {/* ── Google OAuth button ── */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700 mb-4 disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? 'Menghubungkan ke Google…' : 'Masuk dengan Google'}
          </button>

          {/* divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-400">atau masuk dengan email</span>
            </div>
          </div>

          {/* ── Email / password form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right mt-1">
                <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Fitur reset password sedang dalam pengembangan'); }} className="text-xs text-[#2E8BFF] hover:underline">Lupa password?</a>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="whitespace-pre-wrap">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center transition-opacity ${isSubmitting ? 'opacity-70' : 'hover:opacity-90'}`}
              style={{ background: '#2E8BFF' }}
            >
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* ── Demo login shortcuts ── */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400">DEMO LOGIN</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3 mb-3">Coba fitur platform tanpa registrasi</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'customer' as const, label: 'Customer', icon: User, colorClass: 'bg-blue-100', iconColor: 'text-[#2E8BFF]' },
                { role: 'caregiver' as const, label: 'Pendamping', icon: Briefcase, colorClass: 'bg-green-100', iconColor: 'text-green-600' },
                { role: 'admin' as const, label: 'Admin', icon: Settings, colorClass: 'bg-purple-100', iconColor: 'text-purple-600' },
              ].map(({ role, label, icon: Icon, colorClass, iconColor }) => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  disabled={isSubmitting || googleLoading}
                  className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-xl hover:border-[#2E8BFF] hover:bg-blue-50 transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg ${colorClass} group-hover:bg-[#2E8BFF] flex items-center justify-center transition-colors`}>
                    <Icon className={`w-4 h-4 ${iconColor} group-hover:text-white transition-colors`} />
                  </div>
                  <span className="text-[10px] text-gray-600 text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link to="/auth/signup" className="text-[#2E8BFF] font-medium hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}