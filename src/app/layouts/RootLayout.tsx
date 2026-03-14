import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Heart, Loader2, User, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SplashCursor from '../components/SplashCursor';
import type { UserRole } from '../context/AuthContext';

// ─── helpers ──────────────────────────────────────────────────────────────────
function dashboardPath(role: UserRole | string) {
  if (role === 'caregiver') return '/dashboard/caregiver';
  if (role === 'admin') return '/dashboard/admin';
  return '/dashboard/customer';
}

// ─── Role Selection Modal ─────────────────────────────────────────────────────
// Shown to first-time Google OAuth users who haven't chosen a role yet.
function RoleSelectionModal({ onSelect }: { onSelect: (role: UserRole) => Promise<void> }) {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    await onSelect(selected);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#2E8BFF' }}
          >
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Selamat Datang di CareMe!</h2>
          <p className="text-gray-500 text-sm">
            Akun Google Anda berhasil terhubung.<br />Anda bergabung sebagai apa?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {([
            {
              role: 'customer' as UserRole,
              icon: User,
              title: 'Saya mencari jasa pendamping pasien',
              sub: 'Untuk keluarga yang membutuhkan pendamping',
              iconColor: 'text-[#2E8BFF]',
              bg: 'bg-blue-100',
            },
            {
              role: 'caregiver' as UserRole,
              icon: Briefcase,
              title: 'Saya ingin menjadi penyedia jasa',
              sub: 'Untuk tenaga pendamping profesional',
              iconColor: 'text-emerald-600',
              bg: 'bg-emerald-100',
            },
          ] as const).map(({ role, icon: Icon, title, sub, iconColor, bg }) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selected === role ? 'border-[#2E8BFF] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selected === role ? 'bg-[#2E8BFF]' : bg
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selected === role ? 'text-white' : iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${selected === role ? 'text-[#2E8BFF]' : 'text-gray-900'}`}>
                    {title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
                {selected === role && <CheckCircle className="w-5 h-5 text-[#2E8BFF] flex-shrink-0" />}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || saving}
          className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-opacity ${
            selected && !saving ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ background: '#2E8BFF' }}
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…</>
            : <>Lanjutkan <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}

// ─── Post-Auth Handler removed (Moved completely to AuthCallbackPage and SignInPage to avoid race conditions).

// ─── Root Layout ──────────────────────────────────────────────────────────────
export function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}

function RootLayoutInner() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F9FC' }}>
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2.5}
        SPLAT_RADIUS={0.18}
        SPLAT_FORCE={5000}
        CURL={3}
        TRANSPARENT={true}
      />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}