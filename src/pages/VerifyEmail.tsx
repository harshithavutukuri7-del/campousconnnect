import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authErrorMessage } from '../services/authService';

export function VerifyEmail() {
  const { user, loading, isConfigured, resendSignupConfirmation } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeEmail = location.state && typeof location.state === 'object' && 'email' in location.state
    ? location.state.email
    : '';
  const [email, setEmail] = useState(user?.email ?? (typeof routeEmail === 'string' ? routeEmail : ''));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isResending, setIsResending] = useState(false);
  const errorCode = searchParams.get('error_code')?.toLowerCase() ?? '';
  const linkFailed = searchParams.has('error');
  const linkExpired = errorCode === 'otp_expired' || errorCode.includes('expired');
  const isVerified = Boolean(user?.email_confirmed_at);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const handleResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    if (!isConfigured) {
      setError('Email verification is not configured. Please contact the CampusConnect administrator.');
      return;
    }

    setError('');
    setNotice('');
    setIsResending(true);
    try {
      await resendSignupConfirmation(normalizedEmail);
      setNotice('If an unconfirmed account exists for this address, a new confirmation email has been requested.');
    } catch (resendError) {
      setError(authErrorMessage(resendError, 'Unable to resend the confirmation email. Please try again later.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        {loading ? (
          <p role="status">Checking your verification status…</p>
        ) : isVerified ? (
          <>
            <h2>Email verified</h2>
            <p>Your email address is confirmed. You can now sign in and access CampusConnect.</p>
            <div className="auth-links">
              <Link to="/login">Continue to login</Link>
              <Link to="/dashboard">Open dashboard</Link>
            </div>
          </>
        ) : (
          <>
            <h2>{linkExpired ? 'Confirmation link expired' : 'Verify your email'}</h2>
            <p>
              {linkExpired
                ? 'This confirmation link is invalid or has expired. Request a new link below.'
                : linkFailed
                  ? 'The confirmation link could not be verified. Request a fresh link below.'
                  : 'Check your inbox for the confirmation link. You must verify your email before signing in.'}
            </p>
            <form onSubmit={handleResend} className="form-stack">
              {error && <div className="alert error" role="alert">{error}</div>}
              {notice && <div className="alert success" role="status">{notice}</div>}
              <label>
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  autoCapitalize="none"
                  maxLength={254}
                  required
                  placeholder="you@college.edu"
                />
              </label>
              <button type="submit" className="primary-button wide" disabled={isResending || !isConfigured}>
                {isResending ? 'Sending confirmation…' : 'Resend confirmation email'}
              </button>
            </form>
            <div className="auth-links">
              <Link to="/login">Back to login</Link>
              <Link to="/register">Create an account</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
