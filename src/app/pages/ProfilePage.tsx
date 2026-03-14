import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  User, Mail, Phone, Shield, Calendar, Edit2,
  Save, X, CheckCircle, AlertCircle, Loader2,
  Briefcase, Settings, LogOut, ArrowLeft,
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { toast } from 'sonner';

// ─── Google badge ─────────────────────────────────────────────────────────────
function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
      <svg viewBox="0 0 24 24" width="12" height="12">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Akun Google
    </span>
  );
}

// ─── Role display helpers ─────────────────────────────────────────────────────
const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  customer: { label: 'Pencari Jasa', icon: User, color: 'text-[#2E8BFF]', bg: 'bg-blue-50' },
  caregiver: { label: 'Penyedia Jasa (Pendamping)', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  admin: { label: 'Administrator', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-50' },
};

export function ProfilePage() {
  const { user, logout, updateProfile, accessToken } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || '' });
  }, [user]);

  if (!user) return null;

  const isGoogleUser = !!user.google_id;
  const RoleIcon = roleConfig[user.role].icon;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (form.phone && !form.phone.match(/^(\+62|62|0)8[1-9][0-9]{6,11}$/))
      e.phone = 'Format nomor tidak valid (contoh: 08xxxxxxxxxx)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!accessToken) {
      toast.info('Perubahan tidak disimpan ke database dalam mode Demo');
      setEditing(false);
      return;
    }
    setSaving(true);
    setSaveResult(null);
    const { error } = await updateProfile({ name: form.name, phone: form.phone });
    setSaving(false);
    if (error) {
      setSaveResult('error');
      console.log('ProfilePage updateProfile error:', error);
    } else {
      setSaveResult('success');
      setEditing(false);
      setTimeout(() => setSaveResult(null), 3000);
    }
  };

  const handleCancel = () => {
    setForm({ name: user.name, phone: user.phone || '' });
    setErrors({});
    setEditing(false);
  };

  const getDashboardPath = () => {
    if (user.role === 'caregiver') return '/dashboard/caregiver';
    if (user.role === 'admin') return '/dashboard/admin';
    return '/dashboard/customer';
  };

  return (
    <div className="min-h-screen" style={{ background: '#F7F9FC' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Back */}
        <Link
          to={getDashboardPath()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profil Saya</h1>

        {/* Avatar + identity card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-4 mb-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-semibold shadow-md"
                  style={{ background: '#2E8BFF' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {/* Role badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig[user.role].bg} ${roleConfig[user.role].color}`}>
                  <RoleIcon className="w-3 h-3" />
                  {roleConfig[user.role].label}
                </span>
                {isGoogleUser && <GoogleBadge />}
              </div>
            </div>
          </div>

          {/* Result banner */}
          {saveResult === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm text-green-700 mb-4">
              <CheckCircle className="w-4 h-4" /> Profil berhasil disimpan!
            </div>
          )}
          {saveResult === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-600 mb-4">
              <AlertCircle className="w-4 h-4" /> Gagal menyimpan. Coba lagi.
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
              {editing ? (
                <div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900">{user.name}</span>
                </div>
              )}
            </div>

            {/* Email (always read-only) */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900">{user.email}</span>
                <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Tidak dapat diubah</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nomor Telepon</label>
              {editing ? (
                <div>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={form.phone}
                    onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: '' })); }}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900">{user.phone || <span className="text-gray-400 italic">Belum diisi</span>}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit actions */}
          <div className="flex gap-3 mt-5">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: '#2E8BFF' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan…' : 'Simpan'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" /> Batal
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* Account info card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Informasi Akun</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-gray-400" />
                Metode Login
              </div>
              <span className="text-sm font-medium text-gray-900">
                {isGoogleUser ? 'Google OAuth' : 'Email & Password'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RoleIcon className="w-4 h-4 text-gray-400" />
                Tipe Akun
              </div>
              <span className={`text-sm font-medium ${roleConfig[user.role].color}`}>
                {roleConfig[user.role].label}
              </span>
            </div>
            {user.created_at && (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Bergabung
                </div>
                <span className="text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
