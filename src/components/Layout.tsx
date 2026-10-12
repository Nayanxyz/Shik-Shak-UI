import { Link, useNavigate } from 'react-router-dom';
import { Swords, Brain, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import NatureBackdrop from './NatureBackdrop';
import SeasonSelector from './SeasonSelector';
import { useSeasonTheme } from '../lib/seasonTheme';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const T = useSeasonTheme();
  const roomCode = useGameStore((s) => s.roomCode);
  const setRoom = useGameStore((s) => s.setRoom);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const safeNavigate = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    if (roomCode) {
      if (!window.confirm('You are in an active battle room. Leave and reset?')) {
        return;
      }
      setRoom(null);
      resetGame();
    }
    navigate(to);
  };

  return (
    <div className="min-h-screen text-slate-900 relative">
      <NatureBackdrop />

      <nav className="relative border-b border-white/60 bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={(e) => safeNavigate(e, '/')} className="flex items-center gap-2.5 font-bold text-xl group">
            <div className={cn("p-1.5 rounded-lg group-hover:brightness-110 transition-all", T.iconBg)}>
              <Swords className="w-5 h-5" />
            </div>
            <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", T.gradient)}>
              Shik-Shak
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => safeNavigate(e, '/practice')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/80 transition-all text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <Brain className="w-4 h-4" />
              Practice
            </button>
            <Link
              to="/battle/lobby"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/80 transition-all text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <Swords className="w-4 h-4" />
              Battle
            </Link>

            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm text-sm">
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", T.iconBg)}>
                    <User className="w-3 h-3" />
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
                className={cn("ml-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all", T.btn)}
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

      <SeasonSelector />
    </div>
  );
}