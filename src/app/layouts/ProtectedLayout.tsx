import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps all protected routes (dashboard pages).
 * - Shows spinner while initial session is resolving (isLoading = true).
 * - Redirects to /auth/signin if no session after loading completes.
 * - Renders child routes if session exists.
 *
 * Per debug spec: dashboard must check session and redirect to login if absent.
 */
export function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        console.log('%c[CareMe Auth] Protected route: session valid', 'color:#22c55e;font-weight:bold',
          '| user:', user.email, '| role:', user.role);
      } else {
        console.log('%c[CareMe Auth] Redirecting to login', 'color:#f59e0b;font-weight:bold',
          '(no session on protected route)');
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2E8BFF' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}
