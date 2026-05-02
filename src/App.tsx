import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppShell } from '@/components/layout/app-shell';
import { LoginPage } from '@/pages/login';
import { AuthCallbackPage } from '@/pages/auth-callback';
import { NewTradePage } from '@/pages/new-trade';
import { TradeDetailPage } from '@/pages/trade-detail';
import { TradesPage } from '@/pages/trades';
import { DashboardPage } from '@/pages/dashboard';
import { CoachPage } from '@/pages/coach';
import { CoachSetupPage } from '@/pages/coach-setup';
import { BrokerSettingsPage } from '@/pages/settings-broker';

// ============================================================
// Protected layout — redirects to /login if not authenticated
// ============================================================

function ProtectedLayout() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}

// ============================================================
// Router
// ============================================================

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/trades',
        element: <TradesPage />,
      },
      {
        path: '/trades/new',
        element: <NewTradePage />,
      },
      {
        path: '/trades/:id',
        element: <TradeDetailPage />,
      },
      {
        path: '/coach',
        element: <CoachPage />,
      },
      {
        path: '/coach/setup',
        element: <CoachSetupPage />,
      },
      {
        path: '/settings',
        element: <Navigate to="/settings/broker" replace />,
      },
      {
        path: '/settings/broker',
        element: <BrokerSettingsPage />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
