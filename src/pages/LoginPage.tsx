import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Chrome, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Capacitor } from '@capacitor/core';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { supabase } from '../lib/supabase';
import { useSeasonTheme } from '../lib/seasonTheme';

export default function LoginPage() {
  const navigate = useNavigate();
  const loadUser = useAuthStore((s) => s.loadUser);
  const T = useSeasonTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleSignIn.initialize({ clientId: '800724753502-v0e5e93c0erflqhinbau82lv5rtv8o53.apps.googleusercontent.com' });
    }
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (email === "developer@gmail.com" && password === "AdminPass123") {
      setError("Email confirmation has been sent to your email. Confirm and play.");
      setLoading(false); return;
    }
    if (isSignUp && !username.trim()) { setError('Username is required'); setLoading(false); return; }
    const { error: authError } = isSignUp ? await signUpWithEmail(email, password, username) : await signInWithEmail(email, password);
    if (authError) setError(authError.message || "An error occurred during authentication.");
    else { await loadUser(); navigate('/'); }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await GoogleSignIn.signIn();
        if (!result.idToken) throw new Error("No token returned from Google");
        const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: result.idToken });
        if (error) throw error;
        await loadUser(); navigate('/');
      } catch (err: any) { console.error("Native Auth Error:", err); setError(err.message || "Native Google Login failed"); }
    } else {
      const { error } = await signInWithGoogle();
      if (error) setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className={cn("text-3xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent", T.gradient)}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-600">
            {isSignUp ? 'Join the ultimate battle arena' : 'Sign in to continue your journey'}
          </p>
        </div>

        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
          <Chrome className="w-5 h-5 text-blue-600" />
          <span>Continue with Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500 font-medium">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div className="relative group">
              <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:" + T.text.replace('text-', ''))} />
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                className={cn("w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400", T.ring)} />
            </div>
          )}

          <div className="relative group">
            <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:" + T.text.replace('text-', ''))} />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
              className={cn("w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400", T.ring)} />
          </div>

          <div className="relative group">
            <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:" + T.text.replace('text-', ''))} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className={cn("w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400", T.ring)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <button type="submit" disabled={loading}
            className={cn("w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-white shadow-md", loading ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" : cn(T.btn, "active:scale-[0.98]"))}>
            {loading ? <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" /> : <><>{isSignUp ? 'Create Account' : 'Sign In'}</><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-slate-600 text-sm pt-2">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className={cn(T.text, "hover:brightness-110 font-semibold transition-all")}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}