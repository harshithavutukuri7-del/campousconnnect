import { getSupabase } from './supabase';

export type RegistrationDetails = {
  full_name: string;
  college: string;
  department: string;
  year_of_study: string;
};

export const authService = {
  login(email: string, password: string) {
    return getSupabase().auth.signInWithPassword({ email, password });
  },

  register(email: string, password: string, details: RegistrationDetails) {
    return getSupabase().auth.signUp({
      email,
      password,
      options: { data: details }
    });
  },

  logout() {
    return getSupabase().auth.signOut();
  },

  resetPassword(email: string, redirectTo?: string) {
    return getSupabase().auth.resetPasswordForEmail(email, { redirectTo });
  }
};
