import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Loader2, User, Briefcase, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';

// ─── Role selection modal ─────────────────────────────────────────────────────
function RoleSelectionModal({ onSelect }: { onSelect: (role: UserRole) => Promise<void> }) {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    await onSelect(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#2E8BFF' }}>
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Selamat Datang di CareMe!</h2>
          <p className="text-gray-500 text-sm">
            Akun Google Anda berhasil terhubung.<br />Anda bergabung sebagai apa?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {[
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
          ].map(({ role, icon: Icon, title, sub, iconColor, bg }) => (
            <button key={role} onClick={() => setSelected(role)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selected === role ? 'border-[#2E8BFF] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${selected === role ? 'bg-[#2E8BFF]' : bg}`}>
                  <Icon className={`w-5 h-5 ${selected === role ? 'text-white' : iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${selected === role ? 'text-[#2E8BFF]' : 'text-gray-900'}`}>{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
                {selected === role && <CheckCircle className="w-5 h-5 text-[#2E8BFF] flex-shrink-0" />}
              </div>
            </button>
          ))}
        </div>

        <button onClick={handleConfirm} disabled={!selected || saving}
          className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-opacity ${selected && !saving ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
          style={{ background: '#2E8BFF' }}>
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…</>
            : <>Lanjutkan <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}

// ─── Main callback page ────────────────────────────────────────────────────────
// This page is the landing point after Google OAuth redirect.
// AuthContext.getSession() handles the PKCE code exchange and resolves
// isLoading → we just watch the context and navigate accordingly.
export function AuthCallbackPage() {
  const { user, isLoading, isNewUser, updateProfile, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [oauthError, setOauthError] = useState('');

  // Check URL for OAuth errors (e.g. user denied access, provider error)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const errorDesc =
      params.get('error_description') ||
      hashParams.get('error_description') ||
      params.get('error') ||
      hashParams.get('error');

    if (errorDesc) {
      console.log('[AuthCallback] OAuth error from URL:', errorDesc);
      setOauthError(decodeURIComponent(errorDesc));
    }
  }, []);

  // React to context resolving (isLoading → false)
  useEffect(() => {
    // Still waiting for getSession() / PKCE exchange — keep showing spinner
    if (isLoading) return;

    // Auth resolved. What's the outcome?
    if (user) {
      console.log('[AuthCallback] Auth resolved → user:', user.email, '| role:', user.role, '| role_chosen:', user.role_chosen, '| isNewUser:', isNewUser);

      // Check if a role was pre-selected on the signup page before Google redirect
      const pendingRole = sessionStorage.getItem('careme_pending_role') as UserRole | null;

      if (pendingRole) {
        // User came from SignUpPage → apply the pending role immediately, no modal needed
        console.log('[AuthCallback] Pending role found from SignUpPage:', pendingRole);
        sessionStorage.removeItem('careme_pending_role');

        // Apply the role if it differs from the current one or hasn't been chosen yet
        if (!user.role_chosen || user.role !== pendingRole) {
          updateProfile({ role: pendingRole, role_chosen: true } as any)
            .then(() => {
              updateUser({ role: pendingRole, role_chosen: true });
              if (pendingRole === 'caregiver') {
                navigate('/caregiver/register', { replace: true });
              } else {
                navigate('/dashboard/customer', { replace: true });
              }
            });
        } else {
          // Role already matches, just navigate
          if (user.role === 'caregiver') navigate('/caregiver/register', { replace: true });
          else navigateToDashboard(user.role);
        }
        return;
      }

      // No pending role — this is a returning user logging in again
      if (isNewUser && user.google_id && !user.role_chosen) {
        // First-time Google user who hasn't chosen a role yet — show modal
        setShowRoleModal(true);
      } else {
        // Returning user: navigate to their saved role from the backend
        navigateToDashboard(user.role);
      }
    } else {
      // getSession() returned no session. Either the exchange failed, or
      // there's an OAuth error, or the user navigated here directly.
      if (!oauthError) {
        console.log('[AuthCallback] No session resolved directly — adding safety delay before redirecting to sign-in...');
        const timer = setTimeout(() => {
          console.log('[AuthCallback] Safety delay passed, navigating to sign-in');
          navigate('/auth/signin', { replace: true });
        }, 1500); // 1.5 second buffer
        return () => clearTimeout(timer);
      }
      // If oauthError is set the error UI renders instead
    }
  }, [user, isLoading, isNewUser, oauthError, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateToDashboard = (role: UserRole | string) => {
    if (role === 'caregiver') navigate('/dashboard/caregiver', { replace: true });
    else if (role === 'admin') navigate('/dashboard/admin', { replace: true });
    else navigate('/dashboard/customer', { replace: true });
  };

  const handleRoleSelect = async (role: UserRole) => {
    await updateProfile({ role, role_chosen: true } as any);
    updateUser({ role, role_chosen: true });
    setShowRoleModal(false);
    navigateToDashboard(role);
  };

  // ── OAuth error state ─────────────────────────────────────────────────────────
  if (oauthError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-gray-900 font-semibold mb-1">Login Gagal</h2>
          <p className="text-gray-500 text-sm mb-5">{oauthError}</p>
          <button onClick={() => navigate('/auth/signin', { replace: true })}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ background: '#2E8BFF' }}>
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  // ── Loading state (waiting for PKCE exchange / getSession) ───────────────────
  return (
    <>
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: '#2E8BFF' }}>
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#2E8BFF' }} />
            <p className="text-gray-700 font-medium">Memproses login Anda…</p>
            <p className="text-gray-400 text-sm">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>

      {showRoleModal && <RoleSelectionModal onSelect={handleRoleSelect} />}
    </>
  );
}
