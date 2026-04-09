import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { isLoggedIn } from '../auth';

/**
 * Wraps all /app/* routes.
 * Redirects to /auth/login if no user is stored in localStorage.
 */
export default function AppLayoutRoute() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      navigate('/auth/login', { replace: true });
    }
  }, [navigate]);

  // Server and Client (first pass) render nothing or a loader
  // This ensures hydration matches (both render null)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // After mount, if we are still here, we are logged in (or redirecting)
  if (!isLoggedIn()) return null;

  return <Outlet />;
}
