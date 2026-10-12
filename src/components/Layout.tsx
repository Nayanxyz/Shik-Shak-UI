import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Brain, LogOut, User, AlertCircle } from 'lucide-react';
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
  const practiceActive = useGameStore((s) => s.practiceActive);
  const setRoom = useGameStore((s) => s.setRoom);
  const resetGame = useGameStore((s) => s.resetGame);
  const setPracticeActive = useGameStore((s) => s.setPracticeActive);

  const [pendingNav, setPendingNav] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const guardMessage = roomCode
    ? 'You are in an active battle room. Leaving will reset the room.'
    : 'You are in an active practice session. Leaving will end the session.';

  const safeNavigate = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    if (roomCode || practiceActive) {
      setPendingNav(to);
      return;
    }
    navigate(to);
  };

  const confirmLeave = () => {
    const to = pendingNav;
    setPendingNav(null);
    if (roomCode) { setRoom(null); resetGame(); }
    if (practiceActive) setPracticeActive(false);
    if (to) navigate(to);
  };

  return (
    <div className="min-h-screen text-slate-900 relative overflow-x-clip">
      <NatureBackdrop />

      <AnimatePresence>
        {pendingNav && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-xl font-bold text-slate-900">Leave current session?</h3>
              </div>
              <p className="text-slate-600">{guardMessage}</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setPendingNav(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all font-medium">
                  Stay
                </button>
                <button onClick={confirmLeave}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all font-medium flex items-center justify-center gap-2 shadow-md shadow-red-500/20">
                  <LogOut className="w-4 h-4" /> Leave
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="relative border-b border-white/60 bg-white/60 backdrop-blur-md sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <button onClick={(e) => safeNavigate(e, '/')} className="flex items-center gap-2 sm:gap-2.5 font-bold text-lg sm:text-xl group shrink-0 min-w-0">
            <div className={cn("p-1.5 rounded-lg group-hover:brightness-110 transition-all", T.iconBg)}>
              <Swords className="w-5 h-5" />
            </div>
            <span className={cn("bg-gradient-to-r bg-clip-text text-transparent truncate", T.gradient)}>
              Shik-Shak
            </span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <button onClick={(e) => safeNavigate(e, '/practice')}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-white/80 transition-all text-sm font-medium text-slate-600 hover:text-slate-900 shrink-0">
              <Brain className="w-4 h-4" />
              <span className="hidden md:inline">Practice</span>
            </button>
            <button onClick={(e) => safeNavigate(e, '/battle/lobby')}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-white/80 transition-all text-sm font-medium text-slate-600 hover:text-slate-900 shrink-0">
              <Swords className="w-4 h-4" />
              <span className="hidden md:inline">Battle</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 pl-2 sm:pl-3 border-l border-slate-200 min-w-0">
                <button onClick={(e) => safeNavigate(e, '/profile')} className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm text-sm min-w-0 hover:bg-white transition-all">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", T.iconBg)}>
                      <User className="w-3 h-3" />
                    </div>
                  )}
                  <span className="text-slate-700 font-medium truncate max-w-[6rem] sm:max-w-[10rem]">{user.username}</span>
                </button>
                <button onClick={handleSignOut} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all shrink-0" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className={cn("ml-1 sm:ml-2 px-3 sm:px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all shrink-0", T.btn)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="relative max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 overflow-x-clip">
        {children}
      </main>

      <SeasonSelector />
    </div>
  );
}