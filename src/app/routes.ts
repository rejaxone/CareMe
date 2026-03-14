import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CaregiverProfilePage } from './pages/CaregiverProfilePage';
import { BookingPage } from './pages/BookingPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { CaregiverRegistration } from './pages/CaregiverRegistration';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ReportViolationPage } from './pages/ReportViolationPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      // ── Public routes ─────────────────────────────────────────────────────
      { index: true, Component: HomePage },
      { path: 'marketplace', Component: MarketplacePage },
      { path: 'cara-kerja', Component: HowItWorksPage },
      { path: 'laporan-pelanggaran', Component: ReportViolationPage },
      { path: 'caregiver/register', Component: CaregiverRegistration },
      { path: 'caregiver/:id', Component: CaregiverProfilePage },
      { path: 'booking/:caregiverId', Component: BookingPage },
      { path: 'auth/signup', Component: SignUpPage },
      { path: 'auth/signin', Component: SignInPage },
      { path: 'auth/callback', Component: AuthCallbackPage },

      // ── Protected routes (require login) ──────────────────────────────────
      {
        Component: ProtectedLayout,
        children: [
          { path: 'dashboard/customer', Component: CustomerDashboard },
          { path: 'dashboard/caregiver', Component: CaregiverDashboard },
          { path: 'dashboard/admin', Component: AdminPanel },
          { path: 'profil', Component: ProfilePage },
        ],
      },

      { path: '*', Component: NotFoundPage },
    ],
  },
]);
