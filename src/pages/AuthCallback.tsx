import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    // Handle the OAuth callback properly
    const handleAuthCallback = async () => {
      // Supabase automatically handles the URL hash on callback
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
        return;
      }

      if (session) {
        await loadUser();
        navigate('/');
      } else {
        // Wait a bit for session to be established
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              await loadUser();
              navigate('/');
            }
          }
        );
        return () => subscription.unsubscribe();
      }
    };

    handleAuthCallback();
  }, [loadUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}