import { getSupabase } from './supabase';

function getVerificationRedirect() {
  return new URL('/verify-email', window.location.origin).toString();
}

function getAuthErrorCode(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    return error.code.toLowerCase();
  }
  return '';
}

export function isEmailNotConfirmedError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  return getAuthErrorCode(error) === 'email_not_confirmed' || message.includes('email not confirmed');
}

export function authErrorMessage(error: unknown, fallback: string) {
  const code = getAuthErrorCode(error);
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'Please verify your email before logging in. You can request a new confirmation link below.';
  }
  if (code === 'otp_expired' || message.includes('expired') || message.includes('invalid token')) {
    return 'That confirmation link is invalid or has expired. Request a new confirmation email below.';
  }
  if (code.includes('rate_limit') || message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many email requests were made. Wait before requesting another confirmation email.';
  }
  if (message.includes('error sending confirmation email') || message.includes('could not send')) {
    return 'Supabase could not send the confirmation email. Email verification remains required. Please try again after the project email provider is configured.';
  }
  if (code === 'user_already_exists' || message.includes('user already registered')) {
    return 'An account may already exist for this email. Try logging in or request a new confirmation email.';
  }
  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'The email or password is incorrect.';
  }
  if (code === 'weak_password' || message.includes('password should be')) {
    return 'Choose a stronger password that meets the password requirements.';
  }
  return fallback;
}

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
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: details,
        emailRedirectTo: getVerificationRedirect()
      }
    });
  },

  resendSignupConfirmation(email: string) {
    return getSupabase().auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: getVerificationRedirect() }
    });
  },

  logout() {
    return getSupabase().auth.signOut();
  },

  resetPassword(email: string, redirectTo?: string) {
    return getSupabase().auth.resetPasswordForEmail(email, { redirectTo });
  }
};
