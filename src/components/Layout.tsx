import { Link, useNavigate } from 'react-router-dom';
import { Swords, Brain, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      {/* ✨ UI UPGRADE: Subtle grid pattern background for depth, replaces flat dark bg */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* ✨ UI UPGRADE: Cleaner border and enhanced backdrop blur */}
      <nav className="relative border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl group">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
              <Swords className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Shik-Shak
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/practice"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium text-slate-300 hover:text-white"
            >
              <Brain className="w-4 h-4" />
              Practice
            </Link>
            <Link
              to="/battle/lobby"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium text-slate-300 hover:text-white"
            >
              <Swords className="w-4 h-4" />
              Battle
            </Link>

            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-white/10">
                {/* ✨ UI UPGRADE: Sleeker user badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 text-sm">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-indigo-400" />
                  </div>
                  <span className="text-slate-200 font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
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