import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService, type RegistrationDetails } from '../services/authService';
import { getProfile } from '../services/campusService';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import type { ProfileRow } from '../types/supabase';

type AuthContextValue = {
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: string;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, details: RegistrationDetails) => Promise<Session | null>;
  resendSignupConfirmation: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const profileRequestId = useRef(0);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setProfileError(error.message);
        setLoading(false);
        return;
      }
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      profileRequestId.current += 1;
      setProfile(null);
      setProfileError('');
      setProfileLoading(false);
      return;
    }
    const requestId = ++profileRequestId.current;
    setProfileLoading(true);
    setProfileError('');
    try {
      const currentProfile = await getProfile(user.id);
      if (requestId === profileRequestId.current) setProfile(currentProfile);
    } catch (error) {
      if (requestId === profileRequestId.current) {
        setProfile(null);
        setProfileError(error instanceof Error ? error.message : 'Unable to load your student profile.');
      }
    } finally {
      if (requestId === profileRequestId.current) setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await authService.login(email, password);
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, details: RegistrationDetails) => {
    const { data, error } = await authService.register(email, password, details);
    if (error) throw error;
    return data.session;
  }, []);

  const resendSignupConfirmation = useCallback(async (email: string) => {
    const { error } = await authService.resendSignupConfirmation(email);
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await authService.logout();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    profileLoading,
    profileError,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    resendSignupConfirmation,
    signOut,
    refreshProfile
  }), [user, profile, loading, profileLoading, profileError, signIn, signUp, resendSignupConfirmation, signOut, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
