import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, API_BASE } from '../lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';

// ─── The frontend URL is dynamically determined based on the environment
//     This MUST match the domains added to:
//     Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
//     e.g., http://localhost:5173 and https://invite-patch-27950517.figma.site
const FRONTEND_URL = typeof window !== 'undefined' ? window.location.origin : 'https://invite-patch-27950517.figma.site';

export type UserRole = 'customer' | 'caregiver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  avatar_url?: string;
  google_id?: string | null;
  role_chosen?: boolean;
  created_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  notifications: Notification[];
  isLoading: boolean;
  isNewUser: boolean;
  accessToken: string | null;
  /** True when the current page load is the landing point of a Google OAuth redirect (?code= was in the URL on mount). Used by RootLayout to trigger post-auth navigation. */
  isOAuthCallback: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (params: SignUpParams) => Promise<{ error: string | null }>;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;
  login: (user: User) => void;
  logout: () => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
}

// ─── mock notifications ────────────────────────────────────────────────────────
const mockNotificationsCustomer: Notification[] = [
  { id: 'n1', title: 'Booking Diterima!', message: 'Ahmad Fauzi menerima permintaan booking Anda untuk tanggal 20 Maret 2026.', type: 'success', read: false, createdAt: '2026-03-05T10:30:00' },
  { id: 'n2', title: 'Pembayaran Diperlukan', message: 'Booking BK001 menunggu pembayaran. Selesaikan sebelum 10 Maret 2026.', type: 'warning', read: false, createdAt: '2026-03-08T08:00:00' },
  { id: 'n3', title: 'Pengingat Booking', message: 'Booking Anda bersama Sari Dewi akan berlangsung besok, 15 Maret 2026 pukul 09:00.', type: 'info', read: true, createdAt: '2026-03-07T18:00:00' },
];
const mockNotificationsCaregiver: Notification[] = [
  { id: 'nc1', title: 'Permintaan Booking Baru!', message: 'Hendra Kustanto mengajukan booking untuk tanggal 10 Maret 2026, 08:00-16:00.', type: 'info', read: false, createdAt: '2026-03-07T14:00:00' },
  { id: 'nc2', title: 'Pembayaran Berhasil', message: 'Pembayaran untuk booking BK011 telah diterima. Jangan lupa hadir tepat waktu!', type: 'success', read: false, createdAt: '2026-03-06T09:00:00' },
];

const AuthContext = createContext<AuthContextType | null>(null);

// ─── fetch profile from backend ───────────────────────────────────────────────
async function fetchUserProfile(accessToken: string): Promise<{ user: User; isNewUser: boolean } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      const u = data.user;
      return {
        user: {
          id: u.id,
          name: u.name || 'Pengguna',
          email: u.email || '',
          phone: u.phone || '',
          role: (u.role as UserRole) || 'customer',
          avatar: u.avatar_url || '',
          avatar_url: u.avatar_url || '',
          google_id: u.google_id ?? null,
          role_chosen: u.role_chosen ?? true,
          created_at: u.created_at,
        },
        isNewUser: !!data.is_new_user,
      };
    } else if (res.status === 404) {
      // Backend profile not found yet (could be sync delay from auth system)
      // Attempt to return a basic profile from Supabase Auth Session
      const { data: authData } = await supabase.auth.getUser(accessToken);
      if (authData?.user) {
         return {
            user: {
              id: authData.user.id,
              name: authData.user.user_metadata?.name || authData.user.user_metadata?.full_name || 'Pengguna Baru',
              email: authData.user.email || '',
              phone: authData.user.phone || '',
              role: (authData.user.user_metadata?.role as UserRole) || 'customer',
              avatar: authData.user.user_metadata?.avatar_url || '',
              avatar_url: authData.user.user_metadata?.avatar_url || '',
              google_id: null,
              role_chosen: !!authData.user.user_metadata?.role,
              created_at: authData.user.created_at,
            },
            isNewUser: true
         }
      }
    }
    
    // other backend errors
    const err = await res.json().catch(() => ({}));
    console.log('[CareMe Auth] fetchUserProfile error:', res.status, err);
    return null;
  } catch (err) {
    console.log('[CareMe Auth] fetchUserProfile network error:', err);
    return null;
  }
}

// ─── provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Capture whether this page load is an OAuth callback BEFORE Supabase
  // cleans the URL params. The ?code= param is removed by history.replaceState()
  // once the PKCE exchange completes, so we must read it synchronously at init.
  const isOAuthCallbackRef = useRef(
    window.location.search.includes('code=') ||
    window.location.hash.includes('access_token=') ||
    window.location.hash.includes('error=')
  );

  const setNotificationsForRole = useCallback((role: UserRole) => {
    if (role === 'customer') setNotifications(mockNotificationsCustomer);
    else if (role === 'caregiver') setNotifications(mockNotificationsCaregiver);
    else setNotifications([]);
  }, []);

  // ── main auth initialization ──────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // ── getSession() is the CORRECT initialization method.
        //
        //   It internally awaits Supabase's initializePromise, which includes
        //   the full PKCE code-for-token exchange when ?code= is in the URL.
        //   This guarantees we get the final resolved session, not a null
        //   mid-exchange snapshot (which onAuthStateChange INITIAL_SESSION can give).
        //
        //   Per debug spec: supabase.auth.getSession() MUST run on page load.

        console.log('[CareMe Auth] Initializing — calling getSession()…');
        console.log('[CareMe Auth] OAuth callback detected:', isOAuthCallbackRef.current, '| URL:', window.location.href);

        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.log('[CareMe Auth] getSession error:', error.message);
        }

        if (session?.access_token && session?.user) {
          // ── Session found ──────────────────────────────────────────────────
          console.log('%c[CareMe Auth] Session detected', 'color:#22c55e;font-weight:bold',
            '| user:', session.user.email);

          setAccessToken(session.access_token);
          const result = await fetchUserProfile(session.access_token);

          if (isMounted) {
            if (result) {
              setUser(result.user);
              setIsNewUser(result.isNewUser);
              setNotificationsForRole(result.user.role);
              localStorage.removeItem('careme_user');
              console.log('[CareMe Auth] Profile loaded → role:', result.user.role,
                '| isNewUser:', result.isNewUser,
                '| role_chosen:', result.user.role_chosen);
            } else {
              // Fallback if backend fetch completely fails but Supabase session is perfectly valid
              console.log('%c[CareMe Auth] Fallback profile generated from session', 'color:#eab308;font-weight:bold');
              const fallbackUser: User = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Pengguna',
                email: session.user.email || '',
                phone: session.user.phone || '',
                role: (session.user.user_metadata?.role as UserRole) || 'customer',
                role_chosen: !!session.user.user_metadata?.role,
                avatar: session.user.user_metadata?.avatar_url || '',
                avatar_url: session.user.user_metadata?.avatar_url || '',
                google_id: null,
                created_at: session.user.created_at,
              };
              setUser(fallbackUser);
              setIsNewUser(false);
              setNotificationsForRole(fallbackUser.role);
            }
          }
        } else {
          // ── No Supabase session ────────────────────────────────────────────
          console.log('%c[CareMe Auth] No session found on initial load', 'color:#f59e0b;font-weight:bold');

          const saved = localStorage.getItem('careme_user');
          if (isMounted && saved) {
            try {
              const savedUser: User = JSON.parse(saved);
              setUser(savedUser);
              setNotificationsForRole(savedUser.role);
              console.log('[CareMe Auth] Demo session restored → role:', savedUser.role);
            } catch {
              localStorage.removeItem('careme_user');
            }
          }
          // Do not immediately set accessToken to null just yet if we suspect a pending OAuth exchange
          if (isMounted) setAccessToken(null);
        }
      } catch (err) {
        console.log('[CareMe Auth] initializeAuth unexpected error:', err);
      } finally {
        if (isMounted) {
          // If this is an OAuth callback and we surprisingly didn't find a session,
          // the PKCE exchange might be slightly delayed. Delay resolving isLoading
          // to give onAuthStateChange a chance to catch the SIGNED_IN event.
          if (isOAuthCallbackRef.current && !accessToken) {
            console.log('[CareMe Auth] Delaying isLoading=false to wait for PKCE SIGNED_IN event...');
            setTimeout(() => {
              setIsLoading((prev) => {
                if (prev) console.log('[CareMe Auth] Fallback timeout reached, resolving isLoading=false');
                return false;
              });
            }, 3000);
          } else {
            setIsLoading(false);
          }
        }
      }
    };

    initializeAuth();

    // ── onAuthStateChange: handles FUTURE events only (not the initial load).
    //   - SIGNED_IN  → after signInWithPassword, signInWithOAuth, or signUp
    //   - SIGNED_OUT → after signOut()
    //   - TOKEN_REFRESHED → access token rotated
    //
    //   We do NOT handle INITIAL_SESSION here — getSession() above owns that.
    //   Per debug spec: listener must log [Auth Event] + [Session].

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        // Required debug logs per spec
        console.log('[Auth Event]', event);
        console.log('[Session]', session);

        if (event === 'SIGNED_IN' && session?.access_token && session?.user) {
          console.log('%c[CareMe Auth] SIGNED_IN event', 'color:#22c55e;font-weight:bold',
            '| user:', session.user.email);

          setAccessToken(session.access_token);
          const result = await fetchUserProfile(session.access_token);
          if (isMounted) {
            if (result) {
              setUser(result.user);
              setIsNewUser(result.isNewUser);
              setNotificationsForRole(result.user.role);
              localStorage.removeItem('careme_user');
            } else {
              const fallbackUser: User = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Pengguna',
                email: session.user.email || '',
                phone: session.user.phone || '',
                role: (session.user.user_metadata?.role as UserRole) || 'customer',
                role_chosen: !!session.user.user_metadata?.role,
                avatar: session.user.user_metadata?.avatar_url || '',
                avatar_url: session.user.user_metadata?.avatar_url || '',
                google_id: null,
                created_at: session.user.created_at,
              };
              setUser(fallbackUser);
              setIsNewUser(false);
              setNotificationsForRole(fallbackUser.role);
            }
            setIsLoading(false); // Can safely force to false now
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('%c[CareMe Auth] SIGNED_OUT event', 'color:#ef4444;font-weight:bold');
          setUser(null);
          setNotifications([]);
          setAccessToken(null);
          setIsNewUser(false);
          localStorage.removeItem('careme_user');
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
          console.log('[CareMe Auth] Token refreshed');
          setAccessToken(session.access_token);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Google OAuth ─────────────────────────────────────────────────────────────��
  const signInWithGoogle = async () => {
    // ⚠️  REQUIRED SUPABASE SETUP:
    //     Go to Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
    //     Add: https://invite-patch-27950517.figma.site
    //
    //     Also ensure Google provider is enabled:
    //     Authentication → Providers → Google → Enable
    //
    // Do not forget to complete setup at https://supabase.com/docs/guides/auth/social-login/auth-google

    console.log('[CareMe Auth] Starting Google OAuth…');
    console.log('[CareMe Auth] redirectTo:', FRONTEND_URL);
    console.log('[CareMe Auth] ⚠️  Ensure this URL is in Supabase → Auth → URL Configuration → Redirect URLs');

    // Per debug spec: redirectTo must point to the stable frontend URL AuthCallback
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${FRONTEND_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw new Error(`Google OAuth error: ${error.message}`);
  };

  // ── Email / password sign-in ──────────────────────────────────────────────────
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login credentials')) return { error: 'Email atau password salah.' };
      return { error: `Login error: ${error.message}` };
    }

    // Eagerly set user in context instead of waiting for onAuthStateChange
    // This prevents the race condition where navigation happens before the
    // SIGNED_IN event handler completes fetchUserProfile.
    if (data?.session?.access_token) {
      console.log('[CareMe Auth] signInWithEmail: eagerly fetching profile…');
      setAccessToken(data.session.access_token);
      const result = await fetchUserProfile(data.session.access_token);
      if (result) {
        setUser(result.user);
        setIsNewUser(result.isNewUser);
        setNotificationsForRole(result.user.role);
        localStorage.removeItem('careme_user');
        console.log('[CareMe Auth] signInWithEmail: profile loaded → role:', result.user.role);
      }
    }

    return { error: null };
  };

  // ── Email / password sign-up ──────────────────────────────────────────────────
  const signUpWithEmail = async (params: SignUpParams) => {
    try {
      console.log('[CareMe Auth] signUpWithEmail: creating account via Supabase…');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.name,
            name: params.name,
            phone: params.phone,
            role: params.role,
          }
        }
      });

      if (signUpError) {
        return { error: `Registrasi gagal: ${signUpError.message}` };
      }

      // Eagerly set user in context so SignUpPage can navigate immediately
      if (signUpData?.session?.access_token) {
        console.log('[CareMe Auth] signUpWithEmail: eagerly fetching profile…');
        setAccessToken(signUpData.session.access_token);
        const result = await fetchUserProfile(signUpData.session.access_token);
        if (result) {
          setUser(result.user);
          setIsNewUser(false); // Email signup = not a "new" Google user
          setNotificationsForRole(result.user.role);
          localStorage.removeItem('careme_user');
          console.log('[CareMe Auth] signUpWithEmail: profile loaded → role:', result.user.role);
        } else {
           // Provide fallback user state from metadata before backend DB syncs
           setUser({
              id: signUpData.user?.id || '',
              name: params.name,
              email: params.email,
              phone: params.phone,
              role: params.role,
              role_chosen: true,
           });
           setNotificationsForRole(params.role);
        }
      } else if (signUpData?.user) {
         // Email confirmation might be required
         return { error: 'Akun berhasil dibuat. Silakan periksa email Anda untuk verifikasi (jika diaktifkan).' };
      }

      return { error: null };
    } catch (err) {
      return { error: `Terjadi kesalahan aplikasi saat registrasi: ${err}` };
    }
  };

  // ── Optimistic local update ───────────────────────────────────────────────────
  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    if (updates.role) setNotificationsForRole(updates.role);
  };

  // ── Persist profile update ────────────────────────────────────────────────────
  const updateProfile = async (updates: Partial<User>) => {
    if (!accessToken) return { error: 'Tidak ada sesi aktif' };
    try {
      const res = await fetch(`${API_BASE}/api/me`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Gagal menyimpan profil' };
      updateUser(data.user);
      return { error: null };
    } catch (err) {
      return { error: `Network error: ${err}` };
    }
  };

  // ── Demo login ────────────────────────────────────────────────────────────────
  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('careme_user', JSON.stringify(newUser));
    setNotificationsForRole(newUser.role);
  };

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (accessToken) {
      await supabase.auth.signOut();
    } else {
      setUser(null);
      setNotifications([]);
      localStorage.removeItem('careme_user');
    }
  };

  const markNotificationRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{
      user, notifications, isLoading, isNewUser, accessToken,
      isOAuthCallback: isOAuthCallbackRef.current,
      signInWithGoogle, signInWithEmail, signUpWithEmail,
      updateUser, updateProfile,
      login, logout,
      markNotificationRead, markAllRead, unreadCount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};