import { Link, useNavigate } from 'react-router-dom';
import { Swords, Brain, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import NatureBackdrop from './NatureBackdrop';

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    // 🌿 Light base — the NatureBackdrop paints sky, sparkles, clouds & hills behind everything
    <div className="min-h-screen text-slate-900 relative">
      <NatureBackdrop />

      <nav className="relative border-b border-slate-200/70 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl group">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
              <Swords className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Shik-Shak
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/practice"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/80 transition-all text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <Brain className="w-4 h-4" />
              Practice
            </Link>
            <Link
              to="/battle/lobby"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/80 transition-all text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <Swords className="w-4 h-4" />
              Battle
            </Link>

            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <User className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}