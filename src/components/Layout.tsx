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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Swords className="w-6 h-6 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Shik-Shak
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/practice"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              <Brain className="w-4 h-4" />
              Practice
            </Link>
            <Link
              to="/battle/lobby"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              <Swords className="w-4 h-4" />
              Battle
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-sm">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300">{user.username}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}