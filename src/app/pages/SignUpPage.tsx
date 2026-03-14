import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Heart, User, Briefcase, Eye, EyeOff,
  CheckCircle, ArrowRight, AlertCircle, Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Role = 'customer' | 'caregiver';
type Step = 1 | 2 | 3;

// ─── Google SVG icon ──────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, user, isLoading } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined as any }));
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Format email tidak valid';
    if (!form.phone.match(/^(\+62|62|0)8[1-9][0-9]{6,11}$/)) newErrors.phone = 'Format nomor telepon tidak valid';
    if (form.password.length < 8) newErrors.password = 'Password minimal 8 karakter';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Google sign-up (stores selected role in sessionStorage before redirect) ──
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setServerError('');
    try {
      // Save the chosen role so AuthCallbackPage can apply it after OAuth redirect
      if (selectedRole) {
        sessionStorage.setItem('careme_pending_role', selectedRole);
      }
      await signInWithGoogle();
      // Redirects to Google — page leaves
    } catch (err: any) {
      setServerError(err.message || 'Daftar dengan Google gagal. Coba lagi.');
      setGoogleLoading(false);
    }
  };

  // ── Step navigation ──────────────────────────────────────────────────────────
  const handleContinue = async () => {
    if (step === 1 && selectedRole) {
      setStep(2);
    } else if (step === 2 && validateForm()) {
      setIsLoadingSignUp(true);
      setServerError('');

      const { error } = await signUpWithEmail({
        email: form.email,
        password: form.password,
        name: form.fullName,
        phone: form.phone,
        role: selectedRole!,
      });

      setIsLoadingSignUp(false);

      if (error) {
        setServerError(error);
        return;
      }

      // Success — go to success screen
      setStep(3);
    }
  };

  // ── If user is already logged in, redirect to their dashboard ──────────────
  useEffect(() => {
    if (!isLoading && user && step !== 3) {
      const path = user.role === 'caregiver' ? '/dashboard/caregiver'
        : user.role === 'admin' ? '/dashboard/admin'
        : '/dashboard/customer';
      console.log('[CareMe Auth] SignUpPage: user already logged in, redirecting to', path);
      navigate(path, { replace: true });
    }
  }, [user, isLoading, navigate, step]);

  // ── Success redirect ──────────────────────────────────────────────────────────
  const handleFinish = () => {
    // Use role from context (eagerly set by signUpWithEmail) or fall back to what
    // the user selected on Step 1. Never default to 'customer' blindly.
    const role = user?.role ?? selectedRole;
    console.log('[SignUpPage] handleFinish → role:', role);
    if (role === 'caregiver') {
      navigate('/caregiver/register');
    } else {
      navigate('/dashboard/customer');
    }
  };

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

          {/* ── Step 1: Choose role ── */}
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-gray-900 text-xl font-semibold mb-1">Buat Akun CareMe</h1>
                <p className="text-gray-500 text-sm">Pilih jenis akun yang sesuai</p>
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700 mb-5 disabled:opacity-60"
              >
                {googleLoading
                  ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  : <GoogleIcon />}
                {googleLoading ? 'Menghubungkan…' : 'Daftar dengan Google'}
              </button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-xs text-gray-400">atau daftar dengan email</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  {
                    role: 'customer' as Role,
                    title: 'Saya mencari jasa pendamping pasien',
                    sub: 'Untuk keluarga yang membutuhkan pendamping',
                    icon: User,
                  },
                  {
                    role: 'caregiver' as Role,
                    title: 'Saya ingin menjadi penyedia jasa',
                    sub: 'Untuk pendamping yang ingin bergabung',
                    icon: Briefcase,
                  },
                ].map(({ role, title, sub, icon: Icon }) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRole === role ? 'border-[#2E8BFF] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedRole === role ? 'bg-[#2E8BFF]' : 'bg-gray-100'}`}>
                        <Icon className={`w-6 h-6 ${selectedRole === role ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${selectedRole === role ? 'text-[#2E8BFF]' : 'text-gray-900'}`}>{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                      </div>
                      {selectedRole === role && (
                        <CheckCircle className="w-5 h-5 text-[#2E8BFF] ml-auto flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-opacity ${selectedRole ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
                style={{ background: '#2E8BFF' }}
              >
                Lanjutkan <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* ── Step 2: Form ── */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-gray-900 text-xl font-semibold mb-1">Data Akun</h1>
                <p className="text-gray-500 text-sm">Isi informasi dasar Anda</p>
              </div>

              {serverError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan nama lengkap" value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <input type="email" placeholder="nama@email.com" value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Telepon <span className="text-red-500">*</span></label>
                  <input type="tel" placeholder="08xxxxxxxxxx" value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="Minimal 8 karakter" value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
                {/* Confirm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Ulangi password" value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={isLoadingSignUp}
                className="w-full mt-5 py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                style={{ background: '#2E8BFF' }}
              >
                {isLoadingSignUp ? <><Loader2 className="w-4 h-4 animate-spin" /> Mendaftarkan…</> : <>Daftar <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Dengan mendaftar, Anda menyetujui{' '}
                <a href="#" className="text-[#2E8BFF] hover:underline">Syarat & Ketentuan</a> dan{' '}
                <a href="#" className="text-[#2E8BFF] hover:underline">Kebijakan Privasi</a> CareMe.
              </p>
            </>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-gray-900 text-xl font-semibold mb-2">Akun Berhasil Dibuat!</h1>
                <p className="text-gray-500 text-sm">
                  Selamat datang di CareMe, <strong>{form.fullName}</strong>!{' '}
                  {selectedRole === 'caregiver'
                    ? 'Lengkapi profil pendamping Anda untuk mulai menerima booking.'
                    : 'Temukan pendamping pasien terbaik untuk orang tersayang Anda.'}
                </p>
              </div>

              {/* Account summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span className="text-gray-900 font-medium">{form.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{form.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Peran</span>
                  <span className="text-[#2E8BFF] font-medium capitalize">
                    {selectedRole === 'customer' ? 'Pelanggan' : 'Pendamping'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: '#2E8BFF' }}
              >
                {selectedRole === 'caregiver' ? 'Lengkapi Profil Pendamping' : 'Ke Dashboard Saya'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="mt-5 text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link to="/auth/signin" className="text-[#2E8BFF] font-medium hover:underline">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}