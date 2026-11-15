import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authErrorMessage, isEmailNotConfirmedError } from '../services/authService';

export function Login() {
  const navigate = useNavigate();
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isConfigured) {
      setError('Supabase is not configured. Add the project URL and anon key to your environment.');
      return;
    }

    setError('');
    setNeedsVerification(false);
    setIsSubmitting(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      navigate('/dashboard');
    } catch (loginError) {
      setNeedsVerification(isEmailNotConfirmedError(loginError));
      setError(authErrorMessage(loginError, 'Unable to sign in. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <h2>Welcome back</h2>
        <p>Log in to continue your student journey.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          {!isConfigured && <div className="alert error">Backend setup is required before students can sign in.</div>}
          {error && <div className="alert error" role="alert">{error}</div>}
          <label>
            <span><Mail size={14} /> College email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="you@college.edu" />
          </label>
          <label>
            <span><Lock size={14} /> Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required placeholder="Your password" />
          </label>
          <button type="submit" className="primary-button wide" disabled={isSubmitting || !isConfigured}>
            {isSubmitting ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          {needsVerification && <Link to="/verify-email">Resend confirmation email</Link>}
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
