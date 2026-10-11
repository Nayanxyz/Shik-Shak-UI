import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  // While Supabase session is restoring, show a loader (prevents redirect flash)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" />
        </div>
        <p className="text-slate-600 font-medium">Loading your arena...</p>
      </div>
    );
  }

  // Not signed in → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Signed in → render the protected page
  return <>{children}</>;
}