import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Chrome, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const loadUser = useAuthStore((s) => s.loadUser);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. HARDCODED INTERCEPT
    if (email === "developer@gmail.com" && password === "AdminPass123") {
      setError("Email confirmation has been sent to your email. Confirm and play.");
      setLoading(false); // <--- Added this so the button stops spinning
      return; 
    }

    // 2. USERNAME VALIDATION
    if (isSignUp && !username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    // 3. REAL SUPABASE AUTH
    const { error: authError } = isSignUp
      ? await signUpWithEmail(email, password, username)
      : await signInWithEmail(email, password);

    if (authError) {
      setError(authError.message || "An error occurred during authentication.");
    } else {
      await loadUser();
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 mt-2">
            {isSignUp ? 'Join the battle arena' : 'Sign in to continue'}
          </p>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <Chrome className="w-5 h-5 text-red-400" />
          <span>Continue with Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-950 text-slate-400">or</span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
              loading ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
            )}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}