import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '../types';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setUser(null);
        setLoading(false);
        return;
      }
      
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (profile?.role !== 'admin') {
        console.error('User is not an admin');
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(profile as User);
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let initialCheckComplete = false;

    // Initial auth check
    checkAuth()
      .then(() => {
        if (mounted) {
          initialCheckComplete = true;
        }
      })
      .catch((error) => {
        console.error('Initial auth check failed:', error);
        if (mounted) {
          setLoading(false);
          initialCheckComplete = true;
        }
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Ignore events until initial check is complete
        if (!initialCheckComplete) return;

        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Only re-check on actual auth events after initial load
          await checkAuth();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  return { user, loading, signOut, checkAuth };
}

